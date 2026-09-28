import { describe, expect, it } from 'vitest';
import {
  addCents,
  formatBRL,
  InvalidMoneyError,
  parseBRL,
  percentOf,
  splitInstallments,
  subtractCents,
} from '../index';

describe('splitInstallments', () => {
  it('coloca a diferença na primeira parcela', () => {
    expect(splitInstallments(10000, 3)).toEqual([3334, 3333, 3333]);
  });
  it('divide 1 centavo em 3x', () => {
    expect(splitInstallments(1, 3)).toEqual([1, 0, 0]);
  });
  it('divide valores grandes sem perder centavos', () => {
    const parts = splitInstallments(Number.MAX_SAFE_INTEGER, 7);
    expect(parts.reduce((a, b) => a + b, 0)).toBe(Number.MAX_SAFE_INTEGER);
  });
  it('1x devolve o total', () => expect(splitInstallments(999, 1)).toEqual([999]));
  it.each([
    [100, 0],
    [100, 1.5],
    [-100, 2],
  ])('rejeita total=%s count=%s', (t, c) => {
    expect(() => splitInstallments(t, c)).toThrow(RangeError);
  });
});

describe('addCents / subtractCents', () => {
  it('soma e subtrai inteiros', () => {
    expect(addCents(150, 250)).toBe(400);
    expect(subtractCents(100, 250)).toBe(-150);
  });
  it('rejeita resultado acima do inteiro seguro', () => {
    expect(() => addCents(Number.MAX_SAFE_INTEGER, 1)).toThrow(RangeError);
  });
  it('rejeita fração', () => expect(() => addCents(0.1, 0.2)).toThrow(RangeError));
});

describe('percentOf', () => {
  it('arredonda o exemplo do orçamento', () => expect(percentOf(98000, 120000)).toBe(82));
  it('passa de 100%', () => expect(percentOf(150, 100)).toBe(150));
  it('zero gasto', () => expect(percentOf(0, 100)).toBe(0));
  it('meio arredonda para cima', () => expect(percentOf(1, 200)).toBe(1));
  it('rejeita total zero', () => expect(() => percentOf(10, 0)).toThrow(RangeError));
  it('arredonda para cima com parte negativa (estorno maior que o total)', () =>
    expect(percentOf(-1000, 100)).toBe(-1000));
});

describe('parseBRL', () => {
  it.each([
    ['1.234,56', 123456],
    ['1234,56', 123456],
    ['R$ 10', 1000],
    [' 10,5 ', 1050],
    ['0,01', 1],
    ['1.000.000', 100000000],
    ['-12,30', -1230],
    ['R$ 1.234,56', 123456],
  ])('%s → %s', (input, cents) => expect(parseBRL(input)).toBe(cents));
  it.each(['', 'abc', '10.5', '10,555', '1,2,3', '1.23,00', 'R$'])('rejeita %j', (input) => {
    expect(() => parseBRL(input)).toThrow(InvalidMoneyError);
  });
  it('rejeita valor acima do inteiro seguro', () => {
    expect(() => parseBRL('999.999.999.999.999,99')).toThrow(RangeError);
  });
  it('InvalidMoneyError carrega o input original', () => {
    try {
      parseBRL('abc');
      throw new Error('deveria ter lançado');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidMoneyError);
      expect((error as InvalidMoneyError).name).toBe('InvalidMoneyError');
      expect((error as InvalidMoneyError).input).toBe('abc');
    }
  });
});

describe('formatBRL', () => {
  it.each([
    [123456, 'R$ 1.234,56'],
    [0, 'R$ 0,00'],
    [5, 'R$ 0,05'],
    [-5, '-R$ 0,05'],
    [100000000, 'R$ 1.000.000,00'],
  ])('%s → %s', (cents, text) => expect(formatBRL(cents)).toBe(text));
  it('ida e volta com parseBRL', () => expect(parseBRL(formatBRL(987654321))).toBe(987654321));
});
