import type { AuthPayload } from '@ticketbasics/zod-schemas';

import { env } from '@backend/../env';
import { sign } from 'hono/jwt';

const ACCESS_TOKEN_EXPIRY = 60 * 1; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days

export const JwtService = {
  async generateToken(sub: number, type: 'access' | 'refresh', tokenId?: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = type === 'access'
      ? iat + ACCESS_TOKEN_EXPIRY
      : iat + REFRESH_TOKEN_EXPIRY;

    const jti = tokenId ?? crypto.randomUUID();

    const payload: AuthPayload = { sub, iat, exp, jti };

    const secret = type === 'access'
      ? env.JWT_ACCESS_SECRET
      : env.JWT_REFRESH_SECRET;

    return sign(payload, secret, 'HS256');
  },
};
