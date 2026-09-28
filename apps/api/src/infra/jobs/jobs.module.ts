import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';

/** Módulo do pg-boss (depende do `ConfigModule` para o `DATABASE_URL`). */
@Module({
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
