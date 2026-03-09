function requireEnv(key: string): string {
  // eslint-disable-next-line node/no-process-env
  const value = process.env[key];

  if (!value)

    throw new Error(`Missing required environment variable: ${key}`);

  return value;
}

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
} as const;
