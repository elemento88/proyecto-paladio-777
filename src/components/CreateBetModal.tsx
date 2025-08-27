import React, { useState } from 'react';
import { useBetting } from '@/hooks/useBetting';
import { useWeb3 } from '@/hooks/useWeb3';
import { ResolutionMode, BetType, OneVsOneMode } from '@/config/contracts';

interface CreateBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (betId: number) => void;
}

export const CreateBetModal: React.FC<CreateBetModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { createSimpleBet, createOneVsOneBet, loading } = useBetting();
  const { isConnected, usdcBalance } = useWeb3();
  const [formData, setFormData] = useState({
    betType: BetType.SIMPLE,
    title: '',
    description: '',
    stakeAmount: '10',
    maxParticipants: 10,
    resolutionMode: ResolutionMode.EXACT,
    oneVsOneMode: OneVsOneMode.CLASSIC,
    prediction: 0,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isConnected) {
      setError('Por favor conecta tu wallet primero');
      return;
    }

    if (parseFloat(usdcBalance) < parseFloat(formData.stakeAmount)) {
      setError('Saldo USDC insuficiente');
      return;
    }

    try {
      let result;

      if (formData.betType === BetType.SIMPLE) {
        result = await createSimpleBet(
          formData.resolutionMode,
          formData.stakeAmount,
          formData.maxParticipants
        );
      } else if (formData.betType === BetType.ONE_VS_ONE) {
        result = await createOneVsOneBet(
          formData.prediction,
          formData.stakeAmount,
          formData.oneVsOneMode
        );
      }

      if (result?.betId) {
        setSuccess(`¡Apuesta creada exitosamente! ID: ${result.betId}`);
        onSuccess?.(result.betId);
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      }
    } catch (err: any) {
      setError(`Error creando apuesta: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2d47] rounded-xl border border-gray-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Crear Nueva Apuesta</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Apuesta */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Apuesta
              </label>
              <select
                value={formData.betType}
                onChange={(e) => setFormData({ ...formData, betType: Number(e.target.value) })}
                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value={BetType.SIMPLE}>Apuesta Simple</option>
                <option value={BetType.ONE_VS_ONE}>1 vs 1</option>
              </select>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título de la Apuesta
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ej. ¿Quién ganará el Clásico?"
                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe los detalles de la apuesta..."
                rows={3}
                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                required
              />
            </div>

            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monto de Apuesta (USDC)
              </label>
              <input
                type="number"
                value={formData.stakeAmount}
                onChange={(e) => setFormData({ ...formData, stakeAmount: e.target.value })}
                min="0.1"
                step="0.1"
                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-white"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Balance disponible: {parseFloat(usdcBalance).toFixed(2)} USDC
              </p>
            </div>

            {/* Predicción (para 1 vs 1) */}
            {formData.betType === BetType.ONE_VS_ONE && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tu Predicción
                </label>
                <input
                  type="number"
                  value={formData.prediction}
                  onChange={(e) => setFormData({ ...formData, prediction: Number(e.target.value) })}
                  placeholder="ej. 2 (goles, puntos, etc.)"
                  className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  required
                />
              </div>
            )}

            {/* Máximo de Participantes (solo para Simple) */}
            {formData.betType === BetType.SIMPLE && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Máximo de Participantes
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                  min="2"
                  max="100"
                  className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
            )}

            {/* Modo de Resolución */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Modo de Resolución
              </label>
              <select
                value={formData.resolutionMode}
                onChange={(e) => setFormData({ ...formData, resolutionMode: Number(e.target.value) })}
                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value={ResolutionMode.EXACT}>Exacto</option>
                <option value={ResolutionMode.CLOSEST}>Más Cercano</option>
                <option value={ResolutionMode.MULTI_WINNER}>Múltiples Ganadores</option>
              </select>
            </div>

            {/* Modo 1 vs 1 */}
            {formData.betType === BetType.ONE_VS_ONE && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Modo 1 vs 1
                </label>
                <select
                  value={formData.oneVsOneMode}
                  onChange={(e) => setFormData({ ...formData, oneVsOneMode: Number(e.target.value) })}
                  className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value={OneVsOneMode.CLASSIC}>Clásico</option>
                  <option value={OneVsOneMode.MARKET}>Mercado</option>
                </select>
              </div>
            )}

            {/* Mensajes */}
            {error && (
              <div className="bg-red-600 text-white p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-600 text-white p-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Botones */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !isConnected}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Crear Apuesta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};