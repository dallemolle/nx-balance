import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/** Módulo global que expõe o `PrismaService` (depende do `ConfigModule`). */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
