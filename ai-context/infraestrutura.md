# Infraestrutura

[Voltar ao índice](./index.md)

## Camada de dados
| Componente | Local | Uso | Observações |
| --- | --- | --- | --- |
| PostgreSQL | Docker local (`docker-compose.yml`, serviço `postgres`) ou `DATABASE_URL` externo | Persistência via Prisma (`src/infra/clients/prisma.ts`) | Scripts `npm run prisma:*` cuidam de migrations, `scripts/seed.js` popula dados exemplo. |
| Redis | Docker local (`redis`) ou `REDIS_URL` | Cache para links, códigos de email e tokens de recuperação (`CACHE_PREFIX` em `src/infra/clients/redis.ts`) | Singleton exposto em `src/infra/storages/cache.ts`; TTL calculado com `helpers/expire-cache-in-seconds.ts`. |
| Supabase Storage | Configurada via `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_PUBLIC_URL` | Upload de arquivos da rota `/api/upload` (`FileStorage`) | Buckets privados por padrão; gere names exclusivos ao usar `bucketName`. |

## Serviços externos
- **MailerSend**: inicializado em `src/configurations/email.ts`. Requer `MAILERSEND_API_KEY` e templates HTML em `src/modules/email/templates`. Em desenvolvimento, `sendEmail` retorna cedo para evitar envio real.
- **Render (deploy)**: workflow `.github/workflows/production.yml` chama `RENDER_DEPLOY_HOOK_URL` após release para publicar a API.

## Provisionamento local
1. `make setup`: executa `nvm use`, `npm install`, `docker compose up -d`, `prisma generate`, `prisma:db:push` e `npm run seed`.
2. Variáveis `.env.example`: copie para `.env.development`, `.env.test` e `.env` conforme ambiente. Campos sensíveis devem receber placeholders seguros (ex.: `FASTIFY_JWT_SECRET_ACCESS_TOKEN=<strong-secret>`).
3. Servidor local: `npm run dev` (nodemon + inspector). Inicie `npm run docker` se ainda não houver containers.

## Estrutura de clientes compartilhados
- Injete `prisma` importando de `@/infra` (arquivo `src/infra/index.ts` reexporta os clientes) para manter um único pool por processo.
- `Redis.getInstance` garante conexão única mesmo em testes; use `cache` para set/get ao invés de instanciar IoRedis diretamente.
- `FileStorage` consome o `supabaseClient` e esconde detalhes de upload (stream -> File -> Supabase), reduzindo acoplamento nos controllers.

## Scripts úteis
- `npm run prisma:newMigration <nome>`: gera migration; use `prisma migrate deploy` no pipeline de produção.
- `npm run prisma:db:push`: sincroniza schema em ambientes efêmeros (não gera migration).
- `npm run docker`: sobe apenas Postgres/Redis; pare com `docker compose down` quando não precisar.
- `npm run new:module`: executa `scripts/create_module.sh`; cria esqueleto com pastas padrão.

Para detalhes sobre deploy e automação consulte [Deploy & CI/CD](./deploy-ci-cd.md); para políticas de segurança referentes a segredos veja [Segurança & Compliance](./seguranca-compliance.md).
