import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ERROR_CODES, type ErrorCode, type ErrorResponse } from '@nx-balance/contracts';
import { ZodValidationException } from 'nestjs-zod';

const INTERNAL: ErrorResponse = {
  code: ERROR_CODES.INTERNAL_ERROR,
  message: 'Erro interno. Tente novamente.',
};

/** Code e mensagem padrão (em português) por status HTTP 4xx conhecido. */
const CLIENT_ERRORS: Partial<Record<number, { code: ErrorCode; message: string }>> = {
  [HttpStatus.BAD_REQUEST]: { code: ERROR_CODES.BAD_REQUEST, message: 'Requisição inválida.' },
  [HttpStatus.UNAUTHORIZED]: { code: ERROR_CODES.UNAUTHORIZED, message: 'Não autenticado.' },
  [HttpStatus.FORBIDDEN]: { code: ERROR_CODES.FORBIDDEN, message: 'Acesso negado.' },
  [HttpStatus.NOT_FOUND]: { code: ERROR_CODES.NOT_FOUND, message: 'Recurso não encontrado.' },
  [HttpStatus.CONFLICT]: { code: ERROR_CODES.CONFLICT, message: 'Conflito com o estado atual.' },
};

interface ValidationIssue {
  path: readonly PropertyKey[];
  message: string;
}

/** Lê as issues de um `ZodError` (v3 ou v4) sem depender da instância do Zod. */
function issuesOf(error: unknown): ValidationIssue[] {
  if (typeof error === 'object' && error !== null && 'issues' in error) {
    const { issues } = error as { issues: unknown };
    if (Array.isArray(issues)) return issues as ValidationIssue[];
  }
  return [];
}

/**
 * Converte qualquer exceção no formato único de erro da API
 * (`{ code, message, details? }`). Nunca expõe a mensagem de erros
 * inesperados nem de erros 5xx.
 */
export function toErrorResponse(exception: unknown): { status: number; body: ErrorResponse } {
  if (exception instanceof ZodValidationException) {
    const details = issuesOf(exception.getZodError()).map((issue) => ({
      path: issue.path.map(String).join('.'),
      message: issue.message,
    }));
    return {
      status: HttpStatus.BAD_REQUEST,
      body: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Dados inválidos.', details },
    };
  }

  if (exception instanceof HttpException) {
    const status = exception.getStatus();
    const known = CLIENT_ERRORS[status];
    if (known) return { status, body: { ...known } };
    if (status < 500) {
      // 4xx sem mapeamento próprio (ex.: 405, 413, 429): mantém o status.
      return {
        status,
        body: { code: ERROR_CODES.BAD_REQUEST, message: 'Requisição inválida.' },
      };
    }
    return { status, body: { ...INTERNAL } };
  }

  return { status: HttpStatus.INTERNAL_SERVER_ERROR, body: { ...INTERNAL } };
}

/**
 * Filtro global: toda resposta de erro sai no formato `ErrorResponse`.
 * Erros 5xx são registrados no log com a stack.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { status, body } = toErrorResponse(exception);

    if (status >= 500) {
      const stack = exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(exception instanceof Error ? exception.message : 'Erro não tratado', stack);
    }

    const { httpAdapter } = this.adapterHost;
    httpAdapter.reply(host.switchToHttp().getResponse(), body, status);
  }
}
