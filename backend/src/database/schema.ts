import { integer, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('role', ['customer', 'agent', 'admin']);

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  avatar: varchar({ length: 255 }),
  phone: varchar({ length: 32 }),
  role: userRoleEnum().notNull().default('customer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
