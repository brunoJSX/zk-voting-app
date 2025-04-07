#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Carrega variáveis do .env
if [ -f ".env" ]; then
    echo -e "${BLUE}📝 Carregando variáveis do .env...${NC}"
    set -a
    source .env
    set +a
else
    echo -e "${RED}❌ Arquivo .env não encontrado${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Iniciando geração do arquivo ptau...${NC}"

# Cria diretório build se não existir
mkdir -p build
cd build

# Fase 1: Gera o arquivo inicial
echo -e "\n${YELLOW}📝 Fase 1: Gerando arquivo inicial...${NC}"
snarkjs ptn bn128 12 pot12_0000.ptau

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao gerar arquivo inicial${NC}"
    exit 1
fi

# Função para contribuição
contribute() {
    local input_file=$1
    local output_file=$2
    local num=$3
    
    echo -e "\n${YELLOW}🔐 Contribuição $num${NC}"
    
    # Verifica se a variável de ambiente existe
    local env_var="CONTRIBUTION_${num}"
    if [ -z "${!env_var}" ]; then
        echo -e "${RED}❌ Erro: Variável de ambiente CONTRIBUTION_${num} não definida${NC}"
        echo -e "${BLUE}Por favor, defina a variável de ambiente antes de executar o script:${NC}"
        echo -e "${YELLOW}export CONTRIBUTION_${num}=seu_valor_aleatorio${NC}"
        exit 1
    fi
    
    echo "Contribuição $num - $(date) - ${!env_var}" | \
    snarkjs ptc $input_file $output_file \
    --name="Contribuição $num" -v
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro na contribuição $num${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Contribuição $num aplicada com sucesso!${NC}"
}

# Contribuições
contribute "pot12_0000.ptau" "pot12_0001.ptau" "1"
contribute "pot12_0001.ptau" "pot12_0002.ptau" "2"
contribute "pot12_0002.ptau" "pot12_0003.ptau" "3"

# Verifica o protocolo
echo -e "\n${YELLOW}🔍 Verificando o protocolo...${NC}"
snarkjs ptv pot12_0003.ptau

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro na verificação${NC}"
    exit 1
fi

# Aplica um beacon aleatório
echo -e "\n${YELLOW}✨ Aplicando beacon aleatório...${NC}"
# Gera um hash aleatório usando data e as contribuições anteriores
random_hex=$(echo "$(date) $(cat pot12_0003.ptau | head -c 100)" | sha256sum | cut -d' ' -f1)
snarkjs ptb pot12_0003.ptau pot12_beacon.ptau $random_hex 10 -n="Beacon final"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao aplicar beacon${NC}"
    exit 1
fi

# Prepara fase 2
echo -e "\n${YELLOW}🎯 Preparando fase 2...${NC}"
snarkjs pt2 pot12_beacon.ptau pot12_final.ptau -v

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao preparar fase 2${NC}"
    exit 1
fi

# Verifica o arquivo final
if [ -f "pot12_final.ptau" ]; then
    echo -e "\n${GREEN}✅ Arquivo pot12_final.ptau gerado com sucesso!${NC}"
    
    # Mostra o tamanho do arquivo
    size=$(ls -lh pot12_final.ptau | awk '{print $5}')
    echo -e "${BLUE}📦 Tamanho do arquivo: $size${NC}"
    
    # Remove arquivos temporários
    echo -e "\n${YELLOW}🧹 Removendo arquivos temporários...${NC}"
    rm pot12_0000.ptau pot12_0001.ptau pot12_0002.ptau pot12_0003.ptau pot12_beacon.ptau
    echo -e "${GREEN}✅ Limpeza concluída${NC}"
else
    echo -e "${RED}❌ Erro ao gerar arquivo pot12_final.ptau${NC}"
    exit 1
fi

cd ..

echo -e "\n${GREEN}✨ Processo concluído com sucesso!${NC}"
echo -e "${BLUE}📍 O arquivo pot12_final.ptau está na pasta build/${NC}" 