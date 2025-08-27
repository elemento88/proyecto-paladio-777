'use client'

import { useState } from 'react';

interface BetTypeCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  difficultyColor: string;
  time: string;
  characteristics: string[];
  buttonColor: string;
  buttonText: string;
}

const betTypes: BetTypeCard[] = [
  {
    id: 'battle-royal',
    title: 'Battle Royal',
    description: 'Todos contra todos - el ganador se lleva todo el pozo',
    icon: '⚔️',
    difficulty: 'Básico',
    difficultyColor: 'text-green-400',
    time: '5 min',
    characteristics: [
      'Múltiples participantes',
      'Ganador único', 
      'Pozo completo'
    ],
    buttonColor: 'bg-green-600 hover:bg-green-700',
    buttonText: 'Completar Battle Royal'
  },
  {
    id: 'pool-grupal',
    title: 'Pool Grupal',
    description: 'Fondos compartidos con distribución proporcional de premios',
    icon: '👥',
    difficulty: 'Intermedio',
    difficultyColor: 'text-yellow-400',
    time: '8 min',
    characteristics: [
      'Liquidez compartida',
      'Reparto de ganancias',
      'Menor riesgo'
    ],
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    buttonText: 'Completar Pool Grupal'
  },
  {
    id: 'prediccion-simple',
    title: 'Predicción Simple',
    description: 'Apuesta directa sobre el resultado de un evento específico',
    icon: '🎯',
    difficulty: 'Básico',
    difficultyColor: 'text-green-400',
    time: '3 min',
    characteristics: [
      'Sí/No simple',
      'Resolución rápida',
      'Para principiantes'
    ],
    buttonColor: 'bg-green-600 hover:bg-green-700',
    buttonText: 'Completar Predicción Simple'
  },
  {
    id: 'mercado-over-under',
    title: 'Mercado Over/Under',
    description: 'Apuesta sobre si un valor será mayor o menor a un número',
    icon: '📊',
    difficulty: 'Intermedio',
    difficultyColor: 'text-yellow-400',
    time: '6 min',
    characteristics: [
      'Rango numérico',
      'Análisis estadístico',
      'Datos deportivos'
    ],
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    buttonText: 'Completar Mercado Over/Under'
  },
  {
    id: 'desafio-1v1',
    title: 'Desafío 1v1',
    description: 'Duelo directo entre dos participantes con apuesta igualada',
    icon: '💥',
    difficulty: 'Avanzado',
    difficultyColor: 'text-red-400',
    time: '10 min',
    characteristics: [
      'Duelo directo',
      'Apuestas igualadas',
      'Negociación privada'
    ],
    buttonColor: 'bg-red-600 hover:bg-red-700',
    buttonText: 'Completar Desafío 1v1'
  },
  {
    id: 'liga-por-puntos',
    title: 'Liga por Puntos',
    description: 'Sistema de puntuación acumulativa a través de múltiples eventos',
    icon: '🏆',
    difficulty: 'Avanzado',
    difficultyColor: 'text-red-400',
    time: '15 min',
    characteristics: [
      'Múltiples eventos',
      'Puntuación acumulada',
      'Temporada completa'
    ],
    buttonColor: 'bg-red-600 hover:bg-red-700',
    buttonText: 'Completar Liga por Puntos'
  }
];

interface CreateBetViewProps {
  onSelectBetType: (betType: BetTypeCard) => void;
}

export default function CreateBetView({ onSelectBetType }: CreateBetViewProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleCreateBet = (betType: BetTypeCard) => {
    setSelectedType(betType.id);
    // Llamar a la función para abrir el modal correspondiente
    setTimeout(() => {
      onSelectBetType(betType);
      setSelectedType(null);
    }, 300);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {betTypes.map((betType) => (
        <div
          key={betType.id}
          className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200"
        >
          {/* Header con icono y badges */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-2xl">{betType.icon}</span>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`text-sm font-medium ${betType.difficultyColor}`}>
                {betType.difficulty}
              </span>
              <div className="flex items-center text-gray-400">
                <span className="text-xs mr-1">⏱️</span>
                <span className="text-sm font-medium text-orange-400">{betType.time}</span>
              </div>
            </div>
          </div>

          {/* Título y descripción */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{betType.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{betType.description}</p>
          </div>

          {/* Características */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm font-medium mb-3">Características:</p>
            <div className="space-y-2">
              {betType.characteristics.map((characteristic, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="text-green-400 mr-2">●</span>
                  <span className="text-gray-300">{characteristic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de creación */}
          <button
            onClick={() => handleCreateBet(betType)}
            disabled={selectedType === betType.id}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              selectedType === betType.id
                ? 'bg-gray-600 cursor-not-allowed'
                : betType.buttonColor + ' transform hover:scale-105'
            }`}
          >
            {selectedType === betType.id ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando...
              </div>
            ) : (
              betType.buttonText
            )}
          </button>
        </div>
      ))}
    </div>
  );
}