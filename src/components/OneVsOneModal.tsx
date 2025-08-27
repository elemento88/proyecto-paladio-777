'use client'

import { useState } from 'react';
import { BetType, ResolutionMode } from '@/types/betting';

interface OneVsOneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChallenge: (challengeData: {
    title: string;
    description: string;
    stake: number;
    sport: string;
    endDate: string;
    betType: BetType;
    resolutionMode: ResolutionMode;
    maxParticipants: number;
    isPublic: boolean;
    targetOpponent: string | null;
  }) => void;
}

export default function OneVsOneModal({ isOpen, onClose, onCreateChallenge }: OneVsOneModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stake, setStake] = useState('100');
  const [sport, setSport] = useState('Fútbol');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [targetOpponent, setTargetOpponent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const challengeData = {
      title,
      description,
      stake: parseFloat(stake),
      sport,
      endDate,
      betType: BetType.ONE_VS_ONE,
      resolutionMode: ResolutionMode.EXACT,
      maxParticipants: 2,
      isPublic,
      targetOpponent: targetOpponent || null
    };

    onCreateChallenge(challengeData);
    
    // Reset form
    setTitle('');
    setDescription('');
    setStake('100');
    setSport('Fútbol');
    setEndDate('');
    setIsPublic(true);
    setTargetOpponent('');

    // Redirigir a deportes después de crear el duelo exitosamente
    setTimeout(() => {
      window.location.href = '/sports';
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2d47] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-600">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Duelo 1v1</h2>
              <p className="text-gray-400 text-sm">Crear un desafío directo contra otro usuario</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del Desafío *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej: ¿Quién predice mejor el marcador?"
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

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción del Desafío
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Describe el desafío y las condiciones..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Apuesta (USDC) *
                </label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="100"
                  min="1"
                  required
                />
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
            </div>

            {/* Tipo de desafío */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Tipo de Desafío
              </label>
              <div className="space-y-3">
                <div
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isPublic
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setIsPublic(true)}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="mr-2"
                    />
                    <span className="text-white font-medium">🌍 Público</span>
                  </div>
                  <p className="text-sm text-gray-400">Cualquier usuario puede aceptar el desafío</p>
                </div>

                <div
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    !isPublic
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setIsPublic(false)}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="mr-2"
                    />
                    <span className="text-white font-medium">🎯 Directo</span>
                  </div>
                  <p className="text-sm text-gray-400">Desafiar a un usuario específico</p>
                </div>
              </div>
            </div>

            {/* Usuario objetivo si es privado */}
            {!isPublic && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Usuario a Desafiar *
                </label>
                <input
                  type="text"
                  value={targetOpponent}
                  onChange={(e) => setTargetOpponent(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="0x1234...abcd o username"
                  required={!isPublic}
                />
              </div>
            )}

            {/* Resumen del duelo */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-medium mb-2">⚔️ Resumen del Duelo</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo:</span>
                  <span className="text-white">Duelo 1v1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Apuesta:</span>
                  <span className="text-white">${stake} USDC cada uno</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pot total:</span>
                  <span className="text-green-400 font-medium">${(parseFloat(stake) * 2).toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ganador recibe:</span>
                  <span className="text-green-400 font-bold">~${(parseFloat(stake) * 1.95).toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-yellow-400">2.5%</span>
                </div>
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
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                ⚔️ Completar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}