# M7 — Dashboard e relatórios

- **Status:** ⬜ Não iniciada
- **Depende de:** M6
- **Plano detalhado:** —

## Objetivo
A tela inicial responde em 5 segundos quanto o Lar tem, quanto gastou no mês e o que vence em breve; os relatórios mostram para onde o dinheiro vai, e cada gráfico leva ao extrato filtrado.

## Requisitos cobertos
- [ ] RF-10.1 · Saldo consolidado atual e previsto para o fim do mês · P1
- [ ] RF-10.2 · Receitas × despesas do mês · P1
- [ ] RF-10.3 · Contas com saldo e cartões com fatura atual e limite · P1
- [ ] RF-10.4 · Próximas contas a pagar (7 dias) e vencidos · P1
- [ ] RF-10.5 · As 3 categorias mais próximas do limite · P1
- [ ] RF-10.6 · Despesas por categoria no mês (rosca) · P1
- [ ] RF-10.7 · Filtro "Lar inteiro" ou "só eu" · P2
- [ ] RF-10.8 · Ocultar valores (ícone de olho) · P2
- [ ] RF-10.10 · Despesas por categoria e subcategoria, com percentual · P1
- [ ] RF-10.11 · Evolução mensal de receitas, despesas e saldo (12 meses) · P1
- [ ] RF-10.12 · Fluxo de caixa por dia ou mês · P1
- [ ] RF-10.13 · Gastos por membro · P1
- [ ] RF-10.14 · Gastos por tag · P2
- [ ] RF-10.15 · Comparativo entre dois períodos · P2
- [ ] RF-10.16 · Evolução do patrimônio · P2
- [ ] RF-10.17 · Clicar no gráfico abre o extrato filtrado · P1

## Entregas
### Backend
- [ ] Módulo `reports` com consultas agregadas em SQL (via repository, sempre com `household_id`)
- [ ] Endpoint único do dashboard, que devolve todos os blocos em uma chamada
- [ ] Regra "consumo pela data da compra × caixa pelo pagamento" aplicada em cada relatório

### Frontend
- [ ] Dashboard responsivo com os blocos RF-10.1 a 10.6
- [ ] Tela de relatórios com seletor de período e os gráficos (Recharts), seguindo a skill `dataviz`
- [ ] Navegação de gráfico para extrato com os filtros aplicados na URL

### Testes
- [ ] Integração: os totais dos relatórios batem com a soma do extrato para o mesmo filtro
- [ ] Integração: a transferência não aparece como receita nem despesa

## Critério de pronto
- O dashboard carrega em até 2 segundos em 4G simulado (RNF-15) com um Lar de 12 meses de dados.
