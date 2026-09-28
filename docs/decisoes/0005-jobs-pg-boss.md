# ADR-0005: Jobs e agendamentos com pg-boss

- **Status:** Aceita
- **Data:** 2026-09-27

## Contexto
Várias tarefas rodam fora da requisição: envio de e-mails, renovação de recorrências até 12 meses à frente (seção 6), fechamento de faturas (RF-12.3), lembretes de vencimento (RF-12.1–12.2), resumo semanal (RF-12.7), exportação de dados (RF-13.4) e processamento de importações grandes (RF-11).

## Decisão
Usar **pg-boss**, uma fila que roda sobre o próprio PostgreSQL, com agendamento cron. O mesmo código da API sobe em modo `worker` para consumir a fila.

## Consequências
- Não há Redis para operar nem pagar no MVP.
- Um job pode ser enfileirado na mesma transação de banco que o originou, sem "e-mail enviado para cadastro que falhou".
- A vazão é menor que a do BullMQ/Redis, mas sobra para o volume do MVP. Se a fila virar gargalo, a troca fica isolada em `infra/jobs`.
- Todo job deve ser idempotente, porque pode rodar duas vezes.
