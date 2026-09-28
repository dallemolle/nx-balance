import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { WorkerModule } from './worker.module';

/**
 * Monta o contexto do worker (usado pelo `main.ts` e pelos testes e2e): sem
 * HTTP, com logger Pino e conexão com o pg-boss (schema `pgboss` criado no
 * primeiro `start()`).
 */
export async function startWorker(): Promise<INestApplicationContext> {
  const ctx = await NestFactory.createApplicationContext(WorkerModule, { bufferLogs: true });
  ctx.useLogger(ctx.get(Logger));
  ctx.enableShutdownHooks();
  ctx.get(Logger).log('Worker iniciado');
  return ctx;
}
