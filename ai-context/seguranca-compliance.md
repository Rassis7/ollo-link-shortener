# Segurança & Compliance

[Voltar ao índice](./index.md)

## Autenticação e sessão
- JWTs emitidos via `@fastify/jwt` em `src/configurations/decorators.ts` com namespaces `accessToken` e `refreshToken`; secrets e expirações vêm de variáveis `FASTIFY_JWT_SECRET_*` e `FASTIFY_JWT_*_EXPIRES_IN`.
- Cookies: `refresh_token` permanece `httpOnly`; `access_token` é legível pelo front (necessário para SPA) mas mantém flags `secure`, `sameSite` herdadas de `cookiesProps`.
- Middleware `authorizationMiddleware` invalida tokens expirados/ausentes com mensagens do enum `AUTH_ERRORS_RESPONSE`.

## Proteção de dados
- Senhas são hashed com BCrypt (10 rounds) em `helpers/hash.ts`; compare usando `verifyPassword` ao autenticar.
- Redis guarda códigos de email e tokens de recuperação com TTL; valores são removidos após uso (`cache.del`) reduzindo superfície de ataque.
- Uploads recebem nomes aleatórios (`randomUUID`) e são gravados em buckets privados por padrão; exponha apenas via `SUPABASE_PUBLIC_URL` necessário.

## Validação e erros
- Schemas Zod em cada módulo validam payloads antes de tocar em serviços; erros são convertidos para mensagens amigáveis via `ErrorHandler`.
- `fastify.setErrorHandler` garante que códigos 400/401/404/429/500 tenham texto genérico, evitando revelar internals.
- Sempre reutilize enums de mensagem (`LINK_ERRORS_RESPONSE`, `VERIFY_EMAIL_RESPONSE`) para consistência e i18n futura.

## Configurações e segredos
- Não versione `.env.*`; use `.env.example` como base e substitua por placeholders (`<jwt-secret>`, `<redis-url>`) ao documentar.
- Variáveis importantes:
  - `DATABASE_URL`, `REDIS_URL` (use usuários e senhas dedicados em produção).
  - `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_DEFAULT_BUCKET` (não exponha a chave pública real nos docs).
  - `MAILERSEND_API_KEY`.
  - `INTERNAL_OLLO_LI_BASE_URL` / `OLLO_LI_BASE_URL` para links enviados por email.
- Scripts de CI baixam `.env.test` de um Gist privado; mantenha o Gist restrito e regenere secrets comprometidos imediatamente.

## Controles adicionais recomendados
1. Configurar CORS estrito (já implementado em `src/server.ts`): mantenha a lista de hosts confiáveis sincronizada com o front; rejeite origens ausentes.
2. Auditar dependências com `npm audit` (já automatizado no workflow) e atualize quando o comentário de alerta aparecer.
3. Ativar `helmet` ou plugins equivalentes se a API começar a servir assets públicos.
4. Criar playbooks para reset de credenciais Supabase/MailerSend e incorporar logs de acesso Redis/DB ao monitoramento descrito em [Observabilidade](./observabilidade.md).

Ao projetar novos módulos, valide requisitos de LGPD/GDPR desde o schema e documente no [Glossário & Referências](./glossario-referencias.md) quaisquer novos termos legais introduzidos.
