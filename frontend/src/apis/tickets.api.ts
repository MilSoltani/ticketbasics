import type { GetAllQueryResponse, Ticket, TicketCreatePayload, TicketQuery, TicketUpdatePayload } from '@ticketbasics/zod-schemas';

import { ticketsClient } from '@ticketbasics/backend/client';

import { authFetch } from '@/utils/auth-fetch.util';
import { serializeQuery } from '@/utils/serialize-query.util';

export async function getAllTickets(query: Partial<TicketQuery>): Promise<GetAllQueryResponse<Ticket>> {
  const serializedQuery = serializeQuery(query);

  return await authFetch<GetAllQueryResponse<Ticket>>(
    () => ticketsClient.index.$get({ query: serializedQuery }),
  );
}

export async function getTicketById(id: number): Promise<Ticket> {
  const result = await authFetch<{ data: Ticket }>(
    () => ticketsClient[':id'].$get({
      param: { id: String(id) },
    }),
  );
  return result.data;
}

export async function updateTicket(
  data: { id: number; changes: TicketUpdatePayload },
): Promise<Ticket> {
  const result = await authFetch<{ data: Ticket }>(
    () => ticketsClient[':id'].$put({
      param: { id: String(data.id) },
      json: data.changes,
    } as any),
  );
  return result.data;
}

export async function createTicket(newTicket: TicketCreatePayload): Promise<Ticket> {
  const result = await authFetch<{ data: Ticket }>(
    () => ticketsClient.index.$post({ json: newTicket }),
  );
  return result.data;
}

export async function deleteTicket(id: number): Promise<Ticket> {
  const result = await authFetch<{ data: Ticket }>(
    () => ticketsClient[':id'].$delete({ param: { id: String(id) } }),
  );
  return result.data;
}
