import { defineConfig, mergeConfig } from 'vitest/config';
import { baseTestConfig } from '@nx-balance/config/vitest.base.ts';

export default mergeConfig(
  defineConfig(baseTestConfig),
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        thresholds: {
          lines: 95,
          branches: 95,
          functions: 95,
          statements: 95,
        },
      },
    },
  }),
);
