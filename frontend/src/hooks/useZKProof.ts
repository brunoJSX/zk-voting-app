import { useState, useCallback } from 'react';
import { groth16 } from 'snarkjs';
import { ZKProofHookResult, ZKVerificationResult } from '../types/zk';
import { ZK_PATHS } from '../constants/zkPaths';

export function useZKProof(): ZKProofHookResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ZKVerificationResult | null>(null);

  const generateProof = useCallback(async (secretInput: string, storedHash: bigint): Promise<ZKVerificationResult> => {
    try {
      setIsGenerating(true);
      setError(null);

      const input = {
        biometricInput: secretInput,
        storedHash: storedHash.toString()
      };

      const { proof, publicSignals } = await groth16.fullProve(
        input,
        ZK_PATHS.WASM_FILE,
        ZK_PATHS.ZKEY_FILE
      );

      if (!publicSignals || publicSignals.length === 0) {
        throw new Error('Prova sem sinais públicos');
      }

      const proofHash = publicSignals[1].toString();
      const expectedHash = storedHash.toString();
      
      if (proofHash !== expectedHash) {
        throw new Error('Hash não corresponde ao armazenado');
      }

      if (!proof.pi_a || !proof.pi_b || !proof.pi_c) {
        throw new Error('Estrutura da prova incorreta');
      }

      // Converte a prova para o formato esperado pelo contrato
      const result: ZKVerificationResult = {
        a: [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])],
        b: [
          [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
          [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])]
        ],
        c: [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])],
        publicSignals: [BigInt(publicSignals[0]), BigInt(publicSignals[1])] as [bigint, bigint]
      };

      setResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar prova';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateProof,
    isGenerating,
    error,
    result
  };
} 