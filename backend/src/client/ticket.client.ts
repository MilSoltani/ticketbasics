import type z from 'zod';

import { hc } from 'hono/client';

import type { ticketSchema } from '../database/schema';
import type ticketHandler from '../handler/ticket.handler';

export const ticketsClient = hc<typeof ticketHandler>('http://localhost:3000/api/tickets');

export type Ticket = z.infer<typeof ticketSchema>;
