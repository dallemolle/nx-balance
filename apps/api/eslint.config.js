// @ts-check
// A API é CommonJS (sem `"type": "module"`), então a config usa `require`.
const { baseConfig } = require('@nx-balance/config/eslint.js');

module.exports = [
  {
    // `src/generated/**` é o Prisma Client gerado por `prisma generate`.
    ignores: ['dist/**', 'dist-worker/**', 'coverage/**', 'src/generated/**'],
  },
  ...baseConfig,
  {
    // Este próprio arquivo é CommonJS e precisa de `require`.
    files: ['eslint.config.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
];
