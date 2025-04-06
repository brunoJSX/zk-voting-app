# ZK Voting App

Aplicação de votação utilizando Zero Knowledge Proofs (ZKP) para verificação biométrica segura.

## 🚀 Tecnologias

- [Circom](https://docs.circom.io/) - Linguagem para circuitos ZKP
- [SnarkJS](https://github.com/iden3/snarkjs) - Biblioteca JavaScript para ZKP
- [React](https://reactjs.org/) - Framework frontend
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript tipado
- [Vite](https://vitejs.dev/) - Build tool e dev server

## 📁 Estrutura do Projeto

```
zk-voting-app/
├── circuits/          # Circuitos Circom
├── build/            # Arquivos compilados
├── scripts/          # Scripts de automação
└── frontend/         # Aplicação React
```

## 🛠️ Setup do Projeto

1. Instale as dependências:
```bash
# Na raiz do projeto
npm install

# No diretório frontend
cd frontend
npm install
```

2. Compile os circuitos:
```bash
chmod +x scripts/compile-circuits.sh
./scripts/compile-circuits.sh
```

3. Execute o setup ZKP:
```bash
chmod +x scripts/setup-zkp.sh
./scripts/setup-zkp.sh
```

4. Inicie o frontend:
```bash
cd frontend
npm run dev
```

## 🔒 Como Funciona

1. O usuário fornece dados biométricos
2. Os dados são hasheados usando Poseidon
3. O circuito ZKP verifica a correspondência do hash
4. Uma prova é gerada e verificada
5. O resultado da verificação é exibido

## 📝 Licença

Este projeto está sob a licença MIT. 