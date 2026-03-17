import type { UserCreatePayload, UserQuery, UserUpdatePayload } from '@ticketbasics/zod-schemas';

import { UserCreateSchema, UserSchema } from '@ticketbasics/zod-schemas';
import { and, asc, between, count, desc, eq, gte, ilike, lte } from 'drizzle-orm';

import { usersTable } from '@/database/schema';
import { db } from '@/index';

export const UserRepository = {
  async getAll(query: UserQuery) {
    const conditions = [];

    if (query.id) {
      conditions.push(eq(usersTable.id, query.id));
    }

    if (query.firstName) {
      conditions.push(ilike(usersTable.firstName, `%${query.firstName}%`));
    }

    if (query.lastName) {
      conditions.push(ilike(usersTable.lastName, `%${query.lastName}%`));
    }

    if (query.username) {
      conditions.push(ilike(usersTable.username, `%${query.username}%`));
    }

    if (query.createdFrom && query.createdTo) {
      conditions.push(between(usersTable.createdAt, query.createdFrom, query.createdTo));
    }
    else if (query.createdFrom) {
      conditions.push(gte(usersTable.createdAt, query.createdFrom));
    }
    else if (query.createdTo) {
      conditions.push(lte(usersTable.createdAt, query.createdTo));
    }

    const sortMap = {
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      username: usersTable.username,
      createdAt: usersTable.createdAt,
    } as const;

    type SortKey = keyof typeof sortMap;

    const sortColumn = query.sort && (query.sort in sortMap)
      ? sortMap[query.sort as SortKey]
      : usersTable.createdAt;

    const orderBy = query.order === 'asc'
      ? asc(sortColumn)
      : desc(sortColumn);

    const limit = query.limit ?? 25;
    const offset = query.offset ?? 0;

    const data = await db
      .select()
      .from(usersTable)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(usersTable)
      .where(and(...conditions));

    return {
      data: UserSchema.array().parse(data),
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
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!result) {
      throw new Error(`User with id ${id} not found`);
    }

    return UserSchema.parse(result);
  },

  async getByUsernameForAuth(username: string) {
    const [result] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (!result) {
      return null;
    }

    return result;
  },

  async create(user: UserCreatePayload) {
    const validated = UserCreateSchema.parse(user);

    const [result] = await db
      .insert(usersTable)
      .values(validated)
      .returning();

    if (!result) {
      throw new Error('Failed to create user');
    }

    return UserSchema.parse(result);
  },

  async update(id: number, data: Partial<UserUpdatePayload>) {
    const validated = UserSchema.partial().parse(data);

    const [result] = await db
      .update(usersTable)
      .set(validated)
      .where(eq(usersTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`Failed to update user with id ${id}`);
    }

    return UserSchema.parse(result);
  },

  async delete(id: number) {
    const [result] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`User with id ${id} not found`);
    }

    return UserSchema.parse(result);
  },
};
