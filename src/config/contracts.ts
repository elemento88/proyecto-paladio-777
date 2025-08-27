// Configuración de contratos del protocolo de apuestas
export const NETWORK_CONFIG = {
  chainId: 80002,
  name: 'Polygon Amoy Testnet',
  rpcUrl: 'https://rpc-amoy.polygon.technology',
  blockExplorer: 'https://amoy.polygonscan.com',
  currency: 'MATIC',
  currencySymbol: 'MATIC'
};

export const CONTRACT_ADDRESSES = {
  MOCK_USDC: '0xBC0F832569966f667a915c5eFE3A787b31a2C751',
  BETTING_PROTOCOL: '0xAa41f121D883415F9cD70Ce2c7F9A453Ada0Fa9f',
};

export const MOCK_USDC_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function mint(address to, uint256 amount)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

export const BETTING_PROTOCOL_ABI = [
  // ============== FUNCIONES DE LECTURA ===============
  
  // Estado básico del contrato
  'function ORACLE_ROLE() view returns (bytes32)',
  'function MAX_PARTICIPANTS_PER_GROUP() view returns (uint256)',
  'function MAX_GROUPS() view returns (uint256)',
  'function paused() view returns (bool)',
  
  // Configuración de tokens y fees
  'function usdcToken() view returns (address)',
  'function generalFee() view returns (uint256)',
  'function tournamentFee() view returns (uint256)',
  'function feeRecipient() view returns (address)',
  
  // Contadores y configuración
  'function betCount() view returns (uint256)',
  'function tournamentCount() view returns (uint256)',
  'function topWinnersLargeTournaments() view returns (uint256)',
  'function topWinnersSmallTournaments() view returns (uint256)',
  'function distributionLarge(uint256) view returns (uint256)',
  'function distributionSmall(uint256) view returns (uint256)',
  'function defaultOracle() view returns (address)',
  
  // Información de apuestas (getter complejo)
  'function bets(uint256) view returns (uint256 betType, uint256 resolutionMode, uint256 stakeAmount, bool locked, bool resolved, uint256 winningTeam, uint256 maxParticipants)',
  
  // Información de torneos
  'function tournaments(uint256) view returns (tuple(uint256 tournamentType, uint256 resolutionMode, uint256 maxParticipants, bool allowIdenticalBets, uint256 registrationEndTime) config, uint256 state, uint256 tournamentId, uint256 currentRound)',
  
  // Oracle data
  'function getLatestOracleData() view returns (int)',
  
  // ============== FUNCIONES DE CREACIÓN DE APUESTAS ===============
  
  // Apuestas simples
  'function createSimpleBet(uint256 resolutionMode, uint256 stakeAmount, uint256 maxParticipants) returns (uint256)',
  
  // Apuestas 1 vs 1
  'function createOneVsOneBet(uint256 prediction, uint256 stakeAmount, uint256 mode) returns (uint256)',
  
  // Apuestas grupales balanceadas
  'function createBalancedGroupBet(uint256 resolutionMode, uint256 stakeAmount, uint256 maxParticipants, uint256 groupSize) returns (uint256)',
  
  // ============== FUNCIONES DE PARTICIPACIÓN ===============
  
  // Unirse a apuestas generales
  'function joinBet(uint256 betId, uint256 predictedValue)',
  
  // Funciones 1 vs 1
  'function offerAgainstBet(uint256 betId, uint256 amount) returns (uint256)',
  'function acceptOffer(uint256 betId, uint256[] calldata offerIds)',
  
  // Funciones grupales
  'function createPrivateGroup(uint256 betId) returns (uint256)',
  'function joinGroup(uint256 betId, uint256 groupId, uint256 predictedValue)',
  'function joinBalancedBet(uint256 betId, uint256 predictedValue)',
  
  // ============== FUNCIONES DE GESTIÓN DE APUESTAS ===============
  
  'function lockBet(uint256 betId)',
  'function cancelOneVsOneBet(uint256 betId)',
  'function refundBet(uint256 betId)',
  
  // ============== FUNCIONES DE RESOLUCIÓN (ORACLE ROLE) ===============
  
  'function resolveSimpleBet(uint256 betId, uint256 winningValue)',
  'function resolveOneVsOneBet(uint256 betId, uint256 outcome)',
  'function resolveBalancedGroupBet(uint256 betId, uint256 winningValue)',
  
  // ============== FUNCIONES DE TORNEOS ===============
  
  // Creación y gestión
  'function createTournament(uint256 tournamentType, uint256 resolutionMode, uint256 maxParticipants, bool allowIdenticalBets, uint256 registrationEndTime) returns (uint256)',
  'function registerForTournament(uint256 tournamentId)',
  
  // Control de estado
  'function startTournament(uint256 tournamentId)',
  'function pauseTournament(uint256 tournamentId)',
  'function resumeTournament(uint256 tournamentId)',
  'function cancelTournament(uint256 tournamentId)',
  
  // Resolución de torneos
  'function resolveTournament(uint256 tournamentId, address[] calldata winners, bool isLarge)',
  'function updateLeaguePoints(uint256 tournamentId, address[] calldata players, uint256[] calldata points)',
  'function advanceKnockoutRound(uint256 tournamentId, address[] calldata winners)',
  
  // ============== FUNCIONES DE CONFIGURACIÓN (ADMIN ROLE) ===============
  
  // Configuración de fees
  'function setGeneralFee(uint256 fee)',
  'function setTournamentFee(uint256 fee)',
  
  // Configuración de torneos
  'function setTopWinners(uint256 large, uint256 small)',
  'function setDistributionLarge(uint256[] calldata dist)',
  'function setDistributionSmall(uint256[] calldata dist)',
  
  // Configuración del oráculo
  'function setDefaultOracle(address oracle)',
  
  // Control del contrato
  'function pause()',
  'function unpause()',
  
  // ============== FUNCIONES DE CONTROL DE ACCESO ===============
  
  'function grantRole(bytes32 role, address account)',
  'function revokeRole(bytes32 role, address account)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function getRoleAdmin(bytes32 role) view returns (bytes32)',
  
  // ============== FUNCIONES DE ACTUALIZACIÓN ===============
  
  'function upgradeTo(address newImplementation)',
  'function upgradeToAndCall(address newImplementation, bytes calldata data)',
  
  // ============== EVENTOS ===============
  
  // Eventos de apuestas
  'event BetCreated(uint256 indexed betId, uint256 betType, uint256 resolutionMode, uint256 stakeAmount)',
  'event PlayerJoined(uint256 indexed betId, address indexed player)',
  'event BetJoined(uint256 indexed betId, address indexed player, uint256 predictedValue)',
  'event BetLocked(uint256 indexed betId)',
  'event BetResolved(uint256 indexed betId, uint256 winningValue)',
  'event PayoutClaimed(uint256 indexed betId, address indexed player, uint256 amount)',
  'event RewardClaimed(uint256 indexed betId, address indexed player, uint256 amount)',
  'event BetRefunded(uint256 indexed betId)',
  'event BetCancelled(uint256 indexed betId, address indexed creator)',
  
  // Eventos grupales
  'event GroupCreated(uint256 indexed betId, uint256 indexed groupId, address indexed creator, bool isPrivate)',
  'event PlayerJoinedGroup(uint256 indexed betId, uint256 indexed groupId, address indexed player)',
  'event GroupBalancedBetResolved(uint256 indexed betId, uint256 indexed winningGroupId)',
  
  // Eventos 1 vs 1
  'event OneVsOneBetCreated(uint256 indexed betId, uint256 mode, uint256 creatorPrediction, uint256 stakeAmount)',
  'event OfferMade(uint256 indexed betId, uint256 indexed offerId, address indexed bidder, uint256 amount)',
  'event OfferAccepted(uint256 indexed betId, uint256 indexed offerId, address indexed bidder)',
  'event OffersPoolAccepted(uint256 indexed betId, uint256 totalOffers, uint256 totalAmount)',
  'event OneVsOneBetResolved(uint256 indexed betId, uint256 outcome, address indexed winner)',
  
  // Eventos de torneos
  'event TournamentCreated(uint256 indexed tournamentId, uint256 tournamentType, uint256 resolutionMode)',
  'event TournamentStarted(uint256 indexed tournamentId)',
  'event TournamentPaused(uint256 indexed tournamentId)',
  'event TournamentResumed(uint256 indexed tournamentId)',
  'event TournamentFinished(uint256 indexed tournamentId)',
  'event TournamentCancelled(uint256 indexed tournamentId)',
  'event PlayerRegistered(uint256 indexed tournamentId, address indexed player)',
  'event PointsUpdated(uint256 indexed tournamentId, address indexed player, uint256 points)',
  'event RoundAdvanced(uint256 indexed tournamentId, uint256 newRound)',
  
  // Eventos de configuración
  'event CommissionUpdated(uint256 oldCommission, uint256 newCommission)',
  'event LimitsUpdated(uint256 oldLimit, uint256 newLimit)',
];

// Enums del protocolo
export enum BetType {
  SIMPLE = 0,
  TOURNAMENT = 1,
  GROUP_BALANCED = 2,
  ONE_VS_ONE = 3,
}

export enum ResolutionMode {
  EXACT = 0,
  CLOSEST = 1,
  MULTI_WINNER = 2,
}

export enum OneVsOneMode {
  CLASSIC = 0,
  MARKET = 1,
}

export enum TournamentType {
  LEAGUE = 0,
  KNOCKOUT = 1,
}

// Configuración de fees
export const FEES_CONFIG = {
  general: 500, // 5% (500 basis points)
  tournament: 300, // 3% (300 basis points)
  display: {
    general: "5%",
    tournament: "3%"
  }
};

// Configuración de transacciones
export const TRANSACTION_CONFIG = {
  gasLimit: {
    createBet: 500000,
    joinBet: 300000,
    resolveBet: 400000,
    claimReward: 200000,
    approve: 100000
  },
  gasPrice: "auto",
  confirmations: 2
};