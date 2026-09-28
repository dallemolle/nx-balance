import { healthResponseSchema } from '@nx-balance/contracts';
import { describe, expect, it, vi } from 'vitest';
import { mockFetch } from '@/test/mock-fetch';
import { ApiError, apiGet } from './api-client';

describe('apiGet', () => {
  it('valida a resposta com o schema', async () => {
    mockFetch(200, { status: 'ok', database: 'up', version: '1' });
    await expect(apiGet('/v1/health', healthResponseSchema)).resolves.toEqual({
      status: 'ok',
      database: 'up',
      version: '1',
    });
  });

  it('erro no formato da API vira ApiError com o code', async () => {
    mockFetch(404, { code: 'NOT_FOUND', message: 'Recurso não encontrado.' });
    await expect(apiGet('/v1/x', healthResponseSchema)).rejects.toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
    });
  });

  it('falha de rede vira NETWORK_ERROR', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(apiGet('/v1/health', healthResponseSchema)).rejects.toMatchObject({
      status: 0,
      code: 'NETWORK_ERROR',
    });
  });

  it('não-2xx com outro corpo vira ApiError UNEXPECTED_RESPONSE', async () => {
    mockFetch(503, { status: 'degraded', database: 'down', version: '1' });
    const error = await apiGet('/v1/health', healthResponseSchema).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 503, code: 'UNEXPECTED_RESPONSE' });
  });

  it('não-2xx sem JSON vira UNEXPECTED_RESPONSE', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('<html>Bad Gateway</html>', { status: 502 })),
    );
    await expect(apiGet('/v1/health', healthResponseSchema)).rejects.toMatchObject({
      status: 502,
      code: 'UNEXPECTED_RESPONSE',
    });
  });

  it('2xx fora do schema é rejeitado', async () => {
    mockFetch(200, { status: 'talvez' });
    await expect(apiGet('/v1/health', healthResponseSchema)).rejects.toMatchObject({
      status: 200,
      code: 'UNEXPECTED_RESPONSE',
    });
  });
});
