// @ts-check
// Este pacote é ESM (`"type": "module"` no package.json), então a config do
// ESLint usa `import`/`export` em vez de `require`/`module.exports`. O alvo
// `@nx-balance/config/eslint.js` continua sendo CommonJS (o pacote
// `@nx-balance/config` não declara `"type": "module"`); o Node faz a
// interoperabilidade automaticamente a partir dos `module.exports` nomeados.
//
// `packages/contracts` não usa `coreBoundaries`: pode importar
// `@nx-balance/core` e `zod` normalmente (ver global-constraints do
// projeto: apps/* → contracts → core).
import { baseConfig } from '@nx-balance/config/eslint.js';

export default [
  {
    ignores: ['dist/**', 'coverage/**'],
  },
  ...baseConfig,
];
