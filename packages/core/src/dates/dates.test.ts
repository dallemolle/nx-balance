import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TIME_ZONE,
  dateWithClampedDay,
  financialMonthByKey,
  financialMonthOf,
  isIsoDate,
  lastDayOfMonth,
  today,
} from '../index';

describe('DEFAULT_TIME_ZONE', () => {
  it('é America/Sao_Paulo', () => expect(DEFAULT_TIME_ZONE).toBe('America/Sao_Paulo'));
});

describe('isIsoDate', () => {
  it.each(['2026-09-28', '2000-01-01', '2028-02-29'])('aceita %s', (value) => {
    expect(isIsoDate(value)).toBe(true);
  });
  it.each([
    '2026-02-30',
    '2027-02-29',
    '2026-13-01',
    '2026-00-10',
    '2026-01-00',
    '2026-01-32',
    '26-01-01',
    '2026/01/01',
    '2026-1-1',
    'abc',
    '',
  ])('rejeita %j', (value) => {
    expect(isIsoDate(value)).toBe(false);
  });
});

describe('today', () => {
  it('usa o fuso de São Paulo perto da meia-noite UTC', () => {
    expect(today(new Date('2026-09-28T01:30:00Z'))).toBe('2026-09-27');
    expect(today(new Date('2026-09-28T03:00:00Z'))).toBe('2026-09-28');
  });
  it('aceita um timeZone explícito', () => {
    expect(today(new Date('2026-09-28T01:30:00Z'), 'UTC')).toBe('2026-09-28');
  });
  it('usa new Date() como padrão quando nenhum argumento é passado', () => {
    expect(isIsoDate(today())).toBe(true);
  });
});

describe('lastDayOfMonth', () => {
  it.each([
    [2026, 1, 31],
    [2026, 2, 28],
    [2028, 2, 29],
    [2026, 4, 30],
    [2026, 12, 31],
  ])('mês %s/%s tem %s dias', (year, month, expected) => {
    expect(lastDayOfMonth(year, month)).toBe(expected);
  });
});

describe('dateWithClampedDay', () => {
  it('fechamento no dia 31 em fevereiro', () => {
    expect(dateWithClampedDay(2026, 2, 31)).toBe('2026-02-28');
    expect(dateWithClampedDay(2028, 2, 31)).toBe('2028-02-29');
  });
  it('dia 31 em abril', () => expect(dateWithClampedDay(2026, 4, 31)).toBe('2026-04-30'));
  it('dia existente não muda', () => expect(dateWithClampedDay(2026, 1, 31)).toBe('2026-01-31'));
});

describe('financialMonthOf', () => {
  it('início no dia 1 é o mês civil', () => {
    expect(financialMonthOf('2026-02-15', 1)).toEqual({
      key: '2026-02',
      start: '2026-02-01',
      end: '2026-02-28',
    });
  });
  it('início no dia 5', () => {
    expect(financialMonthOf('2026-09-05', 5)).toEqual({
      key: '2026-09',
      start: '2026-09-05',
      end: '2026-10-04',
    });
    expect(financialMonthOf('2026-09-04', 5)).toEqual({
      key: '2026-08',
      start: '2026-08-05',
      end: '2026-09-04',
    });
  });
  it('virada de ano', () => {
    expect(financialMonthOf('2026-01-03', 5)).toEqual({
      key: '2025-12',
      start: '2025-12-05',
      end: '2026-01-04',
    });
  });
  it('início no dia 28 atravessa fevereiro', () => {
    expect(financialMonthOf('2026-03-01', 28)).toEqual({
      key: '2026-02',
      start: '2026-02-28',
      end: '2026-03-27',
    });
  });
  it.each([0, 29, 5.5])('rejeita monthStartDay=%s', (d) => {
    expect(() => financialMonthOf('2026-01-10', d)).toThrow(RangeError);
  });
  it('rejeita data inexistente', () =>
    expect(() => financialMonthOf('2026-02-30', 1)).toThrow(RangeError));
  it.each(['2026/01/10', '10-01-2026', 'abc', ''])('rejeita date fora do formato: %j', (d) => {
    expect(() => financialMonthOf(d, 1)).toThrow(RangeError);
  });
});

describe('financialMonthByKey', () => {
  it('dezembro com início no dia 10', () => {
    expect(financialMonthByKey('2026-12', 10)).toEqual({
      key: '2026-12',
      start: '2026-12-10',
      end: '2027-01-09',
    });
  });
  it.each(['2026-13', '26-01', 'x'])('rejeita key %j', (k) => {
    expect(() => financialMonthByKey(k, 1)).toThrow(RangeError);
  });
  it.each([0, 29, 5.5])('rejeita monthStartDay=%s', (d) => {
    expect(() => financialMonthByKey('2026-01', d)).toThrow(RangeError);
  });
  it('mês civil (dia 1) devolve início e fim do próprio mês', () => {
    expect(financialMonthByKey('2026-02', 1)).toEqual({
      key: '2026-02',
      start: '2026-02-01',
      end: '2026-02-28',
    });
  });
  it('início no dia 28 a partir da key de fevereiro', () => {
    expect(financialMonthByKey('2026-02', 28)).toEqual({
      key: '2026-02',
      start: '2026-02-28',
      end: '2026-03-27',
    });
  });
});

describe('financialMonthOf / financialMonthByKey são inversas para a mesma key', () => {
  it('a data de início de financialMonthByKey produz a mesma key em financialMonthOf', () => {
    const month = financialMonthByKey('2026-09', 5);
    expect(financialMonthOf(month.start, 5).key).toBe('2026-09');
    expect(financialMonthOf(month.end, 5).key).toBe('2026-09');
  });
});
