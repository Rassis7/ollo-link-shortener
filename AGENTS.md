# Repository Guidelines

## Project Structure & Module Organization
- Core application code lives in `src/`; `src/server.ts` wires Fastify plugins, env bootstrap, and module routers.
- Shared setup (logger, env, Prisma) resides in `src/configurations`; cross-cutting helpers sit in `src/services` and `src/helpers`.
- Feature domains belong in `src/modules/<feature>` and should expose `*.route.ts` for registration, `*.controller.ts` for HTTP orchestration, and `services/` for business logic. Co-locate Zod schemas under `schemas/` within the module.
- Prisma schema, migrations, and generated client resources stay in `prisma/`; update both schema and client together.
- Test scaffolding under `src/tests` provides mocks and server factories; place module-level specs beside features following `[feature].unit.test.ts` / `[feature].integration.test.ts`.

## Build, Test, and Development Commands
- `make setup`: bootstrap dependencies, Docker services, Prisma client, DB schema, and seed data.
- `npm run dev`: launch Fastify with Nodemon + inspector using `.env.development`.
- `npm run build`: emit compiled JS to `dist/` via `tsc` and `tsc-alias`.
- `npm run docker`: start supporting containers; use `docker compose down` when finished.
- `npm run test`, `npm run test:watch`, `npm run test:ci`: run Jest locally, in watch mode, or CI profile with coverage.
- `npm run lint`: enforce ESLint (Standard + TypeScript) with auto-fix.

## Coding Style & Naming Conventions
- TypeScript strict mode is enabled; declare explicit types on public functions and service contracts when inference is unclear.
- Prefer the `@/` module alias for internal imports; avoid fragile relative paths.
- Use 2-space indentation, `camelCase` for functions/variables, `PascalCase` for classes/types, and suffix route files with `.route.ts`.
- Keep controllers slim: delegate to services, compose schemas for validation, and rely on the shared logger from `src/configurations/app.ts` instead of `console.log`.

## Testing Guidelines
- Jest powers unit and integration tests; mock external integrations (Supabase, Redis, MailerSend) via `src/tests/__mocks__`.
- Maintain coverage by adding unit specs for services and integration specs for routes. Run `npm run test` before submitting changes and capture failure logs.

## Commit & Pull Request Guidelines
- Follow Conventional Commits; run `npm run commit` (`git cz`) to compose messages that feed Release It and the changelog.
- Keep pull requests focused, reference issues, and document testing evidence. Include sample API payloads or screenshots when behavior changes.

## Security & Configuration Tips
- Copy `.env.example` into `.env.development` and `.env.test`; never commit secrets.
- Toggle `DEBUG_MODE=true` only for local troubleshooting.
- After schema edits, execute `npm run prisma:db:push` and `npm run prisma:generate`, then restart local services to pick up changes.
