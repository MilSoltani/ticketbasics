function requireEnv(key: string): string {
  // eslint-disable-next-line node/no-process-env
  const value = process.env[key];

  if (!value)

    throw new Error(`Missing required environment variable: ${key}`);

  return value;
}

export const env = {
  NODE_ENV: requireEnv('NODE_ENV'),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
} as const;
