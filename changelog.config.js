module.exports = {
  disableEmoji: false,
  format: "{type}{scope}: {emoji}{subject}",
  list: [
    "test",
    "feat",
    "fix",
    "chore",
    "docs",
    "refactor",
    "style",
    "ci",
    "perf",
  ],
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: [
    "type",
    "scope",
    "subject",
    "body",
    "breaking",
    "issues",
    "lerna",
  ],
  scopes: [],
  types: {
    chore: {
      description:
        "Mudanças que afetam o sistema de build ou dependências externas (exemplos de scope: gulp, broccoli, npm)",
      emoji: "🤖",
      value: "chore",
    },
    ci: {
      description:
        "Mudanças em arquivos/scripts da configuração da CI (exemplos de scope: Travis, Circle, BrowserStack, SauceLabs)",
      emoji: "🎡",
      value: "ci",
    },
    docs: {
      description: "Mudanças apenas na documentação",
      emoji: "✏️",
      value: "docs",
    },
    feat: {
      description: "Uma nova funcionalidade",
      emoji: "🎸",
      value: "feat",
    },
    fix: {
      description: "Uma correção de bug",
      emoji: "🐛",
      value: "fix",
    },
    perf: {
      description: "Uma mudança de código que melhora a performance",
      emoji: "⚡️",
      value: "perf",
    },
    refactor: {
      description:
        "Uma mudança de código que nem corrige um bug e nem adiciona uma funcionalidade",
      emoji: "💡",
      value: "refactor",
    },
    release: {
      description: "Crie um commit de release",
      emoji: "🏹",
      value: "release",
    },
    style: {
      description:
        "Mudanças que não afetam a semântica do código (espaços em branco, formatação, pontuação, etc.)",
      emoji: "💄",
      value: "style",
    },
    test: {
      description: "Adição ou correção de testes",
      emoji: "💍",
      value: "test",
    },
    messages: {
      type: "Selecione o tipo de alteração que você está comprometendo:",
      customScope: "Selecione o escopo que este componente afeta:",
      subject:
        "Escreva uma descrição curta e imperativa do humor da mudança:\n",
      body: "Forneça uma descrição mais longa da alteração:\n ",
      break: "Liste quaisquer alterações significativas:\n",
      footer: "Problemas que este commit fecha, por exemplo SWSELOG-XXX:",
      confirmCommit: "Os pacotes que este commit afetou\n",
    },
  },
};
