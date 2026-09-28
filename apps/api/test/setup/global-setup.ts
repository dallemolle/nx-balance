import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import type { TestProject } from 'vitest/node';

let container: StartedPostgreSqlContainer | undefined;

/**
 * globalSetup do Vitest e2e: sobe um PostgreSQL efêmero, aplica as
 * migrations com `prisma migrate deploy` e exporta o `DATABASE_URL` do
 * contêiner para os workers. O banco do `docker compose` nunca é usado.
 */
export default async function setup(project: TestProject): Promise<() => Promise<void>> {
  container = await new PostgreSqlContainer('postgres:16-alpine').start();
  const databaseUrl = container.getConnectionUri();

  const root = project.config.root;
  const prismaCli = join(root, 'node_modules', 'prisma', 'build', 'index.js');
  execFileSync(process.execPath, [prismaCli, 'migrate', 'deploy'], {
    cwd: root,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  });

  process.env['DATABASE_URL'] = databaseUrl;
  process.env['E2E_DATABASE_URL'] = databaseUrl;

  return async () => {
    await container?.stop();
    container = undefined;
  };
}
