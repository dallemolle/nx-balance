# M5 — Cartões de crédito e faturas

- **Status:** ⬜ Não iniciada
- **Depende de:** M4
- **Plano detalhado:** —

## Objetivo
O cartão funciona como no banco: a compra cai na fatura certa pelo dia de fechamento, o limite disponível bate com o real, e pagar a fatura tira o dinheiro da conta sem contar o gasto duas vezes.

## Requisitos cobertos
- [ ] RF-07.1 · Cadastrar, editar e arquivar cartões · P1
- [ ] RF-07.2 · Fatura pelo dia de fechamento (compra após o fechamento vai para a seguinte) · P1
- [ ] RF-07.3 · Tela da fatura: período, lançamentos, total, vencimento, status · P1
- [ ] RF-07.4 · Navegar entre faturas passadas e futuras · P1
- [ ] RF-07.5 · Limite disponível = limite − faturas abertas e fechadas não pagas − parcelas futuras · P1
- [ ] RF-07.6 · Pagar fatura a partir de uma conta · P1
- [ ] RF-07.7 · Pagamento parcial leva o saldo para a próxima fatura ("Saldo anterior") · P1
- [ ] RF-07.8 · Estorno e crédito na fatura · P1
- [ ] RF-07.9 · Mover lançamento para outra fatura · P2
- [ ] RF-07.10 · Cartões adicionais vinculados ao principal · P2
- [ ] RF-07.11 · Ajustar o total da fatura ao valor do banco · P2
- [ ] RF-07.12 · Juros e encargos em categoria própria · P2

## Entregas
### Backend
- [ ] Modelos `CreditCard` (fechamento, vencimento, limite, conta padrão, titular, principal) e `Invoice`
- [ ] `core/invoice`: dada uma data de compra e o cartão, calcular a fatura (período, fechamento, vencimento), com ajuste de dia inexistente
- [ ] Criação preguiçosa de faturas (criada quando o primeiro lançamento cai nela) e máquina de estados: Aberta → Fechada → Paga / Paga parcialmente / Vencida
- [ ] Job diário que fecha faturas e marca as vencidas
- [ ] Pagamento como movimentação conta → cartão, fora dos relatórios de consumo
- [ ] Parcelamento no cartão distribuindo as parcelas nas faturas seguintes (usa M4)

### Frontend
- [ ] Lista de cartões com fatura atual e limite disponível
- [ ] Tela da fatura com navegação entre meses, pagamento total ou parcial e estorno
- [ ] O formulário de lançamento aceita cartão no lugar da conta

### Testes
- [ ] `core`: compra no dia do fechamento, no dia seguinte, fechamento no dia 31 em fevereiro, compra parcelada em 10x
- [ ] Integração: pagamento parcial gera "Saldo anterior" correto na próxima fatura
- [ ] Integração: o relatório de consumo conta a compra, e o fluxo de caixa conta o pagamento, sem duplicar

## Critério de pronto
- Uma fatura real do mês, reproduzida no sistema, dá o mesmo total e o mesmo limite disponível que o app do banco.

## Notas
- Editar lançamento de fatura fechada exige confirmação (seção 4): ligar aqui o gancho deixado em M3.
