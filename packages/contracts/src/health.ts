import { z } from 'zod';

/** Resposta do endpoint `/health`. */
export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  database: z.enum(['up', 'down']),
  version: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
