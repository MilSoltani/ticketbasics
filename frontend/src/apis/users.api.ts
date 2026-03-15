import type { PaginationType, User, UserCreatePayload, UserQuery, UserUpdatePayload } from '@ticketbasics/zod-schemas';

import { usersClient } from '@ticketbasics/backend/client';

import { serializeQuery } from '@/utils/serialize-query.util';

export async function getAllUsers(query: Partial<UserQuery>): Promise<{ data: User[]; pagination: PaginationType }> {
  const serializedQuery = serializeQuery(query);

  const response = await usersClient.index.$get({
    query: serializedQuery,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (!Array.isArray(json.data)) {
    throw new TypeError('Invalid response: expected array of users');
  }
  else if (!json.pagination) {
    throw new TypeError('Invalid response: expected pagination');
  }

  return {
    data: json.data,
    pagination: json.pagination,
  };
}

export async function getUserById(id: number): Promise<User> {
  const response = await usersClient[':id'].$get({
    param: { id: String(id) },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (Array.isArray(json.data)) {
    throw new TypeError('Invalid response: expected single user');
  }

  return json.data;
}

export async function updateUser(
  data: { id: number; changes: UserUpdatePayload },
): Promise<User> {
  const response = await usersClient[':id'].$put({
    param: { id: String(data.id) },
    json: data.changes,
  } as any);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const json = await response.json();

  return json.data;
}

export async function createUser(newUser: UserCreatePayload) {
  const response = await usersClient.index.$post({ json: newUser });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const json = await response.json();

  return json.data;
}
