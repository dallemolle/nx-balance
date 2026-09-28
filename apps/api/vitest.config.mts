import swc from 'unplugin-swc';
import { defineConfig, mergeConfig } from 'vitest/config';
import { baseTestConfig } from '@nx-balance/config/vitest.base.mts';

// Testes unitários (`src/**/*.spec.ts`). O plugin SWC emite os metadados de
// decorators que o NestJS usa para injeção de dependência (o esbuild do Vite
// não emite `design:paramtypes`).
export default mergeConfig(
  defineConfig(baseTestConfig),
  defineConfig({
    plugins: [swc.vite({ module: { type: 'es6' } })],
    test: {
      exclude: ['node_modules/**', 'dist/**', 'src/generated/**'],
    },
  }),
);
