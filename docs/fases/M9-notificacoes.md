# M9 — Notificações e alertas

- **Status:** ⬜ Não iniciada
- **Depende de:** M6
- **Plano detalhado:** —

## Objetivo
Ninguém do Lar perde um vencimento nem estoura o orçamento sem aviso, e cada pessoa escolhe por onde quer ser avisada.

## Requisitos cobertos
- [ ] RF-12.1 · Conta a pagar vence em X dias (padrão 2) · sino, e-mail · P1
- [ ] RF-12.2 · Conta vencida e não paga · sino, e-mail · P1
- [ ] RF-12.3 · Fatura fechou, com o total · sino · P1
- [ ] RF-12.4 · Categoria em 80% e 100% do orçamento · sino, e-mail · P1
- [ ] RF-12.5 · Saldo previsto de alguma conta negativo no mês · sino, e-mail · P2
- [ ] RF-12.6 · Convite recebido ou aceito · e-mail · P1
- [ ] RF-12.7 · Resumo semanal · e-mail · P2
- [ ] RF-12.8 · Web Push para todos os alertas · navegador · P2
- [ ] RF-08.7 · Lembrete de vencimento X dias antes · P2
- [ ] RF-09.6 · Alerta ao atingir 80% e 100% do limite · P1

## Entregas
### Backend
- [ ] Modelos `Notification` e `NotificationPreference` (por usuário, por tipo e por canal)
- [ ] Serviço de disparo com os canais sino, e-mail e Web Push (VAPID) atrás de uma interface comum
- [ ] Jobs agendados: vencimentos (diário), resumo semanal, saldo previsto negativo
- [ ] Gatilhos por evento: orçamento cruzando 80%/100% (uma vez por mês e categoria), fatura fechada
- [ ] Destinatários: Administradores e Editores do Lar, respeitando as preferências

### Frontend
- [ ] Sino com contador, lista e "marcar como lida"
- [ ] Tela de preferências de notificação
- [ ] Pedido de permissão de push no momento certo (não no primeiro acesso)

### Testes
- [ ] Integração: o alerta de 80% dispara uma vez só, mesmo com vários lançamentos depois
- [ ] Integração: a preferência desligada impede o envio naquele canal

## Critério de pronto
- Um vencimento de teste gera aviso no sino, no e-mail (visto no Mailpit) e no navegador.
