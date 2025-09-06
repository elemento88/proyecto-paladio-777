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
    description: 'Todos contra todos - hasta 100 participantes compiten',
    icon: '⚔️',
    difficulty: 'Básico',
    difficultyColor: 'text-green-400',
    time: '5 min',
    characteristics: [
      'Hasta 100 participantes',
      'Ganadores configurables', 
      'Distribución personalizada'
    ],
    buttonColor: 'bg-green-600 hover:bg-green-700',
    buttonText: 'Completar Battle Royal'
  },
  {
    id: 'group-balanced',
    title: 'Group Balanced',
    description: 'Grupos equilibrados automáticamente - hasta 1,000 participantes en 10 grupos',
    icon: '⚖️',
    difficulty: 'Intermedio',
    difficultyColor: 'text-blue-400',
    time: '8 min',
    characteristics: [
      'Hasta 100 por grupo (10 grupos)',
      'Auto-balanceado inteligente',
      'Sistema de ranking interno'
    ],
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    buttonText: 'Completar Group Balanced'
  },
  {
    id: 'prediccion-simple',
    title: 'Predicción Simple',
    description: 'Reto directo sobre el resultado de un evento específico',
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
    <div className="space-y-8">
      {/* Sección de tipos de reto - mantener original */}
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

      {/* Sección de Retos Públicos - agregar abajo */}
      <div className="bg-[#2a2d47] rounded-xl border border-gray-600 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Retos Públicos Recientes</h3>
                <p className="text-sm text-gray-400">Únete a retos creados por otros usuarios</p>
              </div>
            </div>
            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
              23 Activas
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Reto Público 1 */}
          <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">🏀</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Lakers vs Warriors</h4>
                  <p className="text-gray-400 text-xs">NBA • v1.1</p>
                </div>
              </div>
              <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                Pendiente
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Reto: $200.00</div>
              <div>Participantes: 2/2</div>
            </div>
            <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs transition-colors">
              Unirse
            </button>
          </div>

          {/* Reto Público 2 */}
          <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">⚽</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Champions League Final</h4>
                  <p className="text-gray-400 text-xs">UEFA • Torneo</p>
                </div>
              </div>
              <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                Ganado
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Reto: $50.00</div>
              <div>Participantes: 16/20</div>
            </div>
            <button className="w-full mt-3 bg-gray-600 text-gray-300 py-2 px-3 rounded text-xs cursor-not-allowed">
              Finalizado
            </button>
          </div>

          {/* Reto Público 3 */}
          <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">🏈</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">NFL Super Bowl</h4>
                  <p className="text-gray-400 text-xs">NFL • Battle Royal</p>
                </div>
              </div>
              <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                Activo
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Reto: $100.00</div>
              <div>Participantes: 45/50</div>
            </div>
            <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs transition-colors">
              Unirse
            </button>
          </div>

          {/* Reto Público 4 */}
          <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">🎾</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Tennis Masters 1000</h4>
                  <p className="text-gray-400 text-xs">ATP • Grupo</p>
                </div>
              </div>
              <div className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-medium">
                En Curso
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Reto: $75.00</div>
              <div>Participantes: 8/10</div>
            </div>
            <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs transition-colors">
              Unirse
            </button>
          </div>

          {/* Reto Público 5 */}
          <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">🏐</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Volleyball Championship</h4>
                  <p className="text-gray-400 text-xs">FIVB • Simple</p>
                </div>
              </div>
              <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                Nuevo
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Reto: $25.00</div>
              <div>Participantes: 12/15</div>
            </div>
            <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs transition-colors">
              Unirse
            </button>
          </div>

          {/* Reto Público 6 */}
          <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">🏒</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">NHL Winter Classic</h4>
                  <p className="text-gray-400 text-xs">NHL • Grupo</p>
                </div>
              </div>
              <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium">
                Lleno
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Reto: $150.00</div>
              <div>Participantes: 8/8</div>
            </div>
            <button className="w-full mt-3 bg-gray-600 text-gray-300 py-2 px-3 rounded text-xs cursor-not-allowed">
              Completo
            </button>
          </div>
        </div>

        {/* Botón para ver todos los retos */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
            Ver Todos los Retos Públicos →
          </button>
        </div>
      </div>
    </div>
  );
}