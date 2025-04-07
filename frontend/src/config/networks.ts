export const NETWORKS = {
  BSC_TESTNET: {
    chainId: '0x61',
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'tBNB',
      decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
  }
} as const;

export async function setupBSCTestnet() {
  try {
    await window.ethereum?.request({
      method: 'wallet_addEthereumChain',
      params: [NETWORKS.BSC_TESTNET]
    });
  } catch (error) {
    console.error('Erro ao adicionar rede:', error);
  }
} 