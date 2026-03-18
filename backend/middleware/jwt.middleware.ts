import { createMiddleware } from 'hono/factory';
import { jwt } from 'hono/jwt';

import { env } from '@/env';

export const jwtMiddleware = createMiddleware(async (c, next) => {
  const publicPaths = ['/login', '/signup'];
  const path = new URL(c.req.url).pathname;

  if (publicPaths.some(p => path.endsWith(p))) {
    return next();
  }

  return jwt({
    secret: env.JWT_SECRET,
    alg: 'HS256',
    cookie: 'auth_token',
  })(c, next);
});
