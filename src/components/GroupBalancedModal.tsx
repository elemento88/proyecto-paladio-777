'use client'

import { useState } from 'react';
import { BetType, ResolutionMode } from '@/types/betting';

interface GroupBalancedModalProps {
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
    groupSize: number;
    numGroups: number;
    balancingMethod: 'SKILL_BASED' | 'RANDOM' | 'STAKES_BASED';
    prizeDistribution: 'EQUAL_GROUPS' | 'POSITION_BASED' | 'TOP_PERFORMERS';
  }) => void;
}

export default function GroupBalancedModal({ isOpen, onClose, onCreateChallenge }: GroupBalancedModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stake, setStake] = useState('25');
  const [sport, setSport] = useState('Fútbol');
  const [maxParticipants, setMaxParticipants] = useState('100');
  const [groupSize, setGroupSize] = useState('10');
  const [balancingMethod, setBalancingMethod] = useState<'SKILL_BASED' | 'RANDOM' | 'STAKES_BASED'>('SKILL_BASED');
  const [prizeDistribution, setPrizeDistribution] = useState<'EQUAL_GROUPS' | 'POSITION_BASED' | 'TOP_PERFORMERS'>('POSITION_BASED');

  if (!isOpen) return null;

  const numGroups = Math.floor(parseInt(maxParticipants) / parseInt(groupSize));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const challengeData = {
      title,
      description,
      stake: parseFloat(stake),
      sport,
      endDate: '',
      betType: BetType.GROUP_BALANCED,
      resolutionMode: ResolutionMode.MULTI_WINNER,
      maxParticipants: parseInt(maxParticipants),
      groupSize: parseInt(groupSize),
      numGroups,
      balancingMethod,
      prizeDistribution
    };

    onCreateChallenge(challengeData);
    
    // Reset form
    setTitle('');
    setDescription('');
    setStake('25');
    setSport('Fútbol');
    setMaxParticipants('100');
    setGroupSize('10');
    setBalancingMethod('SKILL_BASED');
    setPrizeDistribution('POSITION_BASED');

    // Redirect after creation
    setTimeout(() => {
      window.location.href = '/sports';
    }, 500);
  };

  const getDistributionExplanation = () => {
    switch (prizeDistribution) {
      case 'EQUAL_GROUPS':
        return 'Cada grupo gana por igual. El premio se divide equitativamente entre los ganadores de cada grupo.';
      case 'POSITION_BASED':
        return 'Distribución por posición: 1° puesto 50%, 2° puesto 30%, 3° puesto 20%.';
      case 'TOP_PERFORMERS':
        return 'Solo los mejores performers de todos los grupos ganan. Top 3 se dividen el premio.';
      default:
        return '';
    }
  };

  const getBalancingExplanation = () => {
    switch (balancingMethod) {
      case 'SKILL_BASED':
        return 'Los grupos se forman basándose en el historial y estadísticas de los participantes para equilibrar habilidades.';
      case 'RANDOM':
        return 'Distribución completamente aleatoria. Puede resultar en grupos desbalanceados pero es más justo estadísticamente.';
      case 'STAKES_BASED':
        return 'Los grupos se balancean según el monto apostado y experiencia previa de cada participante.';
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
              <h2 className="text-2xl font-semibold text-white">⚖️ Group Balanced</h2>
              <p className="text-gray-400 text-sm">Crear grupos equilibrados automáticamente</p>
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
                Título del Reto *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Ej: Liga Balanceada de Predicciones"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reto por participante (USDC) *
                </label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="25"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Configuración de grupos */}
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-medium mb-4">⚖️ Configuración de Grupos</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Participantes * (máximo 100)
                  </label>
                  <select
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="12">12 participantes</option>
                    <option value="20">20 participantes</option>
                    <option value="30">30 participantes</option>
                    <option value="50">50 participantes</option>
                    <option value="80">80 participantes</option>
                    <option value="100">100 participantes</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Protocolo limita a máximo 100 por grupo
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tamaño de Grupo *
                  </label>
                  <select
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="4">4 por grupo</option>
                    <option value="5">5 por grupo</option>
                    <option value="10">10 por grupo</option>
                    <option value="20">20 por grupo</option>
                    <option value="25">25 por grupo</option>
                    <option value="50">50 por grupo</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                <div className="text-center">
                  <span className="text-blue-400 font-medium">
                    Se formarán {numGroups} grupos de {groupSize} personas cada uno
                  </span>
                  <div className="text-xs text-gray-400 mt-1">
                    Total: {parseInt(maxParticipants)} participantes
                  </div>
                </div>
              </div>

              {/* Método de balanceamiento */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Método de Balanceamiento *
                </label>
                
                <div className="space-y-3">
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      balancingMethod === 'SKILL_BASED' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                    onClick={() => setBalancingMethod('SKILL_BASED')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="balancingMethod"
                        value="SKILL_BASED"
                        checked={balancingMethod === 'SKILL_BASED'}
                        onChange={() => setBalancingMethod('SKILL_BASED')}
                        className="mr-2"
                      />
                      <span className="font-medium text-white">🎯 Basado en Habilidad</span>
                      <span className="ml-2 text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                        Recomendado
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">
                      {getBalancingExplanation()}
                    </p>
                  </div>

                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      balancingMethod === 'RANDOM' 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                    onClick={() => setBalancingMethod('RANDOM')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="balancingMethod"
                        value="RANDOM"
                        checked={balancingMethod === 'RANDOM'}
                        onChange={() => setBalancingMethod('RANDOM')}
                        className="mr-2"
                      />
                      <span className="font-medium text-white">🎲 Aleatorio</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">
                      {getBalancingExplanation()}
                    </p>
                  </div>

                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      balancingMethod === 'STAKES_BASED' 
                        ? 'border-yellow-500 bg-yellow-500/10' 
                        : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                    onClick={() => setBalancingMethod('STAKES_BASED')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="balancingMethod"
                        value="STAKES_BASED"
                        checked={balancingMethod === 'STAKES_BASED'}
                        onChange={() => setBalancingMethod('STAKES_BASED')}
                        className="mr-2"
                      />
                      <span className="font-medium text-white">💰 Basado en Retos</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">
                      {getBalancingExplanation()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Distribución de premios */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Distribución de Premios *
                </label>
                
                <div className="space-y-3">
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      prizeDistribution === 'POSITION_BASED' 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                    onClick={() => setPrizeDistribution('POSITION_BASED')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="prizeDistribution"
                        value="POSITION_BASED"
                        checked={prizeDistribution === 'POSITION_BASED'}
                        onChange={() => setPrizeDistribution('POSITION_BASED')}
                        className="mr-2"
                      />
                      <span className="font-medium text-white">🏆 Por Posición</span>
                      <span className="ml-2 text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                        Popular
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">
                      {getDistributionExplanation()}
                    </p>
                  </div>

                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      prizeDistribution === 'EQUAL_GROUPS' 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                    onClick={() => setPrizeDistribution('EQUAL_GROUPS')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="prizeDistribution"
                        value="EQUAL_GROUPS"
                        checked={prizeDistribution === 'EQUAL_GROUPS'}
                        onChange={() => setPrizeDistribution('EQUAL_GROUPS')}
                        className="mr-2"
                      />
                      <span className="font-medium text-white">⚖️ Grupos Iguales</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">
                      {getDistributionExplanation()}
                    </p>
                  </div>

                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      prizeDistribution === 'TOP_PERFORMERS' 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                    onClick={() => setPrizeDistribution('TOP_PERFORMERS')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="prizeDistribution"
                        value="TOP_PERFORMERS"
                        checked={prizeDistribution === 'TOP_PERFORMERS'}
                        onChange={() => setPrizeDistribution('TOP_PERFORMERS')}
                        className="mr-2"
                      />
                      <span className="font-medium text-white">⭐ Solo los Mejores</span>
                      <span className="ml-2 text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded">
                        Competitivo
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">
                      {getDistributionExplanation()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información sobre cierre automático */}
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-blue-400 mr-3 mt-0.5">🕒</span>
                <div>
                  <h4 className="text-sm font-medium text-blue-100 mb-2">Cierre Automático de Grupos</h4>
                  <div className="text-sm text-blue-200 space-y-1">
                    <p>• Los grupos se formarán automáticamente cuando se llene el cupo</p>
                    <p>• El balanceamiento se ejecutará antes del primer evento deportivo</p>
                    <p>• Los participantes verán su grupo asignado 30 minutos antes del inicio</p>
                    <p>• Sistema inteligente de redistribución en caso de abandonos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción del Reto
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Describe las reglas y objetivos del reto..."
              />
            </div>

            {/* Resumen del reto */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-medium mb-2">⚖️ Resumen del Group Balanced</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Participantes:</span>
                  <span className="text-white">{maxParticipants} jugadores</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Grupos:</span>
                  <span className="text-white">{numGroups} grupos de {groupSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reto individual:</span>
                  <span className="text-white">${stake} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pot total:</span>
                  <span className="text-green-400 font-medium">${(parseFloat(stake) * parseInt(maxParticipants)).toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-yellow-400">2.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Método:</span>
                  <span className="text-blue-400">{
                    balancingMethod === 'SKILL_BASED' ? 'Por Habilidad' :
                    balancingMethod === 'RANDOM' ? 'Aleatorio' :
                    'Por Retos'
                  }</span>
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                ⚖️ Crear Group Balanced
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}