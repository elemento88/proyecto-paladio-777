import { 
  ApiResponse, 
  Fixture, 
  League, 
  Team, 
  BasketballGame, 
  AmericanFootballGame, 
  HockeyGame, 
  BaseballGame,
  LiveScore,
  Odds,
  MatchStatistics,
  SportData
} from '@/types/sports'

// API Configuration
const API_CONFIG = {
  baseUrl: 'https://api-football-v1.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
    'X-RapidAPI-Host': process.env.NEXT_PUBLIC_API_FOOTBALL_HOST || 'api-football-v1.p.rapidapi.com'
  }
}

// Helper function to make API calls
async function apiCall<T>(endpoint: string): Promise<ApiResponse<T> | null> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: API_CONFIG.headers
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Check for subscription error
    if (data.message && data.message.includes('not subscribed')) {
      console.warn('API key not subscribed, using mock data')
      return null
    }
    
    return data
  } catch (error) {
    console.error('API call error:', error)
    return null
  }
}

// Sports data configuration
export const AVAILABLE_SPORTS: SportData[] = [
  {
    id: 1,
    name: 'Fútbol',
    slug: 'football',
    icon: '⚽',
    apiEndpoint: '/v3/fixtures',
    isAvailable: true
  },
  {
    id: 2,
    name: 'Baloncesto',
    slug: 'basketball',
    icon: '🏀',
    apiEndpoint: '/v1/games',
    isAvailable: false // Will be implemented
  },
  {
    id: 3,
    name: 'Fútbol Americano',
    slug: 'american-football',
    icon: '🏈',
    apiEndpoint: '/v1/games',
    isAvailable: false
  },
  {
    id: 4,
    name: 'Hockey',
    slug: 'hockey',
    icon: '🏒',
    apiEndpoint: '/v1/games',
    isAvailable: false
  },
  {
    id: 5,
    name: 'Béisbol',
    slug: 'baseball',
    icon: '⚾',
    apiEndpoint: '/v1/games',
    isAvailable: false
  },
  {
    id: 6,
    name: 'Tenis',
    slug: 'tennis',
    icon: '🎾',
    apiEndpoint: '/v1/games',
    isAvailable: false
  },
  {
    id: 7,
    name: 'Cricket',
    slug: 'cricket',
    icon: '🏏',
    apiEndpoint: '/v1/games',
    isAvailable: false
  },
  {
    id: 8,
    name: 'Volleyball',
    slug: 'volleyball',
    icon: '🏐',
    apiEndpoint: '/v1/games',
    isAvailable: false
  },
  {
    id: 9,
    name: 'Rugby',
    slug: 'rugby',
    icon: '🏉',
    apiEndpoint: '/v1/games',
    isAvailable: false
  },
  {
    id: 10,
    name: 'Formula 1',
    slug: 'formula1',
    icon: '🏎️',
    apiEndpoint: '/v1/races',
    isAvailable: false
  }
]

// FOOTBALL/SOCCER API CALLS
export class FootballAPI {
  // Get all leagues
  static async getLeagues(season: number = new Date().getFullYear()): Promise<League[]> {
    const data = await apiCall<League>(`/v3/leagues?season=${season}`)
    return data?.response || []
  }

  // Get teams from a league
  static async getTeams(leagueId: number, season: number = new Date().getFullYear()): Promise<Team[]> {
    const data = await apiCall<Team>(`/v3/teams?league=${leagueId}&season=${season}`)
    return data?.response || []
  }

  // Get live fixtures
  static async getLiveFixtures(): Promise<Fixture[]> {
    const data = await apiCall<Fixture>('/v3/fixtures?live=all')
    return data?.response || []
  }

  // Get fixtures by date
  static async getFixturesByDate(date: string): Promise<Fixture[]> {
    const data = await apiCall<Fixture>(`/v3/fixtures?date=${date}`)
    return data?.response || []
  }

  // Get fixtures by league
  static async getFixturesByLeague(leagueId: number, season: number = new Date().getFullYear()): Promise<Fixture[]> {
    const data = await apiCall<Fixture>(`/v3/fixtures?league=${leagueId}&season=${season}`)
    return data?.response || []
  }

  // Get fixture details
  static async getFixtureDetails(fixtureId: number): Promise<Fixture | null> {
    const data = await apiCall<Fixture>(`/v3/fixtures?id=${fixtureId}`)
    return data?.response?.[0] || null
  }

  // Get odds for a fixture
  static async getFixtureOdds(fixtureId: number): Promise<Odds[]> {
    const data = await apiCall<Odds>(`/v3/odds?fixture=${fixtureId}`)
    return data?.response || []
  }

  // Get match statistics
  static async getMatchStatistics(fixtureId: number): Promise<MatchStatistics | null> {
    const data = await apiCall<MatchStatistics>(`/v3/fixtures/statistics?fixture=${fixtureId}`)
    return data?.response?.[0] || null
  }

  // Get top leagues (popular ones)
  static getTopLeagues(): { id: number; name: string; country: string; logo: string }[] {
    return [
      { id: 39, name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png' },
      { id: 140, name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      { id: 78, name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png' },
      { id: 61, name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png' },
      { id: 135, name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png' },
      { id: 2, name: 'Champions League', country: 'World', logo: 'https://media.api-sports.io/football/leagues/2.png' },
      { id: 3, name: 'Europa League', country: 'World', logo: 'https://media.api-sports.io/football/leagues/3.png' },
      { id: 1, name: 'World Cup', country: 'World', logo: 'https://media.api-sports.io/football/leagues/1.png' }
    ]
  }
}

// Mock data generator for when API is not available
class MockDataGenerator {
  static generateTodaysFixtures(): LiveScore[] {
    const today = new Date()
    const todayStr = today.toISOString()
    
    return [
      // Premier League
      {
        id: 1001,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Manchester City',
        awayTeam: 'Arsenal',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 1002,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Liverpool',
        awayTeam: 'Chelsea',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 4 * 60 * 60 * 1000).toISOString()
      },
      // La Liga
      {
        id: 1003,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 1004,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Atlético Madrid',
        awayTeam: 'Valencia',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 8 * 60 * 60 * 1000).toISOString()
      },
      // Serie A
      {
        id: 1005,
        sport: 'football',
        league: 'Serie A',
        homeTeam: 'Juventus',
        awayTeam: 'AC Milan',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 5 * 60 * 60 * 1000).toISOString()
      },
      // Bundesliga
      {
        id: 1006,
        sport: 'football',
        league: 'Bundesliga',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Borussia Dortmund',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 7 * 60 * 60 * 1000).toISOString()
      }
    ]
  }

  static generateLiveScores(): LiveScore[] {
    const now = new Date()
    
    return [
      {
        id: 2001,
        sport: 'football',
        league: 'Champions League',
        homeTeam: 'PSG',
        awayTeam: 'Manchester United',
        homeScore: 2,
        awayScore: 1,
        status: 'Match Finished',
        time: 'FT',
        date: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 2002,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Tottenham',
        awayTeam: 'West Ham',
        homeScore: 1,
        awayScore: 1,
        status: 'Second Half',
        time: '67\'',
        date: now.toISOString()
      },
      {
        id: 2003,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Sevilla',
        awayTeam: 'Real Betis',
        homeScore: 0,
        awayScore: 2,
        status: 'First Half',
        time: '23\'',
        date: new Date(now.getTime() - 23 * 60 * 1000).toISOString()
      }
    ]
  }
}

// UNIFIED SPORTS API
export class SportsAPI {
  // Get all available sports
  static getAvailableSports(): SportData[] {
    return AVAILABLE_SPORTS
  }

  // Get live scores for all sports
  static async getLiveScores(): Promise<LiveScore[]> {
    try {
      // Try to get real data first
      const footballFixtures = await FootballAPI.getLiveFixtures()
      
      if (footballFixtures.length === 0) {
        console.info('No real API data available, using mock live scores')
        return MockDataGenerator.generateLiveScores()
      }
      
      const liveScores: LiveScore[] = footballFixtures.map(fixture => ({
        id: fixture.id,
        sport: 'football',
        league: fixture.league.name,
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        homeScore: fixture.goals.home,
        awayScore: fixture.goals.away,
        status: fixture.status.long,
        time: fixture.status.elapsed ? `${fixture.status.elapsed}'` : fixture.status.short,
        date: fixture.date
      }))

      return liveScores
    } catch (error) {
      console.error('Error fetching live scores:', error)
      return MockDataGenerator.generateLiveScores()
    }
  }

  // Get today's fixtures
  static async getTodaysFixtures(): Promise<LiveScore[]> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const footballFixtures = await FootballAPI.getFixturesByDate(today)
      
      if (footballFixtures.length === 0) {
        console.info('No real API data available, using mock fixtures for today')
        return MockDataGenerator.generateTodaysFixtures()
      }
      
      const todaysFixtures: LiveScore[] = footballFixtures.map(fixture => ({
        id: fixture.id,
        sport: 'football',
        league: fixture.league.name,
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        homeScore: fixture.goals.home,
        awayScore: fixture.goals.away,
        status: fixture.status.long,
        time: fixture.status.elapsed ? `${fixture.status.elapsed}'` : fixture.status.short,
        date: fixture.date
      }))

      return todaysFixtures
    } catch (error) {
      console.error('Error fetching today\'s fixtures:', error)
      return MockDataGenerator.generateTodaysFixtures()
    }
  }

  // Get popular leagues
  static getPopularLeagues() {
    return FootballAPI.getTopLeagues()
  }
}

// Rate limiting helper
export class RateLimiter {
  private static requests: number[] = []
  private static readonly MAX_REQUESTS = 100 // API-Football free tier limit
  private static readonly TIME_WINDOW = 24 * 60 * 60 * 1000 // 24 hours

  static canMakeRequest(): boolean {
    const now = Date.now()
    // Remove requests older than 24 hours
    this.requests = this.requests.filter(time => now - time < this.TIME_WINDOW)
    
    if (this.requests.length >= this.MAX_REQUESTS) {
      console.warn('Rate limit reached. Please wait before making more requests.')
      return false
    }

    this.requests.push(now)
    return true
  }

  static getRemainingRequests(): number {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.TIME_WINDOW)
    return this.MAX_REQUESTS - this.requests.length
  }
}