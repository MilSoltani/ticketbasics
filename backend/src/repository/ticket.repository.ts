import type { InferInsertModel } from 'drizzle-orm';

import { eq } from 'drizzle-orm';

import { ticketSchema, ticketsTable } from '@/database/schema';
import { db } from '@/index';

type InsertTicket = InferInsertModel<typeof ticketsTable>;

export const TicketRepository = {
  async getAll() {
    const result = await db
      .select()
      .from(ticketsTable);

    return ticketSchema.array().parse(result);
  },

  async getById(id: number) {
    const [result] = await db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.id, id));

    if (!result) {
      throw new Error(`Ticket with id ${id} not found`);
    }

    return ticketSchema.parse(result);
  },

  async create(ticket: InsertTicket) {
    // Validate input before inserting
    const validated = ticketSchema.parse(ticket);

    const [result] = await db
      .insert(ticketsTable)
      .values(validated)
      .returning();

    if (!result) {
      throw new Error('Failed to create ticket');
    }

    return ticketSchema.parse(result);
  },

  async update(id: number, data: Partial<InsertTicket>) {
    // Validate partial input before updating
    const validated = ticketSchema.partial().parse(data);

    const [result] = await db
      .update(ticketsTable)
      .set(validated)
      .where(eq(ticketsTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`Failed to update ticket with id ${id}`);
    }

    return ticketSchema.parse(result);
  },

  async delete(id: number) {
    const [result] = await db
      .delete(ticketsTable)
      .where(eq(ticketsTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`Ticket with id ${id} not found`);
    }

    return ticketSchema.parse(result);
  },
};
