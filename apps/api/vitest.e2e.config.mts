import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// Testes e2e (`test/**/*.e2e-spec.ts`): o globalSetup sobe um PostgreSQL
// próprio via Testcontainers e aplica as migrations; o banco do
// `docker compose` nunca é tocado.
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['test/**/*.e2e-spec.ts'],
    globalSetup: ['test/setup/global-setup.ts'],
    // Subir o contêiner e rodar as migrations pode levar alguns segundos.
    hookTimeout: 120_000,
    testTimeout: 30_000,
    // Um único banco compartilhado: os arquivos e2e rodam em sequência.
    fileParallelism: false,
    // Logs do Pino só em nível fatal para a saída dos testes ficar limpa.
    env: { LOG_LEVEL: 'fatal' },
  },
});
