import type { InferInsertModel } from 'drizzle-orm';

import { TicketCreateSchema, TicketSchema } from '@ticketbasics/zod-schemas';
import { eq } from 'drizzle-orm';

import { ticketsTable } from '@/database/schema';
import { db } from '@/index';

type InsertTicket = InferInsertModel<typeof ticketsTable>;

export const TicketRepository = {
  async getAll() {
    const result = await db
      .select()
      .from(ticketsTable);

    return TicketSchema.array().parse(result);
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
