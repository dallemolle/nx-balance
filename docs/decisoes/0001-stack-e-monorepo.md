# ADR-0001: Monorepo TypeScript com NestJS e React/Vite

- **Status:** Aceita
- **Data:** 2026-09-27

## Contexto
O MVP é web, mas o app nativo (fase 4) precisa usar a mesma API e as mesmas regras (princípio 5 da especificação; RNF-13). O projeto começa com uma equipe pequena, e trocar de linguagem entre as camadas custa caro.

## Decisão
- TypeScript em todas as camadas.
- API em **NestJS** e web em **React + Vite** (SPA/PWA).
- Um **monorepo pnpm + Turborepo** com `apps/api`, `apps/web` e, depois, `apps/mobile` (React Native).
- Pacotes compartilhados: `packages/core` (domínio puro), `packages/contracts` (schemas Zod) e `packages/config`.

## Consequências
- Os tipos e as validações são escritos uma vez e usados na API, no web e no app.
- O app nativo reaproveita `contracts`, `core` e o conhecimento de React.
- O monorepo exige disciplina de dependências: um app não importa de outro app, e o `core` não faz I/O.
- Next.js não foi escolhido porque o MVP não precisa de SSR. Se o site de vendas (fase 3) precisar de SEO, ele vira um app próprio no monorepo.
