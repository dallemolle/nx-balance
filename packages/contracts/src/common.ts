import { isIsoDate } from '@nx-balance/core';
import { z } from 'zod';

/**
 * Dinheiro é sempre um inteiro de centavos (`number`), seguro até
 * `Number.MAX_SAFE_INTEGER` (ver global-constraints do projeto: proibido
 * `float`/`toFixed` em cálculo de dinheiro).
 */
export const centsSchema = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);

/**
 * Data de competência: string `AAAA-MM-DD` que representa uma data real
 * (rejeita, por exemplo, `2026-02-30`). Reaproveita a validação de
 * `@nx-balance/core` para não duplicar a regra em cada schema.
 */
export const isoDateSchema = z.string().refine(isIsoDate, 'Data inválida (use AAAA-MM-DD)');
