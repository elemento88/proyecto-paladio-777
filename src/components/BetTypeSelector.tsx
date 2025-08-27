'use client'

import { useState } from 'react';
import { BetType, ResolutionMode } from '@/types/betting';

interface BetTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: BetTypeOption) => void;
}

export interface BetTypeOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  betType: BetType;
  resolutionMode: ResolutionMode;
  maxParticipants: number;
  minStake: number;
  features: string[];
}

const betTypeOptions: BetTypeOption[] = [
  {
    id: 'simple',
    title: 'Apuesta Simple',
    description: 'Predicción directa sobre un evento deportivo',
    icon: '🎯',
    iconBg: 'bg-blue-500',
    betType: BetType.SIMPLE,
    resolutionMode: ResolutionMode.EXACT,
    maxParticipants: 50,
    minStake: 25,
    features: ['Múltiples participantes', 'Ganador único', 'Predicción exacta']
  },
  {
    id: 'tournament',
    title: 'Torneo',
    description: 'Competencia con múltiples rondas y eliminación',
    icon: '🏆',
    iconBg: 'bg-yellow-500',
    betType: BetType.TOURNAMENT,
    resolutionMode: ResolutionMode.MULTI_WINNER,
    maxParticipants: 64,
    minStake: 50,
    features: ['Sistema de bracket', 'Múltiples ganadores', 'Rondas eliminatorias']
  },
  {
    id: 'group_balanced',
    title: 'Grupo Balanceado',
    description: 'Grupo con distribución equitativa de ganancias',
    icon: '👥',
    iconBg: 'bg-green-500',
    betType: BetType.GROUP_BALANCED,
    resolutionMode: ResolutionMode.CLOSEST,
    maxParticipants: 20,
    minStake: 100,
    features: ['Distribución equitativa', 'Múltiples posiciones ganadoras', 'Sistema de ranking']
  },
  {
    id: 'one_vs_one',
    title: 'Duelo 1v1',
    description: 'Desafío directo entre dos participantes',
    icon: '⚔️',
    iconBg: 'bg-purple-500',
    betType: BetType.ONE_VS_ONE,
    resolutionMode: ResolutionMode.EXACT,
    maxParticipants: 2,
    minStake: 50,
    features: ['Solo 2 participantes', 'Ganador se lleva todo', 'Duelo directo']
  },
  {
    id: 'prediction_pool',
    title: 'Pool de Predicciones',
    description: 'Predicciones múltiples con puntuación acumulativa',
    icon: '🎱',
    iconBg: 'bg-indigo-500',
    betType: BetType.TOURNAMENT,
    resolutionMode: ResolutionMode.CLOSEST,
    maxParticipants: 100,
    minStake: 25,
    features: ['Predicciones múltiples', 'Sistema de puntos', 'Rankings dinámicos']
  },
  {
    id: 'progressive_jackpot',
    title: 'Jackpot Progresivo',
    description: 'Apuesta acumulativa que crece con cada participante',
    icon: '💎',
    iconBg: 'bg-pink-500',
    betType: BetType.SIMPLE,
    resolutionMode: ResolutionMode.EXACT,
    maxParticipants: 1000,
    minStake: 10,
    features: ['Premio acumulativo', 'Sin límite de participantes', 'Jackpot creciente']
  }
];

export default function BetTypeSelector({ isOpen, onClose, onSelectType }: BetTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<BetTypeOption | null>(null);

  if (!isOpen) return null;

  const handleSelectType = (type: BetTypeOption) => {
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (selectedType) {
      onSelectType(selectedType);
      setSelectedType(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2d47] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-600">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Elegir Tipo de Reto</h2>
              <p className="text-gray-400 text-sm">Selecciona el formato que mejor se adapte a tu reto</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {betTypeOptions.map((type) => (
              <div
                key={type.id}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedType?.id === type.id
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700/20'
                }`}
                onClick={() => handleSelectType(type)}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${type.iconBg} rounded-lg flex items-center justify-center mr-3 shadow-md`}>
                    <span className="text-white text-xl">{type.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{type.title}</h3>
                    <div className="flex items-center text-xs text-gray-400">
                      <span className="mr-2">👥 Max: {type.maxParticipants}</span>
                      <span>💰 Min: ${type.minStake}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{type.description}</p>
                
                <div className="space-y-1">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-400">
                      <span className="mr-2 text-green-400">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-600 flex justify-between text-xs">
                  <span className="text-gray-400">Tipo: {type.betType}</span>
                  <span className="text-gray-400">Modo: {type.resolutionMode}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Panel de información del tipo seleccionado */}
          {selectedType && (
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-600">
              <div className="flex items-center mb-4">
                <div className={`w-16 h-16 ${selectedType.iconBg} rounded-xl flex items-center justify-center mr-4`}>
                  <span className="text-white text-2xl">{selectedType.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedType.title}</h3>
                  <p className="text-gray-400">{selectedType.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{selectedType.maxParticipants}</div>
                  <div className="text-xs text-gray-400">Max Participantes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">${selectedType.minStake}</div>
                  <div className="text-xs text-gray-400">Apuesta Mínima</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{selectedType.betType}</div>
                  <div className="text-xs text-gray-400">Tipo de Apuesta</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{selectedType.resolutionMode}</div>
                  <div className="text-xs text-gray-400">Resolución</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedType.features.map((feature, index) => (
                  <span key={index} className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedType}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {selectedType ? `Crear ${selectedType.title}` : 'Selecciona un Tipo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}