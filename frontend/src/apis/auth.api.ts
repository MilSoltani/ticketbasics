import type { AuthResponse, LoginPayload, SignupPayload } from '@ticketbasics/zod-schemas';

import { authClient } from '@ticketbasics/backend/client';

export async function login(loginPayload: LoginPayload): Promise<AuthResponse> {
  const response = await authClient.login.$post({ json: loginPayload as LoginPayload });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function signup(signupPayload: SignupPayload): Promise<AuthResponse> {
  const response = await authClient.signup.$post({ json: signupPayload as SignupPayload });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function refresh(): Promise<AuthResponse> {
  const response = await authClient.refresh.$post();

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
