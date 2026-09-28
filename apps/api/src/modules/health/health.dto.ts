import { healthResponseSchema } from '@nx-balance/contracts';
import { createZodDto } from 'nestjs-zod';

/** DTO da resposta de `GET /v1/health` (schema compartilhado com a web). */
export class HealthResponseDto extends createZodDto(healthResponseSchema) {}
