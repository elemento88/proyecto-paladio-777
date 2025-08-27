'use client';

import { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useCompleteBetting } from '@/hooks/useCompleteBetting';

export default function AdminPanel() {
  const { account, isConnected } = useWeb3();
  const { 
    setGeneralFee,
    setTournamentFee,
    setTopWinners,
    setDistributionLarge,
    setDistributionSmall,
    setDefaultOracle,
    pauseContract,
    unpauseContract,
    grantRole,
    revokeRole,
    hasRole,
    getProtocolInfo,
    resolveSimpleBet,
    resolveOneVsOneBet,
    resolveBalancedGroupBet,
    refundBet,
    lockBet,
    loading 
  } = useCompleteBetting();

  // Estados para formularios
  const [generalFee, setGeneralFeeState] = useState<number>(500); // 5%
  const [tournamentFee, setTournamentFeeState] = useState<number>(300); // 3%
  const [topWinnersLarge, setTopWinnersLargeState] = useState<number>(10);
  const [topWinnersSmall, setTopWinnersSmallState] = useState<number>(5);
  const [oracleAddress, setOracleAddress] = useState<string>('');

  // Distribuciones
  const [largeDist, setLargeDist] = useState<string>('5000,3000,2000'); // 50%, 30%, 20%
  const [smallDist, setSmallDist] = useState<string>('6000,4000'); // 60%, 40%

  // Control de acceso
  const [roleAddress, setRoleAddress] = useState<string>('');
  const [roleType, setRoleType] = useState<string>('ORACLE_ROLE');

  // Resolución de apuestas
  const [resolveBetId, setResolveBetId] = useState<number>(0);
  const [winningValue, setWinningValue] = useState<number>(0);
  const [outcome, setOutcome] = useState<number>(0);

  // Estados de información
  const [protocolInfo, setProtocolInfoState] = useState<any>(null);
  const [roleCheckResult, setRoleCheckResult] = useState<string>('');

  const handleSetGeneralFee = async () => {
    if (!account) return;

    try {
      await setGeneralFee(generalFee);
      alert(`Fee general actualizado a ${generalFee / 100}%`);
    } catch (error) {
      console.error('Error setting general fee:', error);
      alert('Error al actualizar fee general');
    }
  };

  const handleSetTournamentFee = async () => {
    if (!account) return;

    try {
      await setTournamentFee(tournamentFee);
      alert(`Fee de torneo actualizado a ${tournamentFee / 100}%`);
    } catch (error) {
      console.error('Error setting tournament fee:', error);
      alert('Error al actualizar fee de torneo');
    }
  };

  const handleSetTopWinners = async () => {
    if (!account) return;

    try {
      await setTopWinners(topWinnersLarge, topWinnersSmall);
      alert('Top winners actualizados exitosamente');
    } catch (error) {
      console.error('Error setting top winners:', error);
      alert('Error al actualizar top winners');
    }
  };

  const handleSetDistributionLarge = async () => {
    if (!account) return;

    try {
      const distribution = largeDist.split(',').map(d => parseInt(d.trim()));
      await setDistributionLarge(distribution);
      alert('Distribución de torneos grandes actualizada');
    } catch (error) {
      console.error('Error setting large distribution:', error);
      alert('Error al actualizar distribución');
    }
  };

  const handleSetDistributionSmall = async () => {
    if (!account) return;

    try {
      const distribution = smallDist.split(',').map(d => parseInt(d.trim()));
      await setDistributionSmall(distribution);
      alert('Distribución de torneos pequeños actualizada');
    } catch (error) {
      console.error('Error setting small distribution:', error);
      alert('Error al actualizar distribución');
    }
  };

  const handleSetDefaultOracle = async () => {
    if (!account || !oracleAddress.trim()) return;

    try {
      await setDefaultOracle(oracleAddress);
      alert('Oráculo por defecto actualizado');
    } catch (error) {
      console.error('Error setting default oracle:', error);
      alert('Error al actualizar oráculo');
    }
  };

  const handlePauseContract = async () => {
    if (!account) return;

    try {
      await pauseContract();
      alert('Contrato pausado');
    } catch (error) {
      console.error('Error pausing contract:', error);
      alert('Error al pausar contrato');
    }
  };

  const handleUnpauseContract = async () => {
    if (!account) return;

    try {
      await unpauseContract();
      alert('Contrato reanudado');
    } catch (error) {
      console.error('Error unpausing contract:', error);
      alert('Error al reanudar contrato');
    }
  };

  const handleGrantRole = async () => {
    if (!account || !roleAddress.trim()) return;

    try {
      await grantRole(roleType, roleAddress);
      alert(`Rol ${roleType} otorgado a ${roleAddress}`);
    } catch (error) {
      console.error('Error granting role:', error);
      alert('Error al otorgar rol');
    }
  };

  const handleRevokeRole = async () => {
    if (!account || !roleAddress.trim()) return;

    try {
      await revokeRole(roleType, roleAddress);
      alert(`Rol ${roleType} revocado de ${roleAddress}`);
    } catch (error) {
      console.error('Error revoking role:', error);
      alert('Error al revocar rol');
    }
  };

  const handleCheckRole = async () => {
    if (!roleAddress.trim()) return;

    try {
      const hasRoleResult = await hasRole(roleType, roleAddress);
      setRoleCheckResult(`${roleAddress} ${hasRoleResult ? 'TIENE' : 'NO TIENE'} el rol ${roleType}`);
    } catch (error) {
      console.error('Error checking role:', error);
      setRoleCheckResult('Error al verificar rol');
    }
  };

  const handleLoadProtocolInfo = async () => {
    try {
      const info = await getProtocolInfo();
      setProtocolInfoState(info);
    } catch (error) {
      console.error('Error loading protocol info:', error);
      alert('Error al cargar información del protocolo');
    }
  };

  const handleResolveSimpleBet = async () => {
    if (!account || resolveBetId <= 0) return;

    try {
      await resolveSimpleBet(resolveBetId, winningValue);
      alert(`Apuesta simple ${resolveBetId} resuelta con valor ganador: ${winningValue}`);
    } catch (error) {
      console.error('Error resolving simple bet:', error);
      alert('Error al resolver apuesta simple');
    }
  };

  const handleResolveOneVsOneBet = async () => {
    if (!account || resolveBetId <= 0) return;

    try {
      await resolveOneVsOneBet(resolveBetId, outcome);
      alert(`Apuesta 1vs1 ${resolveBetId} resuelta con resultado: ${outcome}`);
    } catch (error) {
      console.error('Error resolving 1vs1 bet:', error);
      alert('Error al resolver apuesta 1vs1');
    }
  };

  const handleResolveGroupBet = async () => {
    if (!account || resolveBetId <= 0) return;

    try {
      await resolveBalancedGroupBet(resolveBetId, winningValue);
      alert(`Apuesta grupal ${resolveBetId} resuelta con valor ganador: ${winningValue}`);
    } catch (error) {
      console.error('Error resolving group bet:', error);
      alert('Error al resolver apuesta grupal');
    }
  };

  const handleRefundBet = async () => {
    if (!account || resolveBetId <= 0) return;

    try {
      await refundBet(resolveBetId);
      alert(`Apuesta ${resolveBetId} reembolsada`);
    } catch (error) {
      console.error('Error refunding bet:', error);
      alert('Error al reembolsar apuesta');
    }
  };

  const handleLockBet = async () => {
    if (!account || resolveBetId <= 0) return;

    try {
      await lockBet(resolveBetId);
      alert(`Apuesta ${resolveBetId} bloqueada`);
    } catch (error) {
      console.error('Error locking bet:', error);
      alert('Error al bloquear apuesta');
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Panel de Administración</h3>
        <p className="text-gray-600">Conecta tu wallet para acceder al panel de admin</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h3 className="text-2xl font-bold mb-6 text-center">⚙️ Panel de Administración</h3>

      {/* Información del Protocolo */}
      <div className="border-2 border-blue-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">📊 Información del Protocolo</h4>
        
        <button
          onClick={handleLoadProtocolInfo}
          disabled={loading}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Cargar Info'}
        </button>

        {protocolInfo && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded">
            <div><strong>Pausado:</strong> {protocolInfo.isPaused ? 'Sí' : 'No'}</div>
            <div><strong>Fee General:</strong> {protocolInfo.generalFee / 100}%</div>
            <div><strong>Fee Torneo:</strong> {protocolInfo.tournamentFee / 100}%</div>
            <div><strong>Total Apuestas:</strong> {protocolInfo.betCount}</div>
            <div><strong>Total Torneos:</strong> {protocolInfo.tournamentCount}</div>
            <div><strong>Max Participantes:</strong> {protocolInfo.maxParticipants}</div>
            <div><strong>Winners Large:</strong> {protocolInfo.topWinnersLarge}</div>
            <div><strong>Winners Small:</strong> {protocolInfo.topWinnersSmall}</div>
          </div>
        )}
      </div>

      {/* Configuración de Fees */}
      <div className="border-2 border-green-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">💰 Configuración de Fees</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee General (basis points)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={generalFee}
                onChange={(e) => setGeneralFeeState(parseInt(e.target.value) || 500)}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500"
                min="0"
                max="10000"
              />
              <button
                onClick={handleSetGeneralFee}
                disabled={loading}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Actualizar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{generalFee / 100}% - 100 = 1%</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee Torneo (basis points)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={tournamentFee}
                onChange={(e) => setTournamentFeeState(parseInt(e.target.value) || 300)}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500"
                min="0"
                max="10000"
              />
              <button
                onClick={handleSetTournamentFee}
                disabled={loading}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Actualizar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{tournamentFee / 100}% - 100 = 1%</p>
          </div>
        </div>
      </div>

      {/* Configuración de Torneos */}
      <div className="border-2 border-purple-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">🏆 Configuración de Torneos</h4>
        
        <div className="space-y-4">
          {/* Top Winners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top Winners Large
              </label>
              <input
                type="number"
                value={topWinnersLarge}
                onChange={(e) => setTopWinnersLargeState(parseInt(e.target.value) || 10)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top Winners Small
              </label>
              <input
                type="number"
                value={topWinnersSmall}
                onChange={(e) => setTopWinnersSmallState(parseInt(e.target.value) || 5)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                min="1"
                max="20"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSetTopWinners}
                disabled={loading}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Actualizar Winners
              </button>
            </div>
          </div>

          {/* Distribuciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distribución Large (basis points separados por comas)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={largeDist}
                  onChange={(e) => setLargeDist(e.target.value)}
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-purple-500"
                  placeholder="5000,3000,2000"
                />
                <button
                  onClick={handleSetDistributionLarge}
                  disabled={loading}
                  className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
                >
                  Set
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distribución Small (basis points separados por comas)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={smallDist}
                  onChange={(e) => setSmallDist(e.target.value)}
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-purple-500"
                  placeholder="6000,4000"
                />
                <button
                  onClick={handleSetDistributionSmall}
                  disabled={loading}
                  className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Oráculo */}
      <div className="border-2 border-orange-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">🔮 Configuración de Oráculo</h4>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={oracleAddress}
            onChange={(e) => setOracleAddress(e.target.value)}
            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-orange-500"
            placeholder="Dirección del oráculo por defecto"
          />
          <button
            onClick={handleSetDefaultOracle}
            disabled={loading || !oracleAddress.trim()}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            Establecer Oráculo
          </button>
        </div>
      </div>

      {/* Control del Contrato */}
      <div className="border-2 border-red-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">🛑 Control del Contrato</h4>
        
        <div className="flex gap-2">
          <button
            onClick={handlePauseContract}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Pausar Contrato
          </button>
          
          <button
            onClick={handleUnpauseContract}
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Reanudar Contrato
          </button>
        </div>
      </div>

      {/* Control de Acceso */}
      <div className="border-2 border-indigo-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">🔐 Control de Acceso</h4>
        
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={roleType}
              onChange={(e) => setRoleType(e.target.value)}
              className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ORACLE_ROLE">ORACLE_ROLE</option>
              <option value="DEFAULT_ADMIN_ROLE">DEFAULT_ADMIN_ROLE</option>
            </select>
            
            <input
              type="text"
              value={roleAddress}
              onChange={(e) => setRoleAddress(e.target.value)}
              className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Dirección del usuario"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleGrantRole}
              disabled={loading || !roleAddress.trim()}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Otorgar Rol
            </button>
            
            <button
              onClick={handleRevokeRole}
              disabled={loading || !roleAddress.trim()}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Revocar Rol
            </button>
            
            <button
              onClick={handleCheckRole}
              disabled={!roleAddress.trim()}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Verificar Rol
            </button>
          </div>

          {roleCheckResult && (
            <div className="p-2 bg-gray-100 rounded text-sm">
              {roleCheckResult}
            </div>
          )}
        </div>
      </div>

      {/* Resolución de Apuestas (Oracle Functions) */}
      <div className="border-2 border-yellow-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">⚖️ Resolución de Apuestas (Oráculo)</h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="number"
              value={resolveBetId || ''}
              onChange={(e) => setResolveBetId(parseInt(e.target.value) || 0)}
              className="p-2 border rounded focus:ring-2 focus:ring-yellow-500"
              placeholder="ID de Apuesta"
              min="1"
            />
            
            <input
              type="number"
              value={winningValue || ''}
              onChange={(e) => setWinningValue(parseInt(e.target.value) || 0)}
              className="p-2 border rounded focus:ring-2 focus:ring-yellow-500"
              placeholder="Valor Ganador"
            />
            
            <input
              type="number"
              value={outcome || ''}
              onChange={(e) => setOutcome(parseInt(e.target.value) || 0)}
              className="p-2 border rounded focus:ring-2 focus:ring-yellow-500"
              placeholder="Resultado (0,1,2)"
              min="0"
              max="2"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={handleResolveSimpleBet}
              disabled={loading || resolveBetId <= 0}
              className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 text-sm"
            >
              Resolver Simple
            </button>
            
            <button
              onClick={handleResolveOneVsOneBet}
              disabled={loading || resolveBetId <= 0}
              className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 text-sm"
            >
              Resolver 1vs1
            </button>
            
            <button
              onClick={handleResolveGroupBet}
              disabled={loading || resolveBetId <= 0}
              className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 text-sm"
            >
              Resolver Grupal
            </button>
            
            <button
              onClick={handleRefundBet}
              disabled={loading || resolveBetId <= 0}
              className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
            >
              Reembolsar
            </button>
            
            <button
              onClick={handleLockBet}
              disabled={loading || resolveBetId <= 0}
              className="bg-orange-600 text-white px-3 py-2 rounded hover:bg-orange-700 disabled:opacity-50 text-sm"
            >
              Bloquear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}