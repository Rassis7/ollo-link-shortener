#!/bin/bash

# Verifica se foi fornecido um nome para o módulo
if [ -z "$1" ]; then
  echo "Por favor, forneça um nome para o módulo."
  exit 1
fi

MODULE_NAME=$1

# Cria a estrutura de pastas
mkdir -p src/modules/$MODULE_NAME
cd $MODULE_NAME

# Cria os arquivos
touch src/modules/${MODULE_NAME}/${MODULE_NAME}.controller.ts
touch src/modules/${MODULE_NAME}/${MODULE_NAME}.schema.ts
touch src/modules/${MODULE_NAME}/${MODULE_NAME}.service.ts
touch src/modules/${MODULE_NAME}/${MODULE_NAME}.route.ts

# Imprime a mensagem de sucesso
echo "Estrutura criada para o módulo: $MODULE_NAME"