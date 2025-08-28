'use client'

import { useState } from 'react';
import Link from 'next/link';
import { SportCategory, BettingChallenge, Position, UserProfile, BetType, ResolutionMode, OneVsOneMode } from '@/types/betting';
import { WalletConnection } from '@/components/WalletConnection';
import UserPanel from '@/components/UserPanel';
import BetModal from '@/components/BetModal';
// import OneVsOneModal from '@/components/OneVsOneModal';
import MarketOffersModal from '@/components/MarketOffersModal';
// import GroupBalancedModal from '@/components/GroupBalancedModal';
// import TournamentModal from '@/components/TournamentModal';
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
    type: 'Battle Royal (3 Ganadores)',
    description: 'El Clásico - Predicción del resultado final | 1°: 50% | 2°: 30% | 3°: 20%',
    stake: '$50',
    participants: '12/20',
    timeRemaining: '2h 45m',
    creator: '0x1234...5678',
    odds: '1.85x',
    league: 'Liga Española',
    sport: 'Fútbol',
    endDate: '28/1, 20:00',
    icon: '⚽',
    iconBg: 'bg-green-500'
  },
  {
    id: '2',
    title: 'Lakers Total Points',
    type: 'Group Balanced',
    description: 'NBA - Predicción de puntos totales Lakers vs Warriors',
    stake: '$75',
    participants: '8/15',
    timeRemaining: '5h 15m',
    creator: '0x8765...4321',
    odds: '2.10x',
    league: 'NBA',
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
    league: 'Premier League',
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
    league: 'ATP',
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
    league: 'NFL',
    sport: 'Fútbol Americano',
    endDate: '28/1, 23:30',
    icon: '🏈',
    iconBg: 'bg-purple-500'
  },
  // Más retos para completar los deportes
  {
    id: '6',
    title: 'AC Milan vs Juventus',
    type: 'Battle Royal (5 Ganadores)',
    description: 'Serie A - Predicción del marcador exacto | Top 5 ganan premios',
    stake: '$30',
    participants: '7/15',
    timeRemaining: '4h 20m',
    creator: '0xabc1...2345',
    odds: '2.45x',
    league: 'Serie A',
    sport: 'Fútbol',
    endDate: '28/1, 21:45',
    icon: '⚽',
    iconBg: 'bg-green-500'
  },
  {
    id: '7',
    title: 'Boston Celtics vs Miami Heat',
    type: 'Group Balanced',
    description: 'NBA - Predicción del ganador y puntos totales',
    stake: '$60',
    participants: '10/20',
    timeRemaining: '7h 10m',
    creator: '0xdef2...3456',
    odds: '1.95x',
    league: 'NBA',
    sport: 'Baloncesto',
    endDate: '29/1, 01:30',
    icon: '🏀',
    iconBg: 'bg-orange-500'
  },
  {
    id: '8',
    title: 'Yankees vs Red Sox',
    type: '1v1 Duel',
    description: 'MLB - Predicción del ganador de la serie',
    stake: '$40',
    participants: '1/2',
    timeRemaining: '2 días 5h',
    creator: '0xghi3...4567',
    odds: '2.10x',
    league: 'MLB',
    sport: 'Béisbol',
    endDate: '30/1, 18:00',
    icon: '⚾',
    iconBg: 'bg-red-500'
  },
  {
    id: '9',
    title: 'Novak Djokovic vs Carlos Alcaraz',
    type: 'Battle Royal (1 Ganador)',
    description: 'Australian Open - Predicción del sets totales | Ganador único: 70%',
    stake: '$35',
    participants: '14/25',
    timeRemaining: '1 día 2h',
    creator: '0xjkl4...5678',
    odds: '2.80x',
    league: 'Australian Open',
    sport: 'Tenis',
    endDate: '29/1, 14:00',
    icon: '🎾',
    iconBg: 'bg-yellow-500'
  },
  {
    id: '10',
    title: 'Buffalo Bills vs Kansas City Chiefs',
    type: 'Tournament',
    description: 'NFL Playoffs - Predicción del margen de victoria',
    stake: '$150',
    participants: '28/40',
    timeRemaining: '3 días 8h',
    creator: '0xmno5...6789',
    odds: '2.20x',
    league: 'NFL Playoffs',
    sport: 'Fútbol Americano',
    endDate: '31/1, 22:00',
    icon: '🏈',
    iconBg: 'bg-purple-500'
  },
  {
    id: '11',
    title: 'Tiger Woods - The Masters',
    type: 'Group Balanced',
    description: 'PGA Tour - Predicción de posición final',
    stake: '$20',
    participants: '5/12',
    timeRemaining: '5 días',
    creator: '0xpqr6...7890',
    odds: '4.50x',
    league: 'PGA Tour',
    sport: 'Golf',
    endDate: '2/2, 16:00',
    icon: '⛳',
    iconBg: 'bg-green-600'
  },
  {
    id: '12',
    title: 'Edmonton Oilers vs Toronto Maple Leafs',
    type: '1v1 Duel',
    description: 'NHL - Predicción del resultado en tiempo regular',
    stake: '$45',
    participants: '0/2',
    timeRemaining: '6h 45m',
    creator: '0xstu7...8901',
    odds: '1.88x',
    league: 'NHL',
    sport: 'Hockey',
    endDate: '28/1, 23:45',
    icon: '🏒',
    iconBg: 'bg-blue-600'
  },
  {
    id: '13',
    title: 'All Blacks vs Springboks',
    type: 'Battle Royal',
    description: 'Rugby Championship - Predicción del marcador final',
    stake: '$55',
    participants: '3/10',
    timeRemaining: '1 día 15h',
    creator: '0xvwx8...9012',
    odds: '3.10x',
    league: 'Rugby Championship',
    sport: 'Rugby',
    endDate: '29/1, 19:30',
    icon: '🏉',
    iconBg: 'bg-green-700'
  },
  {
    id: '14',
    title: 'Brasil vs Argentina - Voleibol',
    type: 'Group Balanced',
    description: 'Liga de Naciones - Predicción del resultado por sets',
    stake: '$25',
    participants: '8/15',
    timeRemaining: '4 días 2h',
    creator: '0xyza9...0123',
    odds: '2.65x',
    league: 'Liga de Naciones',
    sport: 'Voleibol',
    endDate: '1/2, 17:00',
    icon: '🏐',
    iconBg: 'bg-yellow-600'
  },
  // Retos adicionales para aumentar contadores
  {
    id: '15',
    title: 'Manchester City vs Arsenal',
    type: '1v1 Duel (Clásico)',
    description: 'Premier League - Predicción de goles totales',
    stake: '$80',
    participants: '1/2',
    timeRemaining: '8h 30m',
    creator: '0xabc0...1234',
    odds: '2.05x',
    league: 'Premier League',
    sport: 'Fútbol',
    endDate: '29/1, 03:30',
    icon: '⚽',
    iconBg: 'bg-green-500'
  },
  {
    id: '16',
    title: 'Golden State Warriors Total Wins',
    type: 'Tournament',
    description: 'NBA Season - Predicción de victorias totales',
    stake: '$90',
    participants: '18/30',
    timeRemaining: '2 semanas',
    creator: '0xdef1...2345',
    odds: '1.75x',
    league: 'NBA Season',
    sport: 'Baloncesto',
    endDate: '15/2, 12:00',
    icon: '🏀',
    iconBg: 'bg-orange-500'
  },
  // Ejemplos de OneVsOne MARKET mode
  {
    id: '17',
    title: 'Liverpool vs Tottenham - Mercado Abierto',
    type: '1v1 Market (3 ofertas)',
    description: 'Predicción: 2.5 goles totales | Acepta ofertas contra esta predicción',
    stake: '$50',
    participants: '1 + 3 ofertas',
    timeRemaining: '5h 15m',
    creator: '0xmarket...1234',
    odds: '1.85x - 2.40x',
    league: 'Premier League',
    sport: 'Fútbol',
    endDate: '28/1, 21:15',
    icon: '📈',
    iconBg: 'bg-purple-500'
  },
  {
    id: '18',
    title: 'NBA Lakers Puntos - Mercado Dinámico',
    type: '1v1 Market (7 ofertas)',
    description: 'Predicción: 112.5 puntos Lakers | Múltiples ofertas activas',
    stake: '$75',
    participants: '1 + 7 ofertas',
    timeRemaining: '3h 45m',
    creator: '0xnba...5678',
    odds: '1.65x - 3.20x',
    league: 'NBA',
    sport: 'Baloncesto',
    endDate: '28/1, 22:45',
    icon: '📈',
    iconBg: 'bg-purple-500'
  },
  {
    id: '19',
    title: 'Tenis ATP - Sets Totales Mercado',
    type: '1v1 Market (Sin ofertas)',
    description: 'Predicción: 3.5 sets totales | Esperando ofertas contra esta predicción',
    stake: '$40',
    participants: '1 + 0 ofertas',
    timeRemaining: '2 días 4h',
    creator: '0xtennis...9012',
    odds: 'Esperando ofertas',
    league: 'ATP Masters',
    sport: 'Tenis',
    endDate: '30/1, 15:30',
    icon: '📈',
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
  const [selectedSport, setSelectedSport] = useState('todos');
  const [mainTab, setMainTab] = useState('retos'); // puede ser 'retos', 'crear' o 'configurar'
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState('50');
  const [userPrediction, setUserPrediction] = useState('');
  
  // Estados para Market Offers Modal
  const [showMarketOffersModal, setShowMarketOffersModal] = useState(false);
  const [selectedMarketChallenge, setSelectedMarketChallenge] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // const [showOneVsOneModal, setShowOneVsOneModal] = useState(false);
  // const [showGroupBalancedModal, setShowGroupBalancedModal] = useState(false);
  // const [showTournamentModal, setShowTournamentModal] = useState(false);
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
    maxGroups: '5',
    resolutionMode: 'EXACT',
    isPublic: true,
    // Configuraciones específicas por modo de resolución
    exactModeConfig: {
      maxWinners: '1',
      tieBreakMethod: 'NO_TIES' as 'SPLIT_PRIZE' | 'NO_TIES'
    },
    closestModeConfig: {
      proximityType: 'ABSOLUTE' as 'ABSOLUTE' | 'PERCENTAGE' | 'SCALED',
      allowTies: false,
      tieBreakMethod: 'SPLIT_PRIZE' as 'SPLIT_PRIZE' | 'TIMESTAMP' | 'RANDOM',
      maxWinners: 1 as 1 | 3 | 5
    },
    multiWinnerModeConfig: {
      positionDistribution: 'PERCENTAGE' as 'PERCENTAGE' | 'CUSTOM' | 'PROGRESSIVE',
      winnerPercentage: 15, // porcentaje de participantes que ganarán
      winnerPositions: 3, // número calculado de ganadores
      prizeDistribution: [
        { position: 1, percentage: 60 },
        { position: 2, percentage: 25 },
        { position: 3, percentage: 15 }
      ]
    }
  });

  const handleJoinBet = (challengeId: string) => {
    const challenge = activeChallenges.find(c => c.id === challengeId);
    
    // Si es un reto de mercado (1v1 Market), mostrar el modal de ofertas
    if (challenge?.type.includes('Market')) {
      setSelectedMarketChallenge(challengeId);
      setShowMarketOffersModal(true);
    } else {
      // Si es un reto normal, mostrar el modal de unirse
      setSelectedChallenge(challengeId);
      setShowJoinModal(true);
    }
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
            betData.betType === 'GROUP_BALANCED' ? 'Group Balanced' : '1v1 Duel',
      description: betData.description || `${betData.sport} - Reto personalizado`,
      stake: `$${betData.stake}`,
      participants: `1/${betData.maxParticipants}`,
      timeRemaining: '2 días',
      creator: betData.creator,
      odds: '2.00x',
      league: betData.sport,
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

  const handleCreateTournament = (challengeData: {
    title: string;
    description: string;
    stake: number;
    sport: string;
    endDate: string;
    betType: BetType;
    resolutionMode: ResolutionMode;
    maxParticipants: number;
    tournamentType: 'LEAGUE' | 'KNOCKOUT';
    registrationEndTime: string;
    allowIdenticalBets: boolean;
  }) => {
    const newChallenge: BettingChallenge = {
      id: (activeChallenges.length + 1).toString(),
      title: challengeData.title,
      type: `Torneo ${challengeData.tournamentType === 'LEAGUE' ? 'Liga' : 'Eliminación'}`,
      description: `${challengeData.description} | ${challengeData.tournamentType} | ${challengeData.maxParticipants} jugadores`,
      stake: `$${challengeData.stake}`,
      participants: `0/${challengeData.maxParticipants}`,
      timeRemaining: '47h 30m',
      creator: '0x1234...abcd',
      odds: '1.85x',
      league: `${challengeData.sport} Tournament`,
      sport: challengeData.sport,
      endDate: new Date(challengeData.registrationEndTime).toLocaleDateString(),
      icon: challengeData.sport === 'Fútbol' ? '⚽' : 
            challengeData.sport === 'Baloncesto' ? '🏀' : '🎾',
      iconBg: 'bg-purple-500'
    };

    setActiveChallenges([...activeChallenges, newChallenge]);
    // setShowTournamentModal(false);
    
    addTransaction({
      id: `tx-${Date.now()}`,
      type: 'BET_PLACED',
      betId: newChallenge.id,
      betTitle: newChallenge.title,
      amount: challengeData.stake.toString(),
      date: new Date().toLocaleDateString(),
      status: 'COMPLETED'
    });

    updateBalance(-challengeData.stake, challengeData.stake);
  };

  const handleCreateGroupBalanced = (challengeData: {
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
  }) => {
    const newChallenge: BettingChallenge = {
      id: (activeChallenges.length + 1).toString(),
      title: challengeData.title,
      type: `Group Balanced (${challengeData.numGroups} grupos)`,
      description: `${challengeData.description} | Método: ${
        challengeData.balancingMethod === 'SKILL_BASED' ? 'Por Habilidad' :
        challengeData.balancingMethod === 'RANDOM' ? 'Aleatorio' :
        'Por Apuestas'
      }`,
      stake: `$${challengeData.stake}`,
      participants: `0/${challengeData.maxParticipants}`,
      timeRemaining: '23h 58m',
      creator: '0x9876...5432',
      odds: '1.85x',
      league: `${challengeData.sport} Liga`,
      sport: challengeData.sport,
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
      icon: challengeData.sport === 'Fútbol' ? '⚽' : 
            challengeData.sport === 'Baloncesto' ? '🏀' : '🎾',
      iconBg: 'bg-blue-500'
    };

    setActiveChallenges([...activeChallenges, newChallenge]);
    // setShowGroupBalancedModal(false);
    
    addTransaction({
      id: `tx-${Date.now()}`,
      type: 'BET_PLACED',
      betId: newChallenge.id,
      betTitle: newChallenge.title,
      amount: challengeData.stake.toString(),
      date: new Date().toLocaleDateString(),
      status: 'COMPLETED'
    });

    updateBalance(-challengeData.stake, challengeData.stake);
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
      league: challengeData.sport,
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
    // setShowOneVsOneModal(false);
  };

  const handleBetTypeSelection = (betType: BetTypeOption) => {
    setSelectedBetType(betType);
    setShowBetTypeSelector(false);
    
    // Abrir el modal correspondiente según el tipo
    if (betType.id === 'one_vs_one') {
      // setShowOneVsOneModal(true);
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
    // Usar el flujo unificado para todos los tipos de apuesta
    setSelectedBetTypeCard(betTypeCard);
      
    // Configurar valores por defecto según el tipo de apuesta
    const defaultValues = {
      maxParticipants: betTypeCard.id === 'battle-royal' ? '100' : 
                       betTypeCard.id === 'desafio-1v1' ? '2' :
                       betTypeCard.id === 'group-balanced' ? '20' :
                       betTypeCard.id === 'torneo-estructurado' ? '32' : '20',
      maxGroups: betTypeCard.id === 'group-balanced' ? '5' : '1',
      betAmount: betTypeCard.id === 'battle-royal' ? '50' : 
                 betTypeCard.id === 'desafio-1v1' ? '100' :
                 betTypeCard.id === 'group-balanced' ? '25' :
                 betTypeCard.id === 'torneo-estructurado' ? '25' : '50',
      resolutionMode: betTypeCard.id === 'mercado-over-under' ? 'CLOSEST' : 
                      betTypeCard.id === 'battle-royal' ? 'MULTI_WINNER' :
                      betTypeCard.id === 'group-balanced' ? 'CLOSEST' :
                      betTypeCard.id === 'torneo-estructurado' ? 'MULTI_WINNER' : 'EXACT'
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
    if (!selectedBetTypeCard || !configFormData.title.trim()) {
      console.log('Validación fallida:', { selectedBetTypeCard, title: configFormData.title });
      return;
    }

    console.log('Continuando a deportes con configuración:', configFormData);

    // Guardar configuración completa en localStorage
    const completeConfig = {
      id: selectedBetTypeCard.id,
      title: selectedBetTypeCard.title,
      description: selectedBetTypeCard.description,
      icon: selectedBetTypeCard.icon,
      betType: selectedBetTypeCard.id === 'desafio-1v1' ? 'ONE_VS_ONE' : 
                selectedBetTypeCard.id === 'battle-royal' ? 'SIMPLE' :
                selectedBetTypeCard.id === 'group-balanced' ? 'GROUP_BALANCED' :
                selectedBetTypeCard.id === 'prediccion-simple' ? 'SIMPLE' :
                selectedBetTypeCard.id === 'mercado-over-under' ? 'SIMPLE' : 'SIMPLE',
      resolutionMode: configFormData.resolutionMode,
      ...configFormData,
      timestamp: Date.now()
    };
    
    console.log('Guardando en localStorage:', completeConfig);
    localStorage.setItem('completeBetConfig', JSON.stringify(completeConfig));
    
    // Usar router de Next.js en lugar de window.location
    try {
      window.location.href = '/sports/create';
    } catch (error) {
      console.error('Error al redirigir:', error);
    }
  };

  const handleBackToCreate = () => {
    setMainTab('crear');
    setSelectedBetTypeCard(null);
  };

  // Funciones para el Market Offers Modal
  const handleAcceptOffer = (offerId: string) => {
    console.log('Accepting offer:', offerId);
    // Aquí iría la lógica para aceptar una oferta específica del contrato
    setShowMarketOffersModal(false);
  };

  const handleRejectOffer = (offerId: string) => {
    console.log('Rejecting offer:', offerId);
    // Aquí iría la lógica para rechazar una oferta específica del contrato
  };

  const handleMakeOffer = (amount: string, prediction: string) => {
    console.log('Making offer:', { amount, prediction, challengeId: selectedMarketChallenge });
    // Aquí iría la lógica para hacer una nueva oferta en el contrato
    setShowMarketOffersModal(false);
  };

  // Mock data para ofertas (en una implementación real vendría del contrato)
  const getMockOffersForChallenge = (challengeId: string) => {
    // Diferentes ofertas según el reto
    switch (challengeId) {
      case '17': // Liverpool vs Tottenham
        return [
          {
            id: '1',
            bidder: '0x1234...5678',
            amount: '60',
            prediction: '2.0',
            timestamp: 'Hace 2h',
            status: 'pending' as const
          },
          {
            id: '2',
            bidder: '0x9876...4321',
            amount: '75',
            prediction: '3.0',
            timestamp: 'Hace 1h',
            status: 'pending' as const
          },
          {
            id: '3',
            bidder: '0xabcd...efgh',
            amount: '50',
            prediction: '1.5',
            timestamp: 'Hace 30m',
            status: 'accepted' as const
          }
        ];
      case '18': // NBA Lakers
        return [
          { id: '4', bidder: '0xnba1...1111', amount: '80', prediction: '108.5', timestamp: 'Hace 3h', status: 'pending' as const },
          { id: '5', bidder: '0xnba2...2222', amount: '65', prediction: '115.5', timestamp: 'Hace 2h', status: 'pending' as const },
          { id: '6', bidder: '0xnba3...3333', amount: '90', prediction: '110.0', timestamp: 'Hace 1h', status: 'pending' as const },
          { id: '7', bidder: '0xnba4...4444', amount: '55', prediction: '118.0', timestamp: 'Hace 45m', status: 'pending' as const },
          { id: '8', bidder: '0xnba5...5555', amount: '70', prediction: '105.5', timestamp: 'Hace 20m', status: 'accepted' as const },
          { id: '9', bidder: '0xnba6...6666', amount: '85', prediction: '120.0', timestamp: 'Hace 15m', status: 'accepted' as const }
        ];
      case '19': // Tenis ATP
        return [];
      default:
        return [];
    }
  };

  // Función para calcular contadores dinámicos por deporte
  const getSportCounts = () => {
    const counts: { [key: string]: number } = {};
    
    // Mapeo de deportes del sistema a nombres de los retos
    const sportMapping: { [key: string]: string[] } = {
      'futbol': ['Fútbol'],
      'baloncesto': ['Baloncesto'],
      'tenis': ['Tenis'],
      'beisbol': ['Béisbol'],
      'futbol-americano': ['Fútbol Americano'],
      'golf': ['Golf'],
      'hockey': ['Hockey'],
      'rugby': ['Rugby'],
      'voleibol': ['Voleibol']
    };

    // Contar retos por cada deporte
    Object.keys(sportMapping).forEach(sportId => {
      const sportNames = sportMapping[sportId];
      counts[sportId] = activeChallenges.filter(challenge => 
        sportNames.includes(challenge.sport)
      ).length;
    });

    // Agregar contador total
    counts['todos'] = activeChallenges.length;

    return counts;
  };

  // Función para filtrar retos por deporte seleccionado
  const getFilteredChallenges = () => {
    if (selectedSport === 'todos') {
      return activeChallenges;
    }

    const sportMapping: { [key: string]: string[] } = {
      'futbol': ['Fútbol'],
      'baloncesto': ['Baloncesto'],
      'tenis': ['Tenis'],
      'beisbol': ['Béisbol'],
      'futbol-americano': ['Fútbol Americano'],
      'golf': ['Golf'],
      'hockey': ['Hockey'],
      'rugby': ['Rugby'],
      'voleibol': ['Voleibol']
    };

    const sportNames = sportMapping[selectedSport] || [];
    return activeChallenges.filter(challenge => 
      sportNames.includes(challenge.sport)
    );
  };

  // Obtener contadores dinámicos y retos filtrados
  const sportCounts = getSportCounts();
  const filteredChallenges = getFilteredChallenges();

  // Crear categorías de deportes con contadores dinámicos
  const dynamicSportsCategories = mockSportsCategories.map(sport => ({
    ...sport,
    count: sportCounts[sport.id] || 0
  }));

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
            {dynamicSportsCategories.map((sport) => (
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
                <span className="text-white">{dynamicSportsCategories.filter(s => s.count > 0).length - 1}</span>
              </div>
              <div className="flex justify-between">
                <span>Retos Activos:</span>
                <span className="text-white">{activeChallenges.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Mostrando:</span>
                <span className="text-blue-400">{filteredChallenges.length} retos</span>
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
                  <h2 className="text-xl font-semibold mb-1 flex items-center">
                    {mainTab === 'retos' ? 'Retos Activos' : 'Crear Nuevo Reto'}
                    {mainTab === 'retos' && selectedSport !== 'todos' && (
                      <span className="ml-3 px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-600/30">
                        {dynamicSportsCategories.find(s => s.id === selectedSport)?.icon} {dynamicSportsCategories.find(s => s.id === selectedSport)?.name}
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-400">
                    {mainTab === 'retos' 
                      ? selectedSport === 'todos' 
                        ? 'Explora y participa en retos disponibles' 
                        : `Retos de ${dynamicSportsCategories.find(s => s.id === selectedSport)?.name} - ${filteredChallenges.length} disponibles`
                      : 'Elige el tipo de reto que quieres crear'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido condicional según el tab seleccionado */}
            {mainTab === 'retos' ? (
              <div className="space-y-4">
                {filteredChallenges.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {selectedSport === 'todos' ? 'No hay retos activos' : `No hay retos de ${dynamicSportsCategories.find(s => s.id === selectedSport)?.name}`}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {selectedSport === 'todos' ? '¡Sé el primero en crear un reto emocionante!' : 'Prueba seleccionar otro deporte o crea un nuevo reto'}
                    </p>
                    <div className="flex gap-3 justify-center">
                      {selectedSport !== 'todos' && (
                        <button 
                          onClick={() => setSelectedSport('todos')}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Ver Todos los Retos
                        </button>
                      )}
                      <button 
                        onClick={() => setMainTab('crear')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        + Crear Reto
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredChallenges.map((challenge) => (
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
                        {selectedBetTypeCard?.id === 'group-balanced' 
                          ? 'Máximo de Participantes por Grupo *'
                          : 'Máximo de Participantes *'
                        }
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={configFormData.maxParticipants}
                        onChange={handleConfigFormChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        min="2"
                        max={selectedBetTypeCard?.id === 'group-balanced' ? '50' : '100'}
                      />
                    </div>

                    {/* Campo específico para Group Balanced - Cantidad de Grupos */}
                    {selectedBetTypeCard?.id === 'group-balanced' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cantidad de Grupos *
                        </label>
                        <input
                          type="number"
                          name="maxGroups"
                          value={configFormData.maxGroups}
                          onChange={handleConfigFormChange}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          min="2"
                          max="10"
                          placeholder="Máximo 10 grupos"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Se crearán automáticamente hasta {configFormData.maxGroups} grupos con un máximo de {configFormData.maxParticipants} participantes cada uno
                        </p>
                      </div>
                    )}

                    {/* Modo de resolución */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Modo de Resolución * 
                        <span className="text-xs text-gray-400 ml-2">
                          {selectedBetTypeCard?.id === 'group-balanced' 
                            ? 'Group Balanced usa siempre "Más Cercano"' 
                            : '¿Cómo se determina el ganador?'
                          }
                        </span>
                      </label>
                      
                      {/* Modo específico para Group Balanced */}
                      {selectedBetTypeCard?.id === 'group-balanced' ? (
                        <div className="space-y-3">
                          <div className="border-blue-500 bg-blue-500/10 border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    name="resolutionMode"
                                    value="CLOSEST"
                                    checked={true}
                                    disabled={true}
                                    className="mr-3 text-blue-500"
                                  />
                                  <span className="font-medium text-white">🔥 Más Cercano (Obligatorio)</span>
                                  <span className="ml-2 text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                                    Group Balanced
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300 mb-3">
                                  <strong>Reglas específicas de Group Balanced:</strong><br/>
                                  • El grupo con más predicciones acertadas gana<br/>
                                  • Las ganancias se distribuyen entre todos los integrantes del grupo ganador<br/>
                                  • Máximo 80% de predicciones iguales entre grupos (diversidad obligatoria)
                                </p>
                                <div className="bg-gray-900/50 rounded p-3 text-xs">
                                  <div className="text-gray-400 mb-1">📝 Ejemplo:</div>
                                  <div className="text-blue-300">• Grupo A: 8 predicciones correctas de 20 participantes</div>
                                  <div className="text-blue-300">• Grupo B: 6 predicciones correctas de 20 participantes</div>
                                  <div className="text-green-300">• Ganador: Grupo A (todos sus 20 integrantes ganan)</div>
                                  <div className="text-yellow-300">• Premio: 95% del pozo dividido entre los 20 integrantes del Grupo A</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                        {/* EXACT Mode */}
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            configFormData.resolutionMode === 'EXACT' 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                          }`}
                          onClick={() => setConfigFormData({...configFormData, resolutionMode: 'EXACT'})}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <input
                                  type="radio"
                                  name="resolutionMode"
                                  value="EXACT"
                                  checked={configFormData.resolutionMode === 'EXACT'}
                                  onChange={handleConfigFormChange}
                                  className="mr-3 text-green-500"
                                />
                                <span className="font-medium text-white">🎯 Exacta</span>
                                <span className="ml-2 text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                                  Mayor dificultad
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 mb-3">
                                Solo ganan los participantes que acierten exactamente el resultado final. Si nadie acierta, se devuelven las criptomonedas a todos sin penalización.
                              </p>
                              <div className="bg-gray-900/50 rounded p-3 text-xs">
                                <div className="text-gray-400 mb-1">📝 Ejemplo:</div>
                                <div className="text-green-300">• Resultado: Barcelona 2-1 Real Madrid</div>
                                <div className="text-green-300">• Ganadores: Solo quien predijo "2-1"</div>
                                <div className="text-yellow-300">• Premio: Los ganadores se dividen el 95% del pozo total</div>
                                <div className="text-orange-300">• Si nadie acierta: Se regresan las criptomonedas a todos</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CLOSEST Mode */}
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            configFormData.resolutionMode === 'CLOSEST' 
                              ? 'border-blue-500 bg-blue-500/10' 
                              : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                          }`}
                          onClick={() => setConfigFormData({...configFormData, resolutionMode: 'CLOSEST'})}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <input
                                  type="radio"
                                  name="resolutionMode"
                                  value="CLOSEST"
                                  checked={configFormData.resolutionMode === 'CLOSEST'}
                                  onChange={handleConfigFormChange}
                                  className="mr-3 text-blue-500"
                                />
                                <span className="font-medium text-white">🔥 Más Cercano</span>
                                <span className="ml-2 text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                                  Balanceado
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 mb-3">
                                Gana quien más se acerque al resultado real, aunque no sea exacto.
                              </p>
                              <div className="bg-gray-900/50 rounded p-3 text-xs">
                                <div className="text-gray-400 mb-1">📝 Ejemplo:</div>
                                <div className="text-blue-300">• Resultado: 78 puntos totales</div>
                                <div className="text-blue-300">• Predicciones: 75, 80, 85</div>
                                <div className="text-blue-300">• Ganador: Quien predijo 80 (diferencia: 2 puntos)</div>
                                <div className="text-yellow-300">• Premio: El más cercano gana el 95% del pozo</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* MULTI_WINNER Mode */}
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            configFormData.resolutionMode === 'MULTI_WINNER' 
                              ? 'border-purple-500 bg-purple-500/10' 
                              : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                          }`}
                          onClick={() => setConfigFormData({...configFormData, resolutionMode: 'MULTI_WINNER'})}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <input
                                  type="radio"
                                  name="resolutionMode"
                                  value="MULTI_WINNER"
                                  checked={configFormData.resolutionMode === 'MULTI_WINNER'}
                                  onChange={handleConfigFormChange}
                                  className="mr-3 text-purple-500"
                                />
                                <span className="font-medium text-white">🏆 Multi-Ganador</span>
                                <span className="ml-2 text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                                  Más oportunidades
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 mb-3">
                                Múltiples participantes pueden ganar según criterios flexibles.
                              </p>
                              <div className="bg-gray-900/50 rounded p-3 text-xs">
                                <div className="text-gray-400 mb-1">📝 Ejemplo:</div>
                                <div className="text-purple-300">• Top 3 predicciones más cercanas</div>
                                <div className="text-purple-300">• O todos dentro de un rango específico</div>
                                <div className="text-yellow-300">• Premio: Se divide entre los ganadores (ej: 60%/25%/15%)</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* EXACT Mode */}
                          <div 
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              configFormData.resolutionMode === 'EXACT' 
                                ? 'border-green-500 bg-green-500/10' 
                                : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                            }`}
                            onClick={() => setConfigFormData({...configFormData, resolutionMode: 'EXACT'})}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    name="resolutionMode"
                                    value="EXACT"
                                    checked={configFormData.resolutionMode === 'EXACT'}
                                    onChange={handleConfigFormChange}
                                    className="mr-3 text-green-500"
                                  />
                                  <span className="font-medium text-white">🎯 Exacta</span>
                                  <span className="ml-2 text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                                    Mayor dificultad
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300">
                                  Solo ganan los participantes que acierten exactamente el resultado final.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* CLOSEST Mode */}
                          <div 
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              configFormData.resolutionMode === 'CLOSEST' 
                                ? 'border-blue-500 bg-blue-500/10' 
                                : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                            }`}
                            onClick={() => setConfigFormData({...configFormData, resolutionMode: 'CLOSEST'})}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    name="resolutionMode"
                                    value="CLOSEST"
                                    checked={configFormData.resolutionMode === 'CLOSEST'}
                                    onChange={handleConfigFormChange}
                                    className="mr-3 text-blue-500"
                                  />
                                  <span className="font-medium text-white">🔥 Más Cercano</span>
                                  <span className="ml-2 text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                                    Balanceado
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300">
                                  Gana quien más se acerque al resultado real.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* MULTI_WINNER Mode */}
                          <div 
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              configFormData.resolutionMode === 'MULTI_WINNER' 
                                ? 'border-purple-500 bg-purple-500/10' 
                                : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                            }`}
                            onClick={() => setConfigFormData({...configFormData, resolutionMode: 'MULTI_WINNER'})}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    name="resolutionMode"
                                    value="MULTI_WINNER"
                                    checked={configFormData.resolutionMode === 'MULTI_WINNER'}
                                    onChange={handleConfigFormChange}
                                    className="mr-3 text-purple-500"
                                  />
                                  <span className="font-medium text-white">🏆 Multi-Ganador</span>
                                  <span className="ml-2 text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                                    Más oportunidades
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300">
                                  Múltiples participantes pueden ganar según criterios flexibles.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                      )}
                    </div>

                    {/* Información sobre liga */}
                    <div className="md:col-span-2">
                      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 mb-4">
                        <div className="flex items-center">
                          <span className="text-blue-400 mr-2">ℹ️</span>
                          <span className="text-sm text-blue-100">
                            La liga específica se seleccionará automáticamente al elegir el evento deportivo en el siguiente paso.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Información sobre cierre automático */}
                    <div className="md:col-span-2">
                      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                        <div className="flex items-start">
                          <span className="text-blue-400 mr-3 mt-0.5">🕒</span>
                          <div>
                            <h4 className="text-sm font-medium text-blue-100 mb-2">Cierre Automático de Apuestas</h4>
                            <div className="text-sm text-blue-200 space-y-1">
                              <p>• Las apuestas se cerrarán automáticamente cuando empiece el evento deportivo</p>
                              <p>• Para múltiples juegos: se cierra cuando empiece el primer partido</p>
                              <p>• El sistema detecta automáticamente los horarios de inicio desde las APIs deportivas</p>
                              <p>• No es necesario configurar fecha/hora manualmente</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Configuraciones específicas por modo de resolución */}
                    
                    {/* Configuración EXACT Mode */}
                    {configFormData.resolutionMode === 'EXACT' && (
                      <div className="md:col-span-2 bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                        <h4 className="text-green-300 font-medium mb-4 flex items-center">
                          <span className="mr-2">🎯</span>
                          Configuración Modo Exacto
                        </h4>
                        
                        {/* Información fija del modo exacto */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Ganadores:</span>
                              <span className="text-green-400 font-semibold">1 único ganador</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Predicciones duplicadas:</span>
                              <span className="text-red-400 font-semibold">❌ No permitidas</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Requisito para ganar:</span>
                              <span className="text-green-400 font-semibold">Predicción exacta</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-green-900/30 border border-green-600/40 rounded-lg">
                            <div className="flex items-start">
                              <span className="text-green-400 mr-2 mt-0.5">ℹ️</span>
                              <div className="text-sm text-green-200">
                                <p className="font-medium mb-1">Reglas del Modo Exacto:</p>
                                <ul className="space-y-1 text-green-300">
                                  <li>• Si alguien acierta exactamente el resultado, esa persona gana</li>
                                  <li>• No se permiten predicciones idénticas (evita empates)</li>
                                  <li>• Si nadie acierta exactamente, se devuelve la criptomoneda sin penalización</li>
                                  <li>• El ganador se lleva el 100% del pozo disponible</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Configuración CLOSEST Mode */}
                    {configFormData.resolutionMode === 'CLOSEST' && (
                      <div className="md:col-span-2 bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
                        <h4 className="text-orange-300 font-medium mb-4 flex items-center">
                          <span className="mr-2">🔥</span>
                          Configuración Modo Más Cercano
                        </h4>
                        
                        {/* Información fija del modo más cercano */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Ganadores:</span>
                              <span className="text-orange-400 font-semibold">1 único ganador</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Predicciones duplicadas:</span>
                              <span className="text-red-400 font-semibold">❌ No permitidas</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Criterio de victoria:</span>
                              <span className="text-orange-400 font-semibold">Predicción más cercana</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Tipo de proximidad:</span>
                              <span className="text-orange-400 font-semibold">Diferencia absoluta</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-orange-900/30 border border-orange-600/40 rounded-lg">
                            <div className="flex items-start">
                              <span className="text-orange-400 mr-2 mt-0.5">ℹ️</span>
                              <div className="text-sm text-orange-200">
                                <p className="font-medium mb-1">Reglas del Modo Más Cercano:</p>
                                <ul className="space-y-1 text-orange-300">
                                  <li>• Gana quien tenga la predicción más cercana al resultado real</li>
                                  <li>• No se permiten predicciones idénticas (evita empates)</li>
                                  <li>• Se calcula la diferencia absoluta entre predicción y resultado</li>
                                  <li>• El ganador se lleva el 100% del pozo disponible</li>
                                  <li>• Siempre hay un ganador garantizado</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Configuración MULTI_WINNER Mode */}
                    {configFormData.resolutionMode === 'MULTI_WINNER' && (
                      <div className="md:col-span-2 bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                        <h4 className="text-purple-300 font-medium mb-4 flex items-center">
                          <span className="mr-2">🏆</span>
                          Configuración Modo Multi-Ganador
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Porcentaje de Ganadores *
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                name="multiWinnerModeConfig.winnerPercentage"
                                value={configFormData.multiWinnerModeConfig.winnerPercentage}
                                onChange={(e) => {
                                  const percentage = Math.max(2, Math.min(40, parseInt(e.target.value) || 2));
                                  // Calcular número de ganadores basado en porcentaje y participantes
                                  const participants = parseInt(configFormData.maxParticipants);
                                  const winnersCount = Math.ceil((percentage / 100) * participants);
                                  
                                  // Generar distribución automática
                                  const generateDistribution = (count: number) => {
                                    const distribution = [];
                                    if (count === 1) {
                                      distribution.push({ position: 1, percentage: 100 });
                                    } else if (count === 2) {
                                      distribution.push({ position: 1, percentage: 70 });
                                      distribution.push({ position: 2, percentage: 30 });
                                    } else if (count === 3) {
                                      distribution.push({ position: 1, percentage: 60 });
                                      distribution.push({ position: 2, percentage: 25 });
                                      distribution.push({ position: 3, percentage: 15 });
                                    } else {
                                      // Para más de 3 ganadores, usar distribución progresiva
                                      let remainingPercentage = 100;
                                      for (let i = 1; i <= count; i++) {
                                        let positionPercentage;
                                        if (i === 1) {
                                          positionPercentage = Math.round(100 / (count + 1));
                                        } else if (i === count) {
                                          positionPercentage = remainingPercentage;
                                        } else {
                                          positionPercentage = Math.round(remainingPercentage / (count - i + 1));
                                        }
                                        distribution.push({ position: i, percentage: positionPercentage });
                                        remainingPercentage -= positionPercentage;
                                      }
                                    }
                                    return distribution;
                                  };

                                  setConfigFormData({
                                    ...configFormData,
                                    multiWinnerModeConfig: {
                                      ...configFormData.multiWinnerModeConfig,
                                      winnerPercentage: percentage,
                                      prizeDistribution: generateDistribution(winnersCount)
                                    }
                                  });
                                }}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 pr-8"
                                min="2"
                                max="40"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              Mínimo 2%, máximo 40% de los participantes
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Ganadores Calculados
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-purple-400 font-semibold">
                              {Math.ceil((configFormData.multiWinnerModeConfig.winnerPercentage / 100) * parseInt(configFormData.maxParticipants))} ganadores
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              De {configFormData.maxParticipants} participantes máximos
                            </div>
                          </div>
                        </div>

                        {/* Información adicional */}
                        <div className="bg-purple-900/30 border border-purple-600/40 rounded-lg p-3 mb-4">
                          <div className="flex items-start">
                            <span className="text-purple-400 mr-2 mt-0.5">ℹ️</span>
                            <div className="text-sm text-purple-200">
                              <p className="font-medium mb-1">Cálculo de Ganadores:</p>
                              <div className="text-purple-300 space-y-1">
                                <p>• Se permite que múltiples participantes tengan predicciones similares</p>
                                <p>• Los ganadores se determinan por ranking de precisión</p>
                                <p>• Si hay predicciones iguales, ganan quienes las hicieron primero (timestamp)</p>
                                <p>• Si el cálculo da número impar, se redondea hacia arriba</p>
                                <p>• Ejemplo: {configFormData.multiWinnerModeConfig.winnerPercentage}% de {configFormData.maxParticipants} = {Math.ceil((configFormData.multiWinnerModeConfig.winnerPercentage / 100) * parseInt(configFormData.maxParticipants))} ganadores</p>
                                <p className="text-xs text-purple-400 bg-purple-900/30 p-2 rounded mt-2">
                                  📝 Caso ejemplo: Si solo pueden ganar 2 personas y hay 3 apuestas iguales "2-1", ganan los primeros 2 que apostaron por "2-1"
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Distribución de premios */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="text-sm font-medium text-purple-200 mb-3">Distribución de Premios Automática</div>
                          <div className="text-xs text-purple-300 mb-3 bg-purple-900/20 p-2 rounded">
                            ⏱️ <strong>Orden de ganadores:</strong> Se ordenan por precisión primero, y en caso de empate, por orden de llegada (timestamp)
                          </div>
                          <div className="space-y-2">
                            {configFormData.multiWinnerModeConfig.prizeDistribution.map((prize, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm">
                                  {prize.position === 1 ? '🥇' : prize.position === 2 ? '🥈' : prize.position === 3 ? '🥉' : '🏆'} {prize.position}° Lugar:
                                </span>
                                <div className="flex items-center">
                                  <span className="text-purple-400 font-medium mr-1">{prize.percentage}</span>
                                  <span className="text-gray-400 text-sm">%</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    (${((parseFloat(configFormData.betAmount) * parseInt(configFormData.maxParticipants)) * (prize.percentage / 100)).toFixed(2)})
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-400">
                            Total: {configFormData.multiWinnerModeConfig.prizeDistribution.reduce((sum, p) => sum + p.percentage, 0)}% del pozo disponible
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Configuración específica para Desafío 1v1 */}
                    {selectedBetTypeCard?.id === 'desafio-1v1' && (
                      <div className="md:col-span-2 bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                        <h4 className="text-red-300 font-medium mb-4 flex items-center">
                          <span className="mr-2">💥</span>
                          Configuración Desafío 1v1
                        </h4>
                        
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Participantes:</span>
                              <span className="text-red-400 font-semibold">Exactamente 2 jugadores</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Tipo de duelo:</span>
                              <span className="text-red-400 font-semibold">Clásico (directo)</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">Premio:</span>
                              <span className="text-red-400 font-semibold">Winner takes all</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-red-900/30 border border-red-600/40 rounded-lg">
                            <div className="flex items-start">
                              <span className="text-red-400 mr-2 mt-0.5">ℹ️</span>
                              <div className="text-sm text-red-200">
                                <p className="font-medium mb-1">Reglas del Duelo 1v1:</p>
                                <ul className="space-y-1 text-red-300">
                                  <li>• Solo 2 participantes pueden unirse</li>
                                  <li>• Duelo directo con apuestas igualadas</li>
                                  <li>• El ganador se lleva el 100% del pozo</li>
                                  <li>• Resolución automática cuando se completa</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Configuración específica para Group Balanced */}
                    {selectedBetTypeCard?.id === 'group-balanced' && (
                      <div className="md:col-span-2 bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                        <h4 className="text-blue-300 font-medium mb-4 flex items-center">
                          <span className="mr-2">⚖️</span>
                          Configuración Group Balanced
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Método de Balanceo *
                            </label>
                            <select
                              name="groupBalancedMethod"
                              defaultValue="SKILL_BASED"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="SKILL_BASED">Basado en Habilidad</option>
                              <option value="RANDOM">Aleatorio</option>
                              <option value="STAKES_BASED">Basado en Apuestas</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Tamaño de Grupos
                            </label>
                            <select
                              name="groupSize"
                              defaultValue="10"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="5">5 por grupo</option>
                              <option value="10">10 por grupo (Recomendado)</option>
                              <option value="20">20 por grupo</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="text-sm font-medium text-blue-200 mb-3">Información del Sistema</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Máximo participantes totales:</span>
                              <span className="text-white">{parseInt(configFormData.maxGroups) * parseInt(configFormData.maxParticipants)} ({configFormData.maxGroups} grupos de {configFormData.maxParticipants})</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Auto-balanceado:</span>
                              <span className="text-green-400">✅ Activado</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Ranking interno:</span>
                              <span className="text-blue-400">Por grupo</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600/40 rounded-lg">
                            <div className="text-xs text-blue-300">
                              <p><strong>Cómo funciona:</strong></p>
                              <p>• Los participantes se dividen automáticamente en grupos equilibrados</p>
                              <p>• Cada grupo compite internamente</p>
                              <p>• Los ganadores de cada grupo obtienen premios</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Configuración específica para Torneo Estructurado */}
                    {selectedBetTypeCard?.id === 'torneo-estructurado' && (
                      <div className="md:col-span-2 bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                        <h4 className="text-purple-300 font-medium mb-4 flex items-center">
                          <span className="mr-2">🏆</span>
                          Configuración Torneo Estructurado
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Tipo de Torneo *
                            </label>
                            <select
                              name="tournamentType"
                              defaultValue="LEAGUE"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                              <option value="LEAGUE">Liga (Todos contra todos)</option>
                              <option value="KNOCKOUT">Eliminación Directa</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Número de Participantes
                            </label>
                            <select
                              name="tournamentParticipants"
                              defaultValue="16"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                              <option value="8">8 participantes</option>
                              <option value="16">16 participantes</option>
                              <option value="32">32 participantes</option>
                              <option value="64">64 participantes</option>
                              <option value="100">100 participantes</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="flex items-center text-sm font-medium text-gray-300">
                            <input
                              type="checkbox"
                              name="allowIdenticalPredictions"
                              defaultChecked={false}
                              className="mr-2 accent-purple-500"
                            />
                            Permitir Predicciones Idénticas
                          </label>
                          <div className="mt-1 text-xs text-gray-400">
                            Permite que múltiples participantes hagan la misma predicción
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="text-sm font-medium text-purple-200 mb-3">Características del Torneo</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Estructura:</span>
                              <span className="text-purple-400">Sistema de brackets</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Duración:</span>
                              <span className="text-white">Hasta finalización</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Registro:</span>
                              <span className="text-green-400">Automático al unirse</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600/40 rounded-lg">
                            <div className="text-xs text-purple-300">
                              <p><strong>Sistema de Torneo:</strong></p>
                              <p>• Liga: Todos compiten entre sí, ranking por puntos</p>
                              <p>• Knockout: Eliminación directa por rondas</p>
                              <p>• Múltiples ganadores según configuración</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Configuración adicional */}
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
                        <div className="text-right">
                          <div className="text-white font-medium mb-1">
                            {configFormData.resolutionMode === 'EXACT' ? '🎯 Exacta' :
                             configFormData.resolutionMode === 'CLOSEST' ? '🔥 Más Cercano' : '🏆 Multi-Ganador'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {configFormData.resolutionMode === 'EXACT' ? 'Solo coincidencias perfectas ganan' :
                             configFormData.resolutionMode === 'CLOSEST' ? 'Gana la predicción más cercana' : 'Múltiples ganadores posibles'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Información específica por modo de resolución */}
                      
                      {/* Resumen Modo EXACT */}
                      {configFormData.resolutionMode === 'EXACT' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Ganadores:</span>
                            <span className="text-green-400 font-semibold">1 único ganador</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Predicciones duplicadas:</span>
                            <span className="text-red-400 font-semibold">❌ No permitidas</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Requisito:</span>
                            <span className="text-green-400">Predicción exacta</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            Si nadie acierta exactamente, se devuelve la criptomoneda sin penalización
                          </div>
                        </>
                      )}

                      {/* Resumen Modo CLOSEST */}
                      {configFormData.resolutionMode === 'CLOSEST' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Ganadores:</span>
                            <span className="text-orange-400 font-semibold">1 único ganador</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Predicciones duplicadas:</span>
                            <span className="text-red-400 font-semibold">❌ No permitidas</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Criterio:</span>
                            <span className="text-orange-400">Predicción más cercana</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Proximidad:</span>
                            <span className="text-orange-400">Diferencia absoluta</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            Siempre hay un ganador garantizado (el más cercano al resultado)
                          </div>
                        </>
                      )}

                      {/* Resumen Modo MULTI_WINNER */}
                      {configFormData.resolutionMode === 'MULTI_WINNER' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Porcentaje ganadores:</span>
                            <span className="text-purple-400 font-semibold">{configFormData.multiWinnerModeConfig.winnerPercentage}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Número ganadores:</span>
                            <span className="text-purple-400">
                              {Math.ceil((configFormData.multiWinnerModeConfig.winnerPercentage / 100) * parseInt(configFormData.maxParticipants))} de {configFormData.maxParticipants}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Predicciones duplicadas:</span>
                            <span className="text-green-400">✅ Permitidas</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Criterio:</span>
                            <span className="text-purple-400">Precisión + Timestamp</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Desempate:</span>
                            <span className="text-purple-400 text-sm">Primero en apostar</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <div className="text-xs text-gray-400 mb-2">Distribución automática de premios:</div>
                            <div className="space-y-1 max-h-20 overflow-y-auto">
                              {configFormData.multiWinnerModeConfig.prizeDistribution.slice(0, 5).map((prize, index) => (
                                <div key={index} className="flex justify-between text-xs">
                                  <span className={`${
                                    prize.position === 1 ? 'text-yellow-300' :
                                    prize.position === 2 ? 'text-gray-300' :
                                    prize.position === 3 ? 'text-orange-300' : 'text-blue-300'
                                  }`}>
                                    {prize.position === 1 ? '🥇' : prize.position === 2 ? '🥈' : prize.position === 3 ? '🥉' : '🏆'} {prize.position}°:
                                  </span>
                                  <span className={`${
                                    prize.position === 1 ? 'text-yellow-300' :
                                    prize.position === 2 ? 'text-gray-300' :
                                    prize.position === 3 ? 'text-orange-300' : 'text-blue-300'
                                  }`}>
                                    ${((parseFloat(configFormData.betAmount) * parseInt(configFormData.maxParticipants)) * (prize.percentage / 100)).toFixed(0)} ({prize.percentage}%)
                                  </span>
                                </div>
                              ))}
                              {configFormData.multiWinnerModeConfig.prizeDistribution.length > 5 && (
                                <div className="text-xs text-gray-500 text-center">
                                  ... y {configFormData.multiWinnerModeConfig.prizeDistribution.length - 5} más
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

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
                      disabled={!configFormData.title.trim()}
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

      {/* Modales comentados - ahora usan el flujo unificado 
      <OneVsOneModal 
        isOpen={showOneVsOneModal}
        onClose={() => {
          setShowOneVsOneModal(false);
          setSelectedBetType(null);
        }}
        onCreateChallenge={handleCreateOneVsOne}
      />

      <GroupBalancedModal 
        isOpen={showGroupBalancedModal}
        onClose={() => setShowGroupBalancedModal(false)}
        onCreateChallenge={handleCreateGroupBalanced}
      />

      <TournamentModal 
        isOpen={showTournamentModal}
        onClose={() => setShowTournamentModal(false)}
        onCreateChallenge={handleCreateTournament}
      />
      */}

      {/* Modal para ofertas de mercado */}
      {selectedMarketChallenge && (
        <MarketOffersModal
          isOpen={showMarketOffersModal}
          onClose={() => {
            setShowMarketOffersModal(false);
            setSelectedMarketChallenge(null);
          }}
          challengeTitle={activeChallenges.find(c => c.id === selectedMarketChallenge)?.title || ''}
          creatorPrediction={selectedMarketChallenge === '17' ? '2.5 goles totales' : 
                            selectedMarketChallenge === '18' ? '112.5 puntos Lakers' : 
                            '3.5 sets totales'}
          creatorStake={activeChallenges.find(c => c.id === selectedMarketChallenge)?.stake?.replace('$', '') || '50'}
          offers={getMockOffersForChallenge(selectedMarketChallenge)}
          onAcceptOffer={handleAcceptOffer}
          onRejectOffer={handleRejectOffer}
          onMakeOffer={handleMakeOffer}
          isCreator={false} // En una implementación real, esto se determinaría comparando con la wallet conectada
        />
      )}

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
                  <span className="ml-2 text-white font-medium">{dynamicSportsCategories.filter(s => s.count > 0).length - 1}</span>
                </div>
                <div>
                  <span className="text-gray-400">Retos Activos:</span>
                  <span className="ml-2 text-white font-medium">{activeChallenges.length}</span>
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