import type { JWTPayload } from 'hono/utils/jwt/types';

import { zValidator } from '@hono/zod-validator';
import { LoginSchema, SignupSchema } from '@ticketbasics/zod-schemas';
import { compare, hash } from 'bcryptjs';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';

import { env } from '@/env';
import { UserRepository } from '@/repository';
import { CookieService } from '@/service/cookie.service';
import { JwtService } from '@/service/jwt.service';

const authHandler = new Hono()
  .post('/login', zValidator('json', LoginSchema), async (c) => {
    const { username, password } = c.req.valid('json');

    const user = await UserRepository.getByUsernameForAuth(username);

    const dummyHash = '$2a$10$123456789012345678901uQeQy5cZ0QpQpQpQpQpQpQpQpQpQpQp';
    const hashToCheck = user?.password ?? dummyHash;
    const isValid = await compare(password, hashToCheck);

    if (!user || !isValid) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const accessToken = await JwtService.generateToken(user.id, 'access');
    const refreshToken = await JwtService.generateToken(user.id, 'refresh');

    CookieService.createAccessCookie(c, accessToken);
    CookieService.createRefreshCookie(c, refreshToken);

    return c.json({ message: 'Logged in', user: { id: user.id, username: user.username } });
  })
  .post('/signup', zValidator('json', SignupSchema), async (c) => {
    const { firstName, lastName, username, password } = c.req.valid('json');

    const existingUser = await UserRepository.getByUsernameForAuth(username);

    if (existingUser) {
      return c.json({ message: 'Username already exists' }, 409);
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await UserRepository.create({
      username,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const accessToken = await JwtService.generateToken(newUser.id, 'access');
    const refreshToken = await JwtService.generateToken(newUser.id, 'refresh');

    CookieService.createAccessCookie(c, accessToken);
    CookieService.createRefreshCookie(c, refreshToken);

    return c.json({ message: 'Signed up!', user: { id: newUser.id, username: newUser.username } });
  })
  .post('/refresh', async (c) => {
    const refreshToken = getCookie(c, 'refresh_token');

    if (!refreshToken) {
      return c.json({ message: 'No refresh token' }, 401);
    }

    const payload = await verify(
      refreshToken,
      env.JWT_REFRESH_SECRET,
      'HS256',
    ) as JWTPayload;

    if (!payload) {
      return c.json({ message: 'Invalid refresh token' }, 401);
    }

    const userId = payload.sub as number | undefined;

    if (!userId) {
      return c.json({ message: 'Invalid refresh token' }, 401);
    }

    const newAccessToken = await JwtService.generateToken(userId, 'access');
    const user = await UserRepository.getById(userId);

    CookieService.createAccessCookie(c, newAccessToken);

    return c.json({ message: 'Token refreshed', user: { id: user?.id, username: user?.username } });
  });

export default authHandler;
