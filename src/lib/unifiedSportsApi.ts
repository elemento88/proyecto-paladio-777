// Removed unused import: SportsAPI
import { LiveScore } from '@/types/sports';

// Datos deportivos unificados que incluyen todos los eventos de la aplicación
export class UnifiedSportsAPI {
  // Cache para evitar llamadas repetitivas
  private static cache: {
    data: LiveScore[];
    timestamp: number;
  } | null = null;

  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  // Obtener todos los eventos deportivos disponibles en la aplicación
  static async getAllEvents(): Promise<LiveScore[]> {
    // Verificar cache
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      console.log('📦 Using cached sports data');
      return this.cache.data;
    }

    try {
      console.log('🔄 Loading massive sports events...');
      
      // Importar dinámicamente para evitar problemas de dependencias circulares
      const { getMassiveSportsEvents } = await import('./massiveSportsApi');
      
      // Usar la función masiva que genera 3,000-6,000 eventos
      const massiveEvents = await getMassiveSportsEvents();
      
      console.log(`✅ Generated ${massiveEvents.length} massive sports events`);
      console.log('🔍 Sample events loaded:', 
        massiveEvents.slice(0, 5).map(e => `${e.homeTeam} vs ${e.awayTeam} (${e.date})`));

      // Actualizar cache
      this.cache = {
        data: massiveEvents,
        timestamp: Date.now()
      };

      return massiveEvents;
    } catch (error) {
      console.error('Error loading massive sports data:', error);
      
      // Fallback a datos mock comprehensivos
      console.log('🔄 Using fallback comprehensive mock data');
      const mockEvents = this.generateComprehensiveMockData();
      
      // Actualizar cache con fallback
      this.cache = {
        data: mockEvents,
        timestamp: Date.now()
      };
      
      return mockEvents;
    }
  }

  // Generar datos mock comprehensivos
  private static generateComprehensiveMockData(): LiveScore[] {
    const today = new Date();
    
    return [
      // La Liga
      {
        id: 9001,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9002,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Real Betis',
        awayTeam: 'Sevilla',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 36 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9003,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Real Sociedad',
        awayTeam: 'Valencia',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 48 * 60 * 60 * 1000).toISOString()
      },
      // Premier League
      {
        id: 9004,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Brighton',
        awayTeam: 'Burnley',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9005,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Liverpool',
        awayTeam: 'Manchester City',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 18 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9006,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Brighton',
        awayTeam: 'Chelsea',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 30 * 60 * 60 * 1000).toISOString()
      },
      // NBA
      {
        id: 9007,
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Boston Celtics',
        awayTeam: 'Brooklyn Nets',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9008,
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Bulls',
        awayTeam: 'Lakers',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 15 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9009,
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Raptors',
        awayTeam: 'Heat',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 22 * 60 * 60 * 1000).toISOString()
      },
      // Serie A
      {
        id: 9010,
        sport: 'football',
        league: 'Serie A',
        homeTeam: 'Roma',
        awayTeam: 'Lazio',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 26 * 60 * 60 * 1000).toISOString()
      },
      // Bundesliga
      {
        id: 9011,
        sport: 'football',
        league: 'Bundesliga',
        homeTeam: 'Bayer Leverkusen',
        awayTeam: 'Borussia Dortmund',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 40 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9012,
        sport: 'football',
        league: 'Bundesliga',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Borussia Monchengladbach',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 52 * 60 * 60 * 1000).toISOString()
      },
      // Más equipos para busqueda por letra R
      {
        id: 9013,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Rayo Vallecano',
        awayTeam: 'Real Valladolid',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 60 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9014,
        sport: 'football',
        league: 'Serie A',
        homeTeam: 'Roma',
        awayTeam: 'Atalanta',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 65 * 60 * 60 * 1000).toISOString()
      },
      // Equipos que empiezan con B
      {
        id: 9015,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Brighton',
        awayTeam: 'Burnley',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 70 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9016,
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Boston Celtics',
        awayTeam: 'Brooklyn Nets',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 75 * 60 * 60 * 1000).toISOString()
      },
      // Equipos que empiezan con M
      {
        id: 9017,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Manchester United',
        awayTeam: 'Manchester City',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 80 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9018,
        sport: 'football',
        league: 'Serie A',
        homeTeam: 'AC Milan',
        awayTeam: 'Inter Milan',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 85 * 60 * 60 * 1000).toISOString()
      },
      // Equipos que empiezan con A
      {
        id: 9019,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Arsenal',
        awayTeam: 'Aston Villa',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 90 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9020,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Atletico Madrid',
        awayTeam: 'Athletic Bilbao',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 95 * 60 * 60 * 1000).toISOString()
      },
      // Equipos que empiezan con L
      {
        id: 9021,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Liverpool',
        awayTeam: 'Leicester City',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 100 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9022,
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Los Angeles Lakers',
        awayTeam: 'Los Angeles Clippers',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 105 * 60 * 60 * 1000).toISOString()
      },
      // Equipos que empiezan con C
      {
        id: 9023,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Chelsea',
        awayTeam: 'Crystal Palace',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 110 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9024,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Celta Vigo',
        awayTeam: 'Cadiz',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 115 * 60 * 60 * 1000).toISOString()
      },
      // Equipos que empiezan con T
      {
        id: 9025,
        sport: 'football',
        league: 'Premier League',
        homeTeam: 'Tottenham',
        awayTeam: 'West Ham',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 120 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9026,
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Toronto Raptors',
        awayTeam: 'Miami Heat',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 125 * 60 * 60 * 1000).toISOString()
      },
      // Equipos que empiezan con P
      {
        id: 9027,
        sport: 'football',
        league: 'Ligue 1',
        homeTeam: 'PSG',
        awayTeam: 'Paris FC',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 130 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9028,
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Philadelphia 76ers',
        awayTeam: 'Phoenix Suns',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 135 * 60 * 60 * 1000).toISOString()
      },
      // Equipos que empiezan con S
      {
        id: 9029,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Sevilla',
        awayTeam: 'Real Sociedad',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 140 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9030,
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'San Antonio Spurs',
        awayTeam: 'Sacramento Kings',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date(today.getTime() + 145 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  // Datos de fallback básicos
  private static generateBasicFallbackData(): LiveScore[] {
    return [
      {
        id: 8001,
        sport: 'football',
        league: 'La Liga',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date().toISOString()
      },
      {
        id: 8002,
        sport: 'basketball',
        league: 'NBA',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: 'VS',
        date: new Date().toISOString()
      }
    ];
  }

  // Limpiar cache manualmente
  static clearCache(): void {
    this.cache = null;
    console.log('🗑️ Sports cache cleared');
  }

  // Buscar eventos específicos
  static async searchEvents(query: string): Promise<LiveScore[]> {
    const allEvents = await this.getAllEvents();
    const searchTerm = query.toLowerCase();

    return allEvents.filter(event => {
      const homeTeam = event.homeTeam.toLowerCase();
      const awayTeam = event.awayTeam.toLowerCase();
      const league = event.league.toLowerCase();

      return homeTeam.includes(searchTerm) ||
             awayTeam.includes(searchTerm) ||
             league.includes(searchTerm) ||
             homeTeam.startsWith(searchTerm) ||
             awayTeam.startsWith(searchTerm) ||
             homeTeam.split(' ').some(word => word.startsWith(searchTerm)) ||
             awayTeam.split(' ').some(word => word.startsWith(searchTerm));
    });
  }
}