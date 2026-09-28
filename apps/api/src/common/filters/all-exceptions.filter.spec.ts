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
    ['BAD_REQUEST', new BadRequestException(), 400, 'Requisição inválida.'],
    ['UNAUTHORIZED', new UnauthorizedException(), 401, 'Não autenticado.'],
    ['FORBIDDEN', new ForbiddenException(), 403, 'Acesso negado.'],
    ['CONFLICT', new ConflictException(), 409, 'Conflito com o estado atual.'],
  ])(
    'HttpException padrão vira %s com status e mensagem padrão',
    (code, exception, status, message) => {
      expect(toErrorResponse(exception)).toEqual({ status, body: { code, message } });
    },
  );

  it('mensagem de domínio no formato ErrorResponse passa adiante com o status da exceção', () => {
    const exception = new ConflictException({
      code: 'CONFLICT',
      message: 'Categoria já existe.',
      details: { field: 'name' },
    });
    expect(toErrorResponse(exception)).toEqual({
      status: 409,
      body: { code: 'CONFLICT', message: 'Categoria já existe.', details: { field: 'name' } },
    });
  });

  it('mensagem de domínio sem details não ganha a chave details', () => {
    const exception = new NotFoundException({
      code: 'NOT_FOUND',
      message: 'Conta não encontrada.',
    });
    expect(toErrorResponse(exception)).toEqual({
      status: 404,
      body: { code: 'NOT_FOUND', message: 'Conta não encontrada.' },
    });
  });

  it('mensagem em string simples continua usando o padrão do status', () => {
    expect(toErrorResponse(new ConflictException('Categoria já existe.'))).toEqual({
      status: 409,
      body: { code: 'CONFLICT', message: 'Conflito com o estado atual.' },
    });
  });

  it('resposta 404 do roteador do Nest ("Cannot GET") usa a mensagem padrão', () => {
    expect(toErrorResponse(new NotFoundException('Cannot GET /v1/x')).body).toEqual({
      code: 'NOT_FOUND',
      message: 'Recurso não encontrado.',
    });
  });

  it('corpo com code fora de ERROR_CODES é ignorado', () => {
    const exception = new BadRequestException({ code: 'INVENTADO', message: 'x' });
    expect(toErrorResponse(exception).body).toEqual({
      code: 'BAD_REQUEST',
      message: 'Requisição inválida.',
    });
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
