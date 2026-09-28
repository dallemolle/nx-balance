import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Env } from '../../infra/config/env';
import type { PrismaService } from '../../infra/prisma/prisma.service';
import { HealthController } from './health.controller';

const env = { APP_VERSION: '1.2.3' } as Env;

function controllerWith(queryRaw: () => Promise<unknown>): HealthController {
  const prisma = { $queryRaw: vi.fn(queryRaw) } as unknown as PrismaService;
  return new HealthController(prisma, env);
}

function fakeResponse(): { status: ReturnType<typeof vi.fn> } {
  return { status: vi.fn() };
}

describe('HealthController', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('responde ok quando o SELECT 1 funciona', async () => {
    const res = fakeResponse();
    const body = await controllerWith(() => Promise.resolve([{ '?column?': 1 }])).check(
      res as never,
    );
    expect(body).toEqual({ status: 'ok', database: 'up', version: '1.2.3' });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responde 503 degraded quando o banco demora mais de 2 s', async () => {
    vi.useFakeTimers();
    const res = fakeResponse();
    const pending = controllerWith(() => new Promise(() => {})).check(res as never);
    await vi.advanceTimersByTimeAsync(2_000);
    await expect(pending).resolves.toEqual({
      status: 'degraded',
      database: 'down',
      version: '1.2.3',
    });
    expect(res.status).toHaveBeenCalledWith(503);
  });

  it('não deixa o timer do timeout pendente quando o banco responde', async () => {
    vi.useFakeTimers();
    await controllerWith(() => Promise.resolve([])).check(fakeResponse() as never);
    expect(vi.getTimerCount()).toBe(0);
  });
});
