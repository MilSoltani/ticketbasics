import type { LoginPayload, SignupPayload } from '@ticketbasics/zod-schemas';

import { authClient } from '@ticketbasics/backend/client';

export async function login(loginPayload: LoginPayload): Promise<void> {
  const response = await authClient.login.$post({ json: loginPayload as LoginPayload });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
}

export async function signup(signupPayload: SignupPayload): Promise<void> {
  const response = await authClient.signup.$post({ json: signupPayload as SignupPayload });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
}
