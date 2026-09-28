/**
 * Configuração base de testes (Vitest) compartilhada pelos pacotes e apps
 * do monorepo. Cada pacote importa `baseTestConfig` no seu próprio
 * `vitest.config.ts` e estende o que precisar.
 */
export const baseTestConfig = {
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
};
