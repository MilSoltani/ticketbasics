import type { JWTPayload } from 'hono/utils/jwt/types';

import { env } from '@backend/../env';
import { UserRepository } from '@backend/repository';
import { SessionRepository } from '@backend/repository/session.repository';
import { CookieService } from '@backend/service/cookie.service';
import { JwtService, REFRESH_TOKEN_EXPIRY } from '@backend/service/jwt.service';
import { SessionService } from '@backend/service/session.service';
import { HTTP, response } from '@backend/utils/http-response.util';
import { zValidator } from '@hono/zod-validator';
import { LoginSchema, SignupSchema } from '@ticketbasics/zod-schemas';
import { compare, hash } from 'bcryptjs';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';

const authHandler = new Hono()
  .post('/login', zValidator('json', LoginSchema), async (c) => {
    const { username, password } = c.req.valid('json');

    const user = await UserRepository.getByUsernameForAuth(username);

    const dummyHash = '$2a$10$123456789012345678901uQeQy5cZ0lsjfoijsodijfpsjdfjslfpQpQpQpQp';
    const hashToCheck = user?.password ?? dummyHash;
    const isValid = await compare(password, hashToCheck);

    if (!user || !isValid) {
      return response(c, HTTP.UNAUTHORIZED);
    }

    const accessToken = await JwtService.generateToken(user.id, 'access');
    const refreshToken = await JwtService.generateToken(user.id, 'refresh');

    const userAgent = c.req.header('User-Agent');
    await SessionService.createSession(user.id, refreshToken, crypto.randomUUID(), userAgent);

    CookieService.createAccessCookie(c, accessToken);
    CookieService.createRefreshCookie(c, refreshToken);

    const userPayload = { id: user.id, username: user.username };

    return response(c, HTTP.OK, userPayload);
  })
  .post('/signup', zValidator('json', SignupSchema), async (c) => {
    const { firstName, lastName, username, password } = c.req.valid('json');

    const existingUser = await UserRepository.getByUsernameForAuth(username);

    if (existingUser) {
      return response(c, HTTP.CONFLICT);
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

    const userAgent = c.req.header('User-Agent');
    await SessionService.createSession(newUser.id, refreshToken, crypto.randomUUID(), userAgent);

    CookieService.createAccessCookie(c, accessToken);
    CookieService.createRefreshCookie(c, refreshToken);

    const userPayload = { id: newUser.id, username: newUser.username };

    return response(c, HTTP.OK, userPayload);
  })
  .post('/refresh', async (c) => {
    const refreshToken = getCookie(c, 'refresh_token');

    if (!refreshToken)
      return response(c, HTTP.UNAUTHORIZED);

    const payload = await verify(refreshToken, env.JWT_REFRESH_SECRET, 'HS256') as JWTPayload;

    if (!payload?.sub || !payload.jti)
      return response(c, HTTP.UNAUTHORIZED);

    const session = await SessionRepository.getByTokenId(payload.jti as string);

    if (!session)
      return response(c, HTTP.UNAUTHORIZED);

    if (session.revokedAt || session.expiresAt <= new Date()) {
      return response(c, HTTP.UNAUTHORIZED);
    }

    const valid = await compare(refreshToken, session.refreshTokenHash);

    if (!valid)
      return response(c, HTTP.UNAUTHORIZED);

    const newRefreshToken = await JwtService.generateToken(payload.sub as number, 'refresh');
    const newHash = await hash(newRefreshToken, 12);

    await SessionRepository.update(session.id, {
      refreshTokenHash: newHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    });

    const newAccessToken = await JwtService.generateToken(payload.sub as number, 'access');

    CookieService.createAccessCookie(c, newAccessToken);
    CookieService.createRefreshCookie(c, newRefreshToken);

    const user = await UserRepository.getById(payload.sub as number);

    return response(c, HTTP.OK, { user: { id: user.id, username: user.username } });
  });

export default authHandler;
