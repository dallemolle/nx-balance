import 'reflect-metadata';
import { Inject, Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfigModule, ENV } from './config.module';
import type { Env } from './env';

@Injectable()
class NeedsEnv {
  constructor(@Inject(ENV) readonly env: Env) {}
}

// Módulo que NÃO importa o ConfigModule: só enxerga o ENV porque ele é global.
@Module({ providers: [NeedsEnv] })
class FeatureModule {}

@Module({ imports: [ConfigModule, FeatureModule] })
class AppModule {}

describe('ConfigModule', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('fornece o Env validado pelo token ENV para qualquer módulo', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://u:p@localhost:5432/db');
    vi.stubEnv('PORT', '4321');
    const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
    try {
      expect(app.get<Env>(ENV)).toMatchObject({ PORT: 4321, APP_MODE: 'api' });
      expect(app.get(NeedsEnv).env.DATABASE_URL).toBe('postgresql://u:p@localhost:5432/db');
    } finally {
      await app.close();
    }
  });

  it('falha na inicialização quando a configuração é inválida', async () => {
    vi.stubEnv('DATABASE_URL', undefined);
    await expect(
      NestFactory.createApplicationContext(AppModule, { logger: false, abortOnError: false }),
    ).rejects.toThrow(/Configuração inválida: DATABASE_URL/);
  });
});
