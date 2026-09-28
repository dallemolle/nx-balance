import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { toErrorResponse } from './all-exceptions.filter';

describe('toErrorResponse', () => {
  it('erro desconhecido vira 500 sem vazar detalhes', () => {
    expect(toErrorResponse(new Error('senha do banco'))).toEqual({
      status: 500,
      body: { code: 'INTERNAL_ERROR', message: 'Erro interno. Tente novamente.' },
    });
  });

  it('NotFoundException vira NOT_FOUND', () => {
    expect(toErrorResponse(new NotFoundException())).toEqual({
      status: 404,
      body: { code: 'NOT_FOUND', message: 'Recurso não encontrado.' },
    });
  });

  it('erro de validação Zod lista os campos', () => {
    const zodError = z.object({ amount: z.number() }).safeParse({ amount: 'x' }).error!;
    const { status, body } = toErrorResponse(new ZodValidationException(zodError));
    expect(status).toBe(400);
    expect(body.code).toBe('VALIDATION_ERROR');
    expect(body.message).toBe('Dados inválidos.');
    expect(body.details).toEqual([{ path: 'amount', message: expect.any(String) }]);
  });

  it('caminhos aninhados do Zod viram "a.b.0"', () => {
    const schema = z.object({ items: z.array(z.object({ amount: z.number() })) });
    const zodError = schema.safeParse({ items: [{ amount: 'x' }] }).error!;
    const { body } = toErrorResponse(new ZodValidationException(zodError));
    expect(body.details).toEqual([{ path: 'items.0.amount', message: expect.any(String) }]);
  });

  it.each([
    [new BadRequestException(), 400, 'BAD_REQUEST'],
    [new UnauthorizedException(), 401, 'UNAUTHORIZED'],
    [new ForbiddenException(), 403, 'FORBIDDEN'],
    [new ConflictException(), 409, 'CONFLICT'],
  ])('HttpException %# mantém o status e mapeia o code', (exception, status, code) => {
    const result = toErrorResponse(exception);
    expect(result.status).toBe(status);
    expect(result.body.code).toBe(code);
    expect(result.body.details).toBeUndefined();
  });

  it('HttpException 5xx vira INTERNAL_ERROR sem vazar a mensagem', () => {
    const result = toErrorResponse(new HttpException('segredo', HttpStatus.BAD_GATEWAY));
    expect(result).toEqual({
      status: 502,
      body: { code: 'INTERNAL_ERROR', message: 'Erro interno. Tente novamente.' },
    });
  });

  it('valores que não são Error também viram 500', () => {
    expect(toErrorResponse('boom').status).toBe(500);
  });
});
