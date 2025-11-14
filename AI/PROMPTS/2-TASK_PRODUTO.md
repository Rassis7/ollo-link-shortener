# Demanda de Produto – Rota de Redirecionamento de Links

Queremos fechar o ciclo do nosso encurtador de links: hoje já é possível gerar um link curto, mas ainda não existe uma rota pública padrão para quando alguém clica nesse link.

Precisamos de uma rota única que receba o link encurtado e leve a pessoa automaticamente para a URL original, ou avise claramente quando o link não existir.

## O que esperamos ter ao final:

- Um endereço público no formato https://NOSSO_DOMINIO/r/{hash} que possa ser usado em campanhas, e-mails, etc.
- Se o hash existir, deve ser redirecionado para a URL original com o status de redirecionamento correto.
- Se o hash não existir, deve receber uma resposta de “não encontrado” (404).
