# M8 — Importação de extratos (OFX e CSV)

- **Status:** ⬜ Não iniciada
- **Depende de:** M3 (pode andar em paralelo a M4–M7)
- **Plano detalhado:** —

## Objetivo
Trazer o extrato do banco sem digitar: importar o arquivo, revisar, confirmar, sem duplicar o que já existe, e com a categoria sugerida pelo histórico.

## Requisitos cobertos
- [ ] RF-11.1 · Importar OFX de conta ou cartão · P1
- [ ] RF-11.2 · Importar CSV com mapeamento de colunas e modelo salvo por banco · P2
- [ ] RF-11.3 · Tela de revisão antes de gravar · P1
- [ ] RF-11.4 · Detecção de duplicados (FITID do OFX ou data + valor + descrição semelhante) · P1
- [ ] RF-11.5 · Conciliação com lançamento pendente existente · P2
- [ ] RF-11.6 · Categoria sugerida pelo histórico · P1
- [ ] RF-11.7 · Histórico de importações e desfazer uma importação inteira · P2

## Entregas
### Backend
- [ ] Modelos `ImportBatch` e `ImportRow` (linhas em rascunho até a confirmação)
- [ ] Parser OFX (SGML 1.x e XML 2.x, codificações Latin-1/UTF-8 dos bancos brasileiros)
- [ ] Parser CSV com mapeamento configurável e modelos `ImportTemplate` por banco
- [ ] Deduplicação e sugestão de categoria reaproveitando o autocompletar de M3
- [ ] Confirmação em transação única; desfazer remove só os lançamentos do lote

### Frontend
- [ ] Assistente: escolher arquivo e destino → (CSV) mapear colunas → revisar linhas → confirmar
- [ ] Tela de histórico de importações

### Testes
- [ ] Fixtures de OFX reais anonimizados de pelo menos 4 bancos (ex.: Itaú, Nubank, Banco do Brasil, Bradesco)
- [ ] Integração: importar o mesmo arquivo duas vezes não cria duplicados

## Critério de pronto
- O extrato de um mês real de cada banco da família entra sem ajuste manual de formato.
