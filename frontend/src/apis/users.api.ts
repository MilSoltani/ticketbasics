import type { PaginationType, User, UserQuery, UserUpdatePayload } from '@ticketbasics/zod-schemas';

import { usersClient } from '@ticketbasics/backend/client';

import { serializeQuery } from '@/utils/serialize-query.util';

import { authFetch } from '../utils/auth-fetch.util';

export async function getAllUsers(query: Partial<UserQuery>): Promise<{ data: User[]; pagination: PaginationType }> {
  const serializedQuery = serializeQuery(query);

  const json = await authFetch<{ data: User[]; pagination: PaginationType }>(
    () => usersClient.index.$get({
      query: serializedQuery,
    }),
  );

  return {
    data: json.data,
    pagination: json.pagination,
  };
}

export async function getUserById(id: number): Promise<User> {
  const json = await authFetch<{ data: User }>(
    () => usersClient[':id'].$get({
      param: { id: String(id) },
    }),
  );

  return json.data;
}

export async function updateUser(
  data: { id: number; changes: UserUpdatePayload },
): Promise<User> {
  const json = await authFetch<{ data: User }>(
    () => usersClient[':id'].$put({
      param: { id: String(data.id) },
      json: data.changes,
    } as any),
  );

  return json.data;
}

export async function deleteUser(id: number): Promise<User> {
  const json = await authFetch<{ data: User }>(
    () => usersClient[':id'].$delete({ param: { id: String(id) } }),
  );

  return json.data;
}
