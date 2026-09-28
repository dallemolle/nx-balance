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

## Primeira vez

Com o Docker Desktop aberto:

```bash
git clone <url-do-repo>
cd nx-balance
pnpm i
docker compose up -d
pnpm dev
```

- `docker compose up -d` sobe Postgres, Mailpit e MinIO em segundo plano (e cria o bucket do MinIO com um contêiner `minio-init`, que termina logo em seguida — é normal ele aparecer como `Exited (0)`).
- `pnpm dev` sobe a API, o worker e o web juntos. Antes de subir a API e o worker, ele cria `apps/api/.env` a partir do `.env.example` (se ainda não existir; um `.env` existente nunca é sobrescrito) e aplica as migrations pendentes (`prisma migrate deploy`). Não há outro passo manual.
- Abra http://localhost:5173. A página deve mostrar **API: ok · Banco: no ar**.

As configurações locais ficam em `apps/api/.env`. Edite à vontade depois de criado; ele não vai para o git.

## No dia a dia

```bash
docker compose up -d          # depois de reiniciar o PC ou o Docker
pnpm dev                      # Ctrl+C para parar
```

Ao trocar de branch ou puxar mudanças, rode `pnpm i` antes do `pnpm dev` se o `pnpm-lock.yaml` mudou. Migrations novas são aplicadas sozinhas pelo `pnpm dev`.

Para parar os serviços do Docker:

```bash
docker compose stop      # para os contêineres e mantém os dados
docker compose down      # remove os contêineres e mantém os dados (ficam no volume)
docker compose down -v   # remove também o volume: APAGA o banco local
```

Para zerar só o banco de desenvolvimento, sem mexer no Docker: `pnpm db:reset`.

## Serviços locais

| Serviço | Endereço | Acesso |
| --- | --- | --- |
| Web | http://localhost:5173 | — |
| API | http://localhost:3000 (health em `/v1/health`) | — |
| Documentação da API | http://localhost:3000/docs (JSON em `/docs-json`) | — |
| PostgreSQL | `localhost:5432`, banco `nxbalance` | usuário `nxbalance`, senha `nxbalance` |
| Mailpit (e-mails de dev) | http://localhost:8025 (SMTP em `localhost:1025`) | — |
| Console do MinIO (S3 de dev) | http://localhost:9001 (API S3 em `localhost:9000`, bucket `nx-balance-dev`) | usuário `nxbalance`, senha `nxbalance123` |

Todas as portas do Docker ficam presas a `127.0.0.1`, então não são acessíveis por outras máquinas da rede. As senhas acima são só para desenvolvimento.

> O MinIO local usa as imagens comunitárias `pgsty/minio` / `pgsty/mc`, porque as imagens oficiais `minio/minio` e `minio/mc` deixaram de ser publicadas no Docker Hub.

## Problemas comuns

**Porta 5432 ocupada** (outro Postgres ou outro projeto rodando). O `docker compose up` falha com `port is already allocated`. Pare o outro serviço ou use outra porta. Para usar outra porta de forma permanente, crie um arquivo `.env` na raiz do repositório (o Docker Compose lê esse arquivo sozinho; ele não vai para o git):

```
POSTGRES_PORT=5433
```

E ajuste a porta do `DATABASE_URL` em `apps/api/.env` (`…@localhost:5433/nxbalance`). Se o `apps/api/.env` ainda não existir, rode o primeiro `pnpm dev` com a variável definida (`$env:POSTGRES_PORT = '5433'` no PowerShell) que ele já é criado com a porta certa.

**`pnpm dev` falha logo no começo com erro de conexão.** O Postgres não está rodando ou ainda não está pronto. Rode `docker compose up -d`, confira com `docker compose ps` que `postgres` está `healthy` e tente de novo.

**`pnpm test` falha nos testes da API.** Os testes e2e sobem um Postgres próprio com Testcontainers, então o Docker Desktop precisa estar aberto. Eles não usam o banco do `docker compose`.

**`pnpm` não encontrado.** Rode `corepack enable` (veja os pré-requisitos).

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

## Fluxo de branches

Cada funcionalidade nasce numa branch própria (ex.: `feat/m0-fundacao`) e entra primeiro na `staging` por pull request. A `main` só recebe merges vindos da `staging`.

```
feat/* ──PR──▶ staging ──merge──▶ main
```

## CI

O workflow [`ci.yml`](.github/workflows/ci.yml) roda em todo pull request e em push na `staging` e na `main`: instala com `pnpm install --frozen-lockfile` e executa `pnpm turbo run lint typecheck test build`, com cache do Turborepo. O Docker já vem instalado no runner do GitHub Actions, então os testes e2e (Testcontainers) funcionam sem configuração extra.
