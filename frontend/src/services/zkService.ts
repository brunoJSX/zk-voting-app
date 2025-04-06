import { groth16 } from "snarkjs";
import { ZK_PATHS } from "../constants/zkPaths";
import type { ProofInput, ProofOutput } from "../types/zk";

// Converte BigInt para string numérica (field element)
const toFieldElement = (value: bigint): string => {
  return value.toString(10);
};

export const generateZKProof = async (
  secretInput: string,
  storedHash: bigint
): Promise<ProofOutput> => {
  try {
    const input: ProofInput = {
      storedHash: toFieldElement(storedHash),
      biometricInput: secretInput
    };

    console.log("Gerando prova com input:", input);

    const { proof, publicSignals } = await groth16.fullProve(
      input,
      ZK_PATHS.WASM,
      ZK_PATHS.ZKEY
    );

    return {
      proof,
      publicSignals,
      input
    };
  } catch (error) {
    console.error("Erro ao gerar prova:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Erro desconhecido ao gerar prova"
    );
  }
}; 