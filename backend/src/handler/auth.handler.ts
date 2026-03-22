import type { AppJwtVariables } from '@backend/middleware/jwt.middleware';
import type { User } from '@ticketbasics/zod-schemas';
import type { Context } from 'hono';

import { UserRepository } from '@backend/repository';
import { CookieService } from '@backend/service/cookie.service';
import { SessionService } from '@backend/service/session.service';
import { TokenService } from '@backend/service/token.service';
import { zValidator } from '@hono/zod-validator';
import { LoginSchema, SignupSchema } from '@ticketbasics/zod-schemas';
import { compare, hash } from 'bcryptjs';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';

async function issueJWT(c: Context, user: User) {
  const tokenId = crypto.randomUUID();
  const accessToken = await TokenService.generateToken(user.id, 'access');
  const refreshToken = await TokenService.generateToken(user.id, 'refresh', tokenId);

  const userAgent = c.req.header('User-Agent');
  await SessionService.createSession(user.id, refreshToken, tokenId, userAgent);

  CookieService.createAccessCookie(c, accessToken);
  CookieService.createRefreshCookie(c, refreshToken);

  return { id: user.id, username: user.username };
}

const authHandler = new Hono<{ Variables: AppJwtVariables }>()
  .post('/login', zValidator('json', LoginSchema), async (c) => {
    const { username, password } = c.req.valid('json');

    const user = await UserRepository.getByUsernameForAuth(username);

    const dummyHash = '$2a$10$123456789012345678901uQeQy5cZ0lsjfoijsodijfpsjdfjslfpQpQpQpQp';
    const hashToCheck = user?.password ?? dummyHash;
    const isValid = await compare(password, hashToCheck);

    if (!user || !isValid) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userPayload = await issueJWT(c, user);

    return c.json(userPayload, 200);
  })
  .post('/signup', zValidator('json', SignupSchema), async (c) => {
    const { firstName, lastName, username, password } = c.req.valid('json');

    const existingUser = await UserRepository.getByUsernameForAuth(username);

    if (existingUser) {
      return c.json({ error: 'Conflict' }, 409);
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await UserRepository.create({
      username,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const userPayload = await issueJWT(c, newUser);

    return c.json(userPayload, 200);
  })
  .post('/refresh', async (c) => {
    const refreshToken = getCookie(c, 'refresh_token');
    if (!refreshToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
      const { user, newAccessToken, newRefreshToken } = await SessionService.refreshSession(refreshToken);

      CookieService.createAccessCookie(c, newAccessToken);
      CookieService.createRefreshCookie(c, newRefreshToken);

      return c.json({ user }, 200);
    }
    catch {
      return c.json({ error: 'Unauthorized' }, 401);
    }
  });

export default authHandler;
