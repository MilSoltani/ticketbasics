import type { SessionCreatePayload } from '@ticketbasics/zod-schemas';
import type { JWTPayload } from 'hono/utils/jwt/types';

import { env } from '@backend/../env';
import { UserRepository } from '@backend/repository';
import { SessionRepository } from '@backend/repository/session.repository';
import { compare, hash } from 'bcryptjs';
import { verify } from 'hono/jwt';

import { REFRESH_TOKEN_EXPIRY, TokenService } from './token.service';

export const SessionService = {
  async createSession(userId: number, refreshToken: string, tokenId: string, userAgent: string | null = null) {
    const refreshTokenHash = await hash(refreshToken, 12);
    const newSession: SessionCreatePayload = {
      userId,
      tokenId,
      refreshTokenHash,
      userAgent,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000),
    };

    return SessionRepository.create(newSession);
  },

  async refreshSession(token: string) {
    if (!token)
      throw new Error('No refresh token provided');

    let payload: JWTPayload;
    try {
      payload = await verify(token, env.JWT_REFRESH_SECRET, 'HS256') as JWTPayload;
    }
    catch {
      throw new Error('Invalid or expired refresh token signature');
    }

    if (!payload?.sub || !payload.jti) {
      throw new Error('Malformed token payload');
    }

    const session = await SessionRepository.getByTokenId(payload.jti as string);

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.revokedAt) {
      throw new Error('Session has been revoked');
    }

    if (session.expiresAt <= new Date()) {
      throw new Error('Session has expired');
    }

    const valid = await compare(token, session.refreshTokenHash);
    if (!valid) {
      throw new Error('Token mismatch');
    }

    const newTokenId = crypto.randomUUID();
    const userId = payload.sub as number;

    const newRefreshToken = await TokenService.generateToken(userId, 'refresh', newTokenId);
    const newAccessToken = await TokenService.generateToken(userId, 'access');

    const newHash = await hash(newRefreshToken, 12);

    await SessionRepository.update(session.id, {
      refreshTokenHash: newHash,
      tokenId: newTokenId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000),
    });

    const user = await UserRepository.getById(userId);
    if (!user)
      throw new Error('User no longer exists');

    return {
      user: { id: user.id, username: user.username },
      newAccessToken,
      newRefreshToken,
    };
  },
};
