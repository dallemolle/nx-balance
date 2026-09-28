import { describe, expect, it } from 'vitest';
import { loadEnv } from '../src/infra/config/env';
import { PrismaService } from '../src/infra/prisma/prisma.service';

describe('PrismaService (e2e)', () => {
  it('usa o banco do Testcontainers, não o do docker compose', () => {
    // O globalSetup exporta o DATABASE_URL do contêiner efêmero.
    expect(process.env['E2E_DATABASE_URL']).toBeDefined();
    expect(loadEnv().DATABASE_URL).toBe(process.env['E2E_DATABASE_URL']);
  });

  it('conecta no banco de teste e lê a extensão citext', async () => {
    const prisma = new PrismaService(loadEnv()); // o construtor recebe o Env via @Inject(ENV)
    await prisma.onModuleInit();
    const rows = await prisma.$queryRaw<
      { extname: string }[]
    >`SELECT extname FROM pg_extension WHERE extname = 'citext'`;
    expect(rows).toHaveLength(1);
    await prisma.onModuleDestroy();
  });

  it('aplicou a migration init (tabela system_settings)', async () => {
    const prisma = new PrismaService(loadEnv());
    await prisma.onModuleInit();
    try {
      const saved = await prisma.systemSetting.upsert({
        where: { key: 'e2e' },
        create: { key: 'e2e', value: { ok: true } },
        update: { value: { ok: true } },
      });
      expect(saved.value).toEqual({ ok: true });
      expect(saved.updatedAt).toBeInstanceOf(Date);
    } finally {
      await prisma.onModuleDestroy();
    }
  });
});
