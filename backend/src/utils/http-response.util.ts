import type { Context } from 'hono';

export const HTTP = {
  OK: { code: 200, message: 'OK' },
  CREATED: { code: 201, message: 'Created' },
  ACCEPTED: { code: 202, message: 'Accepted' },
  NO_CONTENT: { code: 204, message: 'No Content' },
  BAD_REQUEST: { code: 400, message: 'Bad Request' },
  UNAUTHORIZED: { code: 401, message: 'Unauthorized' },
  FORBIDDEN: { code: 403, message: 'Forbidden' },
  NOT_FOUND: { code: 404, message: 'Not Found' },
  CONFLICT: { code: 409, message: 'Conflict' },
  INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal Server Error' },
  BAD_GATEWAY: { code: 502, message: 'Bad Gateway' },
  SERVICE_UNAVAILABLE: { code: 503, message: 'Service Unavailable' },
} as const;

export type HttpStatus = keyof typeof HTTP;

export function response<T extends object | string | number | undefined = undefined>(
  c: Context,
  status: HttpStatus | typeof HTTP[HttpStatus],
  payload?: T,
) {
  const { code, message } = typeof status === 'string' ? HTTP[status] : status;

  if (code === 204) {
    return c.status(code);
  }

  let body: unknown;
  if (payload === undefined) {
    body = { message };
  }
  else if (typeof payload === 'string' || typeof payload === 'number') {
    body = { message: payload };
  }
  else {
    body = payload;
  }

  return c.json(body, code);
}
