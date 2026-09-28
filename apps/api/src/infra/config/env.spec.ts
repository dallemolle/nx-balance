import { describe, expect, it } from 'vitest';
import { loadEnv } from './env';

const valid = { DATABASE_URL: 'postgresql://u:p@localhost:5432/db' };

describe('loadEnv', () => {
  it('aplica padrões', () => {
    expect(loadEnv(valid)).toMatchObject({
      NODE_ENV: 'development',
      APP_MODE: 'api',
      PORT: 3000,
      LOG_LEVEL: 'info',
    });
  });

  it('aplica o padrão de APP_VERSION', () => {
    expect(loadEnv(valid).APP_VERSION).toBe('0.0.0');
  });

  it('converte PORT para número', () =>
    expect(loadEnv({ ...valid, PORT: '4000' }).PORT).toBe(4000));

  it('lista todas as variáveis inválidas de uma vez', () => {
    expect(() => loadEnv({ PORT: 'abc', APP_MODE: 'batch' })).toThrow(
      /DATABASE_URL.*PORT.*APP_MODE|DATABASE_URL.*APP_MODE.*PORT/,
    );
  });

  it('usa o prefixo "Configuração inválida:" na mensagem', () => {
    expect(() => loadEnv({})).toThrow(/^Configuração inválida: DATABASE_URL \(.+\)$/);
  });

  it('rejeita PORT fora do intervalo e LOG_LEVEL desconhecido', () => {
    expect(() => loadEnv({ ...valid, PORT: '70000', LOG_LEVEL: 'verbose' })).toThrow(
      /PORT.*LOG_LEVEL/,
    );
  });

  it('aceita todos os níveis de log do pino', () => {
    for (const level of ['fatal', 'error', 'warn', 'info', 'debug', 'trace']) {
      expect(loadEnv({ ...valid, LOG_LEVEL: level }).LOG_LEVEL).toBe(level);
    }
  });
});
