import type z from 'zod';

import { hc } from 'hono/client';

import type { ticketCreateSchema, ticketSchema, ticketUpdateSchema } from '../database/schema';
import type ticketHandler from '../handler/ticket.handler';

export const ticketsClient = hc<typeof ticketHandler>('http://localhost:3000/api/tickets');

export type Ticket = z.infer<typeof ticketSchema>;
export type TicketCreatePayload = z.infer<typeof ticketCreateSchema>;
export type TicketUpdatePayload = z.infer<typeof ticketUpdateSchema>;

export type TicketPriority = z.infer<typeof ticketSchema>['priority'];
export type TicketStatus = z.infer<typeof ticketSchema>['status'];
