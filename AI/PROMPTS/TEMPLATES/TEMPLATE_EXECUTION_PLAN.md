# Execution Plan Template (IA)

Estrutura reutilizável para que agentes planejem tarefas complexas mantendo disciplina TDD (`✅ Test Fails → ✅ Code → ✅ Green`) e rastreabilidade. Substitua cada campo `<placeholder>` antes de iniciar a execução.

## Contexto Rápido
- **Objetivo**: `<descrição do resultado esperado>`
- **Escopo**: `<componentes/serviços tocados>`
- **Restrições**: `<tempo, dependências, padrões>`
- **Definição de Pronto**: `<métricas de sucesso, cobertura, validações>`

## Estágios Sequenciais
> Defina estágios granulares e ordenados. Cada estágio deve ser independente e concluído antes do próximo.

### Stage `<n>` – `<nome da entrega>`
- [ ] ✅ **Test Fails** — `<quais suites/fixtures precisam falhar primeiro? quais cenários exercitar?>`
- [ ] ✅ **Code** — `<implementação necessária, serviços/rotas/infra tocados>`
- [ ] ✅ **Green** — `<quais testes/comandos precisam passar antes de avançar?>`
- [ ] 📝 **Notas** — `<riscos, dados de seed, migrações, feature flags>`

> Copie o bloco acima para cada estágio adicional (Stage 0, Stage 1, ...), renomeando o título para refletir a entrega incremental (ex.: “Contract Alignment”, “HTTP Flow”, “DX & Docs”).

## Checks Globais
- [ ] 🔁 **Regressão direcionada** — `<rodar suites completas? lint? type-check?>`
- [ ] 📦 **DX/Docs** — `<atualizar READMEs, coleções de API, scripts>`
- [ ] 📊 **Observabilidade** — `<dashboards, métricas, alertas>`
- [ ] ✅ **Entrega** — `<revisar diff, preparar changelog, comunicação ao solicitante>`

## Registro de Execução (preencha durante a execução)
| Estágio | Hora de início | Resultado | Observações |
| ------- | -------------- | --------- | ----------- |
| `<Stage 0>` | `HH:MM` | `<ok/pending>` | `<achados, blockers>` |
| `<Stage 1>` | `HH:MM` | `<ok/pending>` | `<achados, blockers>` |
| ... | ... | ... | ... |

## Playbook de Atualização
1. Valide se o plano ainda é válido antes de executar cada estágio.
2. Atualize checkboxes logo após completar cada passo para manter visibilidade.
3. Registre desvios (ex.: testes adicionais, hotfixes) na seção de notas do estágio correspondente.
4. Ao finalizar, consolide resultados e próximos passos no relatório ao solicitante.
