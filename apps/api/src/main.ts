import 'reflect-metadata';
import { config as loadDotenv } from 'dotenv';
import { createApiApp } from './create-api-app';
import { loadEnv } from './infra/config/env';
import { startWorker } from './start-worker';

async function bootstrap(): Promise<void> {
  // Em desenvolvimento lê o .env local; em produção as variáveis já vêm do ambiente.
  loadDotenv({ quiet: true });
  const env = loadEnv();

  if (env.APP_MODE === 'worker') {
    await startWorker();
    return;
  }

  const app = await createApiApp();
  await app.listen(env.PORT);
}

void bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
