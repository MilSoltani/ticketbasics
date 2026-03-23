import type { SessionCreatePayload, SessionQuery, SessionUpdatePayload } from '@ticketbasics/zod-schemas';

import { db } from '@backend/database';
import { sessionsTable } from '@backend/database/schema/session.schema';
import { SessionCreateSchema, SessionSchema } from '@ticketbasics/zod-schemas';
import { and, asc, between, count, desc, eq, gte, lte } from 'drizzle-orm';

export const SessionRepository = {
  async getAll(query: SessionQuery) {
    const conditions = [];

    if (query.userId) {
      conditions.push(eq(sessionsTable.userId, query.userId));
    }

    if (query.createdFrom && query.createdTo) {
      conditions.push(between(sessionsTable.createdAt, query.createdFrom, query.createdTo));
    }
    else if (query.createdFrom) {
      conditions.push(gte(sessionsTable.createdAt, query.createdFrom));
    }
    else if (query.createdTo) {
      conditions.push(lte(sessionsTable.createdAt, query.createdTo));
    }

    const sortMap = {
      createdAt: sessionsTable.createdAt,
    } as const;

    type SortKey = keyof typeof sortMap;

    const sortColumn = query.sort && (query.sort in sortMap)
      ? sortMap[query.sort as SortKey]
      : sessionsTable.createdAt;

    const orderBy = query.order === 'asc'
      ? asc(sortColumn)
      : desc(sortColumn);

    const limit = query.limit ?? 25;
    const offset = query.offset ?? 0;

    const data = await db()
      .select()
      .from(sessionsTable)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const countResult = await db()
      .select({ total: count() })
      .from(sessionsTable)
      .where(and(...conditions));

    return {
      data: SessionSchema.array().parse(data),
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
      .from(sessionsTable)
      .where(eq(sessionsTable.id, id));

    if (!result) {
      throw new Error(`Session with id ${id} not found`);
    }

    return SessionSchema.parse(result);
  },

  async getByTokenId(tokenId: string) {
    const [result] = await db()
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.tokenId, tokenId));

    if (!result) {
      throw new Error(`Session with tokenId ${tokenId} not found`);
    }

    return SessionSchema.parse(result);
  },

  async create(session: SessionCreatePayload) {
    const validated = SessionCreateSchema.parse(session);

    const [result] = await db()
      .insert(sessionsTable)
      .values(validated)
      .returning();

    if (!result) {
      throw new Error('Failed to create session');
    }

    return SessionSchema.parse(result);
  },

  async update(id: number, data: Partial<SessionUpdatePayload>) {
    const validated = SessionSchema.partial().parse(data);

    const [result] = await db()
      .update(sessionsTable)
      .set(validated)
      .where(eq(sessionsTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`Failed to update session with id ${id}`);
    }

    return SessionSchema.parse(result);
  },

  async delete(id: number) {
    const [result] = await db()
      .delete(sessionsTable)
      .where(eq(sessionsTable.id, id))
      .returning();

    if (!result) {
      throw new Error(`Session with id ${id} not found`);
    }

    return SessionSchema.parse(result);
  },
};
