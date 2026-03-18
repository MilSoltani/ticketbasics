import { hc } from 'hono/client';

import type authHandler from './handler/auth.handler';
import type ticketHandler from './handler/ticket.handler';
import type userHandler from './handler/user.handler';

export const ticketsClient = hc<typeof ticketHandler>('/api/tickets', {
  init: { credentials: 'include' },
});

export const usersClient = hc<typeof userHandler>('/api/users', {
  init: { credentials: 'include' },
});

export const authClient = hc<typeof authHandler>('/api', {
  init: { credentials: 'include' },
});
