// Cria `apps/api/.env` a partir do `.env.example` quando ele ainda não existe,
// para o `pnpm dev` funcionar logo após o clone. Nunca sobrescreve um `.env`
// existente. Se `POSTGRES_PORT` estiver definido no ambiente (a mesma variável
// que o docker compose usa), a porta do `DATABASE_URL` gerado acompanha.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(apiDir, '.env');
const examplePath = join(apiDir, '.env.example');

if (existsSync(envPath)) process.exit(0);

copyFileSync(examplePath, envPath);

const port = process.env.POSTGRES_PORT;
if (port && /^\d+$/.test(port)) {
  const content = readFileSync(envPath, 'utf8').replace(
    /^(DATABASE_URL=postgresql:\/\/[^@\s]*@[^:/\s]+):\d+\//m,
    `$1:${port}/`,
  );
  writeFileSync(envPath, content);
}

console.log(
  `[ensure-env] apps/api/.env criado a partir do .env.example${port ? ` (Postgres na porta ${port})` : ''}.`,
);
