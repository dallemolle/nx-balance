# NX-Balance — Especificação Funcional (Web)

> Cópia local da especificação. Fonte oficial (Claude Doc): https://claude.ai/code/artifact/d9db609a-c913-4884-a68d-a19137a24bcb
> Ao mudar requisitos, atualize a fonte e esta cópia juntas.

2026-09-27 · Leandro

## 1. Visão geral

O NX-Balance é um sistema web responsivo de controle financeiro pessoal e familiar, pensado desde o início para ser comercializado. A primeira versão (MVP) roda no navegador, no computador e no celular; o app nativo vem numa segunda etapa, usando a mesma base (API e banco de dados).

**Posicionamento:** os concorrentes analisados (Mobills, Minhas Economias, Organizze) tratam a família, no máximo, como uma etiqueta no lançamento. O NX-Balance trata a família como um **Lar compartilhado**: vários usuários com login próprio, contas compartilhadas e individuais, registro de quem pagou e visão consolidada da casa.

**Público-alvo:**

- Pessoas que hoje controlam as finanças em planilha ou caderno
- Casais e famílias que dividem despesas da casa
- Usuários insatisfeitos com apps que não tratam bem o uso a dois

**Princípios do produto:**

1. **Simples no dia a dia:** registrar uma despesa em até 3 toques ou cliques.
1. **Família desde o modelo de dados:** todo dado pertence a um Lar, nunca diretamente a um usuário solto.
1. **Brasil em primeiro lugar:** real (R$), cartão com fatura, parcelamento, Pix e boleto tratados como cidadãos de primeira classe.
1. **Privacidade e LGPD desde o início:** o produto será vendido, então a conformidade não pode ser remendada depois.
1. **Web primeiro, pronto para app:** toda regra de negócio fica na API, nunca só na tela, para o app nativo reaproveitar tudo.

**Convenções deste documento:** cada requisito funcional tem um código (RF-XX.n) para facilitar o detalhamento posterior. A prioridade usa três níveis: **P1** = obrigatório no MVP, **P2** = desejável no MVP, **P3** = fases seguintes.

## 2. Cadastro, acesso e Lar (família)

Todo usuário pertence a pelo menos um Lar. Todos os dados financeiros (contas, cartões, lançamentos, orçamentos) pertencem ao Lar. Ao se cadastrar, o usuário ganha automaticamente um Lar próprio e pode convidar outras pessoas.

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-01.1 | Cadastro com nome, e-mail e senha, com confirmação por e-mail | P1 |
| RF-01.2 | Login com e-mail e senha; opção "manter conectado" | P1 |
| RF-01.3 | Recuperação de senha por link enviado ao e-mail | P1 |
| RF-01.4 | Login social com Google | P2 |
| RF-01.5 | Autenticação em dois fatores (app autenticador) | P2 |
| RF-01.6 | Encerramento de sessão por inatividade (tempo configurável) | P2 |
| RF-02.1 | Criação automática de um Lar no primeiro acesso, com nome editável | P1 |
| RF-02.2 | Convite de membros por e-mail ou link, com validade de 7 dias | P1 |
| RF-02.3 | Papéis de acesso por membro (tabela abaixo) | P1 |
| RF-02.4 | Membros sem login (ex.: filho pequeno), só para identificar a quem pertence um gasto | P1 |
| RF-02.5 | Remover membro ou sair do Lar, preservando o histórico de lançamentos | P1 |
| RF-02.6 | Um usuário participar de mais de um Lar e alternar entre eles | P3 |
| RF-02.7 | Contas privadas: visíveis só para o dono, mesmo dentro do Lar | P2 |
| RF-02.8 | Registro de auditoria: quem criou, editou ou excluiu cada lançamento | P2 |

**Papéis de acesso:**

| Papel | O que pode fazer |
| --- | --- |
| Administrador | Tudo, inclusive convidar e remover membros, excluir o Lar e gerenciar a assinatura |
| Editor | Criar e editar contas, cartões, lançamentos e orçamentos |
| Leitor | Apenas consultar saldos, lançamentos e relatórios |

**Regras de negócio:**

- O Lar sempre tem pelo menos um Administrador; o último não pode sair sem transferir o papel.
- Um membro removido perde o acesso imediatamente, mas seus lançamentos continuam no histórico com o nome dele.
- Membro sem login pode ser convertido em usuário com login depois, mantendo o histórico.

## 3. Contas financeiras

Conta é qualquer lugar onde o dinheiro fica guardado. O saldo de cada conta é sempre calculado a partir do saldo inicial mais os lançamentos efetivados, nunca digitado à mão (exceto no ajuste de saldo).

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-03.1 | Cadastrar conta com nome, tipo, instituição, saldo inicial, data do saldo inicial, cor e ícone | P1 |
| RF-03.2 | Tipos: conta-corrente, poupança, carteira/dinheiro, conta digital, investimento (só saldo), outros | P1 |
| RF-03.3 | Definir dono da conta: compartilhada do Lar ou de um membro específico | P1 |
| RF-03.4 | Saldo atual por conta e saldo consolidado do Lar | P1 |
| RF-03.5 | Saldo previsto: saldo atual + lançamentos pendentes até uma data | P1 |
| RF-03.6 | Opção "não somar no saldo total" (ex.: conta de reserva ou de terceiros) | P1 |
| RF-03.7 | Ajuste de saldo: informar o saldo real e o sistema cria um lançamento de ajuste pela diferença | P1 |
| RF-03.8 | Arquivar conta (some das telas, mantém histórico); excluir só se não houver lançamentos | P1 |
| RF-03.9 | Lista de instituições brasileiras com logotipo para escolha rápida | P2 |
| RF-03.10 | Ordenar contas manualmente na tela inicial | P2 |

**Regras de negócio:**

- Saldo atual considera só lançamentos com status **efetivado** e data até hoje.
- Cartão de crédito não é conta: tem cadastro próprio (seção 7), mas o pagamento da fatura sai de uma conta.

## 4. Lançamentos

Lançamento é qualquer movimentação de dinheiro. Existem três tipos: **receita**, **despesa** e **transferência** entre contas do Lar. Transferência nunca conta como receita nem despesa nos relatórios.

**Campos de um lançamento:**

| Campo | Obrigatório | Observação |
| --- | --- | --- |
| Tipo | Sim | Receita, despesa ou transferência |
| Valor | Sim | Sempre positivo; o tipo define se entra ou sai |
| Data | Sim | Data de competência (quando aconteceu) |
| Descrição | Sim | Texto livre, com sugestão automática pelo histórico |
| Conta ou cartão | Sim | Transferência exige conta de origem e de destino |
| Categoria / subcategoria | Sim (exceto transferência) | Ver seção 5 |
| Status | Sim | Efetivado (pago/recebido) ou pendente |
| Membro | Não | Quem fez o gasto ou a quem pertence |
| Forma de pagamento | Não | Pix, débito, boleto, dinheiro, crédito, TED, outros |
| Tags | Não | Várias por lançamento |
| Observação | Não | Texto longo |
| Anexo | Não | Foto ou PDF do comprovante (P2) |

**Requisitos:**

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-04.1 | Criar, editar, duplicar e excluir lançamentos | P1 |
| RF-04.2 | Botão de lançamento rápido sempre visível (no celular, botão flutuante) | P1 |
| RF-04.3 | Autocompletar: ao digitar a descrição, sugerir categoria, conta e valor usados da última vez | P1 |
| RF-04.4 | Marcar como pago/recebido com um clique, ajustando data e valor real | P1 |
| RF-04.5 | Extrato com filtros por período, conta, cartão, categoria, tag, membro, status, tipo e texto | P1 |
| RF-04.6 | Navegação por mês (mês anterior / próximo) no extrato | P1 |
| RF-04.7 | Totais do filtro: receitas, despesas e saldo do período | P1 |
| RF-04.8 | Seleção múltipla para editar categoria, marcar como pago ou excluir em lote | P2 |
| RF-04.9 | Anexar comprovante (imagem ou PDF, até 5 MB) | P2 |
| RF-04.10 | Dividir um lançamento em várias categorias (ex.: compra de supermercado com itens de limpeza) | P3 |
| RF-04.11 | Exportar extrato filtrado em CSV e Excel | P2 |

**Regras de negócio:**

- Excluir uma transferência exclui os dois lados (saída e entrada).
- Editar lançamento de fatura já fechada exige confirmação, pois altera o total da fatura.
- Valores monetários são guardados em centavos (inteiros) para evitar erros de arredondamento.

## 5. Categorias, subcategorias e tags

Categorias respondem "com o quê gastei"; tags respondem "em que contexto" (ex.: viagem, obra, trabalho). Cada Lar recebe um conjunto padrão de categorias que pode ser totalmente personalizado.

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-05.1 | Categorias separadas para receita e despesa, com nome, cor e ícone | P1 |
| RF-05.2 | Subcategorias em um nível (ex.: Moradia > Aluguel) | P1 |
| RF-05.3 | Conjunto padrão criado com o Lar (lista abaixo) | P1 |
| RF-05.4 | Criar, editar, arquivar e reordenar categorias | P1 |
| RF-05.5 | Excluir categoria com lançamentos exige escolher outra para recebê-los | P1 |
| RF-05.6 | Tags livres, com várias por lançamento e filtro por tag | P1 |
| RF-05.7 | Mesclar duas categorias ou duas tags | P2 |
| RF-05.8 | Regras automáticas: "se a descrição contém X, usar categoria Y" | P3 |

**Categorias padrão sugeridas:**

- **Despesas:** Moradia, Alimentação, Transporte, Saúde, Educação, Lazer, Compras, Serviços e assinaturas, Impostos e taxas, Pets, Filhos, Presentes e doações, Outros
- **Receitas:** Salário, Renda extra, Rendimentos, Reembolsos, Presentes, Outros

Cada categoria padrão vem com 3 a 6 subcategorias comuns (ex.: Alimentação > Supermercado, Restaurante, Delivery, Padaria).

## 6. Recorrências e parcelamentos

Recorrência é um lançamento que se repete sem data para acabar (salário, aluguel, streaming). Parcelamento é um valor dividido em um número fixo de parcelas (compra em 10x). Os dois geram lançamentos futuros com status **pendente**, que alimentam o saldo previsto e as contas a pagar.

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-06.1 | Recorrência com frequência: semanal, quinzenal, mensal, bimestral, trimestral, semestral, anual | P1 |
| RF-06.2 | Recorrência com fim opcional (data final ou número de repetições) | P1 |
| RF-06.3 | Parcelamento informando valor total ou valor da parcela, com número de parcelas | P1 |
| RF-06.4 | Descrição automática com o número da parcela (ex.: "Geladeira 3/10") | P1 |
| RF-06.5 | Ao editar um item da série, perguntar: só este, este e os próximos, ou todos | P1 |
| RF-06.6 | Ao excluir, mesmas três opções | P1 |
| RF-06.7 | Valor variável na recorrência (ex.: conta de luz): prevê o último valor e permite ajustar ao pagar | P1 |
| RF-06.8 | Antecipar parcelas restantes, quitando a série | P2 |
| RF-06.9 | Tela "Minhas recorrências" com o total comprometido por mês | P2 |

**Regras de negócio:**

- Recorrências sem fim geram lançamentos pendentes até 12 meses à frente, renovados automaticamente.
- Na divisão de parcelas, a diferença de centavos vai para a primeira parcela (ex.: R$ 100,00 em 3x = 33,34 + 33,33 + 33,33).
- Parcelamento no cartão de crédito distribui cada parcela na fatura do mês correspondente (seção 7).

## 7. Cartões de crédito e faturas

O gasto no cartão entra como despesa na data da compra (para os relatórios de consumo), mas só sai da conta quando a fatura é paga. A fatura é uma entidade própria, com período, total e status.

**Cadastro do cartão:** nome, bandeira, limite total, dia de fechamento, dia de vencimento, conta padrão de pagamento, titular (membro) e cor. Cartões adicionais podem ser vinculados a um cartão principal, compartilhando limite e fatura.

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-07.1 | Cadastrar, editar e arquivar cartões | P1 |
| RF-07.2 | Fatura calculada automaticamente pelo dia de fechamento: compra após o fechamento vai para a fatura seguinte | P1 |
| RF-07.3 | Tela da fatura: período, lançamentos, total, data de vencimento e status | P1 |
| RF-07.4 | Navegar entre faturas (anteriores e futuras, incluindo parcelas já previstas) | P1 |
| RF-07.5 | Limite disponível = limite total − faturas abertas e fechadas não pagas − parcelas futuras | P1 |
| RF-07.6 | Pagar fatura: escolher conta e valor; gera uma saída na conta | P1 |
| RF-07.7 | Pagamento parcial: o saldo restante é levado para a próxima fatura como lançamento "Saldo anterior" | P1 |
| RF-07.8 | Estorno e crédito na fatura (lançamento negativo que reduz o total) | P1 |
| RF-07.9 | Mover um lançamento para outra fatura manualmente | P2 |
| RF-07.10 | Cartões adicionais vinculados ao principal | P2 |
| RF-07.11 | Ajustar o total da fatura para bater com o valor do banco (gera lançamento de ajuste) | P2 |
| RF-07.12 | Juros e encargos lançados manualmente em categoria própria | P2 |

**Status da fatura:**

| Status | Quando |
| --- | --- |
| Aberta | Antes da data de fechamento; ainda recebe compras |
| Fechada | Após o fechamento e antes do pagamento |
| Paga | Valor total pago |
| Paga parcialmente | Pago valor menor que o total |
| Vencida | Passou do vencimento sem pagamento total |

**Regras de negócio:**

- Se o fechamento ou o vencimento cair em dia que não existe no mês (ex.: dia 31), usa-se o último dia do mês.
- Nos relatórios de consumo, conta a data da compra; no fluxo de caixa, conta o pagamento da fatura. Isso evita contar o mesmo gasto duas vezes.
- Uma fatura só pode ser excluída se não tiver lançamentos nem pagamentos.

## 8. Contas a pagar e a receber

Contas a pagar e a receber são uma visão dos lançamentos com status **pendente**, não um cadastro separado. Isso inclui recorrências, parcelas e faturas de cartão fechadas.

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-08.1 | Tela com pendências agrupadas em: vencidas, vencem hoje, próximos 7 dias, restante do mês | P1 |
| RF-08.2 | Faturas de cartão aparecem como uma única conta a pagar, com o total da fatura | P1 |
| RF-08.3 | Marcar como pago/recebido direto da lista, confirmando data, valor e conta | P1 |
| RF-08.4 | Destaque visual para itens vencidos | P1 |
| RF-08.5 | Totais: a pagar e a receber no período | P1 |
| RF-08.6 | Campo para linha digitável do boleto ou chave Pix, com botão copiar | P2 |
| RF-08.7 | Lembrete por e-mail e notificação no navegador X dias antes do vencimento (seção 12) | P2 |

## 9. Orçamento mensal

O orçamento define um teto de gasto por categoria para cada mês e mostra quanto já foi consumido. Conta tudo que é despesa na categoria, efetivada ou pendente, inclusive compras no cartão pela data da compra.

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-09.1 | Definir limite mensal por categoria (e opcionalmente por subcategoria) | P1 |
| RF-09.2 | Barra de progresso por categoria: gasto, limite, restante e percentual | P1 |
| RF-09.3 | Cores por faixa: verde até 79%, amarelo de 80% a 99%, vermelho a partir de 100% | P1 |
| RF-09.4 | Total orçado × total gasto no mês | P1 |
| RF-09.5 | Copiar o orçamento do mês anterior ou repetir automaticamente todo mês | P1 |
| RF-09.6 | Alerta ao atingir 80% e 100% do limite (seção 12) | P1 |
| RF-09.7 | Sugestão de limite pela média dos últimos 3 meses | P2 |
| RF-09.8 | Orçamento por membro (ex.: mesada de cada filho) | P3 |
| RF-09.9 | Sobra do mês acumulada para o mês seguinte, se o usuário quiser | P3 |

**Exemplo:** limite de R$ 1.200 em Alimentação. Com R$ 980 gastos no dia 20, a barra fica amarela (82%) e o sistema avisa que restam R$ 220 para 10 dias.

## 10. Dashboard e relatórios

A tela inicial responde em 5 segundos a três perguntas: quanto tenho, quanto gastei no mês e o que vence em breve. Os relatórios aprofundam para onde o dinheiro está indo.

**Dashboard (tela inicial):**

| Código | Bloco | Prioridade |
| --- | --- | --- |
| RF-10.1 | Saldo consolidado atual e saldo previsto para o fim do mês | P1 |
| RF-10.2 | Receitas × despesas do mês corrente | P1 |
| RF-10.3 | Lista de contas com saldo e cartões com fatura atual e limite disponível | P1 |
| RF-10.4 | Próximas contas a pagar (7 dias) e itens vencidos | P1 |
| RF-10.5 | Orçamento: as 3 categorias mais próximas do limite | P1 |
| RF-10.6 | Gráfico de despesas por categoria no mês (rosca) | P1 |
| RF-10.7 | Filtro "Lar inteiro" ou "só eu" | P2 |
| RF-10.8 | Ocultar valores (ícone de olho) para usar em público | P2 |
| RF-10.9 | Escolher e reordenar os blocos exibidos | P3 |

**Relatórios:**

| Código | Relatório | Prioridade |
| --- | --- | --- |
| RF-10.10 | Despesas por categoria e subcategoria no período, com percentual | P1 |
| RF-10.11 | Evolução mensal de receitas, despesas e saldo (últimos 12 meses) | P1 |
| RF-10.12 | Fluxo de caixa: entradas e saídas efetivas por dia ou mês | P1 |
| RF-10.13 | Gastos por membro do Lar | P1 |
| RF-10.14 | Gastos por tag | P2 |
| RF-10.15 | Comparativo entre dois períodos (ex.: este mês × mês passado) | P2 |
| RF-10.16 | Evolução do patrimônio (soma dos saldos ao fim de cada mês) | P2 |
| RF-10.17 | Clicar em qualquer fatia ou barra abre o extrato filtrado | P1 |
| RF-10.18 | Exportar relatório em PDF | P3 |

## 11. Importação de extratos (OFX e CSV)

No MVP, a automação vem da importação de arquivos que todo banco brasileiro permite baixar. É a alternativa sem custo ao Open Finance, que fica para a fase de automação.

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-11.1 | Importar arquivo OFX de conta ou cartão, escolhendo a conta/cartão de destino | P1 |
| RF-11.2 | Importar CSV com tela de mapeamento de colunas (data, descrição, valor) e modelo salvo por banco | P2 |
| RF-11.3 | Tela de revisão antes de gravar: editar categoria, ignorar linhas, confirmar | P1 |
| RF-11.4 | Detecção de duplicados: pelo identificador do OFX ou por mesma data, valor e descrição semelhante | P1 |
| RF-11.5 | Conciliação: vincular linha importada a um lançamento pendente já existente (ex.: aluguel previsto), marcando-o como pago | P2 |
| RF-11.6 | Categorização sugerida pelo histórico (mesma descrição usada antes) | P1 |
| RF-11.7 | Histórico de importações, com opção de desfazer uma importação inteira | P2 |
| RF-11.8 | Importar planilha de outro app (modelo NX-Balance em Excel para migração) | P3 |

## 12. Notificações e alertas

Na versão web, os alertas chegam por três canais: central de notificações dentro do sistema (sino), e-mail e notificação do navegador. O push no celular chega com o app nativo.

| Código | Alerta | Canais | Prioridade |
| --- | --- | --- | --- |
| RF-12.1 | Conta a pagar vence em X dias (padrão: 2) | Sino, e-mail | P1 |
| RF-12.2 | Conta vencida e não paga | Sino, e-mail | P1 |
| RF-12.3 | Fatura do cartão fechou, com o total | Sino | P1 |
| RF-12.4 | Categoria atingiu 80% e 100% do orçamento | Sino, e-mail | P1 |
| RF-12.5 | Saldo previsto de alguma conta fica negativo no mês | Sino, e-mail | P2 |
| RF-12.6 | Convite para o Lar recebido ou aceito | E-mail | P1 |
| RF-12.7 | Resumo semanal: gastos da semana e o que vence na próxima | E-mail | P2 |
| RF-12.8 | Notificação do navegador (Web Push) para todos os alertas acima | Navegador | P2 |

**Regras:** cada usuário escolhe, por tipo de alerta, quais canais quer receber. Alertas do Lar (orçamento, vencimentos) vão para todos os membros Administrador e Editor, a menos que desativem.

## 13. Configurações, privacidade e LGPD

Como o NX-Balance lida com dados financeiros e será vendido, os direitos previstos na LGPD precisam estar disponíveis como funções do sistema, e não só como texto na política de privacidade.

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF-13.1 | Perfil: nome, e-mail, foto, troca de senha | P1 |
| RF-13.2 | Preferências: tema claro/escuro/automático, primeiro dia do mês financeiro, tela inicial | P1 |
| RF-13.3 | Aceite de Termos de Uso e Política de Privacidade no cadastro, com registro de data e versão | P1 |
| RF-13.4 | Exportar todos os dados do Lar (portabilidade) em arquivo compactado com CSVs | P1 |
| RF-13.5 | Excluir a própria conta; se for o único Administrador, escolher entre excluir o Lar ou transferir | P1 |
| RF-13.6 | Lista de sessões ativas com opção de encerrar as outras | P2 |
| RF-13.7 | Consentimento de cookies e de comunicações de marketing, separados | P1 |
| RF-13.8 | Canal de contato para o titular dos dados (e-mail do encarregado/DPO) | P1 |
| RF-13.9 | Backup automático diário, com retenção de 30 dias | P1 |

**Primeiro dia do mês financeiro (RF-13.2):** permite que quem recebe salário no dia 5, por exemplo, veja o "mês" de 5 a 4 em vez de 1 a 30. Afeta orçamento, dashboard e relatórios.

## 14. Requisitos não funcionais

Estes requisitos valem para o sistema inteiro e condicionam as escolhas de tecnologia.

**Responsividade e usabilidade**

| Código | Requisito |
| --- | --- |
| RNF-01 | Layout funcional de 360 px (celular) a 1920 px (monitor), sem rolagem horizontal |
| RNF-02 | No celular: menu inferior com Início, Extrato, botão "+" central, Orçamento e Mais |
| RNF-03 | No computador: menu lateral fixo e tabelas com mais colunas |
| RNF-04 | Instalável como PWA (ícone na tela inicial do celular), antecipando parte da experiência de app |
| RNF-05 | Navegadores: Chrome, Edge, Safari e Firefox nas duas últimas versões |
| RNF-06 | Acessibilidade: contraste adequado, navegação por teclado, textos alternativos (meta WCAG 2.1 AA) |
| RNF-07 | Formatos brasileiros: R$ 1.234,56, datas dd/mm/aaaa, fuso America/Sao_Paulo por padrão |

**Segurança**

| Código | Requisito |
| --- | --- |
| RNF-08 | Todo tráfego por HTTPS; senhas com hash forte (bcrypt ou Argon2) |
| RNF-09 | Isolamento por Lar em todas as consultas: nenhum dado de um Lar pode vazar para outro |
| RNF-10 | Limite de tentativas de login e bloqueio temporário após falhas seguidas |
| RNF-11 | Dados sensíveis criptografados no banco; backups criptografados |
| RNF-12 | Logs de acesso e de alterações guardados por 6 meses |

**Arquitetura, desempenho e disponibilidade**

| Código | Requisito |
| --- | --- |
| RNF-13 | API separada do front-end (REST ou GraphQL), para o app nativo usar a mesma API |
| RNF-14 | Banco relacional (ex.: PostgreSQL); valores em centavos (inteiros) |
| RNF-15 | Telas principais carregam em até 2 segundos numa conexão 4G |
| RNF-16 | Extrato paginado, aguentando Lares com mais de 50 mil lançamentos |
| RNF-17 | Disponibilidade-alvo de 99,5% ao mês |
| RNF-18 | Ambientes separados de desenvolvimento, homologação e produção |
| RNF-19 | Testes automatizados obrigatórios nas regras de saldo, fatura e parcelamento |

## 15. Fora do MVP: próximas fases

Tudo marcado como P3 nas seções anteriores, mais os recursos abaixo, fica para depois do MVP web. A ordem prioriza validar o uso real antes de investir em cobrança, app nativo e integrações pagas.

| Fase | Escopo | Conteúdo | Critério para passar à próxima |
| --- | --- | --- | --- |
| 1. MVP Web | Itens P1 e P2 deste documento | Lar, contas, lançamentos, cartões e faturas, recorrências, orçamento, dashboard, relatórios, importação OFX/CSV, PWA | Uso real pela família por 1 a 2 meses |
| 2. Planejamento | Itens P3 da web | Metas e objetivos, projeção de saldo, regras automáticas, divisão de despesas entre membros, mesada, vários Lares | Beta fechado com famílias convidadas |
| 3. Comercialização | Virar produto pago | Planos gratuito e pago, cobrança recorrente, limites por plano, onboarding, site de vendas, suporte, revisão jurídica dos termos | Primeiros assinantes pagantes na web |
| 4. App nativo | Mesma API da web | iOS e Android, notificação push, biometria, modo offline, câmera para comprovantes, widget de saldo | App publicado nas lojas |
| 5. Automação e IA | Diferenciais | Open Finance via agregador, leitura de notificações (Android), assistente com IA (app e WhatsApp), insights, investimentos | — |

O app nativo entra depois da comercialização na web porque reaproveita a API pronta. O Open Finance fica por último porque exige contratar um agregador, com custo por conexão.
