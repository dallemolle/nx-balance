import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { ENV } from '../config/config.module';
import type { Env } from '../config/env';

/** Documentação OpenAPI: UI em `/docs` e JSON em `/docs-json` (fora do prefixo `/v1`). */
export function setupOpenApi(app: INestApplication): void {
  const env = app.get<Env>(ENV);
  const config = new DocumentBuilder()
    .setTitle('NX-Balance API')
    .setDescription('API do NX-Balance.')
    .setVersion(env.APP_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, cleanupOpenApiDoc(document), { jsonDocumentUrl: 'docs-json' });
}
