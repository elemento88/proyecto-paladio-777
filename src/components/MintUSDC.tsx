import React, { useState } from 'react';
import { useBetting } from '@/hooks/useBetting';
import { useWeb3 } from '@/hooks/useWeb3';

export const MintUSDC: React.FC = () => {
  const { mintUSDC, loading } = useBetting();
  const { isConnected } = useWeb3();
  const [amount, setAmount] = useState('100');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleMint = async () => {
    if (!isConnected) {
      setError('Conecta tu wallet primero');
      return;
    }

    setError('');
    setSuccess('');

    try {
      await mintUSDC(amount);
      setSuccess(`¡${amount} USDC minteados exitosamente!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(`Error minteando USDC: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600">
      <h3 className="text-white font-medium mb-4 flex items-center">
        <span className="mr-2">💰</span>
        Mintear USDC de Prueba
      </h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Cantidad a mintear
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-white"
            placeholder="100"
            min="1"
          />
        </div>

        <button
          onClick={handleMint}
          disabled={loading || !isConnected}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Minteando...' : `Mintear ${amount} USDC`}
        </button>

        {success && (
          <div className="bg-green-600 text-white p-2 rounded text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white p-2 rounded text-sm">
            {error}
          </div>
        )}

        <p className="text-xs text-gray-400">
          Esta función solo funciona en testnet para obtener USDC de prueba.
        </p>
      </div>
    </div>
  );
};