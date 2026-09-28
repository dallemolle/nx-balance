import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ENV } from '../config/config.module';
import type { Env } from '../config/env';

/**
 * Logs estruturados com Pino (um log por requisição via `pino-http`).
 * `pino-pretty` só em desenvolvimento; credenciais nunca vão para o log.
 */
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ENV],
      useFactory: (env: Env) => ({
        pinoHttp: {
          level: env.LOG_LEVEL,
          redact: ['req.headers.authorization', 'req.headers.cookie'],
          ...(env.NODE_ENV === 'development'
            ? { transport: { target: 'pino-pretty', options: { singleLine: true } } }
            : {}),
        },
      }),
    }),
  ],
})
export class LoggerModule {}
