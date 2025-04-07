export enum VoteOption {
  None = 0,
  Yes = 1,
  No = 2
}

export interface VotingContract {
  storedHashes(address: string): Promise<bigint>;
  hasVoted(address: string): Promise<boolean>;
  yesVotes(): Promise<bigint>;
  noVotes(): Promise<bigint>;
  registerVoter(voter: string, storedHash: bigint): Promise<void>;
  unregisterCurrentVoter(): Promise<void>;
  vote(
    option: VoteOption,
    a: [bigint, bigint],
    b: [[bigint, bigint], [bigint, bigint]],
    c: [bigint, bigint],
    publicSignals: [bigint, bigint]
  ): Promise<void>;
  getResults(): Promise<[bigint, bigint]>;
}

export interface VerifierContract {
  verifyProof(
    a: [bigint, bigint],
    b: [[bigint, bigint], [bigint, bigint]],
    c: [bigint, bigint],
    publicSignals: [bigint, bigint]
  ): Promise<boolean>;
} 