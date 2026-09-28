import { defineConfig, mergeConfig } from 'vitest/config';
import { baseTestConfig } from '@nx-balance/config/vitest.base.mts';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  mergeConfig(viteConfig, defineConfig(baseTestConfig)),
  defineConfig({
    test: {
      include: ['src/**/*.test.tsx'],
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      restoreMocks: true,
      unstubGlobals: true,
    },
  }),
);
