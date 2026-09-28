// @ts-check
import reactHooks from 'eslint-plugin-react-hooks';
import { baseConfig } from '@nx-balance/config/eslint.js';

export default [
  {
    ignores: ['dist/**', 'coverage/**'],
  },
  ...baseConfig,
  reactHooks.configs.flat.recommended,
];
