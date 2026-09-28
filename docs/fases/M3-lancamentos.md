# M3 — Lançamentos

- **Status:** ⬜ Não iniciada
- **Depende de:** M2
- **Plano detalhado:** —

## Objetivo
Registrar uma despesa em até 3 toques e ver o extrato do mês filtrado, com totais corretos e histórico de quem mexeu em cada lançamento.

## Requisitos cobertos
- [ ] RF-04.1 · Criar, editar, duplicar e excluir · P1
- [ ] RF-04.2 · Botão de lançamento rápido sempre visível · P1
- [ ] RF-04.3 · Autocompletar pela descrição (categoria, conta, valor) · P1
- [ ] RF-04.4 · Marcar como pago/recebido com um clique · P1
- [ ] RF-04.5 · Extrato com filtros (período, conta, cartão, categoria, tag, membro, status, tipo, texto) · P1
- [ ] RF-04.6 · Navegação por mês · P1
- [ ] RF-04.7 · Totais do filtro · P1
- [ ] RF-04.8 · Ações em lote · P2
- [ ] RF-04.9 · Anexar comprovante (imagem/PDF até 5 MB) · P2
- [ ] RF-04.11 · Exportar extrato em CSV e Excel · P2
- [ ] RF-02.8 · Auditoria de criação, edição e exclusão · P2

## Entregas
### Backend
- [ ] Modelo `Transaction` completo (seção 4 da especificação), `TransactionTag`, `Attachment`, `AuditLog`
- [ ] Transferência como duas linhas com `transfer_group_id`; excluir uma exclui as duas
- [ ] Extrato paginado por cursor, com índices para os filtros (RNF-16)
- [ ] Endpoint de sugestões pela descrição (últimos usos no Lar)
- [ ] Upload de anexos para S3 com URL assinada
- [ ] Exportação CSV/XLSX do filtro atual

### Frontend
- [ ] Botão "+" flutuante e formulário rápido (tipo, valor, descrição, conta; o resto opcional)
- [ ] Tela de extrato com filtros, navegação por mês, totais e seleção múltipla
- [ ] Máscara de valor em R$ com teclado numérico no celular

### Testes
- [ ] `core`: totais do período ignoram transferências como receita/despesa
- [ ] Integração: o saldo da conta muda só com lançamentos efetivados até hoje
- [ ] Integração: o registro de auditoria guarda o antes e o depois de uma edição
- [ ] E2E: lançar uma despesa e vê-la no extrato e no saldo

## Critério de pronto
- Com 50 mil lançamentos de seed, a primeira página do extrato responde em menos de 300 ms na API local.

## Notas
- O aviso "fatura já fechada" (regra da seção 4) só é possível depois de M5; deixar o gancho no service.
