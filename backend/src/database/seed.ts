import { seed } from 'drizzle-seed';

import * as schema from '@/database/schema/index.js';
import { db } from '@/index.js';

type Seeder = (count: number) => Promise<void>;

async function seedTickets(count: number): Promise<void> {
  await seed(db, { ticket: schema.ticketsTable }).refine(f => ({
    ticket: {
      count,
      columns: {
        subject: f.loremIpsum({ sentencesCount: 1 }),
        content: f.loremIpsum({ sentencesCount: 10 }),
      },
    },
  }));
}

async function seedUsers(count: number): Promise<void> {
  await seed(db, { ticket: schema.usersTable }).refine(f => ({
    ticket: {
      count,
      columns: {
        firstName: f.firstName(),
        lastName: f.lastName(),
        username: f.lastName(),
      },
    },
  }));
}

const seeders: Record<string, Seeder> = {
  ticket: seedTickets,
  user: seedUsers,
};

async function runSeeder(table: string, count: number): Promise<void> {
  const seeder = seeders[table];

  if (!seeder) {
    console.error(`❌ Table "${table}" not found.`);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`🌱 Seeding "${table}" (${count} rows)...`);

  await seeder(count);

  // eslint-disable-next-line no-console
  console.log('✅ Seeding finished!');
}

function parseArgs(): { table: string; count: number } {
  const [, , tableArg, countArg] = process.argv;

  if (!tableArg) {
    console.error('❌ Table name is required');
    console.error('Usage: tsx src/database/seed.ts <tableName> [count]');
    process.exit(1);
  }

  const count = countArg ? Number(countArg) : 10;

  if (Number.isNaN(count) || count <= 0) {
    console.error('❌ Count must be a positive number');
    process.exit(1);
  }

  return { table: tableArg, count };
}

async function main(): Promise<void> {
  const { table, count } = parseArgs();
  await runSeeder(table, count);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
