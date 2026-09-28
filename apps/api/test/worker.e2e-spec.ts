import type { INestApplicationContext } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { startWorker } from '../src/start-worker';
import { PrismaService } from '../src/infra/prisma/prisma.service';

describe('Worker (e2e)', () => {
  it('o worker conecta o pg-boss e cria o schema pgboss', async () => {
    const ctx: INestApplicationContext = await startWorker();
    const prisma = ctx.get(PrismaService);
    const rows = await prisma.$queryRaw<
      { n: bigint }[]
    >`SELECT count(*) AS n FROM information_schema.schemata WHERE schema_name = 'pgboss'`;
    expect(Number(rows[0]!.n)).toBe(1);
    await ctx.close();
  });
});
