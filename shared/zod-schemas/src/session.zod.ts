import { z } from 'zod';

/* Enums --------------------------------- */
export const sessionSortEnum = z.enum(['createdAt']);

/* Schemas --------------------------------- */

export const SessionSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  tokenId: z.string(),
  refreshTokenHash: z.string(),
  expiresAt: z.date(),
  revokedAt: z.date().nullable(),
  userAgent: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SessionCreateSchema = SessionSchema.omit({
  id: true,
  revokedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const SessionUpdateSchema = SessionSchema.partial();

export const SessionQuerySchema = z.object({
  userId: z.number().int().optional(),
  createdFrom: z.date().optional(),
  createdTo: z.date().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

/* Constants --------------------------------- */
export const SESSION_SORT_OPTIONS = ['createdAt'];

/* Types --------------------------------- */

export type Session = z.infer<typeof SessionSchema>;
export type SessionCreatePayload = z.infer<typeof SessionCreateSchema>;
export type SessionUpdatePayload = z.infer<typeof SessionUpdateSchema>;
export type SessionSortOption = z.infer<typeof sessionSortEnum>;
export type SessionQuery = z.infer<typeof SessionQuerySchema>;
