// Seed idempotente do banco de desenvolvimento (`pnpm db:seed`).
// Pode rodar quantas vezes quiser: usa upsert.
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { loadEnv } from '../src/infra/config/env';

async function main(): Promise<void> {
  const env = loadEnv();
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
  });
  try {
    const value = { version: 1 };
    await prisma.systemSetting.upsert({
      where: { key: 'seed' },
      create: { key: 'seed', value },
      update: { value },
    });
    console.log('Seed aplicado: system_settings[seed] = %j', value);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
