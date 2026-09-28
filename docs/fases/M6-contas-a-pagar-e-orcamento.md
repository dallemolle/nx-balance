# M6 — Contas a pagar e orçamento

- **Status:** ⬜ Não iniciada
- **Depende de:** M5
- **Plano detalhado:** —

## Objetivo
O Lar vê o que vence e quanto ainda pode gastar em cada categoria no mês, respeitando o mês financeiro que começa no dia do salário.

## Requisitos cobertos
- [ ] RF-08.1 · Pendências agrupadas: vencidas, hoje, próximos 7 dias, restante do mês · P1
- [ ] RF-08.2 · Fatura aparece como uma única conta a pagar · P1
- [ ] RF-08.3 · Marcar como pago direto da lista · P1
- [ ] RF-08.4 · Destaque para vencidos · P1
- [ ] RF-08.5 · Totais a pagar e a receber no período · P1
- [ ] RF-08.6 · Linha digitável do boleto ou chave Pix com botão copiar · P2
- [ ] RF-09.1 · Limite mensal por categoria (e subcategoria) · P1
- [ ] RF-09.2 · Barra de progresso: gasto, limite, restante, percentual · P1
- [ ] RF-09.3 · Cores: verde até 79%, amarelo de 80% a 99%, vermelho a partir de 100% · P1
- [ ] RF-09.4 · Total orçado × total gasto · P1
- [ ] RF-09.5 · Copiar o mês anterior ou repetir automaticamente · P1
- [ ] RF-09.7 · Sugestão de limite pela média de 3 meses · P2
- [ ] RF-13.2 · Preferências: tema e primeiro dia do mês financeiro · P1

## Entregas
### Backend
- [ ] Módulo `payables`: consulta sobre lançamentos pendentes + faturas fechadas, sem tabela nova
- [ ] Modelos `Budget` e `BudgetLine`; cálculo do consumido (efetivados + pendentes + cartão pela data da compra)
- [ ] `core/budget`: percentual e faixa de cor; "restam R$ X para N dias"
- [ ] Preferência `month_start_day` no Lar, aplicada via `core/dates` em todas as consultas por mês

### Frontend
- [ ] Tela de contas a pagar e a receber com os grupos e o pagamento rápido
- [ ] Tela de orçamento com barras, total e cópia do mês anterior
- [ ] Preferências: tema claro/escuro/automático e início do mês financeiro

### Testes
- [ ] `core`: exemplo da especificação (R$ 980 de R$ 1.200 no dia 20 = 82%, amarelo, R$ 220 para 10 dias)
- [ ] `core`: mês financeiro de 5 a 4 aplicado ao orçamento
- [ ] Integração: a fatura fechada aparece uma vez com o total, e não item a item

## Critério de pronto
- Mudar o início do mês para o dia 5 muda, de forma coerente, o período do orçamento, das contas a pagar e do extrato.
