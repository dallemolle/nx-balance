import { Module } from '@nestjs/common';
import { ConfigModule } from './infra/config/config.module';
import { LoggerModule } from './infra/logger/logger.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';

/** Módulo raiz do processo HTTP (`APP_MODE=api`). */
@Module({
  imports: [ConfigModule, LoggerModule, PrismaModule, HealthModule],
})
export class ApiModule {}
