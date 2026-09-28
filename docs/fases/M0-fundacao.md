# M0 — Fundação

- **Status:** 🟦 Em revisão
- **Depende de:** —
- **Plano detalhado:** [`docs/superpowers/plans/2026-09-27-m0-fundacao.md`](../superpowers/plans/2026-09-27-m0-fundacao.md)

## Objetivo
Deixar o monorepo pronto para desenvolver funcionalidades: `pnpm dev` sobe API, web e serviços locais; `pnpm test` roda; o CI bloqueia PR quebrado; dinheiro e datas já têm funções testadas.

## Requisitos cobertos
- [x] Monorepo pnpm + Turborepo com `apps/api`, `apps/web` e `packages/{core,contracts,config}` (ADR-0001)
- [x] `docker-compose.yml` com PostgreSQL 16, Mailpit e MinIO; `.env.example` documentado (RNF-18, ambiente dev)
- [x] API NestJS: `GET /v1/health`, configuração validada por Zod, logs Pino, filtro de erro no formato `{ code, message, details? }` (RNF-13)
- [x] Prisma configurado, primeira migration e script de seed (RNF-14)
- [x] Web React + Vite + Tailwind + shadcn/ui + TanStack Router/Query, com uma página que consulta o `/health`
- [x] `packages/core/money`: somar, subtrair, dividir em parcelas (diferença na primeira), percentual, conversão de/para string BR (ADR-0003, RNF-19)
- [x] `packages/core/dates`: "hoje" em `America/Sao_Paulo`, mês financeiro com `month_start_day`, ajuste de dia inexistente no mês (ADR-0003)
- [x] `packages/contracts` com o padrão de schema Zod + geração de OpenAPI em `/docs`
- [x] CI no GitHub Actions: instalar, lint, typecheck, testes e build, com cache do Turborepo

## Entregas
### Infraestrutura
- [x] `pnpm-workspace.yaml`, `turbo.json`, `packages/config` (tsconfig base `strict`, eslint, prettier, vitest)
- [x] Scripts na raiz: `dev`, `build`, `lint`, `typecheck`, `test`, `db:migrate`, `db:seed`, `db:reset`
- [x] Husky + lint-staged (formatar e lintar no commit) e commitlint (Conventional Commits)

### Backend
- [x] Bootstrap em modo `api` | `worker` (o worker ainda vazio, com pg-boss conectado)
- [x] `PrismaService`, módulo de config, `HealthController`
- [x] Banco de teste isolado para testes de integração (schema por execução ou Testcontainers)

### Frontend
- [x] Estrutura `app/`, `features/`, `components/ui`, `lib/`
- [x] Cliente HTTP tipado usando os schemas de `contracts`
- [x] Tema claro/escuro com tokens do Tailwind

### Testes
- [x] `core/money`: casos da especificação (R$ 100,00 em 3x = 33,34 + 33,33 + 33,33) e casos de borda (1 centavo em 3x, valores grandes)
- [x] `core/dates`: mês financeiro com início no dia 5, no dia 1 e no dia 28; fechamento no dia 31 em fevereiro

## Critério de pronto
- Clonar o repositório, `pnpm i`, `docker compose up -d` e `pnpm dev` sobem tudo sem passo manual extra (o README descreve os passos).
- O CI está verde na `main`, e a cobertura de `packages/core` fica acima de 95%.

## Notas
- Fixar a versão do Node em `.nvmrc` e `engines`, e a do pnpm em `packageManager`.
