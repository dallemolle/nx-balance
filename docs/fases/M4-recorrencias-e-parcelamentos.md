# M4 — Recorrências e parcelamentos

- **Status:** ⬜ Não iniciada
- **Depende de:** M3
- **Plano detalhado:** —

## Objetivo
Salário, aluguel e compras parceladas passam a gerar lançamentos futuros pendentes, que alimentam o saldo previsto e as contas a pagar.

## Requisitos cobertos
- [ ] RF-06.1 · Frequências: semanal, quinzenal, mensal, bimestral, trimestral, semestral, anual · P1
- [ ] RF-06.2 · Fim opcional (data final ou número de repetições) · P1
- [ ] RF-06.3 · Parcelamento por valor total ou por valor da parcela · P1
- [ ] RF-06.4 · Descrição com número da parcela ("Geladeira 3/10") · P1
- [ ] RF-06.5 · Editar: só este, este e os próximos, ou todos · P1
- [ ] RF-06.6 · Excluir com as mesmas três opções · P1
- [ ] RF-06.7 · Valor variável: prevê o último valor, ajusta ao pagar · P1
- [ ] RF-06.8 · Antecipar parcelas restantes · P2
- [ ] RF-06.9 · Tela "Minhas recorrências" com total comprometido por mês · P2

## Entregas
### Backend
- [ ] Modelo `RecurrenceSeries` (regra, frequência, fim, tipo recorrência/parcelamento, valor variável)
- [ ] `core/schedule`: gerar as datas da série, com ajuste de fim de mês (31 → último dia)
- [ ] `core/money`: divisão de parcelas com a diferença na primeira
- [ ] Job diário que mantém as recorrências sem fim geradas até 12 meses à frente (idempotente)
- [ ] Edição e exclusão em escopo (`THIS` | `THIS_AND_NEXT` | `ALL`) sem tocar ocorrências já efetivadas

### Frontend
- [ ] Opção "repetir" ou "parcelar" no formulário de lançamento
- [ ] Diálogo de escopo ao editar ou excluir um item de série
- [ ] Tela "Minhas recorrências"

### Testes
- [ ] `core`: R$ 100,00 em 3x; recorrência mensal no dia 31; quinzenal atravessando a virada do ano
- [ ] Integração: "este e os próximos" altera só as ocorrências futuras pendentes
- [ ] Integração: o job rodando duas vezes não duplica ocorrências

## Critério de pronto
- Uma recorrência mensal sem fim sempre tem 12 meses de ocorrências à frente, e o saldo previsto as inclui.

## Notas
- O parcelamento no cartão distribui as parcelas pelas faturas; isso é ligado em M5 usando o mesmo `core/schedule`.
