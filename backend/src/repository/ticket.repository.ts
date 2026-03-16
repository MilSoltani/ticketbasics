import type { TicketQuery } from '@ticketbasics/zod-schemas';
import type { InferInsertModel } from 'drizzle-orm';

import { TicketCreateSchema, TicketSchema } from '@ticketbasics/zod-schemas';
import { and, asc, between, count, desc, eq, gte, ilike, inArray, lte } from 'drizzle-orm';

import { ticketsTable } from '@/database/schema';
import { db } from '@/index';

type InsertTicket = InferInsertModel<typeof ticketsTable>;

export const TicketRepository = {
  async getAll(query: TicketQuery) {
    const conditions = [];

    if (query.id) {
      conditions.push(eq(ticketsTable.id, query.id));
    }

    if (query.subject) {
      conditions.push(ilike(ticketsTable.subject, `%${query.subject}%`));
    }

    if (query.statusIn.length > 0) {
      conditions.push(inArray(ticketsTable.status, query.statusIn));
    }

    if (query.priorityIn.length > 0) {
      conditions.push(inArray(ticketsTable.priority, query.priorityIn));
    }

    if (query.createdFrom && query.createdTo) {
      conditions.push(between(ticketsTable.createdAt, query.createdFrom, query.createdTo));
    }
    else if (query.createdFrom) {
      conditions.push(gte(ticketsTable.createdAt, query.createdFrom));
    }
    else if (query.createdTo) {
      conditions.push(lte(ticketsTable.createdAt, query.createdTo));
    }

    const sortMap = {
      subject: ticketsTable.subject,
      status: ticketsTable.status,
      priority: ticketsTable.priority,
      createdAt: ticketsTable.createdAt,
    } as const;

    const sortColumn = query.sort && query.sort in sortMap ? sortMap[query.sort as keyof typeof sortMap] : ticketsTable.createdAt;

    const orderBy = query.order === 'asc'
      ? asc(sortColumn)
      : desc(sortColumn);

    const limit = query.limit ?? 25;
    const offset = query.offset ?? 0;

    const data = await db
      .select()
      .from(ticketsTable)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(ticketsTable)
      .where(and(...conditions));

    return {
      data: TicketSchema.array().parse(data),
      pagination: {
        total: Number(total),
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        pages: Math.ceil(Number(total) / limit),
      },
    };
  },

  async getById(id: number) {
    const [result] = await db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.id, id));

    if (!result) {
      throw new Error(`Ticket with id ${id} not found`);
    }

    return TicketSchema.parse(result);
  },

  async create(ticket: InsertTicket) {
    const validated = TicketCreateSchema.parse(ticket);

    const [result] = await db
      .insert(ticketsTable)
      .values(validated)
      .returning();

    if (!result) {
      throw new Error('Failed to create ticket');
    }

    return TicketSchema.parse(result);
  },

  async update(id: number, data: Partial<InsertTicket>) {
    const validated = TicketSchema.partial().parse(data);

    const [result] = await db
      .update(ticketsTable)
      .set(validated)
      .where(eq(ticketsTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`Failed to update ticket with id ${id}`);
    }

    return TicketSchema.parse(result);
  },

  async delete(id: number) {
    const [result] = await db
      .delete(ticketsTable)
      .where(eq(ticketsTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`Ticket with id ${id} not found`);
    }

    return TicketSchema.parse(result);
  },
};
