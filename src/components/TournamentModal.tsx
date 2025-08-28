'use client'

import { useState } from 'react';
import { BetType, ResolutionMode, TournamentType } from '@/types/betting';

interface TournamentModalProps {
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
    tournamentType: TournamentType;
    registrationEndTime: string;
    allowIdenticalBets: boolean;
  }) => void;
}

export default function TournamentModal({ isOpen, onClose, onCreateChallenge }: TournamentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stake, setStake] = useState('25');
  const [sport, setSport] = useState('Fútbol');
  const [maxParticipants, setMaxParticipants] = useState('16');
  const [tournamentType, setTournamentType] = useState<TournamentType>(TournamentType.LEAGUE);
  const [registrationEndTime, setRegistrationEndTime] = useState('');
  const [allowIdenticalBets, setAllowIdenticalBets] = useState(false);
  const [resolutionMode, setResolutionMode] = useState<ResolutionMode>(ResolutionMode.MULTI_WINNER);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const challengeData = {
      title,
      description,
      stake: parseFloat(stake),
      sport,
      endDate: '',
      betType: BetType.TOURNAMENT,
      resolutionMode,
      maxParticipants: parseInt(maxParticipants),
      tournamentType,
      registrationEndTime,
      allowIdenticalBets
    };

    onCreateChallenge(challengeData);
    
    // Reset form
    setTitle('');
    setDescription('');
    setStake('25');
    setSport('Fútbol');
    setMaxParticipants('16');
    setTournamentType(TournamentType.LEAGUE);
    setRegistrationEndTime('');
    setAllowIdenticalBets(false);
    setResolutionMode(ResolutionMode.MULTI_WINNER);

    // Redirect after creation
    setTimeout(() => {
      window.location.href = '/sports';
    }, 500);
  };

  const getTournamentExplanation = () => {
    switch (tournamentType) {
      case TournamentType.LEAGUE:
        return 'Todos los participantes compiten entre sí. Los mejores performers ganan según el sistema de puntos acumulativo.';
      case TournamentType.KNOCKOUT:
        return 'Sistema de eliminación directa. Los participantes son eliminados progresivamente hasta que quede un ganador.';
      default:
        return '';
    }
  };

  const getRecommendedParticipants = () => {
    switch (tournamentType) {
      case TournamentType.LEAGUE:
        return '16, 32, 64, 100 participantes recomendados';
      case TournamentType.KNOCKOUT:
        return '8, 16, 32, 64 participantes (potencias de 2)';
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
              <h2 className="text-2xl font-semibold text-white">🏆 Sistema de Torneo</h2>
              <p className="text-gray-400 text-sm">Crear un torneo competitivo estructurado</p>
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
                Título del Torneo *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Ej: Liga Predictiva de Fútbol 2024"
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
                  Entrada por participante (USDC) *
                </label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="25"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Tipo de torneo */}
            <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-medium mb-4">🏆 Tipo de Torneo</h3>
              
              <div className="space-y-3 mb-4">
                {/* LEAGUE Mode */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    tournamentType === TournamentType.LEAGUE 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                  }`}
                  onClick={() => setTournamentType(TournamentType.LEAGUE)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="tournamentType"
                          value={TournamentType.LEAGUE}
                          checked={tournamentType === TournamentType.LEAGUE}
                          onChange={() => setTournamentType(TournamentType.LEAGUE)}
                          className="mr-3 text-green-500"
                        />
                        <span className="font-medium text-white">📊 Liga (League)</span>
                        <span className="ml-2 text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {getTournamentExplanation()}
                      </p>
                      <div className="text-xs text-gray-400">
                        • Todos compiten contra todos
                        • Sistema de puntos acumulativo
                        • Múltiples ganadores posibles
                        • {getRecommendedParticipants()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* KNOCKOUT Mode */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    tournamentType === TournamentType.KNOCKOUT 
                      ? 'border-red-500 bg-red-500/10' 
                      : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                  }`}
                  onClick={() => setTournamentType(TournamentType.KNOCKOUT)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="tournamentType"
                          value={TournamentType.KNOCKOUT}
                          checked={tournamentType === TournamentType.KNOCKOUT}
                          onChange={() => setTournamentType(TournamentType.KNOCKOUT)}
                          className="mr-3 text-red-500"
                        />
                        <span className="font-medium text-white">⚔️ Eliminación Directa (Knockout)</span>
                        <span className="ml-2 text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded">
                          Competitivo
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {getTournamentExplanation()}
                      </p>
                      <div className="text-xs text-gray-400">
                        • Eliminación progresiva por rondas
                        • Solo un ganador final
                        • Brackets automáticos
                        • {getRecommendedParticipants()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuración de participantes */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Participantes * (máximo 100)
                  </label>
                  <select
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="8">8 participantes</option>
                    <option value="16">16 participantes</option>
                    <option value="32">32 participantes</option>
                    <option value="64">64 participantes</option>
                    <option value="100">100 participantes</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Protocolo limita a máximo 100
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cierre de Registro *
                  </label>
                  <input
                    type="datetime-local"
                    value={registrationEndTime}
                    onChange={(e) => setRegistrationEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Opciones avanzadas */}
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white text-sm font-medium">Permitir predicciones idénticas</span>
                    <p className="text-xs text-gray-400">
                      Permite que múltiples usuarios hagan la misma predicción
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowIdenticalBets}
                      onChange={(e) => setAllowIdenticalBets(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modo de resolución */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Modo de Resolución *
              </label>
              <select
                value={resolutionMode}
                onChange={(e) => setResolutionMode(e.target.value as ResolutionMode)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value={ResolutionMode.MULTI_WINNER}>🏆 Multi-Ganador (Recomendado para torneos)</option>
                <option value={ResolutionMode.CLOSEST}>🔥 Más Cercano</option>
                <option value={ResolutionMode.EXACT}>🎯 Exacta</option>
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción del Torneo
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Describe las reglas del torneo y criterios de victoria..."
              />
            </div>

            {/* Resumen del torneo */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-medium mb-2">🏆 Resumen del Torneo</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo:</span>
                  <span className="text-white">
                    {tournamentType === TournamentType.LEAGUE ? 'Liga' : 'Eliminación Directa'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Participantes:</span>
                  <span className="text-white">{maxParticipants} jugadores</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Entrada individual:</span>
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
                  <span className="text-gray-400">Resolución:</span>
                  <span className="text-purple-400">
                    {resolutionMode === ResolutionMode.MULTI_WINNER ? 'Multi-Ganador' :
                     resolutionMode === ResolutionMode.CLOSEST ? 'Más Cercano' : 'Exacta'}
                  </span>
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
                🏆 Crear Torneo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}