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

  it('corpo JSON acima do limite do body-parser (100kb) responde 413', async () => {
    // O body-parser do Express roda como middleware global, antes do roteamento:
    // o corpo é lido (e recusado) mesmo numa rota que só aceita GET.
    const oversized = JSON.stringify({ data: 'x'.repeat(200 * 1024) });
    const res = await request(app.getHttpServer())
      .post('/v1/health')
      .set('Content-Type', 'application/json')
      .send(oversized)
      .expect(413);
    expect(errorResponseSchema.parse(res.body)).toEqual({
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Requisição grande demais.',
    });
  });

  it('JSON malformado responde 400 no formato de erro', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/health')
      .set('Content-Type', 'application/json')
      .send('{"quebrado":')
      .expect(400);
    expect(errorResponseSchema.parse(res.body).code).toBe('BAD_REQUEST');
  });

  it('corpo pequeno numa rota só-GET segue para o roteador (404)', async () => {
    await request(app.getHttpServer())
      .post('/v1/health')
      .set('Content-Type', 'application/json')
      .send('{}')
      .expect(404);
  });

  it('OpenAPI documenta o /v1/health', async () => {
    const res = await request(app.getHttpServer()).get('/docs-json').expect(200);
    expect(res.body.paths['/v1/health']).toBeDefined();
    expect(res.body.info).toMatchObject({ title: 'NX-Balance API', version: '0.0.0' });
  });
});
