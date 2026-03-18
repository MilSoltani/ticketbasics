import type { AuthPayload } from '@ticketbasics/zod-schemas';

import { sign } from 'hono/jwt';

import { env } from '@/env';

const ACCESS_TOKEN_EXPIRY = 60 * 15; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days

export const JwtService = {
  async generateToken(sub: number, type: 'access' | 'refresh'): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = type === 'access'
      ? iat + ACCESS_TOKEN_EXPIRY
      : iat + REFRESH_TOKEN_EXPIRY;

    const payload: AuthPayload = { sub, iat, exp };

    const secret = type === 'access'
      ? env.JWT_ACCESS_SECRET
      : env.JWT_REFRESH_SECRET;

    return sign(payload, secret, 'HS256');
  },

  extractBearerToken(authHeader?: string): string {
    if (!authHeader) {
      throw new Error('Credentials invalid!');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new Error('Credentials invalid!'); ;
    }

    return token;
  },
};
