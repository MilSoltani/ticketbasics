import type { PaginationType, Ticket, TicketCreatePayload, TicketQuery, TicketUpdatePayload } from '@ticketbasics/zod-schemas';

import { ticketsClient } from '@ticketbasics/backend/client';

import { serializeQuery } from '@/utils/serialize-query.util';

export async function getAllTickets(query: Partial<TicketQuery>): Promise<{ data: Ticket[]; pagination: PaginationType }> {
  const serializedQuery = serializeQuery(query);

  const response = await ticketsClient.index.$get({
    query: serializedQuery,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (!Array.isArray(json.data)) {
    throw new TypeError('Invalid response: expected array of tickets');
  }
  else if (!json.pagination) {
    throw new TypeError('Invalid response: expected pagination');
  }

  return {
    data: json.data,
    pagination: json.pagination,
  };
}

export async function getTicketById(id: number): Promise<Ticket> {
  const response = await ticketsClient[':id'].$get({
    param: { id: String(id) },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (Array.isArray(json.data)) {
    throw new TypeError('Invalid response: expected single ticket');
  }

  return json.data;
}

export async function updateTicket(
  data: { id: number; changes: TicketUpdatePayload },
): Promise<Ticket> {
  const response = await ticketsClient[':id'].$put({
    param: { id: String(data.id) },
    json: data.changes,
  } as any);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const json = await response.json();

  return json.data;
}

export async function createTicket(newTicket: TicketCreatePayload) {
  const response = await ticketsClient.index.$post({ json: newTicket });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const json = await response.json();

  return json.data;
}
