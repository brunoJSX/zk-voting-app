#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Iniciando setup do ambiente ZKP..."

# Verifica se o diretório build existe
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Diretório build não encontrado. Execute compile-circuits.sh primeiro.${NC}"
    exit 1
fi

# Verifica se o arquivo .r1cs existe
if [ ! -f "build/identityProof.r1cs" ]; then
    echo -e "${RED}❌ Arquivo .r1cs não encontrado. Execute compile-circuits.sh primeiro.${NC}"
    exit 1
fi

cd build

# Verifica se o arquivo pot12_final.ptau existe e é válido
if [ ! -f "pot12_final.ptau" ] || [ $(stat -f%z pot12_final.ptau 2>/dev/null || stat -c%s pot12_final.ptau) -lt 10000000 ]; then
    echo -e "${YELLOW}⚠️  Arquivo pot12_final.ptau não encontrado ou inválido${NC}"
    echo -e "${YELLOW}⚠️  Gerando novo arquivo ptau...${NC}"
    
    cd ..
    # Verifica se o script generate-ptau.sh existe
    if [ ! -f "scripts/generate-ptau.sh" ]; then
        echo -e "${RED}❌ Script generate-ptau.sh não encontrado${NC}"
        exit 1
    fi
    
    # Dá permissão de execução se necessário
    chmod +x scripts/generate-ptau.sh
    
    # Executa o script de geração
    ./scripts/generate-ptau.sh
    
    # Verifica se a geração foi bem sucedida
    if [ ! -f "build/pot12_final.ptau" ]; then
        echo -e "${RED}❌ Falha ao gerar arquivo pot12_final.ptau${NC}"
        exit 1
    fi
    
    cd build
fi

# Fase 1: Setup inicial do .zkey
echo "🔑 Iniciando Phase 1 - Setup inicial do .zkey..."
snarkjs groth16 setup identityProof.r1cs pot12_final.ptau identityProof_0000.zkey

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Setup inicial do .zkey concluído!${NC}"
    
    # Fase 2: Contribuição final
    echo "🔐 Iniciando Phase 2 - Contribuição final..."
    echo "Contribuição automática" | snarkjs zkey contribute identityProof_0000.zkey identityProof.zkey -v
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Contribuição final concluída!${NC}"
        
        # Gera verification_key.json (temporário, usado para gerar o contrato)
        echo "🔍 Gerando chave de verificação..."
        snarkjs zkey export verificationkey identityProof.zkey verification_key.json
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Chave de verificação gerada com sucesso!${NC}"
            
            # Gera o contrato verificador em Solidity
            echo "📝 Gerando contrato verificador..."
            mkdir -p ../contracts
            snarkjs zkey export solidityverifier identityProof.zkey ../contracts/Verifier.sol
            
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Contrato verificador gerado com sucesso!${NC}"
                
                # Copia .zkey para o frontend
                echo "📂 Copiando .zkey para o frontend..."
                cp identityProof.zkey ../frontend/public/
                
                echo -e "${GREEN}✅ Arquivo .zkey copiado com sucesso!${NC}"
                
                # Remove arquivos temporários
                rm verification_key.json identityProof_0000.zkey
            else
                echo -e "${RED}❌ Erro ao gerar contrato verificador${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ Erro ao gerar chave de verificação${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Erro na contribuição final${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Erro no setup inicial do .zkey${NC}"
    exit 1
fi

cd .. 