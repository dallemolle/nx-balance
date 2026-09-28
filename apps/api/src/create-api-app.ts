import type { INestApplication } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { Logger } from 'nestjs-pino';
import { ApiModule } from './api.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { setupOpenApi } from './infra/openapi/setup-openapi';

/**
 * Monta a aplicação HTTP (usada pelo `main.ts` e pelos testes e2e):
 * logger Pino, prefixo `/v1`, validação Zod, formato único de erro e OpenAPI.
 * Não chama `listen` — quem usa decide.
 */
export async function createApiApp(): Promise<INestApplication> {
  const app = await NestFactory.create(ApiModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  setupOpenApi(app);
  app.enableShutdownHooks();
  return app;
}
