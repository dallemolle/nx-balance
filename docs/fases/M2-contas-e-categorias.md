# M2 — Contas e categorias

- **Status:** ⬜ Não iniciada
- **Depende de:** M1
- **Plano detalhado:** —

## Objetivo
O Lar cadastra onde o dinheiro fica e como ele é classificado, e já sai com um conjunto padrão de categorias pronto para usar.

## Requisitos cobertos
- [ ] RF-03.1 · Conta com nome, tipo, instituição, saldo inicial, data do saldo inicial, cor e ícone · P1
- [ ] RF-03.2 · Tipos: corrente, poupança, carteira, digital, investimento (só saldo), outros · P1
- [ ] RF-03.3 · Dono da conta: compartilhada ou de um membro · P1
- [ ] RF-03.4 · Saldo atual por conta e consolidado do Lar · P1
- [ ] RF-03.5 · Saldo previsto até uma data · P1
- [ ] RF-03.6 · "Não somar no saldo total" · P1
- [ ] RF-03.7 · Ajuste de saldo gera lançamento de ajuste · P1
- [ ] RF-03.8 · Arquivar conta; excluir só sem lançamentos · P1
- [ ] RF-03.9 · Instituições brasileiras com logotipo · P2
- [ ] RF-03.10 · Ordenação manual das contas · P2
- [ ] RF-05.1 · Categorias de receita e despesa com nome, cor e ícone · P1
- [ ] RF-05.2 · Subcategorias em um nível · P1
- [ ] RF-05.3 · Conjunto padrão criado com o Lar · P1
- [ ] RF-05.4 · Criar, editar, arquivar e reordenar · P1
- [ ] RF-05.5 · Excluir categoria em uso exige escolher outra · P1
- [ ] RF-05.6 · Tags livres · P1
- [ ] RF-05.7 · Mesclar categorias ou tags · P2
- [ ] RF-02.7 · Contas privadas, visíveis só para o dono · P2

## Entregas
### Backend
- [ ] Modelos `Account`, `Institution` (seed), `Category`, `Tag`
- [ ] Serviço de saldo em `core` (saldo inicial + efetivados até hoje; previsto até uma data), já preparado para receber lançamentos em M3
- [ ] Seed de categorias padrão aplicado na criação do Lar (seção 5 da especificação)
- [ ] Filtro de visibilidade de contas privadas no repository

### Frontend
- [ ] Lista de contas com saldos, formulário, arquivar e ordenar (arrastar)
- [ ] Gestão de categorias (árvore de dois níveis) e de tags
- [ ] Seletor de instituição com logotipo

### Testes
- [ ] `core`: saldo atual e previsto com contas marcadas "não somar"
- [ ] Integração: a conta privada de um membro não aparece para outro membro
- [ ] Integração: excluir uma categoria em uso sem destino é recusado

## Critério de pronto
- O Lar recém-criado mostra as categorias padrão, e o saldo consolidado ignora as contas marcadas como "não somar".

## Notas
- O ajuste de saldo (RF-03.7) grava um lançamento, então a tabela de lançamentos nasce aqui em forma mínima e é completada em M3.
