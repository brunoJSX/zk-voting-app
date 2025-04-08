/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { VotingContract, VerifierContract } from '../types/contracts';
import { NETWORKS, setupBSCTestnet } from '../config/networks';

// Importa os endereços dos contratos
import contractAddresses from '../config/contracts.json';

const VOTING_ADDRESS = contractAddresses.voting;
const VERIFIER_ADDRESS = contractAddresses.verifier;

export function useContract() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [votingContract, setVotingContract] = useState<VotingContract | null>(null);
  const [verifierContract, setVerifierContract] = useState<VerifierContract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<string>('');

  // Verifica se está na rede correta
  const checkAndSwitchNetwork = useCallback(async () => {
    if (!window.ethereum) return false;

    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChainId !== NETWORKS.BSC_TESTNET.chainId) {
      try {
        // Tenta mudar para a BSC Testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: NETWORKS.BSC_TESTNET.chainId }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          // Se a rede não existe, adiciona
          await setupBSCTestnet();
        } else {
          throw error;
        }
      }
    }
    return true;
  }, []);

  // Conecta à carteira
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      console.error('MetaMask não encontrada');
      return;
    }

    try {
      // Verifica e troca a rede se necessário
      const networkOk = await checkAndSwitchNetwork();
      if (!networkOk) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      // Instancia os contratos
      const votingContract = new ethers.Contract(
        VOTING_ADDRESS,
        [
          'event VoterRemoved(address voter)',
          'function storedHashes(address) view returns (uint256)',
          'function hasVoted(address) view returns (bool)',
          'function yesVotes() view returns (uint256)',
          'function noVotes() view returns (uint256)',
          'function voterChoice(address) view returns (uint8)',
          'function verifier() view returns (address)',
          'function registerVoter(address _voter, uint256 _storedHash) external',
          'function vote(uint8 _vote, uint[2] a, uint[2][2] b, uint[2] c, uint[2] publicSignals) external',
          'function getResults() view returns (uint256 yes, uint256 no)',
          'function unregisterCurrentVoter() external'
        ],
        signer
      ) as unknown as VotingContract;

      const verifierContract = new ethers.Contract(
        VERIFIER_ADDRESS,
        [
          'function verifyProof(uint[2] _pA, uint[2][2] _pB, uint[2] _pC, uint[2] _pubSignals) public view returns (bool)'
        ],
        signer
      ) as unknown as VerifierContract;

      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setChainId(chainId);
      setVotingContract(votingContract);
      setVerifierContract(verifierContract);
      setIsConnected(true);
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  }, [checkAndSwitchNetwork]);

  // Monitora mudanças na carteira
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        connect();
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, [connect]);

  return {
    provider,
    signer,
    votingContract,
    verifierContract,
    account,
    chainId,
    isConnected,
    connect
  };
} 