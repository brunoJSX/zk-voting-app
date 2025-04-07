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

      // Debug: mostra os inputs
      console.log('🔍 Inputs:', {
        secretInput,
        storedHash: storedHash.toString()
      });

      // Prepara os inputs para o circuito
      // Importante: storedHash precisa ser passado como string para manter a precisão
      const input = {
        biometricInput: secretInput,
        storedHash: storedHash.toString()
      };

      // Debug: mostra os arquivos que serão usados
      console.log('📁 Arquivos:', {
        wasm: ZK_PATHS.WASM_FILE,
        zkey: ZK_PATHS.ZKEY_FILE
      });

      // Gera a prova
      console.log('⏳ Gerando prova...');
      const { proof, publicSignals } = await groth16.fullProve(
        input,
        ZK_PATHS.WASM_FILE,
        ZK_PATHS.ZKEY_FILE
      );

      // Debug detalhado da prova
      console.log('🔍 Prova detalhada:');
      console.log('pi_a:', proof.pi_a);
      console.log('pi_b:', JSON.stringify(proof.pi_b, null, 2));
      console.log('pi_c:', proof.pi_c);
      console.log('publicSignals:', publicSignals);

      // Verifica a prova
      console.log('🔎 Verificando prova...');

      // 1. Verifica se temos sinais públicos
      if (!publicSignals || publicSignals.length === 0) {
        console.log('❌ PROVA INVÁLIDA: Sem sinais públicos!');
        throw new Error('Prova sem sinais públicos');
      }

      // 2. Verifica se os sinais públicos batem com o hash armazenado
      // Importante: Converter ambos para string para comparação precisa
      const proofHash = publicSignals[1].toString();
      console.log('Hash da prova:', publicSignals);
      const expectedHash = storedHash.toString();
      
      console.log('Comparando hashes:', {
        proofHash,
        expectedHash,
        são_iguais: proofHash === expectedHash
      });

      if (proofHash !== expectedHash) {
        console.log('❌ PROVA INVÁLIDA: Hash não corresponde!');
        console.log('Hash esperado:', expectedHash);
        console.log('Hash na prova:', proofHash);
        throw new Error('Hash não corresponde ao armazenado');
      }

      // 3. Verifica se a estrutura da prova está correta
      if (!proof.pi_a || !proof.pi_b || !proof.pi_c) {
        console.log('❌ PROVA INVÁLIDA: Estrutura incorreta!');
        throw new Error('Estrutura da prova incorreta');
      }

      console.log('✅ PROVA VÁLIDA!');
      console.log('Hash verificado:', proofHash);

      // Converte a prova para o formato esperado pelo contrato
      const result: ZKVerificationResult = {
        a: [proof.pi_a[0].toString(), proof.pi_a[1].toString()] as [string, string],
        b: [
          // Inverte as colunas da matriz b
          [proof.pi_b[0][1].toString(), proof.pi_b[0][0].toString()] as [string, string],
          [proof.pi_b[1][1].toString(), proof.pi_b[1][0].toString()] as [string, string]
        ],
        c: [proof.pi_c[0].toString(), proof.pi_c[1].toString()] as [string, string],
        publicSignals: [publicSignals[0].toString(), publicSignals[1].toString()] as [string, string]
      };

      // Debug do resultado formatado
      console.log('🔍 Resultado formatado:');
      console.log('a:', result.a);
      console.log('b:', JSON.stringify(result.b, null, 2));
      console.log('c:', result.c);
      console.log('publicSignals:', result.publicSignals);

      setResult(result);
      return result;
    } catch (err) {
      // Debug: mostra o erro detalhado
      console.error('❌ Erro:', err);
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