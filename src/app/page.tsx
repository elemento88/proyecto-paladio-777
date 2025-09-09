'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SportCategory, BettingChallenge, Position, UserProfile, BetType, ResolutionMode, OneVsOneMode } from '@/types/betting';
import { WalletConnection } from '@/components/WalletConnection';
import UserPanel from '@/components/UserPanel';
import BetModal from '@/components/BetModal';
import OneVsOneModal from '@/components/OneVsOneModal';
import MarketOffersModal from '@/components/MarketOffersModal';
import GroupBalancedModal from '@/components/GroupBalancedModal';
import TournamentModal from '@/components/TournamentModal';
import BetTypeSelector, { BetTypeOption } from '@/components/BetTypeSelector';
import CreateBetView from '@/components/CreateBetView';
import { useBalance } from '@/hooks/useBalance';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useBetting } from '@/hooks/useBetting';
import AuthModal from '@/components/AuthModal';
import BotManager from '@/components/BotManager';
import BotSimulator from '@/components/BotSimulator';
import LoginButton from '@/components/LoginButton';
import TournamentCard from '@/components/TournamentCard';
import CreateTournamentModal from '@/components/CreateTournamentModal';
import { useTournaments } from '@/hooks/useTournaments';
import LiveScores from '@/components/LiveScores';
import { useSports } from '@/hooks/useSports';

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

interface League {
  id: string;
  name: string;
  icon: string;
  sport: string;
  country: string;
  count: number;
}

const mockLeagues: League[] = [
  { id: 'todas', name: 'Todas las Ligas', icon: '🌍', sport: 'all', country: 'Global', count: 125 },
  { id: 'premier-league', name: 'Premier League', icon: '⚽', sport: 'futbol', country: 'Inglaterra', count: 22 },
  { id: 'la-liga', name: 'La Liga', icon: '⚽', sport: 'futbol', country: 'España', count: 18 },
  { id: 'serie-a', name: 'Serie A', icon: '⚽', sport: 'futbol', country: 'Italia', count: 15 },
  { id: 'bundesliga', name: 'Bundesliga', icon: '⚽', sport: 'futbol', country: 'Alemania', count: 12 },
  { id: 'champions-league', name: 'Champions League', icon: '🏆', sport: 'futbol', country: 'Europa', count: 8 },
  { id: 'nba', name: 'NBA', icon: '🏀', sport: 'baloncesto', country: 'USA', count: 20 },
  { id: 'euroleague', name: 'EuroLeague', icon: '🏀', sport: 'baloncesto', country: 'Europa', count: 12 },
  { id: 'atp-tour', name: 'ATP Tour', icon: '🎾', sport: 'tenis', country: 'Mundial', count: 16 },
  { id: 'wta-tour', name: 'WTA Tour', icon: '🎾', sport: 'tenis', country: 'Mundial', count: 14 },
  { id: 'nfl', name: 'NFL', icon: '🏈', sport: 'futbol-americano', country: 'USA', count: 18 },
  { id: 'mlb', name: 'MLB', icon: '⚾', sport: 'beisbol', country: 'USA', count: 10 },
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
  // Auth and data hooks
  const { user, signOut } = useAuth()
  const { challenges } = useBetting()
  const { tournaments, activeTournaments, runningTournaments } = useTournaments()
  const { sports, todaysFixtures, liveScores, loading: sportsLoading, error: sportsError } = useSports()
  
  const [selectedSport, setSelectedSport] = useState('todos');
  const [selectedLeague, setSelectedLeague] = useState('todas');
  const [mainTab, setMainTab] = useState('retos'); // puede ser 'retos', 'crear' o 'configurar'
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState('50');
  const [userPrediction, setUserPrediction] = useState('');
  
  // Estados para Market Offers Modal
  const [showMarketOffersModal, setShowMarketOffersModal] = useState(false);
  const [selectedMarketChallenge, setSelectedMarketChallenge] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBotManager, setShowBotManager] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateTournamentModal, setShowCreateTournamentModal] = useState(false);
  const [tournamentFilter, setTournamentFilter] = useState<'all' | 'active' | 'upcoming' | 'finished'>('all');
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  // const [showOneVsOneModal, setShowOneVsOneModal] = useState(false);
  // const [showGroupBalancedModal, setShowGroupBalancedModal] = useState(false);
  // const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showBetTypeSelector, setShowBetTypeSelector] = useState(false);
  const [selectedBetType, setSelectedBetType] = useState<BetTypeOption | null>(null);
  const [activeChallenges, setActiveChallenges] = useState(mockChallenges);
  const { addTransaction, updateBalance } = useBalance();

  // Resetear liga seleccionada cuando cambia el deporte
  useEffect(() => {
    setSelectedLeague('todas');
  }, [selectedSport]);

  // Estados para la configuración de reto
  const [selectedBetTypeCard, setSelectedBetTypeCard] = useState<any>(null);
  const [configFormData, setConfigFormData] = useState({
    title: '',
    description: '',
    betAmount: '50',
    maxParticipants: '20',
    maxGroups: '5',
    resolutionMode: 'EXACT',
    isPublic: true,
    acceptVariableOffers: false, // Para Predicción Simple: aceptar ofertas variables o solo iguales
    // Configuraciones específicas del Torneo Estructurado
    tournamentType: 'LEAGUE' as 'LEAGUE' | 'KNOCKOUT' | 'HYBRID',
    tournamentParticipants: '16',
    tournamentPrizeDistribution: 'TOP3' as 'WINNER_TAKES_ALL' | 'TOP3' | 'TOP5' | 'TOP10',
    tournamentDuration: 'MEDIUM' as 'FAST' | 'MEDIUM' | 'LONG' | 'SEASON',
    allowTournamentSpectators: false,
    enableTournamentChat: true,
    allowIdenticalPredictions: false,
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
      betId: selectedChallenge || '',
      betTitle: challenge.title,
      amount: `-${betAmount}.00`,
      date: new Date().toLocaleDateString(),
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
    // Validar que betData y sus propiedades no sean null
    if (!betData) {
      console.error('betData is null or undefined');
      return;
    }
    
    // Asegurar que sport tenga un valor por defecto
    const sport = betData.sport || 'Fútbol';
    const newChallenge: BettingChallenge = {
      id: (activeChallenges.length + 1).toString(),
      title: betData.title,
      type: betData.betType === BetType.SIMPLE ? 'Battle Royal' : 
            betData.betType === BetType.TOURNAMENT ? 'Tournament' :
            betData.betType === BetType.GROUP_BALANCED ? 'Group Balanced' : '1v1 Duel',
      description: betData.description || `${sport} - Reto personalizado`,
      stake: `$${betData.stake}`,
      participants: `1/${betData.maxParticipants}`,
      timeRemaining: '2 días',
      creator: betData.creator,
      odds: '2.00x',
      league: sport,
      sport: sport,
      endDate: new Date(betData.endDate).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      icon: sport === 'Fútbol' ? '⚽' :
            sport === 'Baloncesto' ? '🏀' :
            sport === 'Tenis' ? '🎾' :
            sport === 'Béisbol' ? '⚾' :
            sport === 'Fútbol Americano' ? '🏈' : '🏆',
      iconBg: 'bg-blue-500'
    };
    
    // Agregar transacción por crear reto
    addTransaction({
      type: 'BET_PLACED',
      betId: newChallenge.id,
      betTitle: newChallenge.title,
      amount: `-${betData.stake}.00`,
      date: new Date().toLocaleDateString(),
      status: 'COMPLETED'
    });

    // Actualizar balance
    updateBalance(-parseFloat(betData.stake), 'bet');

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
      type: 'BET_PLACED',
      betId: newChallenge.id,
      betTitle: newChallenge.title,
      amount: challengeData.stake.toString(),
      date: new Date().toLocaleDateString(),
      status: 'COMPLETED'
    });

    updateBalance(-challengeData.stake, 'bet');
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
        'Por Retos'
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
      type: 'BET_PLACED',
      betId: newChallenge.id,
      betTitle: newChallenge.title,
      amount: challengeData.stake.toString(),
      date: new Date().toLocaleDateString(),
      status: 'COMPLETED'
    });

    updateBalance(-challengeData.stake, 'bet');
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
      date: new Date().toLocaleDateString(),
      status: 'COMPLETED'
    });

    // Actualizar balance
    updateBalance(-challengeData.stake, 'bet');

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
    // Usar el flujo unificado para todos los tipos de reto
    setSelectedBetTypeCard(betTypeCard);
      
    // Configurar valores por defecto según el tipo de reto
    const defaultValues = {
      maxParticipants: betTypeCard.id === 'battle-royal' ? '100' : 
                       betTypeCard.id === 'group-balanced' ? '20' :
                       betTypeCard.id === 'torneo-estructurado' ? '32' :
                       betTypeCard.id === 'prediccion-simple' ? '10' : '20',
      maxGroups: betTypeCard.id === 'group-balanced' ? '5' : '1',
      betAmount: betTypeCard.id === 'battle-royal' ? '50' : 
                 betTypeCard.id === 'group-balanced' ? '25' :
                 betTypeCard.id === 'torneo-estructurado' ? '25' : '50',
      resolutionMode: betTypeCard.id === 'battle-royal' ? 'MULTI_WINNER' :
                      betTypeCard.id === 'group-balanced' ? 'GROUP_WINNER' :
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
      betType: selectedBetTypeCard.id === 'battle-royal' ? 'SIMPLE' :
                selectedBetTypeCard.id === 'group-balanced' ? 'GROUP_BALANCED' :
                selectedBetTypeCard.id === 'prediccion-simple' ? 'SIMPLE' : 'SIMPLE',
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

  // Tournament handlers
  const handleJoinTournament = (tournamentId: string) => {
    console.log('Joining tournament:', tournamentId);
    // Tournament joining logic is handled by TournamentCard component
  };

  const handleViewTournamentDetails = (tournamentId: string) => {
    console.log('Viewing tournament details:', tournamentId);
    setSelectedTournament(tournamentId);
    // For now, just log - in a real app this would navigate to tournament details page
  };

  const handleCreateTournamentSuccess = () => {
    setShowCreateTournamentModal(false);
    // Optionally switch to tournament tab after creating
    setMainTab('torneos');
  };

  // Filter tournaments based on selected filter
  const getFilteredTournaments = () => {
    switch (tournamentFilter) {
      case 'active':
        return tournaments.filter(t => t.tournament_phase === 'REGISTRATION');
      case 'upcoming':
        return runningTournaments;
      case 'finished':
        return tournaments.filter(t => t.tournament_phase === 'FINISHED');
      default:
        return tournaments;
    }
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

  // Función para filtrar retos por deporte y liga seleccionados
  const getFilteredChallenges = () => {
    let challenges = activeChallenges;

    // Filtrar por deporte
    if (selectedSport !== 'todos') {
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
      challenges = challenges.filter(challenge => 
        sportNames.includes(challenge.sport)
      );
    }

    // Filtrar por liga
    if (selectedLeague !== 'todas') {
      const leagueMapping: { [key: string]: string[] } = {
        'premier-league': ['Premier League'],
        'la-liga': ['Liga Española', 'La Liga'],
        'serie-a': ['Serie A'],
        'bundesliga': ['Bundesliga'],
        'champions-league': ['Champions League'],
        'nba': ['NBA'],
        'euroleague': ['EuroLeague'],
        'atp-tour': ['ATP Masters', 'ATP'],
        'wta-tour': ['WTA'],
        'nfl': ['NFL'],
        'mlb': ['MLB']
      };

      const leagueNames = leagueMapping[selectedLeague] || [];
      challenges = challenges.filter(challenge => 
        leagueNames.includes(challenge.league)
      );
    }

    return challenges;
  };

  // Obtener contadores dinámicos y retos filtrados
  const sportCounts = getSportCounts();
  const filteredChallenges = getFilteredChallenges();

  // Crear categorías de deportes con contadores dinámicos
  const dynamicSportsCategories = mockSportsCategories.map(sport => ({
    ...sport,
    count: sportCounts[sport.id] || 0
  }));

  // Filtrar ligas según el deporte seleccionado
  const getFilteredLeagues = () => {
    if (selectedSport === 'todos') {
      return mockLeagues;
    }
    return mockLeagues.filter(league => league.sport === selectedSport || league.sport === 'all');
  };

  const filteredLeagues = getFilteredLeagues();

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

          {/* Sección de Ligas */}
          <div className="mt-8 mb-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🏟️</span>
              <h2 className="text-lg font-semibold">Ligas</h2>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {filteredLeagues.map((league) => (
              <button
                key={league.id}
                onClick={() => setSelectedLeague(league.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  selectedLeague === league.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-lg">{league.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-sm">{league.name}</div>
                    <div className="text-xs text-gray-500">{league.country}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedLeague === league.id
                    ? 'bg-purple-800 text-purple-100'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {league.count}
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
                    { key: 'crear', label: '➕ Crear Reto', desc: 'Crea un nuevo reto' },
                    { key: 'torneos', label: '🏆 Torneos', desc: 'Torneos oficiales del admin' },
                    { key: 'live', label: '⚽ En Vivo', desc: 'Resultados deportivos en tiempo real' }
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
                  {user && (
                    <button 
                      onClick={() => setShowBotManager(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <span className="mr-2">🤖</span>
                      Bots
                    </button>
                  )}
                  <LoginButton variant="primary" size="md" />
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
                    {mainTab === 'retos' ? 'Retos Activos' : 
                     mainTab === 'crear' ? 'Crear Nuevo Reto' :
                     mainTab === 'torneos' ? 'Torneos Oficiales' : 
                     mainTab === 'live' ? 'Deportes en Vivo' : 'Configurar Reto'}
                    {mainTab === 'retos' && selectedSport !== 'todos' && (
                      <span className="ml-3 px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-600/30">
                        {dynamicSportsCategories.find(s => s.id === selectedSport)?.icon} {dynamicSportsCategories.find(s => s.id === selectedSport)?.name}
                      </span>
                    )}
                    {mainTab === 'retos' && selectedLeague !== 'todas' && (
                      <span className="ml-3 px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full border border-purple-600/30">
                        {filteredLeagues.find(l => l.id === selectedLeague)?.icon} {filteredLeagues.find(l => l.id === selectedLeague)?.name}
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-400">
                    {mainTab === 'retos' 
                      ? selectedSport === 'todos' && selectedLeague === 'todas'
                        ? 'Explora y participa en retos disponibles' 
                        : selectedSport !== 'todos' && selectedLeague === 'todas'
                          ? `Retos de ${dynamicSportsCategories.find(s => s.id === selectedSport)?.name} - ${filteredChallenges.length} disponibles`
                          : selectedSport === 'todos' && selectedLeague !== 'todas'
                            ? `Retos de ${filteredLeagues.find(l => l.id === selectedLeague)?.name} - ${filteredChallenges.length} disponibles`
                            : `Retos de ${dynamicSportsCategories.find(s => s.id === selectedSport)?.name} en ${filteredLeagues.find(l => l.id === selectedLeague)?.name} - ${filteredChallenges.length} disponibles`
                      : mainTab === 'crear' 
                        ? 'Elige el tipo de reto que quieres crear'
                        : mainTab === 'torneos'
                          ? 'Competencias estructuradas con premios garantizados'
                          : mainTab === 'live'
                            ? 'Resultados deportivos en tiempo real de API-Football'
                            : 'Configura los detalles de tu reto'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido condicional según el tab seleccionado */}
            {mainTab === 'retos' ? (
              <div className="space-y-4">
                {filteredChallenges.length === 0 ? (
                  /* Mensaje motivacional con ligas populares */
                  <div className="text-center py-12">
                    {/* Sección de Ligas Populares */}
                    <div className="mb-8">
                      <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-2xl font-semibold text-white mb-2">Ligas y Competiciones Populares</h3>
                      <p className="text-gray-400 mb-8">Encuentra eventos deportivos de las mejores ligas del mundo</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                        {/* La Liga */}
                        <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-3">
                              <span className="text-xl">⚽</span>
                            </div>
                            <h4 className="text-white font-medium text-sm mb-1">La Liga</h4>
                            <p className="text-gray-400 text-xs mb-2">España</p>
                            <p className="text-gray-500 text-xs">15 eventos</p>
                          </div>
                        </div>

                        {/* Premier League */}
                        <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                              <span className="text-xl">⚽</span>
                            </div>
                            <h4 className="text-white font-medium text-sm mb-1">Premier League</h4>
                            <p className="text-gray-400 text-xs mb-2">Inglaterra</p>
                            <p className="text-gray-500 text-xs">22 eventos</p>
                          </div>
                        </div>

                        {/* NBA */}
                        <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-3">
                              <span className="text-xl">🏀</span>
                            </div>
                            <h4 className="text-white font-medium text-sm mb-1">NBA</h4>
                            <p className="text-gray-400 text-xs mb-2">Estados Unidos</p>
                            <p className="text-gray-500 text-xs">18 eventos</p>
                          </div>
                        </div>

                        {/* Champions League */}
                        <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center mb-3">
                              <span className="text-xl">🏆</span>
                            </div>
                            <h4 className="text-white font-medium text-sm mb-1">Champions League</h4>
                            <p className="text-gray-400 text-xs mb-2">UEFA</p>
                            <p className="text-gray-500 text-xs">8 eventos</p>
                          </div>
                        </div>

                        {/* NFL */}
                        <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center mb-3">
                              <span className="text-xl">🏈</span>
                            </div>
                            <h4 className="text-white font-medium text-sm mb-1">NFL</h4>
                            <p className="text-gray-400 text-xs mb-2">Estados Unidos</p>
                            <p className="text-gray-500 text-xs">12 eventos</p>
                          </div>
                        </div>

                        {/* Serie A */}
                        <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                              <span className="text-xl">⚽</span>
                            </div>
                            <h4 className="text-white font-medium text-sm mb-1">Serie A</h4>
                            <p className="text-gray-400 text-xs mb-2">Italia</p>
                            <p className="text-gray-500 text-xs">11 eventos</p>
                          </div>
                        </div>

                        {/* ATP Tour */}
                        <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-3">
                              <span className="text-xl">🎾</span>
                            </div>
                            <h4 className="text-white font-medium text-sm mb-1">ATP Tour</h4>
                            <p className="text-gray-400 text-xs mb-2">Mundial</p>
                            <p className="text-gray-500 text-xs">9 eventos</p>
                          </div>
                        </div>

                        {/* Bundesliga */}
                        <div className="bg-[#2a2d47] rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-800 rounded-lg flex items-center justify-center mb-3">
                              <span className="text-xl">⚽</span>
                            </div>
                            <h4 className="text-white font-medium text-sm mb-1">Bundesliga</h4>
                            <p className="text-gray-400 text-xs mb-2">Alemania</p>
                            <p className="text-gray-500 text-xs">13 eventos</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Call to action */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {selectedSport === 'todos' ? '¡Crea tu primer reto!' : `¡Crea un reto de ${dynamicSportsCategories.find(s => s.id === selectedSport)?.name}!`}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {selectedSport === 'todos' ? '¡Sé el primero en crear un reto emocionante con estos eventos populares!' : 'Explora las ligas populares arriba o crea un nuevo reto personalizado'}
                      </p>
                      <div className="flex gap-3 justify-center">
                        {selectedSport !== 'todos' && (
                          <button 
                            onClick={() => setSelectedSport('todos')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                          >
                            Ver Todos los Deportes
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
                              <span className="text-gray-400 mr-2">Reto</span>
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
            ) : mainTab === 'torneos' ? (
              /* Vista de torneos oficiales */
              <div className="space-y-6">
                {/* Header de torneos */}
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Torneos Oficiales
                  </h3>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Torneos estructurados creados y administrados por el equipo. Únete a competencias organizadas con premios garantizados.
                  </p>
                </div>

                {/* Create Tournament Button */}
                {user && (
                  <div className="flex justify-center mb-6">
                    <button 
                      onClick={() => setShowCreateTournamentModal(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <span>➕</span>
                      <span>Crear Torneo</span>
                    </button>
                  </div>
                )}

                {/* Filtros de torneos */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button 
                    onClick={() => setTournamentFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tournamentFilter === 'all' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    🏆 Todos
                  </button>
                  <button 
                    onClick={() => setTournamentFilter('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tournamentFilter === 'active' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    ⚡ Registro Abierto
                  </button>
                  <button 
                    onClick={() => setTournamentFilter('upcoming')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tournamentFilter === 'upcoming' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    📅 En Progreso
                  </button>
                  <button 
                    onClick={() => setTournamentFilter('finished')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tournamentFilter === 'finished' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    ✅ Finalizados
                  </button>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando torneos...</p>
                  </div>
                )}

                {/* Tournament Grid */}
                {!loading && getFilteredTournaments().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredTournaments().map((tournament) => (
                      <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                        onJoin={handleJoinTournament}
                        onViewDetails={handleViewTournamentDetails}
                      />
                    ))}
                  </div>
                ) : !loading && (
                  /* Empty State */
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {tournamentFilter === 'all' ? 'No hay torneos disponibles' :
                       tournamentFilter === 'active' ? 'No hay torneos con registro abierto' :
                       tournamentFilter === 'upcoming' ? 'No hay torneos en progreso' :
                       'No hay torneos finalizados'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {tournamentFilter === 'all' ? 'Los torneos aparecerán aquí una vez creados.' :
                       'Cambia el filtro para ver otros torneos.'}
                    </p>
                    {user && tournamentFilter === 'all' && (
                      <button 
                        onClick={() => setShowCreateTournamentModal(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        ➕ Crear el primer torneo
                      </button>
                    )}
                  </div>
                )}

                {/* Info adicional */}
                <div className="mt-12 bg-purple-900/20 border border-purple-600/30 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-xl">ℹ️</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Sobre los Torneos</h4>
                      <div className="text-gray-400 text-sm space-y-2">
                        <p>• Crea torneos personalizados con diferentes formatos: Liga, Eliminación o Híbrido</p>
                        <p>• Distribución de premios configurable: ganador único, top 3, top 5 o top 10%</p>
                        <p>• Duraciones flexibles: rápido (3-7 días), medio (1-2 semanas), largo (3-4 semanas) o temporada (1-3 meses)</p>
                        <p>• Resolución automatizada y transparente vía oráculos</p>
                        <p>• Sistema de puntuación y clasificación en tiempo real</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : mainTab === 'live' ? (
              /* Vista de deportes en vivo */
              <div className="space-y-6">
                <LiveScores 
                  showHeader={true}
                  maxItems={20}
                  showRefresh={true}
                />
              </div>
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

                    {/* Reto base */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Reto Base (USDC) *
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
                        max={selectedBetTypeCard?.id === 'group-balanced' ? '50' : 
                             selectedBetTypeCard?.id === 'prediccion-simple' ? '10' : '100'}
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

                    {/* Campo específico para Predicción Simple - Aceptar ofertas variables */}
                    {selectedBetTypeCard?.id === 'prediccion-simple' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Tipo de Ofertas *
                          <span className="text-xs text-gray-400 ml-2">¿Permites ofertas con diferentes cantidades?</span>
                        </label>
                        
                        <div className="space-y-3">
                          {/* Ofertas Variables */}
                          <div 
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              configFormData.acceptVariableOffers 
                                ? 'border-blue-500 bg-blue-500/10' 
                                : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                            }`}
                            onClick={() => setConfigFormData({...configFormData, acceptVariableOffers: true})}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    name="acceptVariableOffers"
                                    value="true"
                                    checked={configFormData.acceptVariableOffers === true}
                                    onChange={() => setConfigFormData({...configFormData, acceptVariableOffers: true})}
                                    className="mr-3 text-blue-500"
                                  />
                                  <span className="font-medium text-white">💰 Aceptar Ofertas Variables</span>
                                  <span className="ml-2 text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                                    Flexible
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">
                                  Los aceptantes pueden apostar cantidades diferentes. Tú decides si aceptas cada oferta.
                                </p>
                                <div className="bg-gray-900/50 rounded p-2 text-xs text-gray-400 space-y-1">
                                  <div><strong>Reglas importantes:</strong></div>
                                  <div>• <strong>Límite de ganancia:</strong> Cada aceptante solo puede ganar máximo lo que apostó</div>
                                  <div>• <strong>Control del creador:</strong> Tú decides si aceptar ofertas menores o mayores</div>
                                  <div>• <strong>Cierre automático:</strong> Cuando las ofertas sumen igual a tu reto, el reto se cierra</div>
                                  <div>• <strong>Ejemplo:</strong> Tu apuestas 50 USDC → cuando ofertas sumen 50 USDC, reto se activa</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Ofertas Iguales */}
                          <div 
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              !configFormData.acceptVariableOffers 
                                ? 'border-green-500 bg-green-500/10' 
                                : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                            }`}
                            onClick={() => setConfigFormData({...configFormData, acceptVariableOffers: false})}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    name="acceptVariableOffers"
                                    value="false"
                                    checked={configFormData.acceptVariableOffers === false}
                                    onChange={() => setConfigFormData({...configFormData, acceptVariableOffers: false})}
                                    className="mr-3 text-green-500"
                                  />
                                  <span className="font-medium text-white">⚖️ Solo Cantidades Iguales</span>
                                  <span className="ml-2 text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                                    Estricto
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">
                                  Solo pueden apostar exactamente la misma cantidad que tú apostaste
                                </p>
                                <div className="bg-gray-900/50 rounded p-2 text-xs text-gray-400">
                                  <strong>Ejemplo:</strong> Si tu reto es 50 USDC, todos deben apostar exactamente 50 USDC
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Modo de resolución */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Modo de Resolución * 
                        <span className="text-xs text-gray-400 ml-2">
                          {selectedBetTypeCard?.id === 'group-balanced' 
                            ? 'Group Balanced usa siempre "Grupo Ganador"'
                            : selectedBetTypeCard?.id === 'prediccion-simple'
                            ? 'Predicción Simple usa siempre "Exacta"'
                            : '¿Cómo se determina el ganador?'
                          }
                        </span>
                      </label>
                      
                      {/* Modo específico para Group Balanced */}
                      {selectedBetTypeCard?.id === 'group-balanced' ? (
                        <div className="space-y-3">
                          <div className="border-teal-500 bg-teal-500/10 border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    name="resolutionMode"
                                    value="GROUP_WINNER"
                                    checked={true}
                                    disabled={true}
                                    className="mr-3 text-teal-500"
                                  />
                                  <span className="font-medium text-white">⚖️ Grupo Ganador (Obligatorio)</span>
                                  <span className="ml-2 text-xs bg-teal-600/20 text-teal-400 px-2 py-1 rounded">
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
                                  <div className="text-teal-300">• Grupo A: 8 predicciones correctas de 20 participantes</div>
                                  <div className="text-teal-300">• Grupo B: 6 predicciones correctas de 20 participantes</div>
                                  <div className="text-green-300">• Ganador: Grupo A (todos sus 20 integrantes ganan)</div>
                                  <div className="text-yellow-300">• Premio: 95% del pozo dividido entre los 20 integrantes del Grupo A</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : selectedBetTypeCard?.id === 'prediccion-simple' ? (
                        <div className="space-y-3">
                          <div className="border-green-500 bg-green-500/10 border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    name="resolutionMode"
                                    value="EXACT"
                                    checked={true}
                                    disabled={true}
                                    className="mr-3 text-green-500"
                                  />
                                  <span className="font-medium text-white">🎯 Exacta (Obligatorio)</span>
                                  <span className="ml-2 text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                                    Predicción Simple
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300 mb-3">
                                  <strong>Reglas específicas de Predicción Simple:</strong><br/>
                                  <strong>🎯 Para que gane el CREADOR:</strong> Debe pasar exactamente lo que predijo<br/>
                                  <strong>❌ Para que ganen los ACEPTANTES:</strong> La predicción del creador debe fallar<br/>
                                  <strong>⚠️ Si hay múltiples predicciones:</strong> Si el creador falla en UNA sola, pierde todo<br/>
                                  <strong>💰 Límite de ganancias:</strong> Cada aceptante solo puede ganar máximo lo que apostó<br/>
                                  <strong>✅ Control de ofertas:</strong> El creador decide qué ofertas acepta<br/>
                                  <strong>🔒 Cierre automático:</strong> El reto se cierra cuando las ofertas igualan tu reto
                                </p>
                                <div className="bg-gray-900/50 rounded p-3 text-xs space-y-1">
                                  <div className="text-gray-400 mb-1">📝 Ejemplo con ofertas variables:</div>
                                  <div className="text-green-300">• Creador pone reto de 50 USDC y predice: "Barcelona gana 2-1"</div>
                                  <div className="text-blue-300">• Aceptante 1 pone reto de 30 USDC (contra la predicción)</div>
                                  <div className="text-blue-300">• Aceptante 2 pone reto de 20 USDC (contra la predicción)</div>
                                  <div className="text-orange-300">• Total ofertas: 50 USDC → ¡Reto se cierra automáticamente!</div>
                                  <div className="text-purple-300">Si resultado es exactamente 2-1: CREADOR gana 50 USDC</div>
                                  <div className="text-red-300">Si resultado es otro: Aceptantes ganan máximo lo que pusieron en su reto</div>
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
                            <h4 className="text-sm font-medium text-blue-100 mb-2">Cierre Automático de Retos</h4>
                            <div className="text-sm text-blue-200 space-y-1">
                              <p>• Los retos se cerrarán automáticamente cuando empiece el evento deportivo</p>
                              <p>• Para múltiples juegos: se cierra cuando empiece el primer partido</p>
                              <p>• El sistema detecta automáticamente los horarios de inicio desde las APIs deportivas</p>
                              <p>• No es necesario configurar fecha/hora manualmente</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Configuraciones específicas por modo de resolución */}
                    
                    {/* Configuración EXACT Mode - NO mostrar para Predicción Simple */}
                    {configFormData.resolutionMode === 'EXACT' && selectedBetTypeCard?.id !== 'prediccion-simple' && (
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
                                  📝 Caso ejemplo: Si solo pueden ganar 2 personas y hay 3 retos iguales "2-1", ganan los primeros 2 que pusieron el reto "2-1"
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



                    {/* Configuración específica para Torneo Estructurado */}
                    {selectedBetTypeCard?.id === 'torneo-estructurado' && (
                      <div className="md:col-span-2 bg-purple-900/20 border border-purple-600/30 rounded-lg p-6">
                        <h4 className="text-purple-300 font-medium mb-6 flex items-center">
                          <span className="mr-2">🏆</span>
                          Configuración Torneo Estructurado
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Tipo de Torneo *
                            </label>
                            <select
                              name="tournamentType"
                              value={configFormData.tournamentType || "LEAGUE"}
                              onChange={handleConfigFormChange}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                              <option value="LEAGUE">🏁 Liga (Todos vs Todos)</option>
                              <option value="KNOCKOUT">⚔️ Eliminación Directa</option>
                              <option value="HYBRID">🔄 Híbrido (Liga + Playoffs)</option>
                            </select>
                            <div className="mt-1 text-xs text-gray-400">
                              {configFormData.tournamentType === 'LEAGUE' && 'Sistema de puntos, todos compiten contra todos'}
                              {configFormData.tournamentType === 'KNOCKOUT' && 'Eliminación directa por rondas'}
                              {configFormData.tournamentType === 'HYBRID' && 'Liga clasificatoria + playoffs eliminatorios'}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Número de Participantes
                            </label>
                            <select
                              name="tournamentParticipants"
                              value={configFormData.tournamentParticipants || "16"}
                              onChange={handleConfigFormChange}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                              <option value="8">8 participantes</option>
                              <option value="16">16 participantes ⭐</option>
                              <option value="32">32 participantes</option>
                              <option value="64">64 participantes</option>
                              <option value="100">100 participantes (máx)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Distribución de Premios
                            </label>
                            <select
                              name="tournamentPrizeDistribution"
                              value={configFormData.tournamentPrizeDistribution || "TOP3"}
                              onChange={handleConfigFormChange}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                              <option value="WINNER_TAKES_ALL">🥇 Ganador único (100%)</option>
                              <option value="TOP3">🏆 Top 3 (60%, 25%, 15%)</option>
                              <option value="TOP5">🎖️ Top 5 (40%, 25%, 15%, 12%, 8%)</option>
                              <option value="TOP10">🌟 Top 10% de participantes</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Duración del Torneo
                            </label>
                            <select
                              name="tournamentDuration"
                              value={configFormData.tournamentDuration || "MEDIUM"}
                              onChange={handleConfigFormChange}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                              <option value="FAST">⚡ Rápido (3-7 días)</option>
                              <option value="MEDIUM">🕐 Normal (1-2 semanas)</option>
                              <option value="LONG">📅 Extendido (3-4 semanas)</option>
                              <option value="SEASON">🏆 Temporada (1-3 meses)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                              <input
                                type="checkbox"
                                name="allowTournamentSpectators"
                                checked={configFormData.allowTournamentSpectators || false}
                                onChange={handleConfigFormChange}
                                className="mr-2 accent-purple-500"
                              />
                              👥 Permitir Espectadores
                            </label>
                            <div className="mt-1 text-xs text-gray-400">
                              Los espectadores pueden seguir el torneo sin apostar
                            </div>
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                              <input
                                type="checkbox"
                                name="enableTournamentChat"
                                checked={configFormData.enableTournamentChat || true}
                                onChange={handleConfigFormChange}
                                className="mr-2 accent-purple-500"
                              />
                              💬 Chat del Torneo
                            </label>
                            <div className="mt-1 text-xs text-gray-400">
                              Chat en vivo entre participantes durante el torneo
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                            <input
                              type="checkbox"
                              name="allowIdenticalPredictions"
                              checked={configFormData.allowIdenticalPredictions || false}
                              onChange={handleConfigFormChange}
                              className="mr-2 accent-purple-500"
                            />
                            🎯 Permitir Predicciones Idénticas
                          </label>
                          <div className="mt-1 text-xs text-gray-400">
                            Si se permite, múltiples participantes pueden hacer la misma predicción. 
                            Si está deshabilitado, cada predicción debe ser única.
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-5">
                          <div className="text-sm font-medium text-purple-200 mb-4 flex items-center">
                            <span className="mr-2">⚙️</span>
                            Configuración Avanzada del Torneo
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Tipo:</span>
                                <span className="text-purple-400 font-medium">
                                  {configFormData.tournamentType === 'LEAGUE' ? '🏁 Liga' :
                                   configFormData.tournamentType === 'KNOCKOUT' ? '⚔️ Eliminación' : '🔄 Híbrido'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Participantes:</span>
                                <span className="text-white font-medium">{configFormData.tournamentParticipants || '16'} jugadores</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Duración:</span>
                                <span className="text-orange-400 font-medium">
                                  {configFormData.tournamentDuration === 'FAST' ? '⚡ 3-7 días' :
                                   configFormData.tournamentDuration === 'MEDIUM' ? '🕐 1-2 semanas' :
                                   configFormData.tournamentDuration === 'LONG' ? '📅 3-4 semanas' : '🏆 1-3 meses'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Premios:</span>
                                <span className="text-yellow-400 font-medium">
                                  {configFormData.tournamentPrizeDistribution === 'WINNER_TAKES_ALL' ? '🥇 1 ganador' :
                                   configFormData.tournamentPrizeDistribution === 'TOP3' ? '🏆 Top 3' :
                                   configFormData.tournamentPrizeDistribution === 'TOP5' ? '🎖️ Top 5' : '🌟 Top 10%'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Espectadores:</span>
                                <span className={`font-medium ${configFormData.allowTournamentSpectators ? 'text-green-400' : 'text-gray-400'}`}>
                                  {configFormData.allowTournamentSpectators ? '✅ Permitidos' : '❌ No permitidos'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Chat:</span>
                                <span className={`font-medium ${configFormData.enableTournamentChat ? 'text-green-400' : 'text-gray-400'}`}>
                                  {configFormData.enableTournamentChat ? '💬 Habilitado' : '🔇 Deshabilitado'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-4 bg-purple-900/30 border border-purple-600/40 rounded-lg">
                            <div className="text-xs text-purple-300">
                              <p className="font-semibold mb-2">🏆 Mecánica del Torneo:</p>
                              {configFormData.tournamentType === 'LEAGUE' && (
                                <div className="space-y-1">
                                  <p>• Todos los participantes compiten entre sí</p>
                                  <p>• Sistema de ranking por puntos acumulados</p>
                                  <p>• Ganadores según distribución seleccionada</p>
                                </div>
                              )}
                              {configFormData.tournamentType === 'KNOCKOUT' && (
                                <div className="space-y-1">
                                  <p>• Brackets de eliminación directa</p>
                                  <p>• Perdedores quedan eliminados del torneo</p>
                                  <p>• Finalistas compiten por el primer lugar</p>
                                </div>
                              )}
                              {configFormData.tournamentType === 'HYBRID' && (
                                <div className="space-y-1">
                                  <p>• Fase de liga clasificatoria</p>
                                  <p>• Top clasificados avanzan a playoffs</p>
                                  <p>• Eliminación directa en fase final</p>
                                </div>
                              )}
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
                        <span className="text-gray-400">Reto:</span>
                        <span className="text-white">${configFormData.betAmount} USDC cada uno</span>
                      </div>
                      {/* Mostrar tipo de ofertas para Predicción Simple */}
                      {selectedBetTypeCard?.id === 'prediccion-simple' && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tipo de ofertas:</span>
                          <div className="text-right">
                            <span className={`font-medium ${configFormData.acceptVariableOffers ? 'text-blue-400' : 'text-green-400'}`}>
                              {configFormData.acceptVariableOffers ? '💰 Variables' : '⚖️ Iguales'}
                            </span>
                            <div className="text-xs text-gray-400">
                              {configFormData.acceptVariableOffers 
                                ? 'Cantidades diferentes permitidas' 
                                : 'Solo cantidades exactas'
                              }
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Mostrar configuración específica para Torneo */}
                      {selectedBetTypeCard?.id === 'torneo-estructurado' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tipo de torneo:</span>
                            <span className="text-purple-400 font-medium">
                              {configFormData.tournamentType === 'LEAGUE' ? '🏁 Liga' :
                               configFormData.tournamentType === 'KNOCKOUT' ? '⚔️ Eliminación' : '🔄 Híbrido'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Participantes torneo:</span>
                            <span className="text-white">{configFormData.tournamentParticipants} jugadores</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Distribución premios:</span>
                            <span className="text-yellow-400 font-medium">
                              {configFormData.tournamentPrizeDistribution === 'WINNER_TAKES_ALL' ? '🥇 1 ganador' :
                               configFormData.tournamentPrizeDistribution === 'TOP3' ? '🏆 Top 3' :
                               configFormData.tournamentPrizeDistribution === 'TOP5' ? '🎖️ Top 5' : '🌟 Top 10%'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Duración:</span>
                            <span className="text-orange-400">
                              {configFormData.tournamentDuration === 'FAST' ? '⚡ 3-7 días' :
                               configFormData.tournamentDuration === 'MEDIUM' ? '🕐 1-2 semanas' :
                               configFormData.tournamentDuration === 'LONG' ? '📅 3-4 semanas' : '🏆 1-3 meses'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Funciones extra:</span>
                            <div className="text-right">
                              <div className="space-x-2">
                                {configFormData.allowTournamentSpectators && (
                                  <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">👥 Espectadores</span>
                                )}
                                {configFormData.enableTournamentChat && (
                                  <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">💬 Chat</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Premio total estimado:</span>
                        <span className="text-yellow-400">
                          ${(parseFloat(configFormData.betAmount) * parseInt(
                            selectedBetTypeCard?.id === 'torneo-estructurado' 
                              ? configFormData.tournamentParticipants 
                              : configFormData.maxParticipants
                          )).toLocaleString()} USDC
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Resolución:</span>
                        <div className="text-right">
                          <div className="text-white font-medium mb-1">
                            {configFormData.resolutionMode === 'EXACT' ? '🎯 Exacta' :
                             configFormData.resolutionMode === 'CLOSEST' ? '🔥 Más Cercano' :
                             configFormData.resolutionMode === 'GROUP_WINNER' ? '⚖️ Grupo Ganador' : '🏆 Multi-Ganador'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {configFormData.resolutionMode === 'EXACT' ? 'Solo coincidencias perfectas ganan' :
                             configFormData.resolutionMode === 'CLOSEST' ? 'Gana la predicción más cercana' :
                             configFormData.resolutionMode === 'GROUP_WINNER' ? 'Todo el grupo ganador recibe premio' : 'Múltiples ganadores posibles'}
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
        <div className="w-80 bg-[#1a1d29] border-l border-gray-700 flex flex-col">
          <UserPanel username={mockUser.username} />
          
          {/* Bot Simulator - Solo mostrar si hay usuario autenticado */}
          {user && challenges.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <BotSimulator autoSimulate={false} />
            </div>
          )}
        </div>
      </div>

      {/* Modal para unirse a reto */}
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

      {/* Selector de tipo de reto */}
      <BetTypeSelector 
        isOpen={showBetTypeSelector}
        onClose={() => setShowBetTypeSelector(false)}
        onSelectType={handleBetTypeSelection}
      />

      {/* Modal para crear reto */}
      <BetModal 
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedBetType(null);
        }}
        onCreateBet={handleCreateBet}
        selectedType={selectedBetType || undefined}
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

      {/* Bot Manager Modal */}
      <BotManager 
        isOpen={showBotManager}
        onClose={() => setShowBotManager(false)}
      />

      {/* Create Tournament Modal */}
      <CreateTournamentModal 
        isOpen={showCreateTournamentModal}
        onClose={() => setShowCreateTournamentModal(false)}
        onSuccess={handleCreateTournamentSuccess}
      />

      <Footer />
    </div>
  );
}