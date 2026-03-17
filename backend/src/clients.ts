import { hc } from 'hono/client';

import type authHandler from './handler/auth.handler';
import type ticketHandler from './handler/ticket.handler';
import type userHandler from './handler/user.handler';

export const ticketsClient = hc<typeof ticketHandler>('http://localhost:3000/api/tickets');

export const usersClient = hc<typeof userHandler>('http://localhost:3000/api/users');

export const authClient = hc<typeof authHandler>('http://localhost:3000/api');
