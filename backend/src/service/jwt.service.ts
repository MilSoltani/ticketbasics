import type { AuthPayload } from '@ticketbasics/zod-schemas';

import { sign } from 'hono/jwt';

import { env } from '@/env';

const EXPIRATION_SECONDS = 60 * 60 * Number(env.JWT_EXPIRE_HOURS);

export const JwtService = {
  async generateToken(userId: number): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const payload: AuthPayload = {
      sub: userId,
      iat: now,
      exp: now + EXPIRATION_SECONDS,
    };
    return sign(payload, env.JWT_SECRET);
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
