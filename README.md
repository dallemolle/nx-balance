# NX-Balance

Monorepo (pnpm + Turborepo) do NX-Balance: controle financeiro familiar. API em NestJS (HTTP + worker de filas), web em React/Vite, e um `core` de domínio (dinheiro e datas) sem dependências de framework.

Status do projeto e checklist de cada etapa: [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Pré-requisitos

- **Node 24** (versão travada em [`.nvmrc`](.nvmrc) e em `engines` do `package.json`).
- **Docker** rodando (sobe Postgres/Mailpit/MinIO em dev; os testes e2e da API usam Testcontainers, então também precisam do Docker).
- **pnpm via Corepack**, já embutido no Node:

  ```bash
  corepack enable
  ```

  No Windows sem permissão de administrador, se o comando acima falhar, use um diretório do seu perfil que já esteja no `PATH`:

  ```bash
  corepack enable --install-directory "%APPDATA%\npm"
  ```

## Subindo o ambiente

```bash
git clone <url-do-repo>
cd nx-balance
pnpm i
docker compose up -d
pnpm dev
```

`pnpm dev` sobe a API, o worker e o web juntos (via Turborepo). Não há passo manual além destes: antes de subir a API e o worker, o `dev` da API cria `apps/api/.env` a partir do `.env.example` (se ainda não existir; um `.env` existente nunca é sobrescrito) e aplica as migrations pendentes (`prisma migrate deploy`).

As configurações locais ficam em `apps/api/.env` — edite-o à vontade depois de criado.

**Porta do Postgres ocupada?** O compose expõe o Postgres em `${POSTGRES_PORT:-5432}`. Se a 5432 já estiver em uso, use outra porta nos dois comandos (no primeiro `pnpm dev` o `.env` já é criado apontando para ela):

```bash
POSTGRES_PORT=5433 docker compose up -d
POSTGRES_PORT=5433 pnpm dev
```

(No PowerShell: `$env:POSTGRES_PORT = '5433'` antes de `docker compose up -d` e `pnpm dev`.) Se o `apps/api/.env` já existir, ajuste nele a porta do `DATABASE_URL` (…@localhost:5433/nxbalance).

> O MinIO local usa as imagens comunitárias `pgsty/minio` / `pgsty/mc` — as imagens oficiais `minio/minio` e `minio/mc` deixaram de ser publicadas no Docker Hub.

## URLs em desenvolvimento

| Serviço                | URL                                                      |
| ----------------------- | --------------------------------------------------------- |
| Web                     | http://localhost:5173                                     |
| API                     | http://localhost:3000                                     |
| Documentação da API     | http://localhost:3000/docs (JSON em `/docs-json`)         |
| Mailpit (e-mails de dev)| http://localhost:8025                                     |
| Console do MinIO        | http://localhost:9001                                     |

## Scripts

Na raiz do monorepo (via Turborepo, atingem todos os pacotes/apps):

| Script | Descrição |
| --- | --- |
| `pnpm dev` | sobe web, API e worker em modo desenvolvimento |
| `pnpm build` | build de todos os pacotes e apps |
| `pnpm lint` | lint (ESLint) em todos os pacotes e apps |
| `pnpm typecheck` | checagem de tipos (`tsc --noEmit`) |
| `pnpm test` | testes de todos os pacotes e apps (o `test` da API precisa do Docker rodando: usa Testcontainers para os testes e2e) |
| `pnpm format` | formata o repositório com Prettier |
| `pnpm db:migrate` | cria uma nova migration a partir do `schema.prisma` e a aplica (`prisma migrate dev`); as migrations existentes já são aplicadas pelo `pnpm dev` |
| `pnpm db:seed` | popula o banco (`prisma db seed`) |
| `pnpm db:reset` | reseta o banco de desenvolvimento (`prisma migrate reset --force`) |

## Estrutura

- `apps/api` — NestJS (HTTP + worker pg-boss), Prisma, PostgreSQL.
- `apps/web` — React + Vite + Tailwind + shadcn/ui + TanStack Router/Query.
- `packages/core` — dinheiro e datas, domínio puro (sem I/O).
- `packages/contracts` — schemas Zod compartilhados entre API e web.
- `packages/config` — configuração compartilhada (TypeScript, ESLint, Prettier, Vitest).

## CI

O workflow [`ci.yml`](.github/workflows/ci.yml) roda em todo pull request e em push na `main`: instala com `pnpm install --frozen-lockfile` e executa `pnpm turbo run lint typecheck test build`, com cache do Turborepo. O Docker já vem instalado no runner do GitHub Actions, então os testes e2e (Testcontainers) funcionam sem configuração extra.
