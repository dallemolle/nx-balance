/**
 * Dinheiro é representado sempre como um inteiro de centavos (`Cents`),
 * seguro até `Number.MAX_SAFE_INTEGER`. Nunca usar `float`/`toFixed` em
 * cálculo de dinheiro (ver global-constraints do projeto).
 */
export type Cents = number;

/**
 * Garante que `value` é um inteiro seguro e o devolve tipado como `Cents`.
 * Lança `RangeError` caso contrário (fração, `NaN`, `Infinity` ou fora do
 * intervalo de inteiro seguro).
 */
export function assertCents(value: number): Cents {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`Valor em centavos inválido (esperado inteiro seguro): ${value}`);
  }
  return value;
}

/** Soma dois valores em centavos, aceitando negativos (estornos). */
export function addCents(a: Cents, b: Cents): Cents {
  assertCents(a);
  assertCents(b);
  return assertCents(a + b);
}

/** Subtrai dois valores em centavos, aceitando negativos (estornos). */
export function subtractCents(a: Cents, b: Cents): Cents {
  assertCents(a);
  assertCents(b);
  return assertCents(a - b);
}

/**
 * Divide `totalCents` em `count` parcelas inteiras, colocando a sobra de
 * centavos na primeira parcela. Usa `BigInt` internamente para não perder
 * precisão em valores grandes.
 */
export function splitInstallments(totalCents: Cents, count: number): Cents[] {
  if (!Number.isSafeInteger(totalCents) || totalCents < 0) {
    throw new RangeError(`totalCents inválido para parcelamento: ${totalCents}`);
  }
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError(`count inválido para parcelamento: ${count}`);
  }

  const total = BigInt(totalCents);
  const installments = BigInt(count);
  const base = total / installments;
  const remainder = total % installments;

  const first = Number(base + remainder);
  const rest = Number(base);

  return Array.from({ length: count }, (_, index) => (index === 0 ? first : rest));
}

/**
 * Divisão inteira arredondada para baixo (`floor`), assumindo denominador
 * positivo. Usada por `percentOf` para arredondar "meio para cima" mesmo
 * quando o numerador é negativo (parte maior que o total em estornos).
 */
function floorDivPositiveDenominator(numerator: bigint, denominator: bigint): bigint {
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  return remainder < 0n ? quotient - 1n : quotient;
}

/**
 * Percentual inteiro de `partCents` em relação a `totalCents`, arredondado
 * com meio para cima (ties rounded towards +Infinity). `totalCents` deve
 * ser um inteiro seguro estritamente positivo.
 */
export function percentOf(partCents: Cents, totalCents: Cents): number {
  assertCents(partCents);
  if (!Number.isSafeInteger(totalCents) || totalCents <= 0) {
    throw new RangeError(`totalCents inválido para percentual: ${totalCents}`);
  }

  const part = BigInt(partCents);
  const total = BigInt(totalCents);
  // round-half-up(x) = floor(x + 0.5), aplicado a x = (part * 100) / total.
  const numerator = 200n * part + total;
  const denominator = 2n * total;

  return Number(floorDivPositiveDenominator(numerator, denominator));
}

/** Erro lançado por `parseBRL` quando o texto de entrada não é um valor monetário válido. */
export class InvalidMoneyError extends Error {
  readonly input: string;

  constructor(input: string) {
    super(`Valor monetário inválido: "${input}"`);
    this.name = 'InvalidMoneyError';
    this.input = input;
  }
}

// Sinal opcional, parte inteira (dígitos simples ou agrupados de 3 em 3 com
// ponto) e parte decimal opcional de 1 ou 2 dígitos (1 dígito vale dezenas
// de centavo, ex.: ",5" = 50 centavos).
const MONEY_PATTERN = /^(-)?(\d+|\d{1,3}(?:\.\d{3})+)(?:,(\d{1,2}))?$/;

/**
 * Converte um texto no formato brasileiro (`R$ 1.234,56`) para centavos.
 * Lança `InvalidMoneyError` para texto fora do formato esperado e
 * `RangeError` quando o valor numérico excede o inteiro seguro.
 */
export function parseBRL(input: string): Cents {
  const normalized = input.replace(/R\$/g, '').replace(/\s/g, '');
  const match = MONEY_PATTERN.exec(normalized);

  if (!match) {
    throw new InvalidMoneyError(input);
  }

  const [, negativeSign, integerPart, decimalPart] = match;
  // O grupo 2 é obrigatório no MONEY_PATTERN: se `match` existe, `integerPart`
  // sempre está presente (apenas o sinal e a parte decimal são opcionais).
  const integerDigits = integerPart!.replace(/\./g, '');
  const centsDigits = (decimalPart ?? '').padEnd(2, '0');

  let value = BigInt(integerDigits) * 100n + BigInt(centsDigits);
  if (negativeSign) {
    value = -value;
  }

  const max = BigInt(Number.MAX_SAFE_INTEGER);
  if (value > max || value < -max) {
    throw new RangeError(`Valor fora do limite de inteiro seguro: ${input}`);
  }

  return Number(value);
}

function withThousandsSeparator(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formata centavos como texto no padrão brasileiro (`R$ 1.234,56`), com
 * espaço comum após `R$` e negativo como `-R$ 0,05`. Construído
 * manualmente (sem `Intl`) para não depender de dados de ICU.
 */
export function formatBRL(cents: Cents): string {
  assertCents(cents);

  const value = BigInt(cents);
  const isNegative = value < 0n;
  const absolute = isNegative ? -value : value;

  const reais = absolute / 100n;
  const centavos = absolute % 100n;

  const reaisText = withThousandsSeparator(reais.toString());
  const centavosText = centavos.toString().padStart(2, '0');
  const sign = isNegative ? '-' : '';

  return `${sign}R$ ${reaisText},${centavosText}`;
}
