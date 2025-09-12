import { 
  League, 
  Team, 
  LiveScore,
  SportData
} from '@/types/sports'

// TheSportsDB API Configuration - 100% GRATUITA
const THESPORTSDB_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'

// Types específicos para TheSportsDB
interface TheSportsDbTeam {
  idTeam: string
  strTeam: string
  strTeamBadge?: string
  strCountry?: string
  strSport: string
  strLeague?: string
  intFormedYear?: string
}

interface TheSportsDbLeague {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate?: string
  strCountry?: string
  strBadge?: string
  strLogo?: string
}

interface TheSportsDbEvent {
  idEvent: string
  strEvent: string
  strEventAlternate?: string
  strSport: string
  idLeague: string
  strLeague: string
  strSeason?: string
  strHomeTeam: string
  strAwayTeam: string
  intHomeScore?: string
  intAwayScore?: string
  strStatus?: string
  dateEvent?: string
  strTime?: string
  strTimestamp?: string
  strThumb?: string
  strHomeTeamBadge?: string
  strAwayTeamBadge?: string
  idHomeTeam: string
  idAwayTeam: string
}

// Helper function para hacer llamadas a TheSportsDB
async function theSportsDbCall<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${THESPORTSDB_BASE_URL}${endpoint}`)
    
    if (!response.ok) {
      throw new Error(`TheSportsDB API call failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('TheSportsDB API error:', error)
    return null
  }
}

// Mappers para convertir datos de TheSportsDB a nuestros tipos
function mapTheSportsDbTeamToTeam(dbTeam: TheSportsDbTeam): Team {
  return {
    id: parseInt(dbTeam.idTeam),
    name: dbTeam.strTeam,
    logo: dbTeam.strTeamBadge || '',
    country: dbTeam.strCountry || '',
    code: dbTeam.strTeam?.substring(0, 3).toUpperCase()
  }
}

function mapTheSportsDbLeagueToLeague(dbLeague: TheSportsDbLeague): League {
  return {
    id: parseInt(dbLeague.idLeague),
    name: dbLeague.strLeague,
    country: dbLeague.strCountry || '',
    logo: dbLeague.strBadge || dbLeague.strLogo || '',
    flag: '',
    season: new Date().getFullYear(),
    round: 'Regular Season'
  }
}

function mapTheSportsDbEventToLiveScore(dbEvent: TheSportsDbEvent): LiveScore {
  return {
    id: parseInt(dbEvent.idEvent),
    sport: dbEvent.strSport.toLowerCase(),
    league: dbEvent.strLeague,
    homeTeam: dbEvent.strHomeTeam,
    awayTeam: dbEvent.strAwayTeam,
    homeScore: dbEvent.intHomeScore ? parseInt(dbEvent.intHomeScore) : null,
    awayScore: dbEvent.intAwayScore ? parseInt(dbEvent.intAwayScore) : null,
    status: dbEvent.strStatus || 'Not Started',
    time: dbEvent.strTime || 'VS',
    date: dbEvent.dateEvent || new Date().toISOString()
  }
}

// TheSportsDB API Class
export class TheSportsDbAPI {
  
  // Buscar equipos por nombre
  static async searchTeams(teamName: string): Promise<Team[]> {
    const data = await theSportsDbCall<{ teams?: TheSportsDbTeam[] }>(`/searchteams.php?t=${encodeURIComponent(teamName)}`)
    if (!data?.teams) return []
    
    return data.teams.map(mapTheSportsDbTeamToTeam)
  }

  // Buscar ligas por nombre
  static async searchLeagues(leagueName: string): Promise<League[]> {
    const data = await theSportsDbCall<{ countrys?: TheSportsDbLeague[] }>(`/search_all_leagues.php?l=${encodeURIComponent(leagueName)}`)
    if (!data?.countrys) return []
    
    return data.countrys.map(mapTheSportsDbLeagueToLeague)
  }

  // Obtener todas las ligas de un país
  static async getLeaguesByCountry(country: string): Promise<League[]> {
    const data = await theSportsDbCall<{ countrys?: TheSportsDbLeague[] }>(`/search_all_leagues.php?c=${encodeURIComponent(country)}`)
    if (!data?.countrys) return []
    
    return data.countrys.map(mapTheSportsDbLeagueToLeague)
  }

  // Obtener equipos de una liga
  static async getTeamsByLeague(leagueId: string | number): Promise<Team[]> {
    const data = await theSportsDbCall<{ teams?: TheSportsDbTeam[] }>(`/lookup_all_teams.php?id=${leagueId}`)
    if (!data?.teams) return []
    
    return data.teams.map(mapTheSportsDbTeamToTeam)
  }

  // Obtener próximos eventos de una liga
  static async getNextEvents(leagueId: string | number): Promise<LiveScore[]> {
    const data = await theSportsDbCall<{ events?: TheSportsDbEvent[] }>(`/eventsnextleague.php?id=${leagueId}`)
    if (!data?.events) return []
    
    return data.events.map(mapTheSportsDbEventToLiveScore)
  }

  // Obtener eventos de una temporada específica
  static async getEventsBySeason(leagueId: string | number, season: string | number): Promise<LiveScore[]> {
    const data = await theSportsDbCall<{ events?: TheSportsDbEvent[] }>(`/eventsseason.php?id=${leagueId}&s=${season}`)
    if (!data?.events) return []
    
    return data.events.map(mapTheSportsDbEventToLiveScore)
  }

  // Obtener detalles de un evento
  static async getEventDetails(eventId: string | number): Promise<LiveScore | null> {
    const data = await theSportsDbCall<{ events?: TheSportsDbEvent[] }>(`/lookupevent.php?id=${eventId}`)
    if (!data?.events?.[0]) return null
    
    return mapTheSportsDbEventToLiveScore(data.events[0])
  }

  // Obtener eventos de hoy (todos los deportes)
  static async getTodaysEvents(): Promise<LiveScore[]> {
    // TheSportsDB no tiene endpoint directo para "hoy", así que simulamos con ligas populares
    const popularLeagues = [
      '4328', // Premier League
      '4335', // La Liga
      '4331', // Bundesliga
      '4334', // Serie A
      '4332', // Ligue 1
    ]
    
    const allEvents: LiveScore[] = []
    
    for (const leagueId of popularLeagues) {
      try {
        const events = await this.getNextEvents(leagueId)
        allEvents.push(...events.slice(0, 3)) // Máximo 3 por liga
      } catch (error) {
        console.error(`Error fetching events for league ${leagueId}:`, error)
      }
    }
    
    return allEvents
  }

  // Obtener ligas populares (hardcoded para mejor rendimiento)
  static getPopularLeagues(): { id: string; name: string; country: string; sport: string }[] {
    return [
      { id: '4328', name: 'Premier League', country: 'England', sport: 'Soccer' },
      { id: '4335', name: 'La Liga', country: 'Spain', sport: 'Soccer' },
      { id: '4331', name: 'Bundesliga', country: 'Germany', sport: 'Soccer' },
      { id: '4334', name: 'Serie A', country: 'Italy', sport: 'Soccer' },
      { id: '4332', name: 'Ligue 1', country: 'France', sport: 'Soccer' },
      { id: '4346', name: 'Champions League', country: 'Europe', sport: 'Soccer' },
      { id: '4480', name: 'NBA', country: 'USA', sport: 'Basketball' },
      { id: '4424', name: 'NFL', country: 'USA', sport: 'American Football' },
      { id: '4380', name: 'NHL', country: 'USA/Canada', sport: 'Ice Hockey' },
      { id: '4424', name: 'MLB', country: 'USA', sport: 'Baseball' }
    ]
  }

  // Obtener deportes disponibles
  static getSupportedSports(): SportData[] {
    return [
      {
        id: 1,
        name: 'Fútbol',
        slug: 'soccer',
        icon: '⚽',
        apiEndpoint: '/eventsnextleague.php',
        isAvailable: true
      },
      {
        id: 2,
        name: 'Baloncesto',
        slug: 'basketball',
        icon: '🏀',
        apiEndpoint: '/eventsnextleague.php',
        isAvailable: true
      },
      {
        id: 3,
        name: 'Fútbol Americano',
        slug: 'american-football',
        icon: '🏈',
        apiEndpoint: '/eventsnextleague.php',
        isAvailable: true
      },
      {
        id: 4,
        name: 'Hockey',
        slug: 'ice-hockey',
        icon: '🏒',
        apiEndpoint: '/eventsnextleague.php',
        isAvailable: true
      },
      {
        id: 5,
        name: 'Béisbol',
        slug: 'baseball',
        icon: '⚾',
        apiEndpoint: '/eventsnextleague.php',
        isAvailable: true
      },
      {
        id: 6,
        name: 'Tenis',
        slug: 'tennis',
        icon: '🎾',
        apiEndpoint: '/eventsnextleague.php',
        isAvailable: true
      },
      {
        id: 7,
        name: 'Cricket',
        slug: 'cricket',
        icon: '🏏',
        apiEndpoint: '/eventsnextleague.php',
        isAvailable: true
      },
      {
        id: 8,
        name: 'Motorsports',
        slug: 'motorsports',
        icon: '🏎️',
        apiEndpoint: '/eventsnextleague.php',
        isAvailable: true
      }
    ]
  }
}

// Nueva clase unificada que usa TheSportsDB
export class FreeSportsAPI {
  // Obtener deportes disponibles
  static getAvailableSports(): SportData[] {
    return TheSportsDbAPI.getSupportedSports()
  }

  // Obtener eventos en vivo/próximos (reemplaza getLiveScores)
  static async getLiveScores(): Promise<LiveScore[]> {
    try {
      return await TheSportsDbAPI.getTodaysEvents()
    } catch (error) {
      console.error('Error fetching live scores from TheSportsDB:', error)
      return []
    }
  }

  // Obtener partidos de hoy
  static async getTodaysFixtures(): Promise<LiveScore[]> {
    try {
      return await TheSportsDbAPI.getTodaysEvents()
    } catch (error) {
      console.error('Error fetching today\'s fixtures from TheSportsDB:', error)
      return []
    }
  }

  // Obtener ligas populares
  static getPopularLeagues() {
    return TheSportsDbAPI.getPopularLeagues()
  }

  // Buscar equipos
  static async searchTeams(query: string): Promise<Team[]> {
    try {
      return await TheSportsDbAPI.searchTeams(query)
    } catch (error) {
      console.error('Error searching teams:', error)
      return []
    }
  }

  // Buscar ligas
  static async searchLeagues(query: string): Promise<League[]> {
    try {
      return await TheSportsDbAPI.searchLeagues(query)
    } catch (error) {
      console.error('Error searching leagues:', error)
      return []
    }
  }
}

// Test function para verificar que funcione
export async function testTheSportsDbAPI(): Promise<void> {
  console.log('🧪 Testing TheSportsDB API...')
  
  try {
    // Test 1: Buscar Arsenal
    console.log('1. Searching Arsenal...')
    const arsenalTeams = await TheSportsDbAPI.searchTeams('Arsenal')
    console.log('Arsenal teams found:', arsenalTeams.length)
    
    // Test 2: Obtener eventos de hoy
    console.log('2. Getting today\'s events...')
    const todaysEvents = await FreeSportsAPI.getTodaysFixtures()
    console.log('Today\'s events found:', todaysEvents.length)
    
    // Test 3: Ligas populares
    console.log('3. Getting popular leagues...')
    const popularLeagues = FreeSportsAPI.getPopularLeagues()
    console.log('Popular leagues:', popularLeagues.length)
    
    console.log('✅ TheSportsDB API test completed successfully!')
    
  } catch (error) {
    console.error('❌ TheSportsDB API test failed:', error)
  }
}