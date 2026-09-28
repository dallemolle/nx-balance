# ADR-0004: Autenticação própria com sessões no banco

- **Status:** Aceita
- **Data:** 2026-09-27

## Contexto
É preciso ter login por e-mail e senha com confirmação e recuperação (RF-01.1–01.3), "manter conectado", encerramento por inatividade (RF-01.6), lista de sessões ativas (RF-13.6), limite de tentativas (RNF-10) e, depois, login com Google e 2FA (P2). A mesma autenticação precisa servir ao web e ao app nativo.

## Decisão
- Senha com **Argon2id**.
- **Access token JWT** de 15 minutos no header `Authorization`, com `sub` (usuário), `sid` (sessão) e `hid` (Lar ativo).
- **Refresh token** opaco e rotativo, guardado com hash na tabela `Session`. No web, ele fica em cookie `httpOnly; Secure; SameSite=Strict`; no app, no armazenamento seguro do aparelho.
- "Manter conectado" define a validade da sessão: 30 dias, ou só enquanto o navegador estiver aberto.
- Reutilizar um refresh token já usado revoga a sessão inteira (detecção de roubo).
- Tokens de e-mail (confirmação, recuperação, convite) têm uso único, com hash e validade.
- O limite de tentativas é por e-mail e por IP, com bloqueio temporário crescente.
- Google OAuth e TOTP entram como estratégias adicionais sobre a mesma `Session`.

## Consequências
- A tela de sessões (RF-13.6) e o "sair de todos os dispositivos" são só consultas à tabela `Session`.
- Não há dependência de provedor pago de identidade. Em troca, a segurança é responsabilidade nossa: essa parte exige testes e revisão de segurança (`/security-review`) antes da produção.
