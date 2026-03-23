import { env } from '@backend/../env';
import * as schema from '@backend/database/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function db() {
  if (!_db) {
    const pool = new Pool({ connectionString: env.DATABASE_URL });
    _db = drizzle(pool, { schema });
  }
  return _db;
}
