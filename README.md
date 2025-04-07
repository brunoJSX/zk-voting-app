# Zero Knowledge Voting App

## 📌 Sumário
- [🚀 Funcionalidades](#-funcionalidades)
- [📋 Pré-requisitos](#-pré-requisitos)
- [🔧 Instalação](#-instalação)
- [🏗️ Compilação e Deploy](#-compilação-e-deploy)
- [📝 Contratos Deployados](#-contratos-deployados)
- [🎯 Como Usar](#-como-usar)
- [🔒 Segurança](#-segurança)
- [📚 Tecnologias](#-tecnologias)
- [📄 Licença](#-licença)

Aplicação de votação com privacidade usando Zero Knowledge Proofs (ZKP) na BNB Smart Chain.

## 🚀 Funcionalidades

- Votação anônima usando ZKP
- Verificação de identidade sem revelar dados pessoais
- Interface web amigável
- Contratos inteligentes na BSC Testnet

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Git

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/brunoJSX/zk-voting-app.git
cd zk-voting-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com:
- `RPC_URL`: URL do RPC da BSC Testnet
- `PRIVATE_KEY`: Sua chave privada (sem 0x) - **Opcional se apenas usar os contratos existentes**
- `BSCSCAN_API_KEY`: Chave da API do BscScan (opcional)
- `CONTRIBUTION_1`, `CONTRIBUTION_2`, `CONTRIBUTION_3`: Valores aleatórios para o setup ZKP

## 🏗️ Compilação e Deploy

### Opção 1: Usar contratos já deployados
Se você quer apenas usar a aplicação, pode pular esta seção e usar os contratos já deployados na BSC Testnet.

### Opção 2: Fazer deploy dos seus próprios contratos

1. Execute o setup do ambiente ZKP:
```bash
npm run setup:zkp
```

Este comando irá:
- Compilar os circuitos ZK
- Gerar as chaves de prova e verificação
- Configurar o ambiente para gerar provas ZK
- Copiar os arquivos necessários para o frontend

2. Compile os contratos:
```bash
npm run compile:contracts
```

3. Faça o deploy dos contratos:
```bash
npm run deploy
```

**Nota**: O comando `deploy` executará automaticamente o setup ZKP e a compilação dos contratos antes do deploy.

## 📝 Contratos Deployados

Os contratos estão deployados na BSC Testnet:

- **Verifier**: [0x8b0Eb8430EBBc1fb8f91eE962C3d1d4bF6f4F915](https://testnet.bscscan.com/address/0x8b0Eb8430EBBc1fb8f91eE962C3d1d4bF6f4F915)
- **Voting**: [0x98B3aB676130dBaD61A519b3A44640a2E3E2Ccfa](https://testnet.bscscan.com/address/0x98B3aB676130dBaD61A519b3A44640a2E3E2Ccfa)

## 🎯 Como Usar

1. Inicie o frontend:
```bash
cd frontend
npm install
npm run dev
```

2. Acesse a aplicação em `http://localhost:3000`

3. Para votar:
   - Gere sua prova ZK
   - Conecte sua carteira
   - Vote usando a prova gerada

## 🔒 Segurança

- As provas ZK garantem que você é elegível para votar sem revelar sua identidade
- Os votos são registrados na blockchain de forma anônima
- Apenas o hash da sua identidade é armazenado

## 📚 Tecnologias

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: BNB Smart Chain, Solidity
- **ZKP**: Circom, SnarkJS
- [Ethers.js](https://docs.ethers.io/v5/) - Biblioteca JavaScript para interagir com a blockchain

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 