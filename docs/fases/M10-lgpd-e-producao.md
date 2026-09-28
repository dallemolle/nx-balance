# M10 — LGPD, segurança e produção

- **Status:** ⬜ Não iniciada
- **Depende de:** M1–M9
- **Plano detalhado:** —

## Objetivo
Colocar o MVP em produção com os direitos da LGPD funcionando, segurança revisada, backups testados e desempenho medido, pronto para a família usar no dia a dia.

## Requisitos cobertos
- [ ] RF-13.4 · Exportar todos os dados do Lar (zip com CSVs) · P1
- [ ] RF-13.5 · Excluir a própria conta (e o Lar, ou transferir) · P1
- [ ] RF-13.6 · Sessões ativas e encerrar as outras · P2
- [ ] RF-13.8 · Canal de contato do encarregado (DPO) · P1
- [ ] RF-13.9 · Backup diário com retenção de 30 dias · P1
- [ ] RNF-04 · Instalável como PWA
- [ ] RNF-05 · Chrome, Edge, Safari e Firefox (duas últimas versões)
- [ ] RNF-06 · Acessibilidade WCAG 2.1 AA
- [ ] RNF-07 · Formatos brasileiros revisados em todas as telas
- [ ] RNF-08 · HTTPS e hash de senha forte, verificados
- [ ] RNF-09 · Isolamento por Lar auditado em todos os endpoints (+ avaliação de RLS, ADR-0002)
- [ ] RNF-10 · Limite de tentativas e bloqueio, verificados
- [ ] RNF-11 · Dados sensíveis e backups criptografados
- [ ] RNF-12 · Logs de acesso e alterações por 6 meses
- [ ] RNF-15 · Telas principais em até 2 s no 4G
- [ ] RNF-16 · Extrato aguentando mais de 50 mil lançamentos
- [ ] RNF-17 · Disponibilidade-alvo de 99,5% com monitoramento
- [ ] RNF-18 · Ambientes de homologação e produção separados
- [ ] ADR de hospedagem e deploy aceito

## Entregas
- [ ] ADR-0006: hospedagem (API, banco gerenciado, storage, e-mail) com estimativa de custo mensal
- [ ] Pipeline de deploy: `main` → homologação automático; tag → produção
- [ ] Exportação e exclusão de dados como jobs, com e-mail de conclusão
- [ ] Backup automatizado + **teste de restauração** documentado
- [ ] Monitoramento: uptime, erros (ex.: Sentry) e alertas
- [ ] Manifesto PWA, service worker, ícones e tela offline básica
- [ ] Auditoria de acessibilidade (axe + teclado) e de desempenho (Lighthouse)
- [ ] `/security-review` completo e correção dos achados
- [ ] Páginas de Termos, Política de Privacidade e contato do DPO

## Critério de pronto
- A produção está no ar, a restauração de backup foi testada, o Lighthouse dá pelo menos 90 em desempenho e acessibilidade nas telas principais, e não há achado de segurança crítico em aberto.
- Depois disso começa o período de uso real (1 a 2 meses), que é o critério para iniciar a fase 2.
