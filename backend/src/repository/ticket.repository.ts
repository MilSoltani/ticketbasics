import type { Ticket, TicketQuery } from '@ticketbasics/zod-schemas';
import type { InferInsertModel } from 'drizzle-orm';

import { db } from '@backend/database';
import { ticketsTable } from '@backend/database/schema';
import { TicketCreateSchema, TicketNestedSchema, TicketSchema } from '@ticketbasics/zod-schemas';
import { and, asc, between, count, desc, eq, gte, ilike, inArray, lte } from 'drizzle-orm';
import z from 'zod';

import { UserRepository } from './user.repository';

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

    const columnsArray = query.columns ?? [];

    const selected = columnsArray.length > 0
      ? db().select(
          columnsArray.reduce((acc, col) => {
            if (col in ticketsTable) {
              acc[col] = ticketsTable[col as keyof typeof ticketsTable];
            }
            return acc;
          }, {} as Record<string, any>),
        )
      : db().select();

    const data = await selected
      .from(ticketsTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const countResult = await db()
      .select({ total: count() })
      .from(ticketsTable)
      .where(conditions.length ? and(...conditions) : undefined);

    const tickets = await attachUsers(data as Ticket[]);

    return {
      data: TicketNestedSchema.partial().array().parse(tickets),
      pagination: {
        total: Number(countResult[0]?.total ?? 0),
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        pages: Math.ceil(Number(countResult[0]?.total ?? 0) / limit),
      },
    };
  },

  async getById(id: number) {
    const [result] = await db()
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.id, id));

    if (!result) {
      throw new Error(`Ticket with id ${id} not found`);
    }

    const [ticket] = await attachUsers([result]);
    return TicketNestedSchema.parse(ticket);
  },

  async create(ticket: InsertTicket) {
    const validated = TicketCreateSchema.extend({
      creatorId: z.number().int(),
    }).parse(ticket);

    const [result] = await db()
      .insert(ticketsTable)
      .values(validated)
      .returning();

    if (!result) {
      throw new Error('Failed to create ticket');
    }

    const [newTicket] = await attachUsers([result]);
    return TicketNestedSchema.parse(newTicket);
  },

  async update(id: number, data: Partial<InsertTicket>) {
    const validated = TicketSchema.partial().parse(data);

    const [result] = await db()
      .update(ticketsTable)
      .set(validated)
      .where(eq(ticketsTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`Failed to update ticket with id ${id}`);
    }

    const [ticket] = await attachUsers([result]);
    return TicketNestedSchema.parse(ticket);
  },

  async delete(id: number) {
    const [result] = await db()
      .delete(ticketsTable)
      .where(eq(ticketsTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`Ticket with id ${id} not found`);
    }

    const [ticket] = await attachUsers([result]);
    return TicketNestedSchema.parse(ticket);
  },
};

async function attachUsers(rows: Ticket[]) {
  const userIds = [...new Set(
    rows.flatMap(r => [r.creatorId, r.agentId]),
  )].filter((id): id is number => id !== null && id !== undefined);

  const users = await UserRepository.getEssentialUsers(userIds);

  return rows.map((row) => {
    const creator = users.get(row.creatorId);
    const agent = row.agentId ? users.get(row.agentId) : null;

    return { ...row, creator, agent };
  });
}
