import { buildPoseidon } from "circomlibjs";
import { BigNumberish } from "ethers";

// Utilitário pra transformar entrada em BigInt de forma segura
const toBigInt = (value: BigNumberish): bigint => {
  if (typeof value === 'string') {
    // Remove caracteres não numéricos
    const cleanValue = value.replace(/[^\d]/g, '');
    return BigInt(cleanValue || '0');
  }
  if (typeof value === 'number') {
    return BigInt(Math.floor(value));
  }
  if (typeof value === 'bigint') {
    return value;
  }
  return BigInt(0);
};

export const generatePoseidonHash = async (input: BigNumberish): Promise<bigint> => {
  const poseidon = await buildPoseidon();
  const inputBigInt = toBigInt(input);
  
  // Gera o hash
  const hash = poseidon([inputBigInt]);
  
  // Converte para um número do campo finito como BigInt
  const fieldValue = BigInt(poseidon.F.toString(hash));
  console.log('Hash gerado:', {
    input: inputBigInt.toString(),
    hash: fieldValue.toString()
  });
  
  return fieldValue;
};
