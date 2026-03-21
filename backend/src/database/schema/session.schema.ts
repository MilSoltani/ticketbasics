import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { usersTable } from './user.schema';

export const sessionsTable = pgTable('sessions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenId: varchar({ length: 36 }),
  refreshTokenHash: text().unique().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  revokedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
