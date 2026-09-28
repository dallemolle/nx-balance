// @ts-check
// Este pacote é ESM (`"type": "module"` no package.json), então a config do
// ESLint usa `import`/`export` em vez de `require`/`module.exports`. O alvo
// `@nx-balance/config/eslint.js` continua sendo CommonJS (o pacote
// `@nx-balance/config` não declara `"type": "module"`); o Node faz a
// interoperabilidade automaticamente a partir dos `module.exports` nomeados.
import { baseConfig, coreBoundaries } from '@nx-balance/config/eslint.js';

export default [
  {
    ignores: ['dist/**', 'coverage/**'],
  },
  ...baseConfig,
  // A fronteira de pureza vale só para o domínio (`src/**`): os próprios
  // arquivos de configuração do pacote (este, `tsup.config.ts`,
  // `vitest.config.ts`) precisam importar `@nx-balance/config` normalmente.
  {
    files: ['src/**/*.ts'],
    ...coreBoundaries,
  },
];
