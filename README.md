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

Essa sessão é responsável por mostrar a estrutura base da aplicação, dando uma ideia inicial de arquitetura, sobre os módulos e referente ao CI/CD.

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

- **Controller**: Atua como o ponto de entrada para comunicação externa. Deve ser acessado exclusivamente via rotas, decoradores e etc. É permitido utilizar serviços (do mesmo módulo ou de outros) e schemas para suporte.
- **Router**: Responsável por direcionar as chamadas externas para o controller apropriado, garantindo que apenas controllers sejam acionados.
- **Schema**: Centraliza definições de tipos e validações. Prefira o uso da biblioteca `zod` para essas definições, permitindo que os schemas sejam utilizados por diferentes partes do módulo.
- **Service**: Encarregado das comunicações externas e lógicas de negócio. Também facilita a interação entre diferentes módulos.
- **Extras**: Um módulo pode incluir elementos adicionais, como middleware, templates, entre outros, contanto que sua inclusão seja relevante para o contexto do módulo.
- **Testes**: Os testes são fundamentais para garantir a qualidade do código. Devem ser organizados em arquivos com os sufixos `[TESTE].unit.test.ts` para testes unitários e `[TESTE].integration.test.ts` para testes de integração.

  - unit: onde fazer a menor unidade dos testes, de preferencia testar o que está dentro da pasta `services`
  - integration: onde fazemos o teste da integração, de modo geral pode ser o teste da rota, ou seja, é testado o que está no arquivo `MODULE.route.ts`

    <div align="center">
      <img src="./docs/architecture.drawio.png" width="600px;">
    </div>
  </details>

### 👷 CI/CD - `EM CONSTRUÇÃO`

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

Se for a primeira vez que roda o projeto, é necessário rodar:

```bash
npm run docker
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

Vá até o `.env-development` e habilite a flag `DEBUG_OPTION`

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

Existe o `.env.example` que é a base para as variáveis de ambiente, pra rodar local crie um `env.development` com as variáveis abaixo, substitua o que for necessário

```
# env.development
DEBUG_MODE=false|true
FASTIFY_JWT_SECRET="SOME_RANDOM_SECRET_HERE"
FASTIFY_JWT_SECRET_EXPIRES_IN="7d"
FASTIFY_RATE_LIMIT_MAX=100
FASTIFY_RATE_LIMIT_TIME_WINDOW="1 minute"
INTERNAL_OLLO_LI_BASE_URL="https://app.ollo.li"
OLLO_LI_BASE_URL="https://ollo.li"

DATABASE_URL="postgresql://ollo:ollo_password@localhost:5432/ollo_li?schema=public"
MAILERSEND_API_KEY=
REDIS_URL="redis://ollo-li-redis:6379"
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_DEFAULT_BUCKET=
CORS_ORIGIN=
```

## Para os testes é necessário criar um arquivo `.env-test`, pode ser igual ao `.env.-development`
