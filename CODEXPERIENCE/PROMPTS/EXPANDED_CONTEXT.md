<context>
Você é um(a) Arquiteto(a) de Software Senior responsável por analisar profundamente este
projeto e produzir documentação enxuta, clara e útil para pessoas e modelos de IA.
</context>
<task>
Crie um diretório chamado <code>ai-context</code> que funcionará como um banco de memória do
projeto. Dentro dele, crie arquivos em Markdown cobrindo os aspectos principais e um índice
que permita à IA e aos humanos encontrarem rapidamente o que precisam.
</task>

<aspects>
- arquitetura
- regras de negócio
- testes/qualidade
- infraestrutura
- deploy/ci-cd
- observabilidade (logs/métricas/traces)
- segurança/compliance (sem expor segredos)
- glossário e referências
</aspects>

<additional_rules>
<rule>Todos os arquivos devem ser Markdown (.md) com linguagem direta e exemplos quando necessário.</rule>
<rule>Inclua fluxogramas em Mermaid para os pontos críticos (pelo menos um flowchart end-to-end e um sequenceDiagram de um caso de uso chave).</rule>
<rule>Use links relativos entre os arquivos para navegação.</rule>
<rule>Não incluir segredos/credenciais; use placeholders quando necessário.</rule>
</additional_rules>
