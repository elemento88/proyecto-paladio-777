'use client'

import { useState } from 'react';
import { BetType, ResolutionMode } from '@/types/betting';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBet: (betData: {
    title: string;
    betType: BetType;
    resolutionMode: ResolutionMode;
    stake: string;
    maxParticipants: number;
    endDate: string;
    description: string;
    sport: string;
    creator: string;
  }) => void;
  selectedType?: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

export default function BetModal({ isOpen, onClose, onCreateBet, selectedType }: BetModalProps) {
  const [betTitle, setBetTitle] = useState('');
  const [betType, setBetType] = useState<BetType>(BetType.SIMPLE);
  const [resolutionMode, setResolutionMode] = useState<ResolutionMode>(ResolutionMode.EXACT);
  const [stakeAmount, setStakeAmount] = useState('50');
  const [maxParticipants, setMaxParticipants] = useState('20');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [sport, setSport] = useState('Fútbol');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const betData = {
      title: betTitle,
      betType,
      resolutionMode,
      stake: stakeAmount,
      maxParticipants: parseInt(maxParticipants),
      endDate,
      description,
      sport,
      creator: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4)
    };

    onCreateBet(betData);
    
    // Reset form
    setBetTitle('');
    setBetType(BetType.SIMPLE);
    setResolutionMode(ResolutionMode.EXACT);
    setStakeAmount('50');
    setMaxParticipants('20');
    setEndDate('');
    setDescription('');
    setSport('Fútbol');

    // Redirigir a deportes después de crear el reto exitosamente
    setTimeout(() => {
      window.location.href = '/sports';
    }, 500);
  };


  const getResolutionModeDescription = (mode: ResolutionMode) => {
    switch (mode) {
      case ResolutionMode.EXACT:
        return 'Debe acertar exactamente para ganar';
      case ResolutionMode.CLOSEST:
        return 'Gana quien más se acerque al resultado';
      case ResolutionMode.MULTI_WINNER:
        return 'Pueden haber múltiples ganadores';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2d47] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-600">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {selectedType ? `Crear ${selectedType.title}` : 'Crear Nuevo Reto'}
              </h2>
              {selectedType && (
                <p className="text-gray-400 text-sm flex items-center mt-1">
                  <span className="mr-2">{selectedType.icon}</span>
                  {selectedType.description}
                </p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título del Reto *
                </label>
                <input
                  type="text"
                  value={betTitle}
                  onChange={(e) => setBetTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ej: Real Madrid vs Barcelona"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deporte
                </label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Fútbol">⚽ Fútbol</option>
                  <option value="Baloncesto">🏀 Baloncesto</option>
                  <option value="Tenis">🎾 Tenis</option>
                  <option value="Béisbol">⚾ Béisbol</option>
                  <option value="Fútbol Americano">🏈 Fútbol Americano</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha límite *
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Describe el reto y las condiciones..."
              />
            </div>


            {/* Modo de resolución */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Modo de Resolución *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(ResolutionMode).map((mode) => (
                  <div
                    key={mode}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      resolutionMode === mode
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setResolutionMode(mode)}
                  >
                    <div className="flex items-center mb-1">
                      <input
                        type="radio"
                        checked={resolutionMode === mode}
                        onChange={() => setResolutionMode(mode)}
                        className="mr-2"
                      />
                      <span className="text-white font-medium">
                        {mode === ResolutionMode.EXACT ? 'Exacto' :
                         mode === ResolutionMode.CLOSEST ? 'Más Cercano' :
                         'Múltiples Ganadores'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{getResolutionModeDescription(mode)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuración de apuesta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Apuesta Mínima (USDC) *
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="50"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Máximo de Participantes *
                </label>
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="20"
                  min="2"
                  max={betType === BetType.ONE_VS_ONE ? "2" : "100"}
                  required
                />
              </div>
            </div>

            {/* Fee info */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-400">Fee del protocolo:</span>
                <span className="text-yellow-400">2.5%</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-400">Depósito requerido:</span>
                <span className="text-white">${stakeAmount} USDC</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total a depositar:</span>
                <span className="text-green-400 font-medium">
                  ${(parseFloat(stakeAmount) * 1.025).toFixed(2)} USDC
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Completar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}