# Deploy & CI/CD

[Voltar ao índice](./index.md)

## Pipeline de PR (`.github/workflows/main.yml`)
1. **InstallDeps**: checkout + `actions/setup-node` (usa `NODE_VERSION` secreto) + cache de `node_modules`.
2. **CodeAnalysis**: roda `npm audit --audit-level moderate`, comenta resultado no PR se houver findings (action `actions-comment-pull-request`), e executa `npm run lint --fix`.
3. **Tests**: recria `.env.test` a partir de um Gist privado, roda `npx prisma generate`, executa `npm run test:ci` com cobertura e envia report ao Codecov (`codecov/codecov-action@v3`).
- O workflow é disparado para `pull_request` direcionado à `main`; falhas em qualquer job bloqueiam o merge.

## Pipeline de produção (`.github/workflows/production.yml`)
- Dispara em `push` na `main` ou novas tags `v*`.
- **InstallDeps** garante dependências.
- **Release**: reusa caches, configura git e roda `npm run release:ci` (Release It) para versionar/gerar changelog automaticamente.
- **Deploy**: após um release bem-sucedido, chama `curl $RENDER_DEPLOY_HOOK_URL` para acionar o deploy no Render (ou serviço equivalente) sem precisar de secrets adicionais no repositório.

## Processo recomendado
1. Abra PR seguindo Conventional Commits; valide `npm run lint && npm run test` localmente.
2. Após merge, crie tag `vX.Y.Z` (ou deixe Release It cuidar disso). O workflow de produção gera a release e dispara o deploy.
3. Monitore `codecov.io/gh/olloapp/ollo-link-api` e os checks do GitHub para garantir que a cobertura permaneça ≥80%.

## Variáveis e segredos usados nos workflows
- `NODE_VERSION`: controla a versão do Node usada no Actions.
- `CODECOV_TOKEN`: upload de cobertura.
- `RENDER_DEPLOY_HOOK_URL`: endpoint para publicar na infraestrutura gerenciada.
- `.env.test`: baixado de um Gist privado. Para novos ambientes, atualize o Gist ou adapte o passo correspondente.

## Gatilhos manuais
- `npm run release`: pode ser acionado localmente para gerar tags/notas antes de subir para o remoto.
- Caso precise travar deploys, pause o hook no Render ou remova temporariamente o passo “Deploy” do workflow.

Consulte [Infraestrutura](./infraestrutura.md) para saber quais serviços precisam estar provisionados antes do deploy e [Observabilidade](./observabilidade.md) para validar saúde pós-publicação.
