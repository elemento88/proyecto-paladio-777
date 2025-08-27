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
  category: string;
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

// Nuevos tipos para el protocolo completo
export enum BetType {
  SIMPLE = 'SIMPLE',
  TOURNAMENT = 'TOURNAMENT',
  GROUP_BALANCED = 'GROUP_BALANCED',
  ONE_VS_ONE = 'ONE_VS_ONE'
}

export enum ResolutionMode {
  EXACT = 'EXACT',
  CLOSEST = 'CLOSEST',
  MULTI_WINNER = 'MULTI_WINNER'
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