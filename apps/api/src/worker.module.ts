import { Module } from '@nestjs/common';
import { ConfigModule } from './infra/config/config.module';
import { JobsModule } from './infra/jobs/jobs.module';
import { LoggerModule } from './infra/logger/logger.module';
import { PrismaModule } from './infra/prisma/prisma.module';

/** Módulo raiz do processo worker (`APP_MODE=worker`): sem HTTP. */
@Module({
  imports: [ConfigModule, LoggerModule, PrismaModule, JobsModule],
})
export class WorkerModule {}
