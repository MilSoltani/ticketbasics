import type authHandler from '@backend/handler/auth.handler';
import type ticketHandler from '@backend/handler/ticket.handler';
import type userHandler from '@backend/handler/user.handler';

import { hc } from 'hono/client';

export const ticketsClient = hc<typeof ticketHandler>('/api/tickets', {
  init: { credentials: 'include' },
});

export const usersClient = hc<typeof userHandler>('/api/users', {
  init: { credentials: 'include' },
});

export const authClient = hc<typeof authHandler>('/api', {
  init: { credentials: 'include' },
});
