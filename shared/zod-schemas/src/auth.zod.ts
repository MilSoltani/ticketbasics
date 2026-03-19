import z from 'zod';

import type { User } from './user.zod';

import { UserCreateSchema } from './user.zod';

export const LoginSchema = z.object({
  username: z.string().min(5).max(32),
  password: z.string().min(12).max(128),
});

export const SignupSchema = UserCreateSchema.extend({
  password: z.string().min(12).max(128).regex(/[a-z]/, 'Must contain at least one lowercase letter').regex(/[A-Z]/, 'Must contain at least one uppercase letter').regex(/\d/, 'Must contain at least one number'),
});

export type LoginPayload = z.infer<typeof LoginSchema>;
export type SignupPayload = z.infer<typeof SignupSchema>;

export interface AuthPayload {
  sub: number;
  iat: number;
  exp: number;
  [key: string]: string | number;
}

export interface AuthResponse {
  user: Partial<User>;
  message?: string;
}
