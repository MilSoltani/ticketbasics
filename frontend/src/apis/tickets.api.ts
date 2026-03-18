import type { GetAllQueryResponse, Ticket, TicketCreatePayload, TicketQuery, TicketUpdatePayload } from '@ticketbasics/zod-schemas';

import { ticketsClient } from '@ticketbasics/backend/client';

import { serializeQuery } from '@/utils/serialize-query.util';

import { authFetch } from '../utils/auth-fetch.util';

export async function getAllTickets(query: Partial<TicketQuery>): Promise<GetAllQueryResponse<Ticket>> {
  const serializedQuery = serializeQuery(query);

  return await authFetch<GetAllQueryResponse<Ticket>>(
    () => ticketsClient.index.$get({ query: serializedQuery }),
  );
}

export async function getTicketById(id: number): Promise<Ticket> {
  return await authFetch<Ticket>(
    () => ticketsClient[':id'].$get({
      param: { id: String(id) },
    }),
  );
}

export async function updateTicket(
  data: { id: number; changes: TicketUpdatePayload },
): Promise<Ticket> {
  return await authFetch<Ticket>(
    () => ticketsClient[':id'].$put({
      param: { id: String(data.id) },
      json: data.changes,
    } as any),
  );
}

export async function createTicket(newTicket: TicketCreatePayload): Promise<Ticket> {
  return await authFetch<Ticket>(
    () => ticketsClient.index.$post({ json: newTicket }),
  );
}

export async function deleteTicket(id: number): Promise<Ticket> {
  return await authFetch<Ticket>(
    () => ticketsClient[':id'].$delete({ param: { id: String(id) } }),
  );
}
