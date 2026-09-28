import { z } from 'zod';

/**
 * Variáveis de ambiente validadas na inicialização da API/worker.
 * A ordem das chaves é a ordem em que os erros aparecem na mensagem.
 */
export const envSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_MODE: z.enum(['api', 'worker']).default('api'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  APP_VERSION: z.string().min(1).default('0.0.0'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Valida `source` (padrão: `process.env`) e devolve o `Env` tipado.
 * Lança `Error` listando **todas** as variáveis inválidas de uma vez, no
 * formato `Configuração inválida: DATABASE_URL (Required), PORT (...)`.
 */
export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  const result = envSchema.safeParse(source);
  if (result.success) {
    return result.data;
  }

  const problems = new Map<string, string>();
  for (const issue of result.error.issues) {
    const key = issue.path.map(String).join('.');
    if (problems.has(key)) continue;
    problems.set(key, source[key] === undefined ? 'Required' : issue.message);
  }

  const list = [...problems].map(([key, message]) => `${key} (${message})`).join(', ');
  throw new Error(`Configuração inválida: ${list}`);
}
