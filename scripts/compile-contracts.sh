#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔨 Compilando contratos Solidity..."

# Criar diretório build/contracts se não existir
mkdir -p build/contracts

# Compilar contratos
npx solcjs --bin --abi --optimize --base-path . --include-path node_modules/ --output-dir build/contracts contracts/Verifier.sol contracts/Voting.sol

# Verificar se a compilação foi bem sucedida
if [ $? -eq 0 ]; then
    # Criar arquivo JSON para o Verifier
    echo "{" > build/contracts/Verifier.json
    echo "  \"abi\": $(cat build/contracts/contracts_Verifier_sol_Groth16Verifier.abi)," >> build/contracts/Verifier.json
    echo "  \"bytecode\": \"0x$(cat build/contracts/contracts_Verifier_sol_Groth16Verifier.bin)\"" >> build/contracts/Verifier.json
    echo "}" >> build/contracts/Verifier.json
    
    # Criar arquivo JSON para o Voting
    echo "{" > build/contracts/Voting.json
    echo "  \"abi\": $(cat build/contracts/contracts_Voting_sol_Voting.abi)," >> build/contracts/Voting.json
    echo "  \"bytecode\": \"0x$(cat build/contracts/contracts_Voting_sol_Voting.bin)\"" >> build/contracts/Voting.json
    echo "}" >> build/contracts/Voting.json
    
    echo -e "${GREEN}✅ Contratos compilados com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao compilar contratos${NC}"
    exit 1
fi 