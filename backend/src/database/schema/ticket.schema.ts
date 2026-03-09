import { integer, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';

export const statusEnum = pgEnum('status', ['open', 'pending', 'working', 'resolved', 'closed']);

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);

export const ticketsTable = pgTable('tickets', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  subject: varchar({ length: 512 }).notNull(),
  description: text().notNull(),
  status: statusEnum().notNull().default('open'),
  priority: priorityEnum().notNull().default('low'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ticketSchema = createSelectSchema(ticketsTable);

export const ticketInsertSchema = createInsertSchema(ticketsTable)
  .omit({
    createdAt: true,
    updatedAt: true,
  });

export const ticketUpdateSchema = createUpdateSchema(ticketsTable)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial();
