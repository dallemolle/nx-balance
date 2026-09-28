# ADR-0002: Isolamento de dados por Lar

- **Status:** Aceita
- **Data:** 2026-09-27

## Contexto
Todo dado financeiro pertence a um Lar (princípio 2). Um vazamento entre Lares é o pior defeito possível de um produto financeiro vendido (RNF-09). O Lar é o *tenant* do sistema.

## Decisão
1. Toda tabela de dado financeiro tem `household_id NOT NULL`, e seus índices começam por essa coluna.
2. A API resolve o Lar ativo a partir do token e confirma que o usuário é Member desse Lar. O resultado vai para um `HouseholdContext` por requisição. Nenhum endpoint aceita `householdId` livre no corpo ou na query para decidir o acesso.
3. Os repositories recebem o contexto e sempre filtram por `household_id`. Uma extensão do Prisma recusa consultas a modelos multi-tenant sem esse filtro.
4. Defesa em profundidade: *Row-Level Security* no PostgreSQL, avaliada na etapa M10 com teste de carga.
5. Todo endpoint novo ganha teste de integração provando que o usuário de outro Lar recebe `404`.

## Consequências
- Um esquecimento no código não vira vazamento, porque a extensão falha alto em desenvolvimento e nos testes.
- A troca de Lar ativo (RF-02.6, fase 2) já cabe no desenho: basta mudar o Lar no token.
- As consultas de relatório precisam respeitar o mesmo contexto; SQL cru só dentro do repository, sempre com `household_id`.
