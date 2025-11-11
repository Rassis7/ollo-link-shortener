# Glossário & Referências

[Voltar ao índice](./index.md)

## Termos frequentes
| Termo | Definição | Referência |
| --- | --- | --- |
| **Context** | Objeto `{ prisma }` passado para todos os services; permite trocar Prisma por mocks nos testes. | `src/configurations/context.ts` |
| **Decorators Fastify** | Métodos adicionados em `fastify.decorate` (`isAuthorized`, `isAccountVerified`, `verifyAccessToken`). Usados nas rotas para acionar middlewares JWT. | `src/configurations/decorators.ts` |
| **CACHE_PREFIX** | Enum que define namespaces Redis (`EMAIL_VERIFICATION`, `LINK`, `ACCOUNT_NOT_CONFIRMED`, `RECOVERY_PASSWORD`). Evita colisões em um único cluster. | `src/infra/clients/redis.ts` |
| **TTL Helper** | Função `expireCacheInSeconds(date)` converte datas futuras em segundos para Redis. | `src/helpers/expire-cache-in-seconds.ts` |
| **DEBUG_MODE** | Flag que habilita logs coloridos e prints extras quando `true`. Controla `logger` e comportamento do server. | `src/server.ts`, `src/configurations/app.ts` |
| **Render Deploy Hook** | URL armazenada em `RENDER_DEPLOY_HOOK_URL` para disparar deploy após release. | `.github/workflows/production.yml` |
| **Supabase Default Bucket** | Nome padrão usado por `FileStorage` (`SUPABASE_DEFAULT_BUCKET`), substituível quando um bucket customizado é passado no upload. | `src/infra/storages/file-storage.ts` |
| **ErrorHandler** | Wrapper que traduz exceções Fastify/Zod/JS em payload uniforme enviado ao cliente e logado pelo servidor. | `src/helpers/error-handler.ts` |

## Referências cruzadas
- Guia detalhado do repositório: [`README.md`](../README.md)
- Diagramas e imagens de arquitetura/CI: [`docs/`](../docs)
- Workflows e templates de PR: [`.github/workflows`](../.github/workflows) e [`.github/pull_request_template.md`](../.github/pull_request_template.md)
- Scripts auxiliares: [`scripts/create_module.sh`](../scripts/create_module.sh), [`scripts/seed.js`](../scripts/seed.js)
- Configurações adicionais citadas neste hub: [Arquitetura](./arquitetura.md), [Infraestrutura](./infraestrutura.md), [Segurança](./seguranca-compliance.md).

> Ao adicionar novos conceitos, inclua-os nesta tabela com uma curta descrição e referência direta ao arquivo onde vivem.
