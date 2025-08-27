'use client'

import { useState } from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

export default function DepositModal({ isOpen, onClose, onDeposit }: DepositModalProps) {
  const [amount, setAmount] = useState('100');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleDeposit = async () => {
    setIsProcessing(true);
    
    // Simular procesamiento de depósito
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onDeposit(parseFloat(amount));
    setIsProcessing(false);
    setAmount('100');
    onClose();
  };

  const presetAmounts = [50, 100, 250, 500, 1000];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2a2d47] rounded-xl p-6 max-w-md w-full mx-4 border border-gray-600">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Depositar USDC</h3>
          <p className="text-gray-400">
            Añadir fondos a tu cuenta para participar en apuestas
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cantidad (USDC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="100"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cantidades predefinidas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className={`py-2 px-3 rounded-lg border transition-colors ${
                    amount === preset.toString()
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  ${preset}
                </button>
              ))}
              <button
                onClick={() => setAmount('2500')}
                className={`py-2 px-3 rounded-lg border transition-colors ${
                  amount === '2500'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                $2,500
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Cantidad:</span>
              <span className="text-white">${amount} USDC</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Fee de red:</span>
              <span className="text-yellow-400">~$0.05</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total a recibir:</span>
              <span className="text-green-400 font-medium">${amount} USDC</span>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start">
              <span className="text-blue-400 mr-2 mt-0.5">ℹ️</span>
              <div>
                <p className="text-blue-300 text-sm font-medium mb-1">Modo Testnet</p>
                <p className="text-blue-200 text-xs">
                  Esta es una simulación. En producción se conectaría a tu wallet para depositar USDC real.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </>
            ) : (
              'Depositar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}