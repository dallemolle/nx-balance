# M1 — Identidade e Lar

- **Status:** ⬜ Não iniciada
- **Depende de:** M0
- **Plano detalhado:** —

## Objetivo
Uma pessoa se cadastra, confirma o e-mail, entra, ganha um Lar, convida o cônjuge e cadastra um filho sem login, tudo com os papéis respeitados e nenhum dado vazando entre Lares.

## Requisitos cobertos
- [ ] RF-01.1 · Cadastro com nome, e-mail e senha, com confirmação por e-mail · P1
- [ ] RF-01.2 · Login e "manter conectado" · P1
- [ ] RF-01.3 · Recuperação de senha por link · P1
- [ ] RF-01.4 · Login com Google · P2
- [ ] RF-01.5 · 2FA com app autenticador (TOTP) · P2
- [ ] RF-01.6 · Encerramento de sessão por inatividade · P2
- [ ] RF-02.1 · Lar criado automaticamente no primeiro acesso, com nome editável · P1
- [ ] RF-02.2 · Convite por e-mail ou link, válido por 7 dias · P1
- [ ] RF-02.3 · Papéis Administrador, Editor e Leitor · P1
- [ ] RF-02.4 · Membros sem login · P1
- [ ] RF-02.5 · Remover membro ou sair do Lar, preservando o histórico · P1
- [ ] RF-13.1 · Perfil: nome, e-mail, foto, troca de senha · P1
- [ ] RF-13.3 · Aceite de Termos e Política no cadastro, com data e versão · P1
- [ ] RF-13.7 · Consentimento de cookies e de marketing, separados · P1
- [ ] RNF-01/02/03 · Shell responsivo: menu inferior no celular (Início, Extrato, "+", Orçamento, Mais) e menu lateral no desktop

## Entregas
### Backend
- [ ] Modelos `User`, `Session`, `EmailToken`, `Household`, `Member`, `Invite`, `Consent`
- [ ] Módulo `auth`: cadastro, confirmação, login, refresh com rotação, logout, esqueci a senha (ADR-0004)
- [ ] Limite de tentativas de login por e-mail e por IP (RNF-10)
- [ ] `HouseholdContext` + guard de papel + extensão do Prisma que exige `household_id` (ADR-0002)
- [ ] Módulo `households`: renomear, membros, convites, transferência de Administrador
- [ ] E-mails transacionais com templates (confirmação, recuperação, convite) enviados por job

### Frontend
- [ ] Telas: cadastro, login, confirmar e-mail, esqueci/redefinir senha, aceitar convite
- [ ] Layout do app (menus móvel e desktop) e rotas protegidas
- [ ] Configurações: perfil, Lar, membros e convites
- [ ] Banner de cookies e aceite de termos

### Testes
- [ ] Integração: fluxo completo de cadastro → confirmação → login → refresh → logout
- [ ] Integração: usuário do Lar A recebe `404` em recursos do Lar B
- [ ] Regras: o último Administrador não sai sem transferir; o membro removido perde o acesso na hora
- [ ] E2E (Playwright): cadastro e convite aceito por outra pessoa

## Critério de pronto
- Duas contas reais conseguem dividir um Lar pelo navegador do celular.
- `/security-review` rodado no módulo `auth`, sem achados críticos em aberto.

## Notas
- O texto dos Termos e da Política pode ser provisório no MVP; a revisão jurídica fica na fase 3.
