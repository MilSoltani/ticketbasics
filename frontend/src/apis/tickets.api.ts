import type { Ticket, TicketCreatePayload, TicketUpdatePayload } from '@ticketbasics/zod-schemas';

import { ticketsClient } from '@ticketbasics/backend/client';

export async function getAllTickets(): Promise<Ticket[]> {
  const response = await ticketsClient.index.$get();

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (!Array.isArray(json.data)) {
    throw new TypeError('Invalid response: expected array of tickets');
  }

  return json.data;
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
