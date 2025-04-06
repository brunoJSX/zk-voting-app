/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProofInput {
  storedHash: string;
  biometricInput: string;
  [key: string]: string; // Index signature para compatibilidade com CircuitSignals
}

export interface ProofOutput {
  proof: any; // Tipo específico do snarkjs
  publicSignals: string[];
  input: ProofInput;
}

export interface ZKVerificationResult {
  isValid: boolean;
  error?: string;
} 