/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProofInput {
  [key: string]: string;
  biometricInput: string;
  storedHash: string;
}

export interface ProofOutput {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
  };
  publicSignals: string[];
}

export interface ZKVerificationResult {
  a: [bigint, bigint];
  b: [[bigint, bigint], [bigint, bigint]];
  c: [bigint, bigint];
  publicSignals: [bigint, bigint];
}

export interface ZKProofHookResult {
  generateProof: (secretInput: string, storedHash: bigint) => Promise<ZKVerificationResult>;
  isGenerating: boolean;
  error: string | null;
  result: ZKVerificationResult | null;
} 