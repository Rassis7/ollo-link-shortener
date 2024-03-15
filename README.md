<div align="center">
<img src="./resource/images/logo-ollo.png" width="200px;" height="150px">
</div>

# OLLO.li

> API que controla todas as features da OLLO.li, **essa API não contempla o MVP**

[![codecov](https://codecov.io/gh/olloapp/ollo-link-api/graph/badge.svg?token=i92IIJ25y9)](https://codecov.io/gh/olloapp/ollo-link-api)

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Ter instalado a versão mais recente de `node`, atualmente recomendamos `>=18.12.0 <=20.9.0`
- Ter o `npm` que acompanha a versão do `node` instalada no seu computador
- Ter o Docker instalado na máquina
- Ler esse README

## 🏛️ Estrutural

### 🏗️ Arquitetura

<details open>
<summary>Modulos</summary>

Um módulo basicamente é a representação de algo maior, ou seja, ele pode ser divido em várias funcionalidades.
Podemos ter vários controllers, schemas, services e o que mais for necessário, o ideal é quebrar ao máximo as funcionalidades de um módulo em vários arquivos, respeitando o principio da responsabilidade única.

  <div align="center">
    <img src="./docs/architecture-module.drawio.png" width="600px;">
  </div>
</details>

<details open>
<summary>Separação dos módulos</summary>

Devemos ficar atentos a não misturar as coisas, lembre-se cada parte tem sua responsabilidade:

- Controller -> Deve fazer a comunicação externa, ou seja, só pode ser chamado pode ser com routes ou um decorator do fastify, mas pode usar service (do mesmo ou de outro módulos) e schemas
- Router -> Pode somente chamar um controller
- Schema -> Devemos concentrar os tipos e validações de tipos aqui, de sempre preferencia ao uso do `zod`. Pode transitar entre as outras
- Service -> Responsável por comunicação externas e regras de negócio, também é aqui onde um módulo pode se comunicar com outro.
- Extras -> Podemos ter outras coisas dentro de um módulo, como um middleware, template, ou qualquer outra coisa, desde que faça sentido dentro do módulo
- **tests** -> concentramos os testes aqui, sempre com um sufixo `[TESTE].unit.test.ts` e/ou `[TESTE].unit.integration.ts`

  - unit: onde fazer a menor unidade dos testes, de preferencia testar o que está dentro da pasta `services`
  - integration: onde fazemos o teste da integração, de modo geral pode ser o teste da rota, ou seja, é testado o que está no arquivo `MODULE.route.ts`

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

```bash
npm run install
```

## ☕ Usando OLLO.li API

Para usar **OLLO.li API**, siga estas etapas:

```bash
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

```bash
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

```bash
npm run prisma:newMigration MIGRATION_NAME
```

> Substitua o `MIGRATION_NAME` pelo nome que desejar

Para abrir o Prisma Studio

```bash
npm run prisma studio
```

### Infra + Docker

Pro hora usamos o docker somente para infra, então para subir o ambiente com o Prisma, só rodar:

```bash
npm run docker
```

### String de conexão

Para acessar tanto o `Postgres` quanto o `Redis`, precisará das seguintes strings de conexão

```bash
## para uso de client
DATABASE_URL="postgresql://ollo:ollo_password@localhost:5432/ollo_li?schema=public"
REDIS_URL="redis://localhost:6379"
```

## 🗂️ Para criar um novo módulo

Temos um script que faz a criação automática do novo módulo

```bash
npm run new:module MODULE_NAME
```

> Substitua o `MODULE_NAME` pelo nome do módulo

## 👀 Rodando os testes

Temos um script que faz a criação automática do novo módulo

```bash
npm run test:watch [path do arquivo se quiser rodar individualmente]
```

## 💻 Build

Para gerar o build da aplicação, rode:

```bash
npm run build
```

Será criado uma pasta `dist` na raiz do projeto.

Para rodar a API em modo de prod:

```bash
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

---
