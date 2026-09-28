// Configuração do Prisma CLI (Prisma 7). Carrega `apps/api/.env` antes de
// tudo; em CI/testes o `DATABASE_URL` vem do ambiente do processo.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // `prisma generate` não precisa de banco: não usamos `env()` (que lança
    // quando a variável falta) para o `postinstall` funcionar sem `.env`.
    url: process.env['DATABASE_URL'],
  },
});
