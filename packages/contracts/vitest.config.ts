import { defineConfig, mergeConfig } from 'vitest/config';
import { baseTestConfig } from '@nx-balance/config/vitest.base.mts';

export default mergeConfig(defineConfig(baseTestConfig), defineConfig({}));
