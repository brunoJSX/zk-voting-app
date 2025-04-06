pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

template IdentityProof() {
    signal input storedHash;      // Hash armazenado no sistema
    signal input biometricInput;  // Biometria fornecida pelo usuário (valor original)
    signal output isValid;        // 1 se os hashes são iguais, 0 caso contrário

    // Calcula o hash da biometria fornecida
    component hasher = Poseidon(1);
    hasher.inputs[0] <== biometricInput;

    // Compute isValid usando constraint
    signal diff;
    diff <== storedHash - hasher.out;
    isValid <== 1 - diff * diff;  // Será 1 se igual, 0 se diferente
}

component main = IdentityProof();
