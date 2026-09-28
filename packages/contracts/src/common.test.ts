import { describe, expect, it } from 'vitest';
import { centsSchema, isoDateSchema } from './common';
import { healthResponseSchema } from './health';

describe('centsSchema', () => {
  it('centsSchema aceita inteiro e rejeita fração, negativo e acima do seguro', () => {
    expect(centsSchema.parse(123)).toBe(123);
    for (const v of [1.5, -1, Number.MAX_SAFE_INTEGER + 1]) {
      expect(centsSchema.safeParse(v).success).toBe(false);
    }
  });
});

describe('isoDateSchema', () => {
  it('isoDateSchema rejeita data inexistente com mensagem em português', () => {
    expect(isoDateSchema.parse('2026-02-28')).toBe('2026-02-28');
    const r = isoDateSchema.safeParse('2026-02-30');
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toBe('Data inválida (use AAAA-MM-DD)');
  });
});

describe('healthResponseSchema', () => {
  it('healthResponseSchema valida a resposta do /health', () => {
    expect(
      healthResponseSchema.safeParse({ status: 'ok', database: 'up', version: '0.0.0' }).success,
    ).toBe(true);
  });
});
