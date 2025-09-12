// Removed unused imports: SportsAPI, FootballAPI
import { UnifiedSportsAPI } from './unifiedSportsApi';
import { BettingChallenge } from '@/types/betting';
import { LiveScore } from '@/types/sports';

export interface SearchResult {
  id: string;
  type: 'challenge' | 'match';
  title: string;
  subtitle: string;
  league: string;
  sport: string;
  icon: string;
  participants?: string;
  stake?: string;
  timeLeft?: string;
  status?: string;
  date?: string;
  url?: string;
}

export class SearchAPI {
  // Buscar en retos activos
  static searchChallenges(query: string, challenges: BettingChallenge[]): SearchResult[] {
    if (query.length < 1) return [];

    const searchTerm = query.toLowerCase();
    
    return challenges
      .filter(challenge => {
        const title = challenge.title.toLowerCase();
        const league = challenge.league?.toLowerCase() || '';
        const description = challenge.description.toLowerCase();
        
        // Búsqueda más flexible
        return title.includes(searchTerm) ||
               league.includes(searchTerm) ||
               description.includes(searchTerm) ||
               title.startsWith(searchTerm) ||
               league.startsWith(searchTerm) ||
               // Búsqueda por palabras parciales
               title.split(' ').some(word => word.startsWith(searchTerm)) ||
               league.split(' ').some(word => word.startsWith(searchTerm)) ||
               description.split(' ').some(word => word.startsWith(searchTerm));
      })
      .map(challenge => ({
        id: challenge.id,
        type: 'challenge' as const,
        title: challenge.title,
        subtitle: challenge.description,
        league: challenge.league || 'Reto Personalizado',
        sport: this.extractSportFromTitle(challenge.title),
        icon: this.getSportIcon(this.extractSportFromTitle(challenge.title)),
        participants: challenge.participants,
        stake: challenge.stake,
        timeLeft: challenge.timeRemaining,
        url: `/challenge/${challenge.id}`
      }))
      // Ordenar por relevancia
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        // Priorizar coincidencias exactas al inicio
        const aStartsWithQuery = aTitle.startsWith(searchTerm);
        const bStartsWithQuery = bTitle.startsWith(searchTerm);
        
        if (aStartsWithQuery && !bStartsWithQuery) return -1;
        if (!aStartsWithQuery && bStartsWithQuery) return 1;
        
        return 0;
      });
  }

  // Buscar en partidos en vivo y futuros
  static async searchMatches(query: string): Promise<SearchResult[]> {
    if (query.length < 1) return [];

    try {
      console.log(`⚽ Searching matches for: "${query}"`);
      
      // Usar la API unificada que incluye todos los eventos
      const allMatches = await UnifiedSportsAPI.getAllEvents();
      const searchTerm = query.toLowerCase();
      
      console.log(`🏟️ Total matches available:`, allMatches.length);
      
      // Log first few matches for debugging
      if (allMatches.length > 0) {
        console.log('📋 Sample matches:', allMatches.slice(0, 5).map(m => `${m.homeTeam} vs ${m.awayTeam}`));
      }

      // Filtrar con mayor precisión
      const filteredMatches = allMatches.filter(match => {
        const homeTeam = match.homeTeam.toLowerCase();
        const awayTeam = match.awayTeam.toLowerCase();
        const league = match.league.toLowerCase();
        const fullMatch = `${homeTeam} vs ${awayTeam}`;
        
        // Búsqueda más flexible
        const matches = homeTeam.includes(searchTerm) ||
               awayTeam.includes(searchTerm) ||
               league.includes(searchTerm) ||
               fullMatch.includes(searchTerm) ||
               homeTeam.startsWith(searchTerm) ||
               awayTeam.startsWith(searchTerm) ||
               // Búsqueda por palabras parciales
               homeTeam.split(' ').some(word => word.startsWith(searchTerm)) ||
               awayTeam.split(' ').some(word => word.startsWith(searchTerm)) ||
               league.split(' ').some(word => word.startsWith(searchTerm));
        
        if (matches) {
          console.log(`✅ Match found: ${match.homeTeam} vs ${match.awayTeam} (${match.league})`);
        }
        
        return matches;
      });
      
      console.log(`🎯 Filtered matches for "${query}":`, filteredMatches.length);
      
      return filteredMatches
        .map(match => ({
          id: match.id.toString(),
          type: 'match' as const,
          title: `${match.homeTeam} vs ${match.awayTeam}`,
          subtitle: this.getMatchSubtitle(match),
          league: match.league,
          sport: match.sport === 'football' ? 'Fútbol' : match.sport,
          icon: this.getSportIcon(match.sport === 'football' ? 'Fútbol' : match.sport),
          status: match.status,
          timeLeft: match.time,
          date: new Date(match.date).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          url: `/match/${match.id}`
        }))
        // Ordenar por relevancia
        .sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          
          // Priorizar coincidencias exactas al inicio
          const aStartsWithQuery = aTitle.startsWith(searchTerm);
          const bStartsWithQuery = bTitle.startsWith(searchTerm);
          
          if (aStartsWithQuery && !bStartsWithQuery) return -1;
          if (!aStartsWithQuery && bStartsWithQuery) return 1;
          
          // Priorizar coincidencias en el nombre del equipo
          const aTeamMatch = aTitle.split(' vs ').some(team => team.trim().startsWith(searchTerm));
          const bTeamMatch = bTitle.split(' vs ').some(team => team.trim().startsWith(searchTerm));
          
          if (aTeamMatch && !bTeamMatch) return -1;
          if (!aTeamMatch && bTeamMatch) return 1;
          
          return 0;
        });
    } catch (error) {
      console.error('Error searching matches:', error);
      return [];
    }
  }

  // Búsqueda combinada
  static async search(query: string, challenges: BettingChallenge[]): Promise<SearchResult[]> {
    if (query.length < 1) return [];

    console.log(`🔍 Searching for: "${query}"`);
    console.log(`📊 Available challenges:`, challenges.length);

    const [challengeResults, matchResults] = await Promise.all([
      Promise.resolve(this.searchChallenges(query, challenges)),
      this.searchMatches(query)
    ]);

    console.log(`🎯 Challenge results:`, challengeResults.length);
    console.log(`⚽ Match results:`, matchResults.length);

    // Combinar y ordenar resultados por relevancia
    const allResults = [...challengeResults, ...matchResults];
    
    console.log(`✅ Total results:`, allResults.length);
    
    return this.sortByRelevance(allResults, query);
  }

  // Ordenar por relevancia
  private static sortByRelevance(results: SearchResult[], query: string): SearchResult[] {
    const searchTerm = query.toLowerCase();
    
    return results.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, searchTerm);
      const bScore = this.calculateRelevanceScore(b, searchTerm);
      return bScore - aScore;
    });
  }

  // Calcular puntuación de relevancia
  private static calculateRelevanceScore(result: SearchResult, searchTerm: string): number {
    let score = 0;
    const title = result.title.toLowerCase();
    const subtitle = result.subtitle.toLowerCase();
    const league = result.league.toLowerCase();

    // Coincidencia exacta en título tiene más peso
    if (title === searchTerm) score += 100;
    else if (title.includes(searchTerm)) score += 50;

    // Coincidencia en liga
    if (league.includes(searchTerm)) score += 30;

    // Coincidencia en subtítulo
    if (subtitle.includes(searchTerm)) score += 20;

    // Los retos tienen prioridad sobre partidos cuando hay empate
    if (result.type === 'challenge') score += 5;

    return score;
  }

  // Extraer deporte del título
  private static extractSportFromTitle(title: string): string {
    const sportKeywords = {
      'Fútbol': ['madrid', 'barcelona', 'premier', 'liga', 'champions', 'europa', 'real', 'atletico', 'valencia', 'sevilla', 'manchester', 'chelsea', 'arsenal', 'liverpool', 'tottenham', 'bayern', 'juventus', 'psg', 'milan'],
      'Baloncesto': ['lakers', 'warriors', 'celtics', 'heat', 'bulls', 'knicks', 'nets', 'sixers', 'nba', 'euroleague'],
      'Fútbol Americano': ['patriots', 'cowboys', 'steelers', 'packers', 'chiefs', 'ravens', 'nfl'],
      'Tenis': ['nadal', 'federer', 'djokovic', 'wimbledon', 'roland garros', 'us open', 'australian open'],
      'Béisbol': ['yankees', 'dodgers', 'red sox', 'cubs', 'mlb'],
    };

    const titleLower = title.toLowerCase();
    
    for (const [sport, keywords] of Object.entries(sportKeywords)) {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        return sport;
      }
    }
    
    return 'Deportes';
  }

  // Obtener icono del deporte
  private static getSportIcon(sport: string): string {
    const icons: { [key: string]: string } = {
      'Fútbol': '⚽',
      'Baloncesto': '🏀',
      'Fútbol Americano': '🏈',
      'Tenis': '🎾',
      'Béisbol': '⚾',
      'Hockey': '🏒',
      'Rugby': '🏉',
      'Voleibol': '🏐',
      'Golf': '⛳',
      'formula1': '🏎️',
      'football': '⚽'
    };
    
    return icons[sport] || '🏆';
  }

  // Obtener subtítulo del partido
  private static getMatchSubtitle(match: LiveScore): string {
    if (match.status === 'Not Started') {
      return `Próximo partido - ${match.time}`;
    }
    
    if (match.homeScore !== null && match.awayScore !== null) {
      return `${match.homeScore} - ${match.awayScore} (${match.status})`;
    }
    
    return match.status;
  }

  // Obtener sugerencias populares
  static getPopularSuggestions(): string[] {
    return [
      'Real Madrid',
      'Barcelona',
      'Manchester United',
      'Manchester City',
      'Liverpool',
      'Chelsea',
      'Arsenal',
      'Lakers',
      'Warriors',
      'Celtics',
      'Heat',
      'Bulls',
      'Champions League',
      'Premier League',
      'La Liga',
      'Serie A',
      'Bundesliga',
      'NBA',
      'NFL',
      'Ligue 1'
    ];
  }

  // Obtener sugerencias inteligentes basadas en query
  static getSmartSuggestions(query: string, allResults: SearchResult[]): string[] {
    if (query.length < 1) return this.getPopularSuggestions().slice(0, 6);

    const searchTerm = query.toLowerCase();
    const suggestions = new Set<string>();

    // Obtener equipos/términos que empiecen con la consulta
    const startingMatches = this.getPopularSuggestions()
      .filter(suggestion => suggestion.toLowerCase().startsWith(searchTerm))
      .slice(0, 4);

    startingMatches.forEach(match => suggestions.add(match));

    // Obtener equipos de los resultados actuales
    allResults.slice(0, 6).forEach(result => {
      if (result.type === 'match') {
        const teams = result.title.split(' vs ');
        teams.forEach(team => {
          if (team.toLowerCase().includes(searchTerm)) {
            suggestions.add(team.trim());
          }
        });
      }
      
      // Agregar ligas como sugerencias
      if (result.league && result.league.toLowerCase().includes(searchTerm)) {
        suggestions.add(result.league);
      }
    });

    // Sugerencias por letra específica
    const letterSuggestions = this.getLetterBasedSuggestions(searchTerm);
    letterSuggestions.forEach(suggestion => suggestions.add(suggestion));

    return Array.from(suggestions).slice(0, 6);
  }

  // Sugerencias basadas en la primera letra
  private static getLetterBasedSuggestions(query: string): string[] {
    const firstLetter = query.charAt(0).toLowerCase();
    
    const letterMap: { [key: string]: string[] } = {
      'b': ['Barcelona', 'Bayern Munich', 'Borussia Dortmund', 'Boston Celtics', 'Bulls', 'Bundesliga'],
      'r': ['Real Madrid', 'Real Betis', 'Rangers', 'Roma', 'Ravens'],
      'm': ['Manchester United', 'Manchester City', 'Milan', 'Miami Heat', 'MLB'],
      'l': ['Liverpool', 'Lakers', 'La Liga', 'Ligue 1', 'Leicester'],
      'a': ['Arsenal', 'Atletico Madrid', 'AC Milan', 'Atlanta Hawks'],
      'c': ['Chelsea', 'Celtic', 'Celtics', 'Chiefs', 'Champions League'],
      'p': ['PSG', 'Premier League', 'Patriots', 'Packers'],
      'j': ['Juventus', 'Jaguars', 'Jazz'],
      'i': ['Inter Milan', 'Indianapolis Colts'],
      'n': ['NBA', 'NFL', 'Napoli', 'Newcastle'],
      't': ['Tottenham', 'Toronto Raptors', 'Tenis'],
      's': ['Sevilla', 'Spurs', 'Serie A', 'Saints'],
      'v': ['Valencia', 'Villarreal', 'Vikings'],
      'w': ['Warriors', 'West Ham', 'Wolverhampton'],
      'd': ['Dortmund', 'Dallas Cowboys', 'Denver Broncos'],
      'f': ['Fútbol', 'Formula 1'],
      'g': ['Golden State Warriors', 'Green Bay Packers'],
      'h': ['Heat', 'Hawks', 'Hockey'],
      'e': ['Europa League', 'Everton'],
      'o': ['Orlando Magic'],
      'u': ['UEFA', 'Utah Jazz'],
      'y': ['Yankees'],
      'z': ['Zenit']
    };

    return letterMap[firstLetter] || [];
  }
}