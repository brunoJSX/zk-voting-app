import { useState } from 'react';
import { generatePoseidonHash } from '../utils/zk/hashUtils';
import { useContract } from '../hooks/useContract';
import { FingerPrintIcon } from '@heroicons/react/24/outline';

export function BiometricRegistration() {
  const [biometricInput, setBiometricInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { votingContract, account, isConnected, connect } = useContract();

  const handleRegister = async () => {
    if (!votingContract || !account || !biometricInput) return;

    try {
      setIsRegistering(true);
      const hash = await generatePoseidonHash(biometricInput);
      await votingContract.registerVoter(account, hash);
      setBiometricInput('');
    } catch (error) {
      console.error('Erro ao registrar:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 p-6">
      <div className="flex items-center justify-center mb-6">
        <FingerPrintIcon className="h-12 w-12 text-indigo-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Registro Biométrico
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

          <button
            onClick={handleRegister}
            disabled={isRegistering || !biometricInput}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              isRegistering || !biometricInput
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isRegistering ? 'Registrando...' : 'Registrar'}
          </button>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Carteira conectada: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        </>
      )}
    </div>
  );
} 