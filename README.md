<div align="center">
<img src="./resource/images/logo-ollo.png" width="200px;" height="150px">
</div>

# OLLO.li

> API que controla todas as features da OLLO.li, **essa API não contempla o MVP**

[![codecov](https://codecov.io/gh/olloapp/ollo-link-api/graph/badge.svg?token=i92IIJ25y9)](https://codecov.io/gh/olloapp/ollo-link-api)

### Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tópicos:

- [x] Trazer o encurtador do MVP para cá
- [x] Configurar o github actions
- [ ] Fazer o deploy para um ambiente de prod
- [ ] Envio de email por fila
- [ ] Configurar swagger
- [ ] Observabilidade

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Ter instalado a versão mais recente de `node`, atualmente recomendamos `>=18.12.0 <=20.9.0`
- Ter o `npm` que acompanha a versão do `node` instalada no seu computador
- Ter o Docker instalado na máquina
- Ler esse README

## 🏛️ Estrutural

### 🏗️ Arquitetura

<details>
<summary>Ver mais</summary>

<div align="center">
<img src="./docs/architecture.drawio.png" width="600px;">
</div>
</details>

### 👷 CI/CD

<details>
<summary>Ver mais</summary>

<div align="center">
<img src="./docs/deploy.drawio.png" width="600px;">
</div>
</details>

## 🚀 Instalando OLLO.li API

Para instalar o **OLLO.li API**, siga estas etapas:

```
npm run install
```

## ☕ Usando OLLO.li API

Para usar **OLLO.li API**, siga estas etapas:

```
npm run dev
```

<details>
<summary>Response</summary>

<div align="center">
<img src="./docs/debug-mode-inactive.png"/>
</div>
</details>

> Pronto, seus containers já estarão criados e as dependências instaladas, agora você usará a API sem nenhuma preocupação com ambiente

## 🪲 Ativando o modo de debug

Vá até o `.env-{production | test | development}` e habilite a flag `DEBUG_OPTION`

```
DEBUG_MODE=true
```

E dê o start normal da API

```
npm run dev
```

<details>
<summary>Response</summary>

<div align="center">
<img src="./docs/debug-mode-active.png"/>
</div>
</details>

<details>
<summary>Quando alguma request for feita, aparecerá no terminal</summary>

<div align="center">
<img src="./docs/request-debug-on.png"/>
</div>
</details>

## 💽 Lidando com o Banco de dados

### Prisma

> Usamos o Prisma como ORM

Para criar uma nova Migration

```
npm run prisma:newMigration MIGRATION_NAME
```

> Substitua o `MIGRATION_NAME` pelo nome que desejar

Para abrir o Prisma Studio

```
npm run prisma studio
```

### Infra + Docker

Pro hora usamos o docker somente para infra, então para subir o ambiente com o Prisma, só rodar:

```
npm run docker
```

### String de conexão

Para acessar tanto o `Postgres` quanto o `Redis`, precisará das seguintes strings de conexão

```
## para uso de client
DATABASE_URL="postgresql://ollo:ollo_password@localhost:5432/ollo_li?schema=public"
REDIS_URL="redis://localhost:6379"
```

## 🗂️ Para criar um novo módulo

Temos um script que faz a criação automática do novo módulo

```
npm run new:module MODULE_NAME
```

> Substitua o `MODULE_NAME` pelo nome do módulo

## 👀 Rodando os testes

Temos um script que faz a criação automática do novo módulo

```
npm run test:watch [path do arquivo se quiser rodar individualmente]
```

## 💻 Build

Para gerar o build da aplicação, rode:

```
npm run build
```

Será criado uma pasta `dist` na raiz do projeto.

Para rodar a API em modo de prod:

```
npm run prod
```

<details>
<summary>Response</summary>

<div align="center">
<img src="./docs/prod.png"/>
</div>
</details>

> Se tudo deu certo, a API estará rodando em modo de produção

## 🌳 Env files

Existe o `.env.example` que é a base para as variáveis de ambiente, pra rodar local crie um `env.development` com as variáveis abaixo

```
# env.development
DEBUG_MODE=false
FASTIFY_JWT_SECRET="EeFX62*-D4xsz[@SE?G;df/3Q44XHC&04ut3[,Ub[8m#£+DKf"
FASTIFY_JWT_SECRET_EXPIRES_IN="7d"
FASTIFY_RATE_LIMIT_MAX=100
FASTIFY_RATE_LIMIT_TIME_WINDOW="1 minute"
INTERNAL_OLLO_LI_BASE_URL="https://app.ollo.li"
OLLO_LI_BASE_URL="https://ollo.li"
VERIFY_EMAIL_SUBJECT="Confirme Seu Cadastro - Importante!"
VERIFY_EMAIL_FROM_EMAIL="no-reply@ollo.li"
VERIFY_EMAIL_FROM_NAME="Vera da OLLO.li"
RECOVERY_PASSWORD_EMAIL_SUBJECT="Reinicie sua senha!"

DATABASE_URL="postgresql://ollo:ollo_password@localhost:5432/ollo_li?schema=public"
MAILERSEND_API_KEY=
REDIS_URL="redis://ollo-li-redis:6379"
```

### Test

```
# env.test
DEBUG_MODE=false
SERVER_PORT=4200
[...]
```

### Production

```
# env.production
DEBUG_MODE=false
SERVER_PORT=4000
[...]
```
