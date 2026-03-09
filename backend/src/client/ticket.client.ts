import { hc } from 'hono/client';

import type ticketHandler from '@/handler/ticket.handler';

export const ticketsClient = hc<typeof ticketHandler>('/tickets');
