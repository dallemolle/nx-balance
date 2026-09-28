import {
  Inject,
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { PgBoss } from 'pg-boss';
import { ENV } from '../config/config.module';
import type { Env } from '../config/env';

/**
 * Conexão com o pg-boss (fila de jobs em background). No `schema` próprio
 * (`pgboss`) para não conflitar com as tabelas da aplicação. Conecta e cria
 * o schema em `onModuleInit`; desconecta em `onModuleDestroy`.
 */
@Injectable()
export class JobsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JobsService.name);
  private readonly pgBoss: PgBoss;

  constructor(@Inject(ENV) env: Env) {
    this.pgBoss = new PgBoss({ connectionString: env.DATABASE_URL, schema: 'pgboss' });
    this.pgBoss.on('error', (error) => this.logger.error(error));
  }

  /** Instância do pg-boss, para as próximas etapas registrarem filas. */
  get boss(): PgBoss {
    return this.pgBoss;
  }

  async onModuleInit(): Promise<void> {
    await this.pgBoss.start();
  }

  async onModuleDestroy(): Promise<void> {
    await this.pgBoss.stop({ graceful: true });
  }
}
