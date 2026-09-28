import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'es2023',
  // tsup injeta `baseUrl` internamente ao gerar as declarações (via
  // rollup-plugin-dts), o que o TypeScript 6 trata como erro de
  // depreciação (TS5101). Silenciamos apenas para este passo, sem afetar
  // o tsconfig.json usado por `tsc --noEmit`/editores.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  sourcemap: true,
  clean: true,
});
