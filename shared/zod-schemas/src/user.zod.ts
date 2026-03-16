import { z } from 'zod';

/* Enums --------------------------------- */

export const userSortEnum = z.enum(['firstName', 'lastName', 'username', 'createdAt']);

/* Schemas --------------------------------- */

export const UserSchema = z.object({
  id: z.number().int(),
  firstName: z.string().max(32).optional(),
  lastName: z.string().max(32).optional(),
  username: z.string().min(5).max(32),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserUpdateSchema = UserCreateSchema.partial();

export const UserQuerySchema = z.object({
  id: z.coerce.number().int().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

/* Constants --------------------------------- */

export const USER_SORT_OPTIONS = ['firstName', 'lastName', 'username', 'createdAt'];

/* Types --------------------------------- */

export type User = z.infer<typeof UserSchema>;
export type UserCreatePayload = z.infer<typeof UserCreateSchema>;
export type UserUpdatePayload = z.infer<typeof UserUpdateSchema>;
export type UserSortOption = z.infer<typeof userSortEnum>;
export type UserQuery = z.infer<typeof UserQuerySchema>;
