import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import type { HealthResponse } from '@nx-balance/contracts';
import type { Response } from 'express';
import { ENV } from '../../infra/config/config.module';
import type { Env } from '../../infra/config/env';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { HealthResponseDto } from './health.dto';

/** Tempo máximo de espera pelo `SELECT 1` antes de considerar o banco fora do ar. */
export const DATABASE_TIMEOUT_MS = 2_000;

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ENV) private readonly env: Env,
  ) {}

  @Get()
  @ApiOkResponse({ type: HealthResponseDto.Output, description: 'API e banco no ar.' })
  @ApiServiceUnavailableResponse({
    type: HealthResponseDto.Output,
    description: 'Banco fora do ar ou sem resposta em 2 s.',
  })
  async check(@Res({ passthrough: true }) res: Response): Promise<HealthResponse> {
    const databaseUp = await this.pingDatabase();
    if (!databaseUp) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
      return { status: 'degraded', database: 'down', version: this.env.APP_VERSION };
    }
    return { status: 'ok', database: 'up', version: this.env.APP_VERSION };
  }

  /** `SELECT 1` com timeout; o timer é sempre limpo para não segurar o processo. */
  private async pingDatabase(): Promise<boolean> {
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('timeout do banco')), DATABASE_TIMEOUT_MS);
    });
    try {
      await Promise.race([this.prisma.$queryRaw`SELECT 1`, timeout]);
      return true;
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }
}
