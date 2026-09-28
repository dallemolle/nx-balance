// @ts-check
const { baseConfig } = require('@nx-balance/config/eslint.config.js');

module.exports = [
  {
    ignores: [
      'docs/**',
      '.claude/**',
      '.agents/**',
      '.superpowers/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/node_modules/**',
    ],
  },
  ...baseConfig,
];
