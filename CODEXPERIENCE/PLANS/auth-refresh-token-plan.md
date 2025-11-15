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
- [x] ✅ **Test Fails** — Mockei `Date.now()` (+2s) e rodei `npm run test -- src/modules/auth/__tests__/authorization-integration.test.ts -t "Should be able to generate new refresh token"` para forçar divergência entre cookies esperados e tokens emitidos.
- [x] ✅ **Code** — Adicionei log temporário de `response.cookies` no teste para capturar o payload completo e validar que a variação vinha do `iat` do `fast-jwt`.
- [x] ✅ **Green** — Sem ação (fase investigativa); achados registrados no relatório final.
- [x] 📝 **Notas** — Evitei `useFakeTimers` (quebrava o hook) e usei `jest.spyOn(Date, "now")` com `mockRestore()` para isolar o efeito no próprio `it`.

### Stage 1 – Ajustar especificação do refresh
- [x] ✅ **Test Fails** — Novo teste atualizado para verificar payload/flags; a rota já atendia as asserções reforçadas, então não houve falha após a refatoração.
- [x] ✅ **Code** — Refatorei o teste para buscar cookies por `name`, validar flags (`sameSite`, `httpOnly`, `maxAge`) e decodificar os tokens via `app.jwt.*.verify`, eliminando dependência das strings mockadas.
- [x] ✅ **Green** — `npm run test -- src/modules/auth/__tests__/authorization-integration.test.ts` confirma o arquivo todo em verde com cobertura preservada.
- [x] 📝 **Notas** — Mantive a lógica inline (sem helper dedicado) porque só este caso faz parsing completo; fácil extrair no futuro se repetirmos.

### Stage 2 – Regressão e comunicação
- [x] ✅ **Test Fails** — Não aplicável (validação final apenas somou regressão direcionada).
- [x] ✅ **Code** — Revisei os demais testes de auth; nenhum outro dependia de comparação direta com `mockAccessToken`/`mockRefreshToken`, então não houve necessidade de docs extras.
- [x] ✅ **Green** — `npm run test -- src/modules/auth/__tests__` executado para cobrir toda a suíte de autenticação.
- [x] 📝 **Notas** — Recomendado citar no PR a causa raiz (`iat` variável) + screenshot do diff do teste falhando após forçar `Date.now()`.

## Checks Globais
- [x] 🔁 **Regressão direcionada** — `npm run test -- src/modules/auth/__tests__` rodado com sucesso pós-refatoração.
- [x] 📦 **DX/Docs** — Sem alteração de flags; nenhum doc precisava ser tocado.
- [x] 📊 **Observabilidade** — Nenhum efeito em métricas/logs, somente cobertura de teste.
- [x] ✅ **Entrega** — Nota para PR preparada destacando o `iat` variável e a nova estratégia de asserção.

## Registro de Execução (preencha durante a execução)
| Estágio | Hora de início | Resultado | Observações |
| ------- | -------------- | --------- | ----------- |
| `Stage 0 – Diagnóstico determinístico` | `20:05` | `ok` | `Teste falhou ao mockar Date.now(); cookies mostraram novos JWTs com iat diferente.` |
| `Stage 1 – Ajustar especificação do refresh` | `20:12` | `ok` | `Teste atualizado para validar payload + flags; backend já atendia requisitos.` |
| `Stage 2 – Regressão e comunicação` | `20:25` | `ok` | `Suíte completa de auth executada; sem dependências extras em mocks.` |

## Playbook de Atualização
1. Valide se o plano ainda é válido antes de executar cada estágio.
2. Atualize checkboxes logo após completar cada passo para manter visibilidade.
3. Registre desvios (ex.: testes adicionais, hotfixes) na seção de notas do estágio correspondente.
4. Ao finalizar, consolide resultados e próximos passos no relatório ao solicitante.
