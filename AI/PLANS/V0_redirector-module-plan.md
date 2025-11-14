# Execution Plan Template (IA)

Estrutura reutilizável para que agentes planejem tarefas complexas mantendo disciplina TDD (`✅ Test Fails → ✅ Code → ✅ Green`) e rastreabilidade. Substitua cada campo `<placeholder>` antes de iniciar a execução.

## Contexto Rápido
- **Objetivo**: Entregar um módulo `redirector` capaz de resolver hashes encurtados via Fastify, retornando 301 ou 404 conforme existência do link, com cobertura mínima de 90%, coleção Postman alinhada e documentação/ai-context atualizados.
- **Escopo**: Novos arquivos em `src/modules/redirector` (controller, service, schema, testes), hooks em `src/modules/link`/infra Prisma para lookup, rota GET `/r/:hash`, ajustes em `docs/postman_collection.json`, fluxo MCP (login → encurtar → redirecionar), atualização relevante no `ai-context`.
- **Restrições**: Seguir arquitetura modular existente, usar TDD (provocar falha antes do código), manter lint/tsc limpos, coverage ≥90% no módulo, rotas expostas via prefixo `r`. Fluxo Postman deve ser atualizado via MCP no workspace OLLO/coleção Ollo.li.
- **Definição de Pronto**: Novos testes passando e cobrindo cenários 301/404, rota acessível em dev, Postman collection e workspace sincronizados e testados (retorno 301 no fluxo), `ai-context` refletindo regra de redirecionamento, plano atualizado.

## Estágios Sequenciais
> Defina estágios granulares e ordenados. Cada estágio deve ser independente e concluído antes do próximo.

### Stage 0 – Descoberta & Contrato HTTP
- [ ] ✅ **Test Fails** — Criar testes (provavelmente integração em `src/modules/redirector/__tests__/redirector.routes.integration.test.ts`) que invoquem `GET /r/:hash`, cobrindo 301 quando hash existe e 404 quando não existe, utilizando fixtures em `tests/app.ts`.
- [ ] ✅ **Code** — Nenhum código funcional ainda; focar em fixtures/mocks necessários (e seed de link) para que o teste reproduza a ausência de rota.
- [ ] ✅ **Green** — Rodar `npm run test src/modules/redirector/__tests__/redirector.routes.integration.test.ts` e garantir falha indicando rota inexistente.
- [ ] 📝 **Notas** — Verificar como links são criados hoje (serviço/link) para reaproveitar Prisma e TTL.

### Stage 1 – Serviço Redirector + Prisma Lookup
- [ ] ✅ **Test Fails** — Expandir testes para validar que o serviço consulta Prisma por `hash` e diferencia estados ativos/inativos (usar factory/mock DB).
- [ ] ✅ **Code** — Implementar `redirector.service.ts` usando `Context { prisma }`, expondo método `resolveHash` que retorna DTO com `originalUrl` ou `null`, respeitando soft deletes/expiração se houver.
- [ ] ✅ **Green** — Executar testes unitários/integração direcionados aos serviços (`npm run test src/modules/redirector/__tests__/redirector.service.unit.test.ts`).
- [ ] 📝 **Notas** — Garantir tipagens com retorno discriminado e mensagens reutilizando helpers HTTP.

### Stage 2 – Controller & Rota `/r/:hash`
- [ ] ✅ **Test Fails** — Atualizar integração para cobrir Fastify controller (`GET /r/:hash`), esperando status 301 com header `Location` ou 404 JSON.
- [ ] ✅ **Code** — Criar controller e schema (zod) no módulo, registrar rota e prefixo `r` no plugin root (`src/server.ts` ou registrador modular). Configurar reply redirect com `reply.redirect(originalUrl, 301)`.
- [ ] ✅ **Green** — Rodar suites do módulo + `npm run test` se necessário para garantir ausência de regressões.
- [ ] 📝 **Notas** — Confirmar que rota é pública (sem auth) e respeita rate limit padrão.

### Stage 3 – Postman MCP & docs
- [ ] ✅ **Test Fails** — (NA) Preparar verificação: se rota não estiver na collection, fluxo manual falha.
- [ ] ✅ **Code** — Usar MCP do Postman para: (1) adicionar request GET `/r/:hash` à coleção Ollo.li; (2) sincronizar `docs/postman_collection.json`; (3) rodar fluxo LOGIN → CREATE LINK → REDIRECT e capturar resultado (301 esperado). Atualizar docs locais.
- [ ] ✅ **Green** — Validar resposta 301 via MCP run; se 404 surgir, revisar etapas anteriores antes de seguir.
- [ ] 📝 **Notas** — Garantir que secrets/env necessários para MCP estejam disponíveis (Mailersend etc). Registrar evidências no relatório final.

### Stage 4 – Ai-context & Revisões Finais
- [ ] ✅ **Test Fails** — Não se aplica; foco em consistência documental.
- [ ] ✅ **Code** — Atualizar `ai-context/regras-de-negocio.md` (ou arquivo pertinente) detalhando novo fluxo de redirecionamento; revisar `docs/postman_collection.json` diff.
- [ ] ✅ **Green** — Rodar `npm run lint`, `npm run test` completo e `npm run build` se o tempo permitir para validação final.
- [ ] 📝 **Notas** — Preparar notas para changelog/PR.

## Checks Globais
- [ ] 🔁 **Regressão direcionada** — Executar `npm run test` completo e `npm run build` após Stage 4.
- [ ] 📦 **DX/Docs** — Confirmar atualização de `docs/postman_collection.json` e `ai-context`.
- [ ] 📊 **Observabilidade** — Revisar se há métricas/logs suficientes para identificar falhas de redirecionamento (ex.: log info quando hash não encontrado).
- [ ] ✅ **Entrega** — Revisar diff (`git status`, `git diff`), preparar mensagem para solicitante, indicar próximos passos/testes ainda pendentes se houver.

## Registro de Execução (preencha durante a execução)
| Estágio | Hora de início | Resultado | Observações |
| ------- | -------------- | --------- | ----------- |
| Stage 0 | `--:--` | `pending` | `A preencher durante execução.` |
| Stage 1 | `--:--` | `pending` | `A preencher durante execução.` |
| Stage 2 | `--:--` | `pending` | `A preencher durante execução.` |
| Stage 3 | `--:--` | `pending` | `A preencher durante execução.` |
| Stage 4 | `--:--` | `pending` | `A preencher durante execução.` |

## Playbook de Atualização
1. Valide se o plano ainda é válido antes de executar cada estágio.
2. Atualize checkboxes logo após completar cada passo para manter visibilidade.
3. Registre desvios (ex.: testes adicionais, hotfixes) na seção de notas do estágio correspondente.
4. Ao finalizar, consolide resultados e próximos passos no relatório ao solicitante.
