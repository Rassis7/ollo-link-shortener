# Observabilidade

[Voltar ao índice](./index.md)

## Logs
- Logger principal definido em `src/configurations/app.ts` com Pino + `pino-pretty`. Em produção (`DEBUG_MODE` falso) logs saem em JSON; em desenvolvimento são coloridos e com `translateTime`.
- `DEBUG_MODE=true` mostra banner "🪲 DEBUG MODE" e imprime cada requisição conforme capturas em `docs/debug-mode-*.png`.
- Controllers usam `ErrorHandler` + `fastify.setErrorHandler` para registrar mensagens consolidadas e evitar vazamento de stack traces para o cliente.

## Health & sinais rápidos
- Endpoint `GET /healthcheck` (módulo `health-check`) retorna `200`/`204` e pode ser usado por load balancers e Render.
- `server.ts` loga a URL (`logger.info(🚀 RUN IN: ...)`) quando inicia e também alerta quando o debug está ligado.

## Rate limiting e proteção de recursos
- Plugin `@fastify/rate-limit` configurado em `src/configurations/rate-limit.ts`; respeite `FASTIFY_RATE_LIMIT_MAX` e `FASTIFY_RATE_LIMIT_TIME_WINDOW` por ambiente.
- Respostas com status `429` recebem mensagem amigável definida em `errors.ts` (“Você atingiu o limite da taxa…”).

## Métricas e tracing
- Não há coleta nativa de métricas, tracing ou logs estruturados de domínio (alem do Pino). Para expandir:
  - Adicione `onRequest`/`onResponse` hooks para medir latência e enviar a agregadores como Datadog ou Prometheus.
  - Use `pino-multi-stream` ou transportes como `pino-http-send` para replicar logs em sistemas centralizados.
  - Implemente middleware para anexar `request-id` (X-Request-Id) e propagar nos logs, facilitando correlações.

## Alertas sugeridos
- Falha ao chamar `RENDER_DEPLOY_HOOK_URL` (deploy workflow) deve enviar notificação manual por enquanto; considere adicionar `if: failure()` com `actions/slack`.
- Monitorar TTL negativo em `verifyEmail`/`recovery` (quando `cache.ttl` retorna `-1`) pode indicar instabilidades no Redis.

## Próximos passos recomendados
1. Integrar `@fastify/under-pressure` para métricas básicas (event loop, heap) e proteger contra overload.
2. Exportar contadores (ex.: número de links criados) usando uma camada simples como `prom-client` e expor em `/metrics`.
3. Documentar padrões de logging de negócio nesta pasta quando forem definidos, mantendo a IA alinhada.

Relacione estes sinais com o checklist em [Segurança & Compliance](./seguranca-compliance.md) para garantir que alertas cubram também eventos de abuso.
