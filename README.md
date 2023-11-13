# OLLO.li API

![GitHub repo size](https://img.shields.io/github/repo-size/iuricode/README-template?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/iuricode/README-template?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/iuricode/README-template?style=for-the-badge)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/iuricode/README-template?style=for-the-badge)
![Bitbucket open pull requests](https://img.shields.io/bitbucket/pr-raw/iuricode/README-template?style=for-the-badge)

<div align="center">
<img src="./docs/ollo-logo.jpg" width="450px;" height="400px">
</div>

> API que controla todas as features da OLLO.li, **essa API não contempla o MVP**

### Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [x] Tarefa 1
- [x] Tarefa 2
- [x] Tarefa 3
- [ ] Tarefa 4
- [ ] Tarefa 5

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Ter instalado a versão mais recente de `node`, atualmente recomendamos `>=18.12.0 <=20.9.0`
- Ter o `npm` que acompanha a versão do `node` instalada no seu computador
- Ter o Docker instalado na máquina
- Ler esse README

## 🚀 Instalando OLLO.li API

Para instalar o **OLLO.li API**, siga estas etapas:

```
npm run docker
```

Pronto, seus containers já estarão criados e as dependências instaladas

## ☕ Usando OLLO.li API

Para usar **OLLO.li API**, siga estas etapas:

```
npm run dev
```

## 💽 Lidando com o Banco de dados

> Usamos o Prisma como ORM

Para criar uma nova Migration

```
npm run prisma:newMigration MIGRATION_NAME
```

> Substitua o `MIGRATION_NAME` pelo nome que desejar

Para abrir o Prisma Studio

```
npm run prisma:studio
```

## 🗂️ Para criar um novo módulo

Temos um script que faz a criação automática do novo módulo

```
npm run new:module MODULE_NAME
```

> Substitua o `MODULE_NAME` pelo nome do módulo

## 🤝 Colaboradores

Agradecemos às seguintes pessoas que contribuíram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/6963242?s=400&u=270414c180ec18e159a1c57f870880f5fbda2e3f&v=4" width="100px;" alt=""/><br>
        <sub>
          <b>Romulo Assis</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
