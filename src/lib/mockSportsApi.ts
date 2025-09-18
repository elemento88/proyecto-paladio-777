import { LiveScore } from '@/types/sports';

// API simplificada que solo usa datos mock - Sin APIs externas
export class MockSportsAPI {
  // Generar datos mock completos para deportes
  static generateMockEvents(): LiveScore[] {
    const today = new Date();
    const events: LiveScore[] = [];
    let eventId = 10001;

    // Helper para generar fechas futuras
    const getRandomFutureDate = (minHours: number, maxHours: number) => {
      const hoursFromNow = Math.floor(Math.random() * (maxHours - minHours)) + minHours;
      const date = new Date(today.getTime() + hoursFromNow * 60 * 60 * 1000);
      return date.toISOString();
    };

    // Helper para generar horarios realistas
    const getRealisticTime = (sport: string) => {
      const times = {
        'Fútbol': ['15:00', '17:30', '20:00', '21:30', '12:00', '19:45'],
        'Baloncesto': ['19:00', '19:30', '20:00', '21:00', '21:30', '22:00'],
        'Fútbol Americano': ['13:00', '16:25', '20:20', '17:00', '20:30'],
        'Béisbol': ['12:05', '13:10', '19:05', '19:10', '20:05', '15:35'],
        'MMA': ['22:00', '23:00', '21:00', '20:00']
      };
      const sportTimes = times[sport as keyof typeof times] || ['19:00', '20:00'];
      return sportTimes[Math.floor(Math.random() * sportTimes.length)];
    };

    // FÚTBOL
    const footballTeams = {
      'La Liga': ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Valencia', 'Villarreal', 'Real Sociedad', 'Athletic Bilbao'],
      'Premier League': ['Manchester City', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Manchester United', 'Newcastle', 'Brighton'],
      'Serie A': ['AC Milan', 'Inter Milan', 'Juventus', 'Napoli', 'Roma', 'Lazio', 'Atalanta', 'Fiorentina'],
      'Champions League': ['Real Madrid', 'Manchester City', 'Bayern Munich', 'PSG', 'Barcelona', 'Inter Milan', 'Napoli', 'Arsenal']
    };

    Object.entries(footballTeams).forEach(([league, teams]) => {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          events.push({
            id: eventId++,
            sport: 'Fútbol',
            league,
            homeTeam: teams[i],
            awayTeam: teams[j],
            homeScore: null,
            awayScore: null,
            status: 'Not Started',
            time: getRealisticTime('Fútbol'),
            date: getRandomFutureDate(1, 168)
          });
        }
      }
    });

    // BALONCESTO
    const basketballTeams = {
      'NBA': ['Lakers', 'Warriors', 'Celtics', 'Heat', 'Bulls', 'Nets', 'Knicks', 'Sixers'],
      'Euroliga': ['Real Madrid', 'Barcelona', 'Fenerbahce', 'CSKA Moscow', 'Panathinaikos', 'Olympiacos'],
    };

    Object.entries(basketballTeams).forEach(([league, teams]) => {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          events.push({
            id: eventId++,
            sport: 'Baloncesto',
            league,
            homeTeam: teams[i],
            awayTeam: teams[j],
            homeScore: null,
            awayScore: null,
            status: 'Not Started',
            time: getRealisticTime('Baloncesto'),
            date: getRandomFutureDate(1, 168)
          });
        }
      }
    });

    // FÚTBOL AMERICANO
    const footballAmericanTeams = {
      'NFL': ['Chiefs', 'Ravens', 'Bills', 'Bengals', 'Cowboys', 'Giants', 'Eagles', 'Patriots'],
      'College Football': ['Alabama', 'Georgia', 'Ohio State', 'Michigan', 'Texas', 'Oklahoma']
    };

    Object.entries(footballAmericanTeams).forEach(([league, teams]) => {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          events.push({
            id: eventId++,
            sport: 'Fútbol Americano',
            league,
            homeTeam: teams[i],
            awayTeam: teams[j],
            homeScore: null,
            awayScore: null,
            status: 'Not Started',
            time: getRealisticTime('Fútbol Americano'),
            date: getRandomFutureDate(1, 168)
          });
        }
      }
    });

    // BÉISBOL
    const baseballTeams = {
      'MLB': ['Yankees', 'Red Sox', 'Dodgers', 'Giants', 'Astros', 'Braves', 'Mets', 'Phillies'],
      'NPB': ['Tokyo Giants', 'Hanshin Tigers', 'Hiroshima Carp', 'Yokohama DeNA']
    };

    Object.entries(baseballTeams).forEach(([league, teams]) => {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          events.push({
            id: eventId++,
            sport: 'Béisbol',
            league,
            homeTeam: teams[i],
            awayTeam: teams[j],
            homeScore: null,
            awayScore: null,
            status: 'Not Started',
            time: getRealisticTime('Béisbol'),
            date: getRandomFutureDate(1, 168)
          });
        }
      }
    });

    // MMA
    const mmaFights = [
      'Jon Jones vs Stipe Miocic', 'Islam Makhachev vs Charles Oliveira', 'Ilia Topuria vs Max Holloway',
      'Alex Pereira vs Khalil Rountree', 'Dricus du Plessis vs Sean Strickland', 'Conor McGregor vs Michael Chandler'
    ];

    mmaFights.forEach((fight, index) => {
      const [fighter1, fighter2] = fight.split(' vs ');
      events.push({
        id: eventId++,
        sport: 'MMA',
        league: 'UFC',
        homeTeam: fighter1,
        awayTeam: fighter2,
        homeScore: null,
        awayScore: null,
        status: 'Not Started',
        time: getRealisticTime('MMA'),
        date: getRandomFutureDate(1, 168)
      });
    });

    return events.sort(() => Math.random() - 0.5); // Mezclar eventos
  }

  // Obtener todos los eventos (solo mock)
  static async getAllEvents(): Promise<LiveScore[]> {
    console.log('🎭 MockSportsAPI: Generating mock sports data...');
    const events = this.generateMockEvents();
    console.log(`✅ Generated ${events.length} mock events`);
    return events;
  }

  // Buscar eventos
  static async searchEvents(query: string): Promise<LiveScore[]> {
    const allEvents = await this.getAllEvents();
    const searchTerm = query.toLowerCase();

    return allEvents.filter(event => {
      const homeTeam = event.homeTeam.toLowerCase();
      const awayTeam = event.awayTeam.toLowerCase();
      const league = event.league.toLowerCase();

      return homeTeam.includes(searchTerm) ||
             awayTeam.includes(searchTerm) ||
             league.includes(searchTerm);
    });
  }
}