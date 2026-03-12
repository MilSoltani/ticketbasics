import { integer, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['open', 'pending', 'working', 'resolved', 'closed']);

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);

export const ticketsTable = pgTable('tickets', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  subject: varchar({ length: 512 }).notNull(),
  description: text().notNull(),
  status: statusEnum().notNull().default('open'),
  priority: priorityEnum().notNull().default('low'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
