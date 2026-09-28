/**
 * Datas de competência são sempre representadas como texto `AAAA-MM-DD`
 * (ISO 8601, sem hora/fuso). Nenhuma biblioteca de datas é usada: a
 * aritmética de dias é feita com `Date.UTC` (nunca o fuso local da
 * máquina), e a conversão de "agora" para data local usa `Intl`.
 */
export type IsoDate = string;

/** Fuso horário padrão do produto (ver global-constraints do projeto). */
export const DEFAULT_TIME_ZONE = 'America/Sao_Paulo';

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Valida que `value` está no formato `AAAA-MM-DD` e representa uma data
 * real (rejeita, por exemplo, `2026-02-30`).
 */
export function isIsoDate(value: string): boolean {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (month < 1 || month > 12) {
    return false;
  }

  return day >= 1 && day <= lastDayOfMonth(year, month);
}

function assertIsoDate(value: string): void {
  if (!isIsoDate(value)) {
    throw new RangeError(`Data inválida (esperado AAAA-MM-DD): ${value}`);
  }
}

function parseIsoDate(value: IsoDate): { year: number; month: number; day: number } {
  assertIsoDate(value);
  const [, yearText, monthText, dayText] = ISO_DATE_PATTERN.exec(value)!;
  return { year: Number(yearText), month: Number(monthText), day: Number(dayText) };
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatIsoDate(year: number, month: number, day: number): IsoDate {
  return `${String(year).padStart(4, '0')}-${pad2(month)}-${pad2(day)}`;
}

/**
 * Devolve a data local (`AAAA-MM-DD`) correspondente a `now` no fuso
 * `timeZone`. Padrões: `new Date()` e `DEFAULT_TIME_ZONE`.
 */
export function today(now: Date = new Date(), timeZone: string = DEFAULT_TIME_ZONE): IsoDate {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // `en-CA` formata como `AAAA-MM-DD`, que é exatamente o formato desejado.
  return formatter.format(now);
}

/** Último dia do mês `month` (1 a 12) de `year`, considerando anos bissextos. */
export function lastDayOfMonth(year: number, month: number): number {
  // Dia 0 do próximo mês (em UTC) é o último dia do mês atual.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Constrói uma `IsoDate` para `year`/`month`/`day`, "grudando" (clamping)
 * `day` no último dia do mês quando ele não existe (ex.: 31 de fevereiro
 * vira o último dia de fevereiro).
 */
export function dateWithClampedDay(year: number, month: number, day: number): IsoDate {
  const clampedDay = Math.min(day, lastDayOfMonth(year, month));
  return formatIsoDate(year, month, clampedDay);
}

/**
 * Mês financeiro (competência): período de um mês que pode começar em
 * qualquer dia entre 1 e 28. `key` é o `AAAA-MM` do mês civil em que o
 * período começa (ver convenção de nomenclatura em global-constraints).
 */
export interface FinancialMonth {
  key: string;
  start: IsoDate;
  end: IsoDate;
}

const MONTH_KEY_PATTERN = /^(\d{4})-(\d{2})$/;

function assertMonthStartDay(monthStartDay: number): void {
  if (!Number.isInteger(monthStartDay) || monthStartDay < 1 || monthStartDay > 28) {
    throw new RangeError(
      `monthStartDay inválido (esperado inteiro entre 1 e 28): ${monthStartDay}`,
    );
  }
}

/** Adiciona (ou subtrai) `count` meses civis a `year`/`month`, normalizando o ano. */
function addMonths(year: number, month: number, count: number): { year: number; month: number } {
  const zeroBasedMonth = month - 1 + count;
  const normalizedYear = year + Math.floor(zeroBasedMonth / 12);
  const normalizedMonth = ((zeroBasedMonth % 12) + 12) % 12;
  return { year: normalizedYear, month: normalizedMonth + 1 };
}

function financialMonthStartingAt(
  year: number,
  month: number,
  monthStartDay: number,
): FinancialMonth {
  const start = dateWithClampedDay(year, month, monthStartDay);
  const next = addMonths(year, month, 1);
  const endExclusive = dateWithClampedDay(next.year, next.month, monthStartDay);
  // `end` é o dia anterior a `endExclusive`, calculado em UTC para não
  // depender do fuso local da máquina.
  const endDate = parseIsoDate(endExclusive);
  const endUtc = new Date(Date.UTC(endDate.year, endDate.month - 1, endDate.day - 1));
  const end = formatIsoDate(endUtc.getUTCFullYear(), endUtc.getUTCMonth() + 1, endUtc.getUTCDate());
  const key = `${String(year).padStart(4, '0')}-${pad2(month)}`;
  return { key, start, end };
}

/**
 * Mês financeiro ao qual `date` pertence, dado que cada mês financeiro
 * começa no dia `monthStartDay` (1 a 28).
 */
export function financialMonthOf(date: IsoDate, monthStartDay: number): FinancialMonth {
  assertMonthStartDay(monthStartDay);
  const { year, month, day } = parseIsoDate(date);

  // Se o dia da data é anterior ao dia de início do mês financeiro do
  // próprio mês civil, a data pertence ao mês financeiro que começou no
  // mês civil anterior.
  const { year: candidateYear, month: candidateMonth } =
    day >= monthStartDay ? { year, month } : addMonths(year, month, -1);

  return financialMonthStartingAt(candidateYear, candidateMonth, monthStartDay);
}

/**
 * Mês financeiro identificado por `key` (`AAAA-MM`, o mês civil em que o
 * período começa), dado `monthStartDay` (1 a 28).
 */
export function financialMonthByKey(key: string, monthStartDay: number): FinancialMonth {
  assertMonthStartDay(monthStartDay);

  const match = MONTH_KEY_PATTERN.exec(key);
  if (!match) {
    throw new RangeError(`Chave de mês inválida (esperado AAAA-MM): ${key}`);
  }

  const [, yearText, monthText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  if (month < 1 || month > 12) {
    throw new RangeError(`Chave de mês inválida (esperado AAAA-MM): ${key}`);
  }

  return financialMonthStartingAt(year, month, monthStartDay);
}
