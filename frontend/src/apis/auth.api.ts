import type { AuthPayload, LoginPayload } from '@ticketbasics/zod-schemas';

import { authClient } from '@ticketbasics/backend/client';

export async function login(loginPayload: LoginPayload): Promise<{ token: AuthPayload }> {
  const response = await authClient.login.$post({ json: loginPayload as LoginPayload });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const json = await response.json();

  return {
    token: json.token,
  };
}
