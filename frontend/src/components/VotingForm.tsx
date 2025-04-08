import { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useZKProof } from '../hooks/useZKProof';
import { VoteOption } from '../types/contracts';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export function VotingForm() {
  const [biometricInput, setBiometricInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<VoteOption>(VoteOption.None);
  const [isVoting, setIsVoting] = useState(false);
  const [results, setResults] = useState<{ yes: bigint; no: bigint } | null>(null);
  
  const { votingContract, account, isConnected, connect } = useContract();
  const { generateProof, isGenerating } = useZKProof();

  const handleVote = async () => {
    if (!votingContract || !account || !biometricInput || selectedOption === VoteOption.None) return;

    try {
      setIsVoting(true);
      
      // Busca o hash armazenado
      const storedHash = await votingContract.storedHashes(account);
      
      // Gera a prova
      const proof = await generateProof(biometricInput, storedHash);
      if (!proof) throw new Error('Falha ao gerar prova');

      console.log('Dados sendo enviados para o contrato:', {
        selectedOption,
        a: proof.a.map(String),
        b: proof.b.map(row => row.map(String)),
        c: proof.c.map(String),
        publicSignals: proof.publicSignals.map(String)
      });

      // Usa os valores diretamente da prova
      await votingContract.vote(
        selectedOption,
        proof.a,
        proof.b,
        proof.c,
        proof.publicSignals
      );

      // Atualiza resultados
      const [yes, no] = await votingContract.getResults();
      setResults({ yes, no });
      setBiometricInput('');
      setSelectedOption(VoteOption.None);
    } catch (error) {
      console.error('Erro ao votar:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleUnregister = async () => {
    if (!votingContract || !account) return;

    try {
      await votingContract.unregisterCurrentVoter();
      // Atualiza resultados após remover
      const [yes, no] = await votingContract.getResults();
      setResults({ yes, no });
      // Limpa o estado
      setBiometricInput('');
      setSelectedOption(VoteOption.None);
    } catch (error) {
      console.error('Erro ao remover registro:', error);
    }
  };

  const fetchResults = async () => {
    if (!votingContract) return;
    const [yes, no] = await votingContract.getResults();
    setResults({ yes, no });

    const storedHash = await votingContract.storedHashes(account);
    console.log("Hash armazenado:", storedHash);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Votação
      </h2>

      {!isConnected ? (
        <button
          onClick={connect}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Conectar Carteira
        </button>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Dados Biométricos
            </label>
            <input
              type="password"
              value={biometricInput}
              onChange={(e) => setBiometricInput(e.target.value)}
              placeholder="Digite seus dados biométricos"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Seu Voto
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedOption(VoteOption.Yes)}
                className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                  selectedOption === VoteOption.Yes
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <CheckCircleIcon className="h-5 w-5" />
                Sim
              </button>
              <button
                onClick={() => setSelectedOption(VoteOption.No)}
                className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
                  selectedOption === VoteOption.No
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <XCircleIcon className="h-5 w-5" />
                Não
              </button>
            </div>
          </div>

          <button
            onClick={handleVote}
            disabled={isVoting || isGenerating || !biometricInput || selectedOption === VoteOption.None}
            className={`w-full py-2 px-4 rounded-md transition-colors mb-4 ${
              isVoting || isGenerating || !biometricInput || selectedOption === VoteOption.None
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isVoting || isGenerating ? 'Processando...' : 'Votar'}
          </button>

          <button
            onClick={fetchResults}
            className="w-full py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors mb-4"
          >
            Atualizar Resultados
          </button>

          <button
            onClick={handleUnregister}
            className="w-full py-2 px-4 rounded-md bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
          >
            Remover Meu Registro
          </button>

          {results && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Resultados
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-100 p-3 rounded-md">
                  <p className="text-green-800 font-bold">{results.yes.toString()}</p>
                  <p className="text-sm text-green-600">Sim</p>
                </div>
                <div className="bg-red-100 p-3 rounded-md">
                  <p className="text-red-800 font-bold">{results.no.toString()}</p>
                  <p className="text-sm text-red-600">Não</p>
                </div>
              </div>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-600 text-center">
            Carteira conectada: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        </>
      )}
    </div>
  );
} 