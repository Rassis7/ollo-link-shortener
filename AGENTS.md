# Repository Guidelines

> Sempre que precisar de visão geral, arquitetura ou regras específicas do projeto, consulte primeiro [`ai-context/index.md`](./ai-context/index.md). Ele centraliza navegação rápida para todos os resumos preparados para agentes e humanos.

## Project Structure & Module Organization
Fastify + TypeScript live under `src/` and are split by modules mirroring OLLO.li features: `modules/auth` (JWT/session lifecycle), `modules/user` (sign-up, profile, password), `modules/link` (shortener CRUD + caching), `modules/email` (verification + recovery templates) e `modules/upload` (Supabase storage). Cross-cutting pieces stay in `configurations/` (logger, decorators, rate limit, Swagger), `infra/` (Prisma, Redis, Supabase clients/storages) e `helpers/` (hashing, HTTP codes, TTL helpers). Tests accompany each module (`__tests__`) with shared harnesses under `src/tests/`. Docs, diagrams e templates residem em `docs/` e `resource/`.

## Build, Test, and Development Commands
- `make setup`: onboarding completo (nvm use, `npm install`, sobe `docker-compose` com Postgres/Redis, roda `prisma generate`, `prisma:db:push` e `npm run seed`).
- `npm run dev`: levanta Fastify com Nodemon/inspector, carregando `.env.development` e exibindo logs coloridos se `DEBUG_MODE=true`.
- `npm run docker`: inicia somente a stack de infra local (containers `ollo-li-postgres` e `ollo-li-redis`).
- `npm run build` / `npm run start`: compila via `tsc` + `tsc-alias` e executa `dist/src/server.js` em produção.
- `npm run test`, `test:watch`, `test:ci`: executam Jest com cobertura (mínimo 80% para branches/functions/lines/statements).

## Coding Style & Naming Conventions
Utilize TypeScript estrito, path alias `@/` e sufixos por responsabilidade (`*.controller.ts`, `*.service.ts`, `*.schema.ts`). Controllers tratam Fastify requests/replies, services concentram regra de negócio com `Context { prisma }`, schemas usam Zod e expõem tipos. Enums/mensagens seguem `UPPER_SNAKE_CASE`. Antes de abrir PR, rode `npm run lint` (ESLint + `standard-with-typescript`) e mantenha funções curtas, com erros centralizados em `helpers/error-handler.ts`.

## Testing Guidelines
Jest (`ts-jest`) cobre unidades e integrações. Nomeie arquivos como `link.service.unit.test.ts` ou `auth.routes.integration.test.ts`. Use mocks globais em `src/tests/` (`prisma.ts`, `redis.ts`, `app.ts`) para simular banco/cache e injetar cookies JWT (`tests/jwt.ts`). Não reduza cobertura abaixo de 80%; explore `npm run test:watch src/modules/link/__tests__/link-integration.test.ts` para iterações rápidas.

## Commit & Pull Request Guidelines
Mensagens seguem Conventional Commits e são auxiliadas por `npm run commit` (Commitizen). Exemplos: `feat(link): add metadata validation` ou `fix(auth): refresh cookie flags`. Pull requests devem referenciar issues (`Closes #123`), resumir mudanças, listar comandos/testes executados e anexar evidências relevantes (p. ex., resposta do endpoint, novo fluxo em Mermaid). Certifique-se de que `npm run build` e `npm run test` passam antes do review.

## Security & Configuration Tips
Nunca versione `.env.*`; baseie-se em `.env.example`. Preencha `FASTIFY_JWT_SECRET_*`, `SUPABASE_*`, `MAILERSEND_API_KEY`, `DATABASE_URL` e `REDIS_URL` com segredos fortes. Rate limiting depende de `FASTIFY_RATE_LIMIT_MAX/TIME_WINDOW`; ajuste por ambiente em vez de comentar o plugin. Antes do deploy, confirme que migrations Prisma foram aplicadas (`npm run prisma:newMigration && prisma migrate deploy`) e que o Redis externo está acessível para validações de email, recovery e caches de links.
