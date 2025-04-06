import { useState, useCallback } from 'react';

import { generateZKProof } from '../services/zkService';
import type { ProofOutput, ZKVerificationResult } from '../types/zk';

export const useZKProof = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProofOutput | null>(null);

  const generateProof = useCallback(async (
    secretInput: string,
    storedHash: bigint
  ): Promise<ZKVerificationResult> => {
    try {
      setIsLoading(true);
      setError(null);

      const proofData = await generateZKProof(secretInput, storedHash);
      setResult(proofData);

      return {
        isValid: proofData.publicSignals[0] === '1',
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar prova';
      setError(errorMessage);
      return {
        isValid: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateProof,
    isLoading,
    error,
    result,
  };
}; 