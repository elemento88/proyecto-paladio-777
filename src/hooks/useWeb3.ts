import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { 
  CONTRACT_ADDRESSES, 
  NETWORK_CONFIG, 
  BETTING_PROTOCOL_ABI, 
  MOCK_USDC_ABI,
  BetType,
  ResolutionMode,
  OneVsOneMode
} from '@/config/contracts';

interface Web3State {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  balance: string;
  usdcBalance: string;
}

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>({
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    isConnected: false,
    isCorrectNetwork: false,
    balance: '0',
    usdcBalance: '0'
  });

  const [bettingContract, setBettingContract] = useState<ethers.Contract | null>(null);
  const [usdcContract, setUsdcContract] = useState<ethers.Contract | null>(null);

  // Conectar wallet
  const connectWallet = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        const network = await provider.getNetwork();
        
        const balance = await provider.getBalance(account);
        
        setState(prev => ({
          ...prev,
          provider,
          signer,
          account,
          chainId: network.chainId,
          isConnected: true,
          isCorrectNetwork: network.chainId === NETWORK_CONFIG.chainId,
          balance: ethers.utils.formatEther(balance)
        }));

        // Inicializar contratos
        const betting = new ethers.Contract(CONTRACT_ADDRESSES.BETTING_PROTOCOL, BETTING_PROTOCOL_ABI, signer);
        const usdc = new ethers.Contract(CONTRACT_ADDRESSES.MOCK_USDC, MOCK_USDC_ABI, signer);
        
        setBettingContract(betting);
        setUsdcContract(usdc);

        // Obtener balance USDC
        try {
          const usdcBalance = await usdc.balanceOf(account);
          setState(prev => ({
            ...prev,
            usdcBalance: ethers.utils.formatEther(usdcBalance)
          }));
        } catch (error) {
          console.error('Error getting USDC balance:', error);
        }

        return true;
      } else {
        throw new Error('MetaMask no está instalado');
      }
    } catch (error) {
      console.error('Error conectando wallet:', error);
      throw error;
    }
  }, []);

  // Desconectar wallet
  const disconnectWallet = useCallback(() => {
    setState({
      provider: null,
      signer: null,
      account: null,
      chainId: null,
      isConnected: false,
      isCorrectNetwork: false,
      balance: '0',
      usdcBalance: '0'
    });
    setBettingContract(null);
    setUsdcContract(null);
  }, []);

  // Cambiar a la red correcta
  const switchToCorrectNetwork = useCallback(async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask no está instalado');

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
              chainName: NETWORK_CONFIG.name,
              rpcUrls: [NETWORK_CONFIG.rpcUrl],
              blockExplorerUrls: [NETWORK_CONFIG.blockExplorer],
              nativeCurrency: {
                name: NETWORK_CONFIG.currency,
                symbol: NETWORK_CONFIG.currencySymbol,
                decimals: 18
              }
            }],
          });
        } catch (addError) {
          throw new Error('Error agregando la red');
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  // Actualizar balances
  const updateBalances = useCallback(async () => {
    if (state.provider && state.account && usdcContract) {
      try {
        const [balance, usdcBalance] = await Promise.all([
          state.provider.getBalance(state.account),
          usdcContract.balanceOf(state.account)
        ]);

        setState(prev => ({
          ...prev,
          balance: ethers.utils.formatEther(balance),
          usdcBalance: ethers.utils.formatEther(usdcBalance)
        }));
      } catch (error) {
        console.error('Error updating balances:', error);
      }
    }
  }, [state.provider, state.account, usdcContract]);

  // Efectos para escuchar cambios en MetaMask
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [connectWallet, disconnectWallet]);

  // Auto-conectar si ya estaba conectado
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Error auto-connecting:', error);
        }
      }
    };

    autoConnect();
  }, [connectWallet]);

  return {
    ...state,
    bettingContract,
    usdcContract,
    connectWallet,
    disconnectWallet,
    switchToCorrectNetwork,
    updateBalances
  };
};