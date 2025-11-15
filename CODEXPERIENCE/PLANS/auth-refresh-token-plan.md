# Execution Plan Template (IA)

Estrutura reutilizável para que agentes planejem tarefas complexas mantendo disciplina TDD (`✅ Test Fails → ✅ Code → ✅ Green`) e rastreabilidade. Substitua cada campo `<placeholder>` antes de iniciar a execução.

## Contexto Rápido
- **Objetivo**: Eliminar a flacidez do teste `Should be able to generate new refresh token`, garantindo que a rota `POST /api/auth/refreshToken` valide rotação de tokens sem depender de strings estáticas.
- **Escopo**: `src/modules/auth/__tests__/authorization-integration.test.ts`, possíveis ajustes utilitários em `src/tests/jwt.ts` ou helpers de parsing de cookies.
- **Restrições**: Manter comportamento atual da rota (sempre gerar novos tokens), obedecer 80% de cobertura global e não introduzir dependências extras.
- **Definição de Pronto**: Teste de integração atualizado passa de forma determinística (`npm run test -- src/modules/auth/__tests__/authorization-integration.test.ts`), cookies continuam com os flags (`httpOnly`, `sameSite`, `domain`) exigidos e `npm run test` segue verde localmente.

## Estágios Sequenciais
> Defina estágios granulares e ordenados. Cada estágio deve ser independente e concluído antes do próximo.

### Stage 0 – Diagnóstico determinístico
- [ ] ✅ **Test Fails** — Forçar diferença de timestamp (`jest.useFakeTimers().setSystemTime(Date.now() + 2000)`) e rodar `npm run test -- src/modules/auth/__tests__/authorization-integration.test.ts -t "Should be able to generate new refresh token"` para observar o diff entre o cookie esperado (`mockAccessToken`) e o token recém-gerado.
- [ ] ✅ **Code** — Instrumentar temporariamente o teste para logar `response.cookies` e confirmar que os valores variam por conta do `iat` do `fast-jwt`; remover logs após coletar evidências.
- [ ] ✅ **Green** — Nenhum (fase apenas de investigação); registrar achados no relatório/PR.
- [ ] 📝 **Notas** — Atenção ao mock global de Date para não impactar outros testes; encapsular dentro do `it` e restaurar no `finally`.

### Stage 1 – Ajustar especificação do refresh
- [ ] ✅ **Test Fails** — Atualizar o teste para validar sem acoplar ao token string: comparar payload via `app.jwt.accessToken.verify`/`refreshToken.verify`, conferir flags (`httpOnly`, `maxAge`, `sameSite`) e, opcionalmente, garantir que novos valores `!==` cookies antigos. Rodar o mesmo comando para ver o teste falhar antes do código.
- [ ] ✅ **Code** — Refatorar asserções para: (1) localizar cookies por `name`, (2) decodificar tokens e comparar `id`, `name`, `accountConfirmed`, (3) verificar que `refresh_token` continua `httpOnly` + `maxAge` e (4) remover dependência de `mockAccessToken`/`mockRefreshToken` na expectativa direta.
- [ ] ✅ **Green** — Executar `npm run test -- src/modules/auth/__tests__/authorization-integration.test.ts` e confirmar que todo o arquivo fica verde; caso mexa em helpers, rodar também `npm run test -- src/modules/auth/__tests__/auth-integration.test.ts`.
- [ ] 📝 **Notas** — Considerar criar helper de parsing de cookies se repetirmos lógica; manter o teste organizado para futura extensão (ex.: validação de `accountConfirmed` falso).

### Stage 2 – Regressão e comunicação
- [ ] ✅ **Test Fails** — Não aplicável (fase de validação final).
- [ ] ✅ **Code** — Revisar se outros testes dependem de `mockAccessToken`/`mockRefreshToken` em expectativas absolutas; atualizar README/ai-context se necessário para reforçar política de rotação.
- [ ] ✅ **Green** — `npm run test` completo (ou pelo menos módulos de auth) para garantir que cobertura mínima continua atendida após mexer nos testes.
- [ ] 📝 **Notas** — Registrar na descrição do PR que o fix é apenas na suíte de integração e anexar diff do erro original para contexto histórico.

## Checks Globais
- [ ] 🔁 **Regressão direcionada** — Executar `npm run test -- src/modules/auth/__tests__` inteiro após ajustes.
- [ ] 📦 **DX/Docs** — Atualizar `ai-context/seguranca-compliance.md` somente se flags de cookie mudarem (não previsto).
- [ ] 📊 **Observabilidade** — Sem impactos (endpoint apenas de autenticação).
- [ ] ✅ **Entrega** — Preparar nota no PR destacando causa raiz (iat variável) e como o novo teste cobre o cenário.

## Registro de Execução (preencha durante a execução)
| Estágio | Hora de início | Resultado | Observações |
| ------- | -------------- | --------- | ----------- |
| `Stage 0 – Diagnóstico determinístico` | `HH:MM` | `<ok/pending>` | `<achados, blockers>` |
| `Stage 1 – Ajustar especificação do refresh` | `HH:MM` | `<ok/pending>` | `<achados, blockers>` |
| `Stage 2 – Regressão e comunicação` | `HH:MM` | `<ok/pending>` | `<achados, blockers>` |

## Playbook de Atualização
1. Valide se o plano ainda é válido antes de executar cada estágio.
2. Atualize checkboxes logo após completar cada passo para manter visibilidade.
3. Registre desvios (ex.: testes adicionais, hotfixes) na seção de notas do estágio correspondente.
4. Ao finalizar, consolide resultados e próximos passos no relatório ao solicitante.
