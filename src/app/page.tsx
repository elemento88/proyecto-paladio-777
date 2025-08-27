'use client'

import { useState } from 'react';
import Link from 'next/link';
import { SportCategory, BettingChallenge, Position, UserProfile } from '@/types/betting';
import { WalletConnection } from '@/components/WalletConnection';
import UserPanel from '@/components/UserPanel';
import BetModal from '@/components/BetModal';
import OneVsOneModal from '@/components/OneVsOneModal';
import BetTypeSelector, { BetTypeOption } from '@/components/BetTypeSelector';
import CreateBetView from '@/components/CreateBetView';
import { useBalance } from '@/hooks/useBalance';

const mockSportsCategories: SportCategory[] = [
  { id: 'todos', name: 'Todos', icon: '🏆', count: 255 },
  { id: 'futbol', name: 'Fútbol', icon: '⚽', count: 45 },
  { id: 'baloncesto', name: 'Baloncesto', icon: '🏀', count: 32 },
  { id: 'tenis', name: 'Tenis', icon: '🎾', count: 28 },
  { id: 'beisbol', name: 'Béisbol', icon: '⚾', count: 18 },
  { id: 'futbol-americano', name: 'Fútbol Americano', icon: '🏈', count: 22 },
  { id: 'golf', name: 'Golf', icon: '⛳', count: 15 },
  { id: 'hockey', name: 'Hockey', icon: '🏒', count: 12 },
  { id: 'rugby', name: 'Rugby', icon: '🏉', count: 8 },
  { id: 'voleibol', name: 'Voleibol', icon: '🏐', count: 10 },
];

const mockChallenges: BettingChallenge[] = [
  {
    id: '1',
    title: 'Real Madrid vs Barcelona',
    type: 'Battle Royal',
    description: 'El Clásico - Predicción del resultado final',
    stake: '$50',
    participants: '12/20',
    timeRemaining: '2h 45m',
    creator: '0x1234...5678',
    odds: '1.85x',
    category: 'Liga Española',
    sport: 'Fútbol',
    endDate: '28/1, 20:00',
    icon: '⚽',
    iconBg: 'bg-green-500'
  },
  {
    id: '2',
    title: 'Lakers Total Points',
    type: 'Pool Grupal',
    description: 'NBA - Predicción de puntos totales Lakers vs Warriors',
    stake: '$75',
    participants: '8/15',
    timeRemaining: '5h 15m',
    creator: '0x8765...4321',
    odds: '2.10x',
    category: 'NBA',
    sport: 'Baloncesto',
    endDate: '28/1, 22:30',
    icon: '🏀',
    iconBg: 'bg-orange-500'
  },
  {
    id: '3',
    title: 'Chelsea vs Manchester United',
    type: '1v1 Duel',
    description: 'Premier League - Duelo directo predicción',
    stake: '$100',
    participants: '1/2',
    timeRemaining: '1 día 3h',
    creator: '0xabcd...efgh',
    odds: '1.92x',
    category: 'Premier League',
    sport: 'Fútbol',
    endDate: '29/1, 16:30',
    icon: '⚽',
    iconBg: 'bg-blue-500'
  },
  {
    id: '4',
    title: 'Tennis Masters 1000',
    type: 'Tournament',
    description: 'ATP Masters - Predicción del ganador',
    stake: '$25',
    participants: '16/32',
    timeRemaining: '3 días',
    creator: '0x9876...5432',
    odds: '3.20x',
    category: 'ATP',
    sport: 'Tenis',
    endDate: '31/1, 14:00',
    icon: '🎾',
    iconBg: 'bg-yellow-500'
  },
  {
    id: '5',
    title: 'Super Bowl LVIII',
    type: 'Tournament',
    description: 'NFL Championship - Predicción del campeón',
    stake: '$200',
    participants: '45/50',
    timeRemaining: '6h 30m',
    creator: '0xdef0...1234',
    odds: '2.75x',
    category: 'NFL',
    sport: 'Fútbol Americano',
    endDate: '28/1, 23:30',
    icon: '🏈',
    iconBg: 'bg-purple-500'
  }
];


const mockUser: UserProfile = {
  username: '77paladio',
  network: 'Polygon Amoy Testnet',
  balance: '$1,250.00 USDC',
  gasPrice: '25 Gwei'
};

export default function Home() {
  const [selectedSport, setSelectedSport] = useState('futbol');
  const [mainTab, setMainTab] = useState('retos'); // puede ser 'retos', 'crear' o 'configurar'
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState('50');
  const [userPrediction, setUserPrediction] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOneVsOneModal, setShowOneVsOneModal] = useState(false);
  const [showBetTypeSelector, setShowBetTypeSelector] = useState(false);
  const [selectedBetType, setSelectedBetType] = useState<BetTypeOption | null>(null);
  const [activeChallenges, setActiveChallenges] = useState(mockChallenges);
  const { addTransaction, updateBalance } = useBalance();

  // Estados para la configuración de apuesta
  const [selectedBetTypeCard, setSelectedBetTypeCard] = useState<any>(null);
  const [configFormData, setConfigFormData] = useState({
    title: '',
    description: '',
    betAmount: '50',
    maxParticipants: '20',
    endDateTime: '',
    resolutionMode: 'EXACT',
    isPublic: true,
    category: 'General'
  });

  const handleJoinBet = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    setShowJoinModal(true);
  };

  const confirmJoinBet = () => {
    console.log('Joining bet:', selectedChallenge, 'Amount:', betAmount, 'Prediction:', userPrediction);
    
    const challenge = activeChallenges.find(c => c.id === selectedChallenge);
    if (!challenge) return;

    // Actualizar participantes
    const updatedChallenges = activeChallenges.map(c => {
      if (c.id === selectedChallenge) {
        const [current, max] = c.participants.split('/');
        return {
          ...c,
          participants: `${parseInt(current) + 1}/${max}`
        };
      }
      return c;
    });
    setActiveChallenges(updatedChallenges);

    // Agregar transacción
    addTransaction({
      type: 'BET_PLACED',
      betId: selectedChallenge,
      betTitle: challenge.title,
      amount: `-${betAmount}.00`,
      status: 'COMPLETED'
    });

    // Actualizar balance
    updateBalance(parseFloat(betAmount), 'bet');
    
    setShowJoinModal(false);
    setSelectedChallenge(null);
    setBetAmount('50');
    setUserPrediction('');
  };

  const handleCreateBet = (betData: {
    title: string;
    betType: BetType;
    resolutionMode: ResolutionMode;
    stake: string;
    maxParticipants: number;
    endDate: string;
    description: string;
    sport: string;
    creator: string;
  }) => {
    const newChallenge: BettingChallenge = {
      id: (activeChallenges.length + 1).toString(),
      title: betData.title,
      type: betData.betType === 'SIMPLE' ? 'Battle Royal' : 
            betData.betType === 'TOURNAMENT' ? 'Tournament' :
            betData.betType === 'GROUP_BALANCED' ? 'Pool Grupal' : '1v1 Duel',
      description: betData.description || `${betData.sport} - Reto personalizado`,
      stake: `$${betData.stake}`,
      participants: `1/${betData.maxParticipants}`,
      timeRemaining: '2 días',
      creator: betData.creator,
      odds: '2.00x',
      category: betData.sport,
      sport: betData.sport,
      endDate: new Date(betData.endDate).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      icon: betData.sport === 'Fútbol' ? '⚽' :
            betData.sport === 'Baloncesto' ? '🏀' :
            betData.sport === 'Tenis' ? '🎾' :
            betData.sport === 'Béisbol' ? '⚾' :
            betData.sport === 'Fútbol Americano' ? '🏈' : '🏆',
      iconBg: 'bg-blue-500'
    };
    
    // Agregar transacción por crear apuesta
    addTransaction({
      type: 'BET_PLACED',
      betId: newChallenge.id,
      betTitle: newChallenge.title,
      amount: `-${betData.stake}.00`,
      status: 'COMPLETED'
    });

    // Actualizar balance
    updateBalance(parseFloat(betData.stake), 'bet');

    setActiveChallenges([newChallenge, ...activeChallenges]);
    setShowCreateModal(false);
  };

  const handleCreateOneVsOne = (challengeData: {
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
  }) => {
    const newChallenge: BettingChallenge = {
      id: (activeChallenges.length + 1).toString(),
      title: challengeData.title,
      type: '1v1 Duel',
      description: challengeData.description || `${challengeData.sport} - Duelo 1v1`,
      stake: `$${challengeData.stake}`,
      participants: '1/2',
      timeRemaining: '2 días',
      creator: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4),
      odds: '1.95x',
      category: challengeData.sport,
      sport: challengeData.sport,
      endDate: new Date(challengeData.endDate).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      icon: challengeData.sport === 'Fútbol' ? '⚽' :
            challengeData.sport === 'Baloncesto' ? '🏀' :
            challengeData.sport === 'Tenis' ? '🎾' :
            challengeData.sport === 'Béisbol' ? '⚾' :
            challengeData.sport === 'Fútbol Americano' ? '🏈' : '⚔️',
      iconBg: 'bg-purple-500'
    };
    
    // Agregar transacción por crear duelo 1v1
    addTransaction({
      type: 'BET_PLACED',
      betId: newChallenge.id,
      betTitle: newChallenge.title,
      amount: `-${challengeData.stake}.00`,
      status: 'COMPLETED'
    });

    // Actualizar balance
    updateBalance(challengeData.stake, 'bet');

    setActiveChallenges([newChallenge, ...activeChallenges]);
    setShowOneVsOneModal(false);
  };

  const handleBetTypeSelection = (betType: BetTypeOption) => {
    setSelectedBetType(betType);
    setShowBetTypeSelector(false);
    
    // Abrir el modal correspondiente según el tipo
    if (betType.id === 'one_vs_one') {
      setShowOneVsOneModal(true);
    } else {
      setShowCreateModal(true);
    }
  };

  const handleCreateBetFromView = (betTypeCard: { 
    id: string; 
    title: string; 
    description: string; 
    icon: string; 
  }) => {
    // Guardar la información del tipo de apuesta seleccionado
    setSelectedBetTypeCard(betTypeCard);
    
    // Configurar valores por defecto según el tipo de apuesta
    const defaultValues = {
      maxParticipants: betTypeCard.id === 'battle-royal' ? '20' :
                      betTypeCard.id === 'pool-grupal' ? '15' :
                      betTypeCard.id === 'desafio-1v1' ? '2' :
                      betTypeCard.id === 'liga-por-puntos' ? '50' : '20',
      betAmount: betTypeCard.id === 'battle-royal' ? '50' :
                betTypeCard.id === 'pool-grupal' ? '25' :
                betTypeCard.id === 'desafio-1v1' ? '100' :
                betTypeCard.id === 'liga-por-puntos' ? '25' : '50',
      resolutionMode: betTypeCard.id === 'mercado-over-under' ? 'CLOSEST' :
                     betTypeCard.id === 'pool-grupal' ? 'CLOSEST' :
                     betTypeCard.id === 'liga-por-puntos' ? 'MULTI_WINNER' : 'EXACT'
    };
    
    // Establecer fecha por defecto (24 horas desde ahora)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setConfigFormData({
      ...configFormData,
      title: `${betTypeCard.title} - ${new Date().toLocaleDateString()}`,
      description: betTypeCard.description,
      ...defaultValues,
      endDateTime: tomorrow.toISOString().slice(0, 16)
    });
    
    // Cambiar a la vista de configuración
    setMainTab('configurar');
  };

  const handleConfigFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setConfigFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleContinueToSports = () => {
    if (!selectedBetTypeCard) return;

    // Guardar configuración completa en localStorage
    const completeConfig = {
      id: selectedBetTypeCard.id,
      title: selectedBetTypeCard.title,
      description: selectedBetTypeCard.description,
      icon: selectedBetTypeCard.icon,
      betType: selectedBetTypeCard.id === 'desafio-1v1' ? 'ONE_VS_ONE' : 
                selectedBetTypeCard.id === 'battle-royal' ? 'SIMPLE' :
                selectedBetTypeCard.id === 'pool-grupal' ? 'GROUP_BALANCED' :
                selectedBetTypeCard.id === 'prediccion-simple' ? 'SIMPLE' :
                selectedBetTypeCard.id === 'mercado-over-under' ? 'SIMPLE' :
                selectedBetTypeCard.id === 'liga-por-puntos' ? 'TOURNAMENT' : 'SIMPLE',
      resolutionMode: configFormData.resolutionMode,
      ...configFormData,
      timestamp: Date.now()
    };
    
    localStorage.setItem('completeBetConfig', JSON.stringify(completeConfig));
    
    // Redirigir a la página de deportes
    window.location.href = '/sports';
  };

  const handleBackToCreate = () => {
    setMainTab('crear');
    setSelectedBetTypeCard(null);
  };

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white flex flex-col">
      {/* Contenido principal wrapper */}
      <div className="flex flex-1">
        {/* Sidebar izquierda - Deportes */}
        <div className="w-64 bg-[#1a1d29] border-r border-gray-700 p-4">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🏆</span>
              <h2 className="text-lg font-semibold">Deportes</h2>
            </div>
          </div>

          <div className="space-y-2">
            {mockSportsCategories.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  selectedSport === sport.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-lg">{sport.icon}</span>
                  <span className="font-medium">{sport.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedSport === sport.id
                    ? 'bg-blue-800 text-blue-100'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {sport.count}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 p-3 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Total Deportes:</span>
                <span className="text-white">22</span>
              </div>
              <div className="flex justify-between">
                <span>Retos Activos:</span>
                <span className="text-white">255</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Header superior */}
          <div className="bg-[#1a1d29] border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Usuario */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <h1 className="font-semibold text-lg">{mockUser.username}</h1>
                  <div className="flex items-center text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>{mockUser.network}</span>
                  </div>
                </div>
              </div>

              {/* Controles derecha */}
              <WalletConnection />
            </div>
          </div>

          {/* Área de contenido principal */}
          <div className="flex-1 p-6">
            {/* Navegación de tabs principales */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {[
                    { key: 'retos', label: '🎯 Retos Activos', desc: 'Explora y participa en retos' },
                    { key: 'crear', label: '➕ Crear Reto', desc: 'Crea un nuevo reto' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setMainTab(tab.key)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        mainTab === tab.key
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <Link href="/sports">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                      <span className="mr-2">🏆</span>
                      Deportes
                    </button>
                  </Link>
                </div>
              </div>
              
              {/* Descripción del tab actual */}
              <div className="mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {mainTab === 'retos' ? 'Retos Activos' : 'Crear Nuevo Reto'}
                  </h2>
                  <p className="text-gray-400">
                    {mainTab === 'retos' 
                      ? 'Explora y participa en retos disponibles' 
                      : 'Elige el tipo de reto que quieres crear'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido condicional según el tab seleccionado */}
            {mainTab === 'retos' ? (
              <div className="space-y-4">
                {activeChallenges.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No hay retos activos</h3>
                    <p className="text-gray-400 mb-6">¡Sé el primero en crear un reto emocionante!</p>
                    <button 
                      onClick={() => setMainTab('crear')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      + Crear Primer Reto
                    </button>
                  </div>
                ) : (
                  activeChallenges.map((challenge) => (
                    <div key={challenge.id} className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
                      <div className="flex items-center justify-between">
                        {/* Lado izquierdo - Información del reto */}
                        <div className="flex items-center">
                          <div className={`w-12 h-12 ${challenge.iconBg} rounded-xl flex items-center justify-center text-white text-xl mr-4`}>
                            {challenge.icon}
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="text-white font-semibold text-lg mr-3">{challenge.title}</h3>
                              <span className="bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded-full">
                                {challenge.type}
                              </span>
                            </div>
                            <p className="text-gray-300 mb-4">{challenge.description}</p>
                          </div>
                        </div>

                        {/* Lado derecho - Botones */}
                        <div className="flex items-center space-x-6">
                          <div className="flex space-x-2">
                            <Link href="/challenge">
                              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                                Ver Detalles
                              </button>
                            </Link>
                            <button 
                              onClick={() => handleJoinBet(challenge.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
                            >
                              <span>Unirse</span>
                              <span className="ml-2">→</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Información inferior */}
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-8">
                            <div className="flex items-center">
                              <span className="text-green-400 mr-1">$</span>
                              <span className="text-gray-400 mr-2">Apuesta</span>
                              <span className="text-white font-medium">{challenge.stake}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-blue-400 mr-1">👥</span>
                              <span className="text-gray-400 mr-2">Participantes</span>
                              <span className="text-white font-medium">{challenge.participants}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-yellow-400 mr-1">⏰</span>
                              <span className="text-gray-400 mr-2">Tiempo Restante</span>
                              <span className="text-white font-medium">{challenge.timeRemaining}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-purple-400 mr-1">👤</span>
                              <span className="text-gray-400 mr-2">Creador</span>
                              <span className="text-white font-medium">{challenge.creator}</span>
                            </div>
                          </div>
                          <div className="text-gray-400">
                            Finaliza <span className="text-white">{challenge.endDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : mainTab === 'crear' ? (
              /* Vista de crear reto */
              <CreateBetView onSelectBetType={handleCreateBetFromView} />
            ) : (
              /* Vista de configuración */
              <div className="space-y-6">
                {/* Tipo de reto seleccionado */}
                <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{selectedBetTypeCard?.icon}</div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedBetTypeCard?.title}</h2>
                      <p className="text-gray-400">{selectedBetTypeCard?.description}</p>
                    </div>
                    <div className="ml-auto bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      Seleccionado
                    </div>
                  </div>
                </div>

                {/* Formulario de configuración */}
                <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Configuración General</h3>
                    <button
                      onClick={handleBackToCreate}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      ← Cambiar Tipo
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Título */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título del Reto *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={configFormData.title}
                        onChange={handleConfigFormChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="Ej: Champions League Final - Predicción Ganador"
                      />
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción
                      </label>
                      <textarea
                        name="description"
                        value={configFormData.description}
                        onChange={handleConfigFormChange}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="Describe tu reto y las reglas específicas..."
                      />
                    </div>

                    {/* Apuesta base */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Apuesta Base (USDC) *
                      </label>
                      <input
                        type="number"
                        name="betAmount"
                        value={configFormData.betAmount}
                        onChange={handleConfigFormChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        min="1"
                      />
                    </div>

                    {/* Máximo de participantes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Máximo de Participantes *
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={configFormData.maxParticipants}
                        onChange={handleConfigFormChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        min="2"
                        max="100"
                      />
                    </div>

                    {/* Modo de resolución */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Modo de Resolución *
                      </label>
                      <select
                        name="resolutionMode"
                        value={configFormData.resolutionMode}
                        onChange={handleConfigFormChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="EXACT">Exacta - Coincidencia perfecta</option>
                        <option value="CLOSEST">Más Cercano - Gana quien esté más cerca</option>
                        <option value="MULTI_WINNER">Multi-Ganador - Varios pueden ganar</option>
                      </select>
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Categoría
                      </label>
                      <select
                        name="category"
                        value={configFormData.category}
                        onChange={handleConfigFormChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="General">General</option>
                        <option value="Deportes">Deportes</option>
                        <option value="Entretenimiento">Entretenimiento</option>
                        <option value="Política">Política</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Finanzas">Finanzas</option>
                      </select>
                    </div>

                    {/* Fecha y hora de cierre */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fecha y Hora de Cierre *
                      </label>
                      <input
                        type="datetime-local"
                        name="endDateTime"
                        value={configFormData.endDateTime}
                        onChange={handleConfigFormChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Configuración adicional */}
                    <div className="md:col-span-2">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={configFormData.isPublic}
                          onChange={handleConfigFormChange}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="text-sm text-gray-300">
                          Reto público (visible para todos los usuarios)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Resumen */}
                  <div className="mt-8 pt-6 border-t border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-4">Resumen de Configuración</h4>
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tipo:</span>
                        <span className="text-white">{selectedBetTypeCard?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Participantes:</span>
                        <span className="text-white">Hasta {configFormData.maxParticipants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Apuesta:</span>
                        <span className="text-white">${configFormData.betAmount} USDC cada uno</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Premio total estimado:</span>
                        <span className="text-yellow-400">
                          ${(parseFloat(configFormData.betAmount) * parseInt(configFormData.maxParticipants)).toLocaleString()} USDC
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Resolución:</span>
                        <span className="text-white">
                          {configFormData.resolutionMode === 'EXACT' ? 'Exacta' :
                           configFormData.resolutionMode === 'CLOSEST' ? 'Más Cercano' : 'Multi-Ganador'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={handleBackToCreate}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleContinueToSports}
                      disabled={!configFormData.title.trim() || !configFormData.endDateTime}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Continuar a Deportes →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Usuario */}
        <UserPanel username={mockUser.username} />
      </div>

      {/* Modal para unirse a apuesta */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a2d47] rounded-xl p-6 max-w-md w-full mx-4 border border-gray-600">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Unirse a Reto</h3>
              <p className="text-gray-400">
                {activeChallenges.find(c => c.id === selectedChallenge)?.title}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cantidad a Apostar (USDC)
                </label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="50"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tu Predicción
                </label>
                <input
                  type="text"
                  value={userPrediction}
                  onChange={(e) => setUserPrediction(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ej: Real Madrid gana 2-1"
                />
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Stake:</span>
                  <span className="text-white">${betAmount} USDC</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Posible ganancia:</span>
                  <span className="text-green-400">~${(parseFloat(betAmount) * 1.85).toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fee de protocolo:</span>
                  <span className="text-yellow-400">2.5%</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmJoinBet}
                disabled={!betAmount || !userPrediction}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selector de tipo de apuesta */}
      <BetTypeSelector 
        isOpen={showBetTypeSelector}
        onClose={() => setShowBetTypeSelector(false)}
        onSelectType={handleBetTypeSelection}
      />

      {/* Modal para crear apuesta */}
      <BetModal 
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedBetType(null);
        }}
        onCreateBet={handleCreateBet}
        selectedType={selectedBetType}
      />

      {/* Modal para duelo 1v1 */}
      <OneVsOneModal 
        isOpen={showOneVsOneModal}
        onClose={() => {
          setShowOneVsOneModal(false);
          setSelectedBetType(null);
        }}
        onCreateChallenge={handleCreateOneVsOne}
      />

      {/* Pie de página completo */}
      <footer className="w-full bg-[#0f1116] border-t border-gray-700">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Lado izquierdo - Logo y descripción */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">P</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">77paladio</span>
                  <p className="text-sm text-gray-400">Plataforma descentralizada de apuestas deportivas</p>
                </div>
              </div>
              
              {/* Estadísticas del protocolo */}
              <div className="hidden md:flex items-center space-x-8 text-sm">
                <div>
                  <span className="text-gray-400">Total Deportes:</span>
                  <span className="ml-2 text-white font-medium">22</span>
                </div>
                <div>
                  <span className="text-gray-400">Retos Activos:</span>
                  <span className="ml-2 text-white font-medium">255</span>
                </div>
              </div>
            </div>

            {/* Lado derecho - Redes sociales y copyright */}
            <div className="flex items-center space-x-8">
              {/* Redes sociales */}
              <div className="flex items-center space-x-3">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" title="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" title="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" title="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" title="Discord">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
                  </svg>
                </a>
              </div>

              {/* Copyright y badges */}
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">
                  © 2024 77paladio
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-yellow-400">⚠️ Solo Testnet</span>
                  <span className="text-gray-500">•</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">🔒</span>
                    <span className="text-gray-400">Seguro</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-purple-400">⚡</span>
                    <span className="text-gray-400">Polygon</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-blue-400">💎</span>
                    <span className="text-gray-400">DeFi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}