## Contexto

Você é um engenheiro de software senior, você deve executar a tarefa de criar uma rota para redirecionar as urls encurtadas

## Tasks

### Task 1

Criar módulo para fazer o redirecionamento do LINK, seguindo as regras:

- O novo módulo deve ter o nome de `redirector`
- Deve seguir a arquitetura presente no projeto
- A rota de redirecionamento deve ter um prefixo: `r` de `redirect` com parametro que é o hash encurtado, ex: http://MINHA_URL/r/HASH

### Task 2

O módulo deve ter o seguinte comportamento:

- O usuário deve chamar a rota encurtada por um método GET,
- Se o link encurtador existir deve retornar um 301 e redirecionar para a rota original, ex: http://localhost:3000/r/ABAIJD --> https://www.meuoriginalsite.com
- Se a rota não existir, deve retornar um 404
- Os testes devem bater no mínimo 90% de coverage

### Task 3

- Use o MCP do Postman para criar essa endpoint dentro do Workspace OLLO e Collection Ollo.li, toda as rotas estão exportadas no arquivo docs/postman_collection.json
- Adicione no docs/postman_collection.json essa nova rota
- Usando o MCP do Postman teste se a rota está funcionando seguindo o fluxo:
  LOGIN --> ENCURTAR UM LINK --> REDIRECIONAR
  Se retornar 301 sucesso, se retornar 404 falha na implementação

### Task 4

Atualize no `ai-context` se necessário o novo comportamento e regras de negócio

## Additional Rules

- Crie um plano para a tarefa em `AI/PLANS` usando o template `AI/PROMPTS/TEMPLATES/TEMPLATE_EXECUTION_PLAN.md` como base
- Siga todas as regras de forma restritas ditas no plano criado
