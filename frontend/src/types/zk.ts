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
  a: [string, string];
  b: [[string, string], [string, string]];
  c: [string, string];
  publicSignals: [string, string];
}

export interface ZKProofHookResult {
  generateProof: (secretInput: string, storedHash: bigint) => Promise<ZKVerificationResult>;
  isGenerating: boolean;
  error: string | null;
  result: ZKVerificationResult | null;
} 