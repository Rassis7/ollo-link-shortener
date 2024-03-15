#!/bin/bash

if [ -z "$1" ]; then
  echo "Por favor, forneça um nome para o módulo."
  exit 1
fi

MODULE_NAME=$1

mkdir -p src/modules/$MODULE_NAME
cd $MODULE_NAME

declare -a types=("controller" "service" "schema")

for type in "${types[@]}"; do
  mkdir -p src/modules/$MODULE_NAME/${type}s
  touch src/modules/${MODULE_NAME}/${type}s/${MODULE_NAME}.${type}.ts
  echo "export * from \"./${MODULE_NAME}.${type}\";" >> src/modules/${MODULE_NAME}/${type}s/index.ts
done

echo "Estrutura criada para o módulo: $MODULE_NAME"