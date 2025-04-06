#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "🔨 Compilando circuito..."

# Cria diretório build se não existir
mkdir -p build

# Compila o circuito
circom circuits/identityProof.circom --r1cs --wasm --sym -o build -l node_modules

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Circuito compilado com sucesso!${NC}"
    
    # Copia arquivo wasm para o frontend
    echo "📂 Copiando arquivo wasm para o frontend..."
    cp build/identityProof_js/identityProof.wasm frontend/public/
    
    echo -e "${GREEN}✅ Arquivo wasm copiado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao compilar circuito${NC}"
    exit 1
fi 