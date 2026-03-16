import z from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(5).max(32),
});

export type LoginPayload = z.infer<typeof LoginSchema>;

export interface AuthPayload {
  sub: number;
  iat: number;
  exp: number;
  [key: string]: string | number;
}
