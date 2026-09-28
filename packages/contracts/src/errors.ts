import { z } from 'zod';

/**
 * Códigos de erro padronizados da API (ver global-constraints do projeto:
 * erros sempre no formato `{ code, message, details? }`, mensagens em
 * português). O valor de cada entrada é o próprio nome, para que
 * `ERROR_CODES.NOT_FOUND === 'NOT_FOUND'`.
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** Formato padrão de erro de toda a API. */
export const errorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
