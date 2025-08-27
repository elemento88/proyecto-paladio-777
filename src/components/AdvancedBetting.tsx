'use client';

import { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useBetting } from '@/hooks/useBetting';
import { useCompleteBetting } from '@/hooks/useCompleteBetting';
import { BetType, ResolutionMode, OneVsOneMode } from '@/config/contracts';

interface OfferData {
  offerId: number;
  bidder: string;
  amount: string;
}

export default function AdvancedBetting() {
  const { account, isConnected, usdcBalance } = useWeb3();
  const { createBalancedGroupBet } = useBetting();
  const { createPrivateGroup, joinGroup, acceptOffer, loading } = useCompleteBetting();

  // Estados para Apuesta Grupal Balanceada
  const [groupBetData, setGroupBetData] = useState({
    resolutionMode: ResolutionMode.EXACT,
    stakeAmount: '',
    maxParticipants: 8,
    groupSize: 4
  });

  // Estados para Grupos Privados
  const [privateBetId, setPrivateBetId] = useState<number>(0);
  
  // Estados para Unirse a Grupo
  const [joinGroupData, setJoinGroupData] = useState({
    betId: 0,
    groupId: 0,
    predictedValue: 0
  });

  // Estados para 1vs1 y Ofertas
  const [oneVsOneOffers, setOneVsOneOffers] = useState({
    betId: 0,
    amount: '',
    offerIds: [] as number[]
  });

  const [selectedOffers, setSelectedOffers] = useState<string>('');

  const handleCreateBalancedGroupBet = async () => {
    if (!account || !groupBetData.stakeAmount) return;

    try {
      const stakeAmountWei = parseFloat(groupBetData.stakeAmount) * 1e6; // USDC has 6 decimals
      
      const result = await createBalancedGroupBet(
        groupBetData.resolutionMode,
        stakeAmountWei.toString(),
        groupBetData.maxParticipants,
        groupBetData.groupSize
      );

      alert(`Apuesta grupal balanceada creada. ID: ${result.betId}`);
      
      // Reset form
      setGroupBetData({
        resolutionMode: ResolutionMode.EXACT,
        stakeAmount: '',
        maxParticipants: 8,
        groupSize: 4
      });
    } catch (error) {
      console.error('Error creating balanced group bet:', error);
      alert('Error al crear apuesta grupal balanceada');
    }
  };

  const handleCreatePrivateGroup = async () => {
    if (!account || privateBetId <= 0) return;

    try {
      const result = await createPrivateGroup(privateBetId);
      alert(`Grupo privado creado. Group ID: ${result.groupId}`);
    } catch (error) {
      console.error('Error creating private group:', error);
      alert('Error al crear grupo privado');
    }
  };

  const handleJoinGroup = async () => {
    if (!account || joinGroupData.betId <= 0 || joinGroupData.groupId <= 0) return;

    try {
      await joinGroup(joinGroupData.betId, joinGroupData.groupId, joinGroupData.predictedValue);
      alert('Te uniste al grupo exitosamente');
      
      // Reset form
      setJoinGroupData({
        betId: 0,
        groupId: 0,
        predictedValue: 0
      });
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Error al unirse al grupo');
    }
  };

  const handleAcceptOffers = async () => {
    if (!account || oneVsOneOffers.betId <= 0 || !selectedOffers.trim()) return;

    try {
      const offerIds = selectedOffers.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      
      await acceptOffer(oneVsOneOffers.betId, offerIds);
      alert('Ofertas aceptadas exitosamente');
      
      // Reset form
      setSelectedOffers('');
    } catch (error) {
      console.error('Error accepting offers:', error);
      alert('Error al aceptar ofertas');
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Funciones Avanzadas de Apuestas</h3>
        <p className="text-gray-600">Conecta tu wallet para acceder a las funciones avanzadas</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h3 className="text-2xl font-bold mb-6 text-center">🎯 Funciones Avanzadas de Apuestas</h3>

      {/* Balance Info */}
      <div className="bg-blue-50 p-3 rounded-lg mb-6">
        <p className="text-sm text-blue-800">
          <strong>Balance USDC:</strong> {parseFloat(usdcBalance).toFixed(2)} USDC
        </p>
      </div>

      {/* Apuestas Grupales Balanceadas */}
      <div className="border-2 border-green-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">👥 Crear Apuesta Grupal Balanceada</h4>
        <p className="text-sm text-gray-600 mb-4">
          Los participantes se dividen automáticamente en grupos balanceados del tamaño especificado.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modo de Resolución
            </label>
            <select
              value={groupBetData.resolutionMode}
              onChange={(e) => setGroupBetData({ 
                ...groupBetData, 
                resolutionMode: parseInt(e.target.value) as ResolutionMode 
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
            >
              <option value={ResolutionMode.EXACT}>Exacto</option>
              <option value={ResolutionMode.CLOSEST}>Más Cercano</option>
              <option value={ResolutionMode.MULTI_WINNER}>Múltiples Ganadores</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto de Apuesta (USDC)
            </label>
            <input
              type="number"
              value={groupBetData.stakeAmount}
              onChange={(e) => setGroupBetData({ 
                ...groupBetData, 
                stakeAmount: e.target.value 
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              min="0.01"
              step="0.01"
              placeholder="10.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo Participantes
            </label>
            <input
              type="number"
              value={groupBetData.maxParticipants}
              onChange={(e) => setGroupBetData({ 
                ...groupBetData, 
                maxParticipants: parseInt(e.target.value) || 8 
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              min="2"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamaño del Grupo
            </label>
            <input
              type="number"
              value={groupBetData.groupSize}
              onChange={(e) => setGroupBetData({ 
                ...groupBetData, 
                groupSize: parseInt(e.target.value) || 4 
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              min="2"
              max="20"
            />
          </div>
        </div>

        <button
          onClick={handleCreateBalancedGroupBet}
          disabled={loading || !groupBetData.stakeAmount}
          className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear Apuesta Grupal Balanceada'}
        </button>
      </div>

      {/* Grupos Privados */}
      <div className="border-2 border-purple-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">🔐 Gestión de Grupos Privados</h4>
        
        <div className="space-y-4">
          {/* Crear Grupo Privado */}
          <div>
            <h5 className="font-medium mb-2">Crear Grupo Privado</h5>
            <p className="text-sm text-gray-600 mb-2">
              Crea un grupo privado para una apuesta existente. Solo los invitados podrán unirse.
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                value={privateBetId || ''}
                onChange={(e) => setPrivateBetId(parseInt(e.target.value) || 0)}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="ID de la apuesta"
                min="1"
              />
              <button
                onClick={handleCreatePrivateGroup}
                disabled={loading || privateBetId <= 0}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Crear Grupo
              </button>
            </div>
          </div>

          {/* Unirse a Grupo */}
          <div>
            <h5 className="font-medium mb-2">Unirse a Grupo Específico</h5>
            <p className="text-sm text-gray-600 mb-2">
              Únete a un grupo específico de una apuesta si conoces el Group ID.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                type="number"
                value={joinGroupData.betId || ''}
                onChange={(e) => setJoinGroupData({ 
                  ...joinGroupData, 
                  betId: parseInt(e.target.value) || 0 
                })}
                className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Bet ID"
                min="1"
              />
              
              <input
                type="number"
                value={joinGroupData.groupId || ''}
                onChange={(e) => setJoinGroupData({ 
                  ...joinGroupData, 
                  groupId: parseInt(e.target.value) || 0 
                })}
                className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Group ID"
                min="0"
              />
              
              <input
                type="number"
                value={joinGroupData.predictedValue || ''}
                onChange={(e) => setJoinGroupData({ 
                  ...joinGroupData, 
                  predictedValue: parseInt(e.target.value) || 0 
                })}
                className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Predicción"
              />
              
              <button
                onClick={handleJoinGroup}
                disabled={loading || joinGroupData.betId <= 0 || joinGroupData.groupId < 0}
                className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Unirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Funciones 1 vs 1 - Gestión de Ofertas */}
      <div className="border-2 border-orange-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">⚔️ Gestión de Ofertas 1 vs 1</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="font-medium mb-2">Aceptar Ofertas</h5>
            <p className="text-sm text-gray-600 mb-3">
              Acepta una o múltiples ofertas en una apuesta 1vs1 modo mercado. 
              En modo mercado, múltiples personas pueden apostar contra tu predicción.
            </p>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={oneVsOneOffers.betId || ''}
                  onChange={(e) => setOneVsOneOffers({ 
                    ...oneVsOneOffers, 
                    betId: parseInt(e.target.value) || 0 
                  })}
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="ID de apuesta 1vs1"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IDs de Ofertas (separados por comas)
                </label>
                <input
                  type="text"
                  value={selectedOffers}
                  onChange={(e) => setSelectedOffers(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="1, 2, 3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deja vacío para aceptar todas las ofertas disponibles
                </p>
              </div>
              
              <button
                onClick={handleAcceptOffers}
                disabled={loading || oneVsOneOffers.betId <= 0}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Aceptando...' : 'Aceptar Ofertas'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Información y Tips */}
      <div className="border-2 border-blue-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">💡 Información y Tips</h4>
        
        <div className="space-y-3 text-sm">
          <div>
            <strong>Apuestas Grupales Balanceadas:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
              <li>Los participantes se dividen automáticamente en grupos del tamaño especificado</li>
              <li>Cada grupo compite contra los demás grupos</li>
              <li>Ideal para competencias entre equipos</li>
            </ul>
          </div>
          
          <div>
            <strong>Grupos Privados:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
              <li>Solo pueden unirse las personas que conozcas el Group ID</li>
              <li>Útil para competencias privadas entre amigos</li>
              <li>Requiere invitación o conocimiento del ID del grupo</li>
            </ul>
          </div>
          
          <div>
            <strong>Ofertas 1vs1:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
              <li>Modo Clásico: Un jugador vs un jugador</li>
              <li>Modo Mercado: Un jugador vs múltiples ofertas</li>
              <li>Puedes aceptar ofertas específicas o todas las disponibles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}