import React from 'react';
import { useWeb3 } from '@/hooks/useWeb3';

export const WalletConnection: React.FC = () => {
  const { 
    account, 
    isConnected, 
    isCorrectNetwork, 
    balance, 
    usdcBalance,
    connectWallet, 
    disconnectWallet, 
    switchToCorrectNetwork 
  } = useWeb3();

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
      >
        <span className="mr-2">🔗</span>
        Conectar Wallet
      </button>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex items-center space-x-2">
        <div className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm">
          Red incorrecta
        </div>
        <button
          onClick={switchToCorrectNetwork}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Cambiar a Polygon Amoy
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Balances */}
      <div className="text-sm space-y-1">
        <div>
          Balance: <span className="text-green-400 font-semibold">{parseFloat(balance).toFixed(4)} MATIC</span>
        </div>
        <div>
          USDC: <span className="text-blue-400 font-semibold">{parseFloat(usdcBalance).toFixed(2)} USDC</span>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="flex items-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold text-xl">
            {account ? account.charAt(2).toUpperCase() : 'U'}
          </span>
        </div>
        <div>
          <div className="font-semibold text-white">
            {account ? shortenAddress(account) : 'Usuario'}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span>Polygon Amoy Testnet</span>
          </div>
        </div>
      </div>

      {/* Botón desconectar */}
      <button
        onClick={disconnectWallet}
        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
      >
        Desconectar
      </button>
    </div>
  );
};