import { serve } from '@hono/node-server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Hono } from 'hono';

// eslint-disable-next-line node/no-process-env
export const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server on http://localhost:${info.port}`);
});
