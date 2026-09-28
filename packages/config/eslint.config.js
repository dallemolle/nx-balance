// @ts-check
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

/**
 * Configuração base de ESLint (flat config) para os pacotes e apps do
 * monorepo: regras recomendadas do typescript-eslint + desativação das
 * regras de estilo que conflitam com o Prettier.
 */
const baseConfig = tseslint.config(tseslint.configs.recommended, eslintConfigPrettier);

/**
 * Regra de fronteira para `packages/core`: o núcleo de domínio precisa
 * permanecer puro (sem I/O, sem dependências de outros pacotes do
 * monorepo e sem módulos do Node).
 */
const coreBoundaries = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@nx-balance/*', 'node:*'],
            message:
              'packages/core não pode depender de outros pacotes do monorepo nem de módulos do Node (prefixo node:).',
          },
        ],
        paths: ['fs', 'http', 'https', 'net', 'child_process'].map((name) => ({
          name,
          message: 'packages/core não pode depender de módulos do Node.',
        })),
      },
    ],
  },
};

module.exports = { baseConfig, coreBoundaries };
