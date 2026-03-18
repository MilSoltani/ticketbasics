import type { Context } from 'hono';

import { setCookie } from 'hono/cookie';

import { env } from '@/env';

const isProd = env.NODE_ENV === 'production';

export const CookieService = {
  createAccessCookie(c: Context, accessToken: string) {
    return createCookie(c, 'access_token', accessToken, 60 * 15, '/');
  },

  createRefreshCookie(c: Context, refreshToken: string) {
    return createCookie(c, 'refresh_token', refreshToken, 60 * 60 * 24 * 7, '/api/refresh');
  },
};

function createCookie(c: Context, name: string, value: string, maxAge: number, path: string = '/') {
  return setCookie(c, name, value, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'Strict' : 'Lax',
    path,
    maxAge,
  });
}
