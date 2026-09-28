# Registro de decisões de arquitetura (ADRs)

Cada decisão que muda como o sistema é construído vira um arquivo curto e numerado. Uma decisão não é apagada: se mudar, ganha um ADR novo e a antiga passa para `Substituída por ADR-XXXX`.

| ADR | Decisão | Status |
| --- | --- | --- |
| [0001](0001-stack-e-monorepo.md) | Monorepo TypeScript: NestJS + React/Vite, com pnpm e Turborepo | Aceita |
| [0002](0002-isolamento-por-lar.md) | Isolamento de dados por Lar em toda consulta | Aceita |
| [0003](0003-dinheiro-e-datas.md) | Dinheiro em centavos inteiros; datas de competência sem hora | Aceita |
| [0004](0004-autenticacao-e-sessoes.md) | Autenticação própria com JWT curto + refresh token em sessão no banco | Aceita |
| [0005](0005-jobs-pg-boss.md) | Jobs e agendamentos com pg-boss sobre o PostgreSQL | Aceita |
| — | Hospedagem e deploy (decidir antes da etapa M10) | Pendente |

## Modelo

```markdown
# ADR-XXXX: <título>

- **Status:** Proposta | Aceita | Substituída por ADR-YYYY
- **Data:** AAAA-MM-DD

## Contexto
O problema e as restrições (cite RF/RNF da especificação).

## Decisão
O que foi decidido, em uma ou duas frases.

## Consequências
O que fica mais fácil, o que fica mais difícil e o que precisa ser vigiado.
```
