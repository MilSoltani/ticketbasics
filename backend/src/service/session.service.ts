import type { SessionCreatePayload } from '@ticketbasics/zod-schemas';

import { SessionRepository } from '@backend/repository/session.repository';
import { hash } from 'bcryptjs';

import { REFRESH_TOKEN_EXPIRY } from './jwt.service';

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
};
