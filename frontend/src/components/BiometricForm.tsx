import { useState, useEffect } from 'react';

import { generatePoseidonHash } from '../utils/zk/hashUtils';
import { useZKProof } from '../hooks/useZKProof';
import { TEST_VALUES } from '../constants/zkPaths';

export const BiometricForm = () => {
  const [secret, setSecret] = useState("");
  const [storedHash, setStoredHash] = useState<bigint | null>(null);
  const { generateProof, isLoading, error, result } = useZKProof();

  // Gera um hash inicial para teste
  useEffect(() => {
    const initializeHash = async () => {
      try {
        const hash = await generatePoseidonHash(TEST_VALUES.DEFAULT_SECRET);
        console.log("Hash inicial gerado:", hash.toString());
        setStoredHash(hash);
      } catch (err) {
        console.error("Erro ao gerar hash inicial:", err);
      }
    };

    initializeHash();
  }, []);

  const handleSubmit = async () => {
    if (!storedHash) {
      console.error("Hash armazenado ainda não foi inicializado.");
      return;
    }

    const proof = await generateProof(secret, storedHash);
    console.log("Prova gerada:", proof);
  };

  return (
    <div className="p-4">
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">Hash Armazenado (para {TEST_VALUES.DEFAULT_SECRET}):</p>
        <p className="font-mono text-xs break-all">{storedHash?.toString() || 'Carregando...'}</p>
      </div>

      <input
        type="text"
        placeholder={`Digite seu segredo (ex: ${TEST_VALUES.DEFAULT_SECRET} para teste)`}
        className="border p-2 rounded w-full mb-2"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />

      <button 
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!secret || !storedHash || isLoading}
      >
        {isLoading ? 'Gerando Prova...' : 'Gerar Prova'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div>
          <h2 className="mt-4 font-bold">Resultado:</h2>
          <pre className="mt-2 bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}; 