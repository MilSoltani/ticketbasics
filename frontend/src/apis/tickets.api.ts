import type { GetAllQueryResponse, TicketCreatePayload, TicketNested, TicketQuery, TicketUpdatePayload } from '@ticketbasics/zod-schemas';

import { ticketsClient } from '@ticketbasics/backend/client';

import { authFetch } from '@/utils/auth-fetch.util';
import { serializeQuery } from '@/utils/serialize-query.util';

export async function getAllTickets(query: Partial<TicketQuery>): Promise<GetAllQueryResponse<TicketNested>> {
  const serializedQuery = serializeQuery(query);

  return await authFetch<GetAllQueryResponse<TicketNested>>(
    () => ticketsClient.index.$get({ query: serializedQuery }),
  );
}

export async function getTicketById(id: number): Promise<TicketNested> {
  const result = await authFetch<{ data: TicketNested }>(
    () => ticketsClient[':id'].$get({
      param: { id: String(id) },
    }),
  );
  return result.data;
}

export async function updateTicket(
  data: { id: number; changes: TicketUpdatePayload },
): Promise<TicketNested> {
  const result = await authFetch<{ data: TicketNested }>(
    () => ticketsClient[':id'].$put({
      param: { id: String(data.id) },
      json: data.changes,
    } as any),
  );
  return result.data;
}

export async function createTicket(newTicket: TicketCreatePayload): Promise<TicketNested> {
  const result = await authFetch<{ data: TicketNested }>(
    () => ticketsClient.index.$post({ json: newTicket }),
  );
  return result.data;
}

export async function deleteTicket(id: number): Promise<TicketNested> {
  const result = await authFetch<{ data: TicketNested }>(
    () => ticketsClient[':id'].$delete({ param: { id: String(id) } }),
  );
  return result.data;
}
