'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useCompleteBetting, TournamentInfo } from '@/hooks/useCompleteBetting';
import { TournamentType, ResolutionMode } from '@/config/contracts';

export default function TournamentManager() {
  const { account, isConnected } = useWeb3();
  const { 
    createTournament, 
    registerForTournament,
    startTournament,
    pauseTournament,
    resumeTournament,
    cancelTournament,
    resolveTournament,
    updateLeaguePoints,
    advanceKnockoutRound,
    getTournamentInfo,
    loading 
  } = useCompleteBetting();

  const [tournamentData, setTournamentData] = useState({
    tournamentType: TournamentType.LEAGUE,
    resolutionMode: ResolutionMode.EXACT,
    maxParticipants: 10,
    allowIdenticalBets: false,
    registrationEndTime: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
  });

  const [selectedTournamentId, setSelectedTournamentId] = useState<number>(0);
  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfo | null>(null);
  const [winners, setWinners] = useState<string>('');
  const [isLarge, setIsLarge] = useState(false);

  // League points management
  const [playersString, setPlayersString] = useState<string>('');
  const [pointsString, setPointsString] = useState<string>('');

  const handleCreateTournament = async () => {
    if (!account) return;

    try {
      await createTournament(
        tournamentData.tournamentType,
        tournamentData.resolutionMode,
        tournamentData.maxParticipants,
        tournamentData.allowIdenticalBets,
        tournamentData.registrationEndTime
      );
      alert('Torneo creado exitosamente');
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Error al crear torneo');
    }
  };

  const handleRegisterForTournament = async () => {
    if (!account || selectedTournamentId <= 0) return;

    try {
      await registerForTournament(selectedTournamentId);
      alert('Registrado al torneo exitosamente');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error al registrarse');
    }
  };

  const handleStartTournament = async () => {
    if (!account || selectedTournamentId <= 0) return;

    try {
      await startTournament(selectedTournamentId);
      alert('Torneo iniciado');
    } catch (error) {
      console.error('Error starting tournament:', error);
      alert('Error al iniciar torneo');
    }
  };

  const handlePauseTournament = async () => {
    if (!account || selectedTournamentId <= 0) return;

    try {
      await pauseTournament(selectedTournamentId);
      alert('Torneo pausado');
    } catch (error) {
      console.error('Error pausing tournament:', error);
      alert('Error al pausar torneo');
    }
  };

  const handleResumeTournament = async () => {
    if (!account || selectedTournamentId <= 0) return;

    try {
      await resumeTournament(selectedTournamentId);
      alert('Torneo reanudado');
    } catch (error) {
      console.error('Error resuming tournament:', error);
      alert('Error al reanudar torneo');
    }
  };

  const handleCancelTournament = async () => {
    if (!account || selectedTournamentId <= 0) return;

    try {
      await cancelTournament(selectedTournamentId);
      alert('Torneo cancelado');
    } catch (error) {
      console.error('Error cancelling tournament:', error);
      alert('Error al cancelar torneo');
    }
  };

  const handleResolveTournament = async () => {
    if (!account || selectedTournamentId <= 0 || !winners.trim()) return;

    try {
      const winnerAddresses = winners.split(',').map(addr => addr.trim());
      await resolveTournament(selectedTournamentId, winnerAddresses, isLarge);
      alert('Torneo resuelto exitosamente');
    } catch (error) {
      console.error('Error resolving tournament:', error);
      alert('Error al resolver torneo');
    }
  };

  const handleUpdateLeaguePoints = async () => {
    if (!account || selectedTournamentId <= 0 || !playersString.trim() || !pointsString.trim()) return;

    try {
      const players = playersString.split(',').map(addr => addr.trim());
      const points = pointsString.split(',').map(p => parseInt(p.trim()));
      
      if (players.length !== points.length) {
        alert('El número de jugadores y puntos debe coincidir');
        return;
      }

      await updateLeaguePoints(selectedTournamentId, players, points);
      alert('Puntos de liga actualizados');
    } catch (error) {
      console.error('Error updating league points:', error);
      alert('Error al actualizar puntos');
    }
  };

  const handleAdvanceKnockout = async () => {
    if (!account || selectedTournamentId <= 0 || !winners.trim()) return;

    try {
      const winnerAddresses = winners.split(',').map(addr => addr.trim());
      await advanceKnockoutRound(selectedTournamentId, winnerAddresses);
      alert('Ronda eliminatoria avanzada');
    } catch (error) {
      console.error('Error advancing knockout:', error);
      alert('Error al avanzar ronda');
    }
  };

  const loadTournamentInfo = async () => {
    if (selectedTournamentId <= 0) return;

    try {
      const info = await getTournamentInfo(selectedTournamentId);
      setTournamentInfo(info);
    } catch (error) {
      console.error('Error loading tournament info:', error);
    }
  };

  useEffect(() => {
    if (selectedTournamentId > 0) {
      loadTournamentInfo();
    }
  }, [selectedTournamentId]);

  if (!isConnected) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Gestión de Torneos</h3>
        <p className="text-gray-600">Conecta tu wallet para gestionar torneos</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h3 className="text-2xl font-bold mb-6 text-center">🏆 Gestión de Torneos</h3>

      {/* Crear Torneo */}
      <div className="border-2 border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">➕ Crear Nuevo Torneo</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Torneo
            </label>
            <select
              value={tournamentData.tournamentType}
              onChange={(e) => setTournamentData({ 
                ...tournamentData, 
                tournamentType: parseInt(e.target.value) as TournamentType 
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value={TournamentType.LEAGUE}>Liga</option>
              <option value={TournamentType.KNOCKOUT}>Eliminatorio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modo de Resolución
            </label>
            <select
              value={tournamentData.resolutionMode}
              onChange={(e) => setTournamentData({ 
                ...tournamentData, 
                resolutionMode: parseInt(e.target.value) as ResolutionMode 
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value={ResolutionMode.EXACT}>Exacto</option>
              <option value={ResolutionMode.CLOSEST}>Más Cercano</option>
              <option value={ResolutionMode.MULTI_WINNER}>Múltiples Ganadores</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo Participantes
            </label>
            <input
              type="number"
              value={tournamentData.maxParticipants}
              onChange={(e) => setTournamentData({ 
                ...tournamentData, 
                maxParticipants: parseInt(e.target.value) || 10 
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              min="2"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fin de Registro (horas desde ahora)
            </label>
            <input
              type="number"
              onChange={(e) => setTournamentData({ 
                ...tournamentData, 
                registrationEndTime: Math.floor(Date.now() / 1000) + (parseInt(e.target.value) || 24) * 3600
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              min="1"
              max="168"
              defaultValue="24"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={tournamentData.allowIdenticalBets}
                onChange={(e) => setTournamentData({ 
                  ...tournamentData, 
                  allowIdenticalBets: e.target.checked 
                })}
                className="mr-2"
              />
              <span className="text-sm">Permitir apuestas idénticas</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleCreateTournament}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear Torneo'}
        </button>
      </div>

      {/* Gestión de Torneo Existente */}
      <div className="border-2 border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">🔧 Gestionar Torneo Existente</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID del Torneo
          </label>
          <input
            type="number"
            value={selectedTournamentId || ''}
            onChange={(e) => setSelectedTournamentId(parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            min="1"
            placeholder="Ingresa el ID del torneo"
          />
        </div>

        {tournamentInfo && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h5 className="font-semibold mb-2">Información del Torneo</h5>
            <p><strong>Tipo:</strong> {tournamentInfo.config.tournamentType === 0 ? 'Liga' : 'Eliminatorio'}</p>
            <p><strong>Modo:</strong> {['Exacto', 'Más Cercano', 'Múltiple'][tournamentInfo.config.resolutionMode]}</p>
            <p><strong>Max Participantes:</strong> {tournamentInfo.config.maxParticipants}</p>
            <p><strong>Ronda Actual:</strong> {tournamentInfo.currentRound}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <button
            onClick={handleRegisterForTournament}
            disabled={loading || selectedTournamentId <= 0}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            Registrarse
          </button>
          
          <button
            onClick={handleStartTournament}
            disabled={loading || selectedTournamentId <= 0}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            Iniciar
          </button>
          
          <button
            onClick={handlePauseTournament}
            disabled={loading || selectedTournamentId <= 0}
            className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 text-sm"
          >
            Pausar
          </button>
          
          <button
            onClick={handleResumeTournament}
            disabled={loading || selectedTournamentId <= 0}
            className="bg-orange-600 text-white px-3 py-2 rounded hover:bg-orange-700 disabled:opacity-50 text-sm"
          >
            Reanudar
          </button>
        </div>

        <button
          onClick={handleCancelTournament}
          disabled={loading || selectedTournamentId <= 0}
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 mb-4"
        >
          Cancelar Torneo
        </button>
      </div>

      {/* Resolución de Torneo */}
      <div className="border-2 border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">🏁 Resolución de Torneo</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Direcciones de Ganadores (separadas por comas)
          </label>
          <textarea
            value={winners}
            onChange={(e) => setWinners(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="0x123..., 0x456..., 0x789..."
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isLarge}
              onChange={(e) => setIsLarge(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Es torneo grande (más distribución de premios)</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleResolveTournament}
            disabled={loading || selectedTournamentId <= 0 || !winners.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Resolver Torneo
          </button>
          
          <button
            onClick={handleAdvanceKnockout}
            disabled={loading || selectedTournamentId <= 0 || !winners.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            Avanzar Eliminatoria
          </button>
        </div>
      </div>

      {/* Liga - Actualizar Puntos */}
      <div className="border-2 border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">📊 Actualizar Puntos de Liga</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jugadores (direcciones separadas por comas)
            </label>
            <textarea
              value={playersString}
              onChange={(e) => setPlayersString(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="0x123..., 0x456..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puntos (números separados por comas)
            </label>
            <textarea
              value={pointsString}
              onChange={(e) => setPointsString(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="10, 8, 6, 4..."
            />
          </div>
        </div>

        <button
          onClick={handleUpdateLeaguePoints}
          disabled={loading || selectedTournamentId <= 0 || !playersString.trim() || !pointsString.trim()}
          className="w-full bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
        >
          Actualizar Puntos
        </button>
      </div>
    </div>
  );
}