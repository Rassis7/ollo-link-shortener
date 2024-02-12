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

### -> Response

<img src="./docs/debug-mode-inactive.png"/>

> Pronto, seus containers já estarão criados e as dependências instaladas, agora você usará a API sem nenhuma preocupação com ambiente

## 🪲 Ativando o modo de debug

Vá até o `.env` e habilite a flag `DEBUG_OPTION`

```
DEBUG_MODE=true
```

E dê o start normal da API

```
npm run dev
```

### -> Response

<img src="./docs/debug-mode-active.png"/>

## 💽 Lidando com o Banco de dados

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
npm start
```

<img src="./docs/prod.png"/>

> Se tudo deu certo, a API estará rodando em modo de produção
