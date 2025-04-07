import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function main() {
  // Configuração do provider e wallet
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  
  console.log('Deploying contracts with account:', wallet.address);

  // Deploy do Verifier
  console.log('\nDeploying Verifier...');
  const verifierArtifact = require('../build/contracts/Verifier.json');
  const verifierFactory = new ethers.ContractFactory(verifierArtifact.abi, verifierArtifact.bytecode, wallet);
  const verifier = await verifierFactory.deploy();
  await verifier.waitForDeployment();
  console.log('Verifier deployed to:', await verifier.getAddress());

  // Deploy do Voting
  console.log('\nDeploying Voting...');
  const votingArtifact = require('../build/contracts/Voting.json');
  const votingFactory = new ethers.ContractFactory(votingArtifact.abi, votingArtifact.bytecode, wallet);
  const voting = await votingFactory.deploy(await verifier.getAddress());
  await voting.waitForDeployment();
  console.log('Voting deployed to:', await voting.getAddress());

  // Salva os endereços em um arquivo
  const addresses = {
    verifier: await verifier.getAddress(),
    voting: await voting.getAddress()
  };

  const configDir = path.join(__dirname, '..', 'frontend', 'src', 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(configDir, 'contracts.json'),
    JSON.stringify(addresses, null, 2)
  );

  console.log('\nContract addresses saved to frontend/src/config/contracts.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 