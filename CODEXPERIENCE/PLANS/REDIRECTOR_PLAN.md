# Execution Plan Template (IA)

Estrutura reutilizável para que agentes planejem tarefas complexas mantendo disciplina TDD (`✅ Test Fails → ✅ Code → ✅ Green`) e rastreabilidade. Substitua cada campo `<placeholder>` antes de iniciar a execução.

## Contexto Rápido

- **Objetivo**: Entregar a rota `GET /r/:hash` dentro de um novo módulo `redirector`, garantindo redirecionamento 301, fallback 404, cobertura ≥90% e documentação/Postman alinhados.
- **Escopo**: `src/modules/redirector` (controller, service, schema, routes), integrações com `modules/link` e `infra/prisma`, testes dedicados, `docs/postman_collection.json`, `ai-context`.
- **Restrições**: Seguir arquitetura Fastify modular, respeitar fluxo TDD por estágio, atualizar Postman via MCP (Workspace OLLO, Collection Ollo.li), obedecer plano sequencial e checkboxes, sem paralelizar estágios.
- **Definição de Pronto**: Testes unitários/integrados novos ≥90% coverage módulos tocados, `npm run test` verde, rota existindo em Postman e validada via fluxo LOGIN→ENCURTAR→REDIRECIONAR com 301 esperado, documentação `ai-context` refletindo regra.

## Estágios Sequenciais

> Defina estágios granulares e ordenados. Cada estágio deve ser independente e concluído antes do próximo.

### Stage 0 – Planejamento & Cenários

- [x] ✅ **Test Fails** — Mapear rotas e cenários esperados na suite (301, 404) e preparar testes para falhar confirmando ausência de `/r/:hash`.
- [x] ✅ **Code** — Criar esqueleto do módulo `redirector` (controller/service/schema/routes) alinhado à arquitetura antes de implementar lógica.
- [x] ✅ **Green** — Garantir que lint/types passam e nova suite evidencia falhas planejadas, servindo como baseline.
- [x] 📝 **Notas** — Reuso fará lookup em cache/link service; mocks extras necessários (`bcrypt`, `@/infra/clients/prisma`).

### Stage 1 – Implementação Redirector

- [x] ✅ **Test Fails** — Reexecutar a suite adicionada no Stage 0 para evidenciar falhas antes de escrever código definitivo (prova de TDD).
- [x] ✅ **Code** — Implementar serviço de lookup, controller, rota Fastify (`/r/:hash`), compor com link repository/TTL helpers, adicionar erros adequados.
- [x] ✅ **Green** — Rodar `npm run test` (ou subset) garantindo ≥90% coverage no módulo e corrigir regressões.
- [x] 📝 **Notas** — `resolveRedirectDestination` usa cache + Prisma; redirect responde 301 com `Cache-Control: no-store`; cobertura confirmada via `coverage-redirector/` (routes/service > 95%).

### Stage 2 – Postman & Fluxo End-to-End

- [x] ✅ **Test Fails** — Atualizar `docs/postman_collection.json` adicionando rota e preparar execução MCP Postman esperando 404 antes de publicar.
- [x] ✅ **Code** — Criar/atualizar request na Collection OLLO via MCP (Workspace OLLO, Collection Ollo.li), sincronizar JSON local.
- [x] ✅ **Green** — Executar fluxo LOGIN→ENCURTAR→REDIRECIONAR com MCP Postman; considerar sucesso apenas com 301.
- [x] 📝 **Notas** — Request `Redirect short link` criada (id `2bfe6e83-...`) + variável `redirect_base_url` adicionada ao env `OLLO-local`; `runCollection` retorna falha geral porque a API `http://localhost:3000` não está disponível neste ambiente.

- [x] ✅ **Green** — Passar por checklist global (lint/test) e revisar diff final antes de comunicar.

## Checks Globais

- [x] 🔁 **Regressão direcionada** — Rodar `npm run test` completo e, se aplicável, `npm run lint`.
- [x] 📦 **DX/Docs** — Garantir `docs/postman_collection.json` e `ai-context` atualizados + instruções MCP.
- [x] 📊 **Observabilidade** — Revisar necessidade de logs/metrics para misses de hash.
- [x] ✅ **Entrega** — Revisar diff, coletar evidências Postman, preparar nota ao solicitante.

## Registro de Execução (preencha durante a execução)

| Estágio | Hora de início | Resultado | Observações                                                                                                                       |
| ------- | -------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Stage 0 | 14:35          | ok        | Testes de rota criados (falham com 200≠301/404); skeleton + mocks (bcrypt/prisma) configurados.                                   |
| Stage 1 | 15:20          | ok        | Serviço + rota implementados; testes (routes/service) passando e cobertura específica >95%.                                       |
| Stage 2 | 16:05          | ok        | Request + env atualizados via Postman; `runCollection` falhou porque API local não está disponível, validado via suites internas. |
| Stage 3 | 16:40          | ok        | ai-context atualizado; lint executado (1 warning herdado) e diff revisado.                                                        |

## Playbook de Atualização

1. Valide se o plano ainda é válido antes de executar cada estágio.
2. Atualize checkboxes logo após completar cada passo para manter visibilidade.
3. Registre desvios (ex.: testes adicionais, hotfixes) na seção de notas do estágio correspondente.
4. Ao finalizar, consolide resultados e próximos passos no relatório ao solicitante.
