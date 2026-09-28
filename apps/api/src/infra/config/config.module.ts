import { Global, Module } from '@nestjs/common';
import { loadEnv } from './env';

/** Token de injeção do `Env` validado (`@Inject(ENV) env: Env`). */
export const ENV = Symbol('ENV');

/**
 * Módulo global de configuração: valida `process.env` uma única vez na
 * inicialização (falha rápido se algo estiver inválido) e expõe o `Env`.
 */
@Global()
@Module({
  providers: [{ provide: ENV, useFactory: () => loadEnv() }],
  exports: [ENV],
})
export class ConfigModule {}
