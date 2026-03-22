import { env } from '@backend/env';
import authHandler from '@backend/handler/auth.handler';
import ticketHandler from '@backend/handler/ticket.handler';
import userHandler from '@backend/handler/user.handler';
import { jwtMiddleware } from '@backend/middleware/jwt.middleware';
import { serve } from '@hono/node-server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';

export const db = drizzle(env.DATABASE_URL);

const app = new Hono()
  .use('/*', cors())
  .use(logger())
  .route('/api', authHandler)
  .use('/api/*', jwtMiddleware)
  .route('/api/tickets', ticketHandler)
  .route('/api/users', userHandler)
  .notFound((c) => {
    return c.json({ error: 'Not Found!' }, 404);
  })
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }
    console.error(err);
    return c.text('Internal Server Error', 500);
  });

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server on http://localhost:${info.port}`);
});
