import { refresh } from '@/apis';

/**
 * Authorized fetch:
 * Server returns 401, asks for a token-refresh automatically
 */
export async function authFetch<T>(fn: () => Promise<Response>): Promise<T> {
  let res = await fn();

  if (res.status !== 401) {
    return res.json() as Promise<T>;
  }

  await refresh();

  res = await fn();
  if (!res.ok)
    throw new Error(`API error: ${res.statusText}`);

  return res.json() as Promise<T>;
}
