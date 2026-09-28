# ADR-0003: Dinheiro em centavos e datas de competência

- **Status:** Aceita
- **Data:** 2026-09-27

## Contexto
A especificação exige valores em centavos inteiros (regra da seção 4; RNF-14), divisão de parcelas com a diferença de centavos na primeira (seção 6), formatos brasileiros (RNF-07) e um "primeiro dia do mês financeiro" configurável (RF-13.2).

## Decisão
**Dinheiro**
- No banco, coluna `bigint` com sufixo `_cents` (ex.: `amount_cents`). No TypeScript, `number` inteiro, seguro até 2^53.
- `amount_cents` é sempre positivo; o `type` do lançamento define se entra ou sai.
- Toda aritmética (soma, divisão em parcelas, percentual de orçamento) fica em `packages/core/money`. É proibido usar `float` para dinheiro e `toFixed` para cálculo.
- O JSON da API trafega centavos inteiros. A formatação em `R$ 1.234,56` acontece só na interface.

**Datas**
- A data de competência é `date` (sem hora), trafegada como `AAAA-MM-DD`.
- Eventos (criação, pagamento, login) são `timestamptz`.
- O fuso padrão é `America/Sao_Paulo`, usado para decidir o que é "hoje".
- O mês financeiro é calculado por `packages/core/dates` a partir do `month_start_day` do Lar (1 a 28). Orçamento, dashboard e relatórios usam essa função.
- Dia de fechamento ou vencimento inexistente no mês (ex.: 31) usa o último dia do mês (seção 7).

## Consequências
- Não há erro de arredondamento, e os testes comparam inteiros exatos.
- O `bigint` do Prisma precisa de conversão no repository (`bigint` → `number`), com checagem de faixa.
- Todo código de data passa pelo `core`, o que evita `new Date()` espalhado com fuso errado.
