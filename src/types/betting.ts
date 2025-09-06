export interface SportCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface BettingChallenge {
  id: string;
  title: string;
  type: string;
  description: string;
  stake: string;
  participants: string;
  timeRemaining: string;
  creator: string;
  odds: string;
  league: string;
  sport: string;
  endDate: string;
  icon: string;
  iconBg: string;
}

export interface Position {
  id: string;
  title: string;
  type: string;
  status: 'Activo' | 'Pendiente';
  stake: string;
  participants: string;
  date: string;
}

export interface Match {
  id: string;
  title: string;
  league: string;
  date: string;
  time: string;
  venue: string;
  local: {
    name: string;
    odds: number;
  };
  draw?: {
    odds: number;
  };
  away: {
    name: string;
    odds: number;
  };
  participants: string;
  minBet: string;
  status: 'Próximo' | 'En Vivo' | 'Finalizado';
}

export interface MarketType {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  marketsCount: number;
  totalVolume: string;
}

export interface UserProfile {
  username: string;
  network: string;
  balance: string;
  gasPrice: string;
  avatar?: string;
}

// Tipos del protocolo según el contrato desplegado
export enum BetType {
  SIMPLE = 0,
  TOURNAMENT = 1,
  GROUP_BALANCED = 2,
  ONE_VS_ONE = 3
}

export enum ResolutionMode {
  EXACT = 0,
  CLOSEST = 1,
  MULTI_WINNER = 2,
  GROUP_WINNER = 3
}

export enum OneVsOneMode {
  CLASSIC = 0,
  MARKET = 1
}

export enum TournamentType {
  LEAGUE = 'LEAGUE',
  KNOCKOUT = 'KNOCKOUT'
}

// Información detallada de los modos de resolución
export interface ResolutionModeInfo {
  name: string;
  icon: string;
  description: string;
  example: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  winChance: 'Alta' | 'Media' | 'Baja';
  prizeDistribution: string;
}

export enum BetStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING'
}

export interface UserBet {
  id: string;
  title: string;
  betType: BetType;
  resolutionMode: ResolutionMode;
  status: BetStatus;
  stake: string;
  userPrediction?: number;
  participants: number;
  maxParticipants: number;
  dateCreated: string;
  endDate?: string;
  outcome?: number;
  winnings?: string;
  sport: string;
  league: string;
  icon: string;
  iconBg: string;
}

export interface UserStats {
  totalBets: number;
  activeBets: number;
  wonBets: number;
  lostBets: number;
  pendingBets: number;
  totalStaked: string;
  totalWinnings: string;
  winRate: number;
  profitLoss: string;
  bestStreak: number;
  currentStreak: number;
}

export interface Transaction {
  id: string;
  type: 'BET_PLACED' | 'BET_WON' | 'BET_LOST' | 'BET_REFUNDED' | 'REWARD_CLAIMED';
  betId: string;
  betTitle: string;
  amount: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface UserBalance {
  usdc: string;
  locked: string;
  available: string;
  pendingRewards: string;
}

// Configuración para Battle Royal con múltiples ganadores
export interface WinnerConfiguration {
  position: number; // 1er lugar, 2do lugar, etc.
  percentage: number; // porcentaje del pozo total
  label: string; // "1er Lugar", "2do Lugar", etc.
}

// Configuración específica para cada modo de resolución
export interface ExactModeConfig {
  maxWinners: number;
  winnerDistribution: WinnerConfiguration[];
  tieBreakMethod: 'SPLIT_PRIZE' | 'NO_TIES';
}

export interface ClosestModeConfig {
  proximityType: 'ABSOLUTE' | 'PERCENTAGE' | 'SCALED';
  allowTies: boolean;
  tieBreakMethod: 'SPLIT_PRIZE' | 'TIMESTAMP' | 'RANDOM';
  maxWinners: 1 | 3 | 5; // Solo 1, 3 o 5 ganadores para closest
}

export interface MultiWinnerModeConfig {
  positionDistribution: 'FIXED' | 'CUSTOM' | 'PROGRESSIVE';
  winnerPositions: number; // 3, 5, 10 ganadores
  prizeDistribution: {
    position: number;
    percentage: number;
  }[];
  qualificationThreshold?: number; // umbral mínimo para ganar
}

// Unión de todas las configuraciones posibles
export type ResolutionModeConfig = ExactModeConfig | ClosestModeConfig | MultiWinnerModeConfig;

// Configuración extendida para retos
export interface ExtendedBetConfig {
  id: string;
  title: string;
  description: string;
  betType: BetType;
  resolutionMode: ResolutionMode;
  battleRoyalConfig?: BattleRoyalConfig;
  betAmount: string;
  maxParticipants: string;
  endDateTime: string;
  isPublic: boolean;
}