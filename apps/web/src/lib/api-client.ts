import { errorResponseSchema } from '@nx-balance/contracts';
import type { z } from 'zod';

/** Erro de chamada à API, sempre com o status HTTP (0 = sem resposta) e um `code` estável. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

/**
 * Faz `GET` em `path` e valida o corpo com `schema`.
 *
 * - 2xx: devolve o corpo validado (fora do schema → `UNEXPECTED_RESPONSE`);
 * - não-2xx no formato de erro da API → `ApiError` com o `code` do corpo;
 * - não-2xx com outro corpo → `ApiError` com `code: 'UNEXPECTED_RESPONSE'`;
 * - falha de rede → `ApiError` com `status: 0` e `code: 'NETWORK_ERROR'`.
 */
export async function apiGet<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  let response: Response;
  try {
    response = await fetch(path, { ...init, method: 'GET', headers });
  } catch (error) {
    // Cancelamento (ex.: TanStack Query abortando a consulta) não é falha de rede.
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'NETWORK_ERROR', 'Não foi possível conectar à API.', error);
  }

  const body = await readJson(response);

  if (!response.ok) {
    const apiError = errorResponseSchema.safeParse(body);
    if (apiError.success) {
      const { code, message, details } = apiError.data;
      throw new ApiError(response.status, code, message, details);
    }
    throw new ApiError(
      response.status,
      'UNEXPECTED_RESPONSE',
      `Resposta inesperada da API (HTTP ${response.status}).`,
      body,
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(
      response.status,
      'UNEXPECTED_RESPONSE',
      'A resposta da API não está no formato esperado.',
      parsed.error.issues,
    );
  }
  return parsed.data;
}
