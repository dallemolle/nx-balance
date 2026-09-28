import type { INestApplication } from '@nestjs/common';
import { errorResponseSchema, healthResponseSchema } from '@nx-balance/contracts';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createApiApp } from '../src/create-api-app';
import { PrismaService } from '../src/infra/prisma/prisma.service';

describe('API HTTP (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApiApp();
    await app.init();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /v1/health com banco no ar', async () => {
    const res = await request(app.getHttpServer()).get('/v1/health').expect(200);
    expect(healthResponseSchema.parse(res.body)).toMatchObject({ status: 'ok', database: 'up' });
    expect(res.body.version).toBe('0.0.0');
  });

  it('GET /v1/health com banco fora do ar responde 503', async () => {
    vi.spyOn(app.get(PrismaService), '$queryRaw').mockRejectedValueOnce(new Error('ECONNREFUSED'));
    const res = await request(app.getHttpServer()).get('/v1/health').expect(503);
    expect(res.body).toMatchObject({ status: 'degraded', database: 'down' });
  });

  it('rota inexistente usa o formato de erro', async () => {
    const res = await request(app.getHttpServer()).get('/v1/nao-existe').expect(404);
    expect(errorResponseSchema.parse(res.body).code).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Recurso não encontrado.');
  });

  it('OpenAPI documenta o /v1/health', async () => {
    const res = await request(app.getHttpServer()).get('/docs-json').expect(200);
    expect(res.body.paths['/v1/health']).toBeDefined();
    expect(res.body.info).toMatchObject({ title: 'NX-Balance API', version: '0.0.0' });
  });
});
