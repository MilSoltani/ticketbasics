import { serve } from '@hono/node-server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { env } from '../env';
import ticketHandler from './handler/ticket.handler';
import userHandler from './handler/user.handler';

export const db = drizzle(env.DATABASE_URL);

const app = new Hono()
  .use('/*', cors())
  .use(logger())
  .route('/api/tickets', ticketHandler)
  .route('/api/users', userHandler);

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server on http://localhost:${info.port}`);
});
