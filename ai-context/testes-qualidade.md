# Testes & Qualidade

[Voltar ao índice](./index.md)

## Stack de testes
- Jest configurado via `jest.config.js` com preset `ts-jest`, ambiente Node e alias `@/` já mapeado.
- `jest.setup.js` carrega `.env.test`, mocka `ioredis` com `ioredis-mock`, intercepta `randomUUID/createHash`, MailerSend e Supabase para testes determinísticos.
- Suíte organizada por módulo dentro de `src/modules/<feature>/__tests__/`, dividindo `*.unit.test.ts` (services) e `*.integration.test.ts` (rotas com `fastify.inject`).

## Execução
| Objetivo | Comando |
| --- | --- |
| Rodar toda a suíte com cobertura | `npm run test` |
| Modo watch para um arquivo | `npm run test:watch src/modules/link/__tests__/link-integration.test.ts` |
| Pipeline CI | `npm run test:ci` (usado em `.github/workflows/main.yml`) |

- Antes de testar, garanta que `npm run prisma generate` foi executado (o workflow CI faz isso explicitamente).
- Use os helpers em `src/tests/app.ts`, `src/tests/prisma.ts` e `src/tests/redis.ts` para montar cenários com mocks consistentes.

## Cobertura mínima
- O `coverageThreshold` global exige 80% para branches, functions, lines e statements. Falhas impedem o merge e o badge do Codecov (`codecov.yml`) é atualizado no CI.
- `collectCoverageFrom` ignora `src/configurations/**/*`, `src/tests/**/*` e `src/server.ts`, evitando ruído de infraestrutura.

## Qualidade de código
- `npm run lint` executa ESLint com `standard-with-typescript`. O workflow “CodeAnalysis” roda `npm audit` e `npm run lint --fix`; corrija localmente antes do push para evitar ruploops.
- Commits seguem Conventional Commits; use `npm run commit` (Commitizen) para guias de mensagem.
- Funções devem permanecer curtas, com erros tratados via `helpers/ErrorHandler` para manter mensagens coesas.

## Boas práticas
- Prefira testar regras em nível de service (e.g. `saveOrUpdateLinkCache`) e apenas cenários críticos em integração.
- Ao mockar datas/UUIDs utilize `jest.useFakeTimers()` e stubs definidos em `jest.setup.js` para manter paridade com a suíte existente.
- Se adicionar novos módulos, replique a estrutura `__tests__`, atualize `collectCoverageFrom` se precisar ignorar arquivos gerados e mantenha exemplos práticos nos testes para que a documentação viva.
- Combine estas diretrizes com [Observabilidade](./observabilidade.md) para criar asserts de logging ou métricas quando forem adicionadas.
