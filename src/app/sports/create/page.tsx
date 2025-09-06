'use client'

import { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BetType, ResolutionMode } from '@/types/betting';
import HomeButton from '@/components/HomeButton';
import Footer from '@/components/Footer';
// Datos de eventos de fútbol inline para evitar problemas de importación JSON

interface MatchData {
  id: string;
  title: string;
  teams: {
    home: string;
    away: string;
  };
  date: string;
  time: string;
  league: string;
  sport: string;
}

interface BetConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  betType: string;
  resolutionMode: string;
  timestamp: number;
}

interface BetOption {
  id: string;
  label: string;
  description: string;
  type: 'prediction' | 'number' | 'boolean';
  options?: string[];
}

interface SelectedPrediction {
  id: string;
  betOptionId: string;
  betOptionLabel: string;
  prediction: string;
  type: string;
}

interface StoredMatch {
  matchData: MatchData;
  predictions: SelectedPrediction[];
  selectedTeam: 'home' | 'away' | null;
}


const footballBetOptions: BetOption[] = [
  {
    id: 'double_chance',
    label: 'Doble Oportunidad',
    description: 'Reto por dos resultados posibles',
    type: 'prediction',
    options: ['Local o Empate', 'Visitante o Empate', 'Local o Visitante']
  },
  {
    id: 'total_goals_over_under',
    label: 'Total de Goles',
    description: 'Predice si habrá más o menos goles de una cantidad específica',
    type: 'prediction',
    options: ['Más de 0.5', 'Menos de 0.5', 'Más de 1.5', 'Menos de 1.5', 'Más de 2.5', 'Menos de 2.5', 'Más de 3.5', 'Menos de 3.5', 'Más de 4.5', 'Menos de 4.5']
  },
  {
    id: 'exact_goals',
    label: 'Número Exacto de Goles',
    description: '¿Cuántos goles exactos habrá?',
    type: 'prediction',
    options: ['0 Goles', '1 Gol', '2 Goles', '3 Goles', '4 Goles', '5+ Goles']
  },
  {
    id: 'both_teams_score',
    label: 'Ambos Equipos Anotan',
    description: '¿Marcarán gol ambos equipos?',
    type: 'prediction',
    options: ['Sí', 'No']
  },
  {
    id: 'correct_score',
    label: 'Marcador Correcto',
    description: 'Selecciona el resultado exacto del partido',
    type: 'prediction',
    options: ['0-0', '1-0', '0-1', '1-1', '2-0', '0-2', '2-1', '1-2', '2-2', '3-0', '0-3', '3-1', '1-3', '3-2', '2-3', 'Otro']
  },
  {
    id: 'first_goal_team',
    label: 'Primer Gol',
    description: '¿Qué equipo marcará el primer gol?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Goles']
  },
  {
    id: 'last_goal_team',
    label: 'Último Gol',
    description: '¿Qué equipo marcará el último gol?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Goles']
  },
  {
    id: 'half_time_result',
    label: 'Resultado al Descanso',
    description: '¿Cómo terminará el primer tiempo?',
    type: 'prediction',
    options: ['Local Gana', 'Empate', 'Visitante Gana']
  },
  {
    id: 'first_half_goals',
    label: 'Goles en el Primer Tiempo',
    description: 'Cantidad de goles que habrá en el primer tiempo',
    type: 'prediction',
    options: ['Más de 0.5', 'Menos de 0.5', 'Más de 1.5', 'Menos de 1.5', 'Más de 2.5', 'Menos de 2.5', 'Exactamente 0', 'Exactamente 1', 'Exactamente 2', 'Exactamente 3+']
  },
  {
    id: 'half_time_full_time',
    label: 'Descanso/Final',
    description: 'Resultado al descanso y al final',
    type: 'prediction',
    options: ['Local/Local', 'Local/Empate', 'Local/Visitante', 'Empate/Local', 'Empate/Empate', 'Empate/Visitante', 'Visitante/Local', 'Visitante/Empate', 'Visitante/Visitante']
  },
  {
    id: 'second_half_result',
    label: 'Resultado del Segundo Tiempo',
    description: '¿Cómo terminará el segundo tiempo?',
    type: 'prediction',
    options: ['Local Gana', 'Empate', 'Visitante Gana']
  },
  {
    id: 'second_half_goals',
    label: 'Goles en el Segundo Tiempo',
    description: 'Total de goles que se marcarán en el segundo tiempo',
    type: 'prediction',
    options: ['Más de 0.5', 'Menos de 0.5', 'Más de 1.5', 'Menos de 1.5', 'Más de 2.5', 'Menos de 2.5', 'Más de 3.5', 'Menos de 3.5']
  },
  {
    id: 'second_half_exact_goals',
    label: 'Goles Exactos Segundo Tiempo',
    description: '¿Cuántos goles exactos habrá en el segundo tiempo?',
    type: 'prediction',
    options: ['0 Goles', '1 Gol', '2 Goles', '3 Goles', '4 Goles', '5+ Goles']
  },
  {
    id: 'second_half_both_teams_score',
    label: 'Ambos Anotan Segundo Tiempo',
    description: '¿Marcarán gol ambos equipos en el segundo tiempo?',
    type: 'prediction',
    options: ['Sí', 'No']
  },
  {
    id: 'second_half_first_goal',
    label: 'Primer Gol Segundo Tiempo',
    description: '¿Qué equipo marcará el primer gol del segundo tiempo?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Goles en 2do Tiempo']
  },
  {
    id: 'second_half_last_goal',
    label: 'Último Gol Segundo Tiempo',
    description: '¿Qué equipo marcará el último gol del segundo tiempo?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Goles en 2do Tiempo']
  },
  {
    id: 'second_half_corners',
    label: 'Córners Segundo Tiempo',
    description: '¿Cuántos córners habrá en el segundo tiempo?',
    type: 'prediction',
    options: ['Más de 2.5', 'Menos de 2.5', 'Más de 4.5', 'Menos de 4.5', 'Más de 6.5', 'Menos de 6.5']
  },
  {
    id: 'second_half_cards',
    label: 'Tarjetas Segundo Tiempo',
    description: '¿Cuántas tarjetas habrá en el segundo tiempo?',
    type: 'prediction',
    options: ['Más de 1.5', 'Menos de 1.5', 'Más de 2.5', 'Menos de 2.5', 'Más de 3.5', 'Menos de 3.5']
  },
  {
    id: 'total_corners',
    label: 'Total de Córners',
    description: '¿Cuántos córners habrá en total?',
    type: 'prediction',
    options: ['Más de 3.5', 'Menos de 3.5', 'Más de 5.5', 'Menos de 5.5', 'Más de 6.5', 'Menos de 6.5', 'Más de 9.5', 'Menos de 9.5', 'Más de 10.5', 'Menos de 10.5']
  },
  {
    id: 'corner_range',
    label: 'Rango de Córners',
    description: 'Número de córners en un rango',
    type: 'prediction',
    options: ['0-5 Córners', '6-10 Córners', '11-15 Córners', '16+ Córners']
  },
  {
    id: 'first_corner',
    label: 'Primer Córner',
    description: '¿Qué equipo sacará el primer córner?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Córners']
  },
  {
    id: 'corner_race',
    label: 'Carrera de Córners',
    description: '¿Qué equipo llegará primero a X córners?',
    type: 'prediction',
    options: ['Local 3 Córners', 'Visitante 3 Córners', 'Local 5 Córners', 'Visitante 5 Córners', 'Local 7 Córners', 'Visitante 7 Córners']
  },
  {
    id: 'total_cards',
    label: 'Total de Tarjetas',
    description: '¿Cuántas tarjetas habrá?',
    type: 'prediction',
    options: ['Más de 1.5', 'Menos de 1.5', 'Más de 2.5', 'Menos de 2.5', 'Más de 3.5', 'Menos de 3.5', 'Más de 4.5', 'Menos de 4.5']
  },
  {
    id: 'red_cards',
    label: 'Tarjetas Rojas',
    description: '¿Habrá tarjetas rojas?',
    type: 'prediction',
    options: ['Sí', 'No', 'Más de 1.5 Rojas', 'Menos de 1.5 Rojas']
  },
  {
    id: 'first_card',
    label: 'Primera Tarjeta',
    description: '¿Qué equipo recibirá la primera tarjeta?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante', 'Sin Tarjetas']
  },
  {
    id: 'penalty_awarded',
    label: 'Penalti en el Partido',
    description: '¿Se pitará algún penalti?',
    type: 'prediction',
    options: ['Sí', 'No']
  },
  {
    id: 'own_goal',
    label: 'Gol en Propia Meta',
    description: '¿Habrá algún autogol?',
    type: 'prediction',
    options: ['Sí', 'No']
  },
  {
    id: 'goals_odd_even',
    label: 'Goles Par/Impar',
    description: '¿El total de goles será par o impar?',
    type: 'prediction',
    options: ['Par', 'Impar']
  }
];

const basketballBetOptions: BetOption[] = [
  {
    id: 'match_result',
    label: 'Ganador del Partido',
    description: '¿Quién ganará el partido?',
    type: 'prediction',
    options: ['Equipo Local', 'Equipo Visitante']
  },
  {
    id: 'total_points',
    label: 'Puntos Totales',
    description: 'Selecciona el rango de puntos totales del partido',
    type: 'prediction',
    options: ['Más de 180.5', 'Menos de 180.5', 'Más de 190.5', 'Menos de 190.5', 'Más de 200.5', 'Menos de 200.5', 'Más de 210.5', 'Menos de 210.5', 'Más de 220.5', 'Menos de 220.5']
  },
  {
    id: 'point_difference',
    label: 'Diferencia de Puntos',
    description: '¿Por cuántos puntos ganará?',
    type: 'number'
  }
];



function CreateBetFromSportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Inicializar matchData inmediatamente desde los parámetros
  const [matchData, setMatchData] = useState<MatchData | null>(() => {
    const matchId = searchParams.get('matchId');
    const matchTitle = searchParams.get('matchTitle');
    const teams = searchParams.get('teams');
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const league = searchParams.get('league');
    const sport = searchParams.get('sport');

    if (matchId && matchTitle && teams && date && time && league && sport) {
      const [home, away] = teams.split(' vs ');
      return {
        id: matchId,
        title: matchTitle,
        teams: { home, away },
        date,
        time,
        league,
        sport
      };
    }
    return null;
  });
  const [betConfig, setBetConfig] = useState<BetConfig | null>(null);
  const [selectedBetOptions, setSelectedBetOptions] = useState<string[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<string>('');
  const [numberValue, setNumberValue] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('50');
  const [maxParticipants, setMaxParticipants] = useState<string>('100');
  const [endDateTime, setEndDateTime] = useState<string>('');
  const [selectedPredictions, setSelectedPredictions] = useState<SelectedPrediction[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away' | null>(null);
  const [gameCount, setGameCount] = useState<number>(() => {
    const gameCountParam = searchParams.get('gameCount');
    return gameCountParam ? parseInt(gameCountParam) : 1;
  });
  const [storedMatches, setStoredMatches] = useState<StoredMatch[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');

  useEffect(() => {
    // Cargar partidos anteriores desde localStorage si es un partido múltiple
    if (gameCount > 1) {
      const storedMatchesData = localStorage.getItem('storedMatches');
      if (storedMatchesData) {
        try {
          const parsedMatches = JSON.parse(storedMatchesData);
          setStoredMatches(parsedMatches);
        } catch (error) {
          console.error('Error parsing stored matches:', error);
        }
      }
    }

    // Cargar progreso específico del partido actual
    const savedBetProgress = localStorage.getItem('currentBetProgress');
    if (savedBetProgress && matchData) {
      try {
        const progress = JSON.parse(savedBetProgress);
        // Verificar que no sea muy antiguo (1 hora)
        if (Date.now() - progress.timestamp < 60 * 60 * 1000) {
          console.log('Comparando partidos - Actual:', matchData.id, 'Guardado:', progress.matchData?.id);
          
          // Solo cargar si es el mismo partido
          if (progress.matchData?.id === matchData.id) {
            setSelectedPredictions(progress.predictions || []);
            setSelectedTeam(progress.selectedTeam || null);
            console.log('Progreso cargado para partido:', matchData.title);
          }
        } else {
          // Eliminar progreso antiguo
          localStorage.removeItem('currentBetProgress');
        }
      } catch (error) {
        console.error('Error parsing bet progress:', error);
        localStorage.removeItem('currentBetProgress');
      }
    }
    
    // Buscar predicciones específicas de este partido en storedMatches
    if (matchData && storedMatches.length === 0) {
      const storedMatchesData = localStorage.getItem('storedMatches');
      if (storedMatchesData) {
        try {
          const parsedMatches = JSON.parse(storedMatchesData);
          // Buscar si este partido ya tiene predicciones guardadas
          const thisMatchData = parsedMatches.find(match => match.matchData?.id === matchData.id);
          if (thisMatchData && thisMatchData.predictions) {
            setSelectedPredictions(thisMatchData.predictions);
            setSelectedTeam(thisMatchData.selectedTeam || null);
            console.log('Predicciones cargadas desde storedMatches para:', matchData.title);
          }
        } catch (error) {
          console.error('Error parsing stored matches for predictions:', error);
        }
      }
    }

    // Verificar si faltan parámetros y redirigir
    if (!matchData) {
      console.log('No sufficient URL params, redirecting to sports page');
      router.push('/sports');
      return;
    }

    // Establecer fecha límite por defecto (1 hora antes del partido)
    if (matchData && !endDateTime) {
      const matchDateTime = new Date(`${matchData.date} ${matchData.time}`);
      matchDateTime.setHours(matchDateTime.getHours() - 1);
      setEndDateTime(matchDateTime.toISOString().slice(0, 16));
    }

    // Obtener configuración completa de reto guardado
    const savedCompleteBetConfig = localStorage.getItem('completeBetConfig');
    if (savedCompleteBetConfig) {
      try {
        const config: any = JSON.parse(savedCompleteBetConfig);
        // Verificar que no sea muy antigua (24 horas)
        if (Date.now() - config.timestamp < 24 * 60 * 60 * 1000) {
          setBetConfig({
            id: config.id,
            title: config.title,
            description: config.description,
            icon: config.icon,
            betType: config.betType,
            resolutionMode: config.resolutionMode,
            timestamp: config.timestamp
          });
          
          // Usar la configuración completa guardada
          setBetAmount(config.betAmount || '50');
          setMaxParticipants(config.maxParticipants || '100');
          if (config.endDateTime) {
            setEndDateTime(config.endDateTime);
          }
        } else {
          // Eliminar configuración antigua
          localStorage.removeItem('completeBetConfig');
        }
      } catch (error) {
        console.error('Error parsing complete bet config:', error);
        localStorage.removeItem('completeBetConfig');
      }
    } else {
      // Fallback: intentar obtener configuración básica
      const savedBetConfig = localStorage.getItem('selectedBetConfig');
      if (savedBetConfig) {
        try {
          const config: BetConfig = JSON.parse(savedBetConfig);
          // Verificar que no sea muy antigua (24 horas)
          if (Date.now() - config.timestamp < 24 * 60 * 60 * 1000) {
            setBetConfig(config);
            
            // Configurar valores por defecto basados en el tipo de reto
            if (config.id === 'battle-royal') {
              setMaxParticipants('100');
              setBetAmount('50');
            } else if (config.id === 'group-balanced') {
              setMaxParticipants('100');
              setBetAmount('25');
            } else if (config.id === 'desafio-1v1') {
              setMaxParticipants('2');
              setBetAmount('100');
            } else if (config.id === 'torneo-estructurado') {
              setMaxParticipants('100');
              setBetAmount('25');
            }
          } else {
            // Eliminar configuración antigua
            localStorage.removeItem('selectedBetConfig');
          }
        } catch (error) {
          console.error('Error parsing bet config:', error);
          localStorage.removeItem('selectedBetConfig');
        }
      }
    }
  }, [searchParams]);

  // Funciones para manejar múltiples predicciones (optimizadas con useCallback)
  const addPrediction = useCallback((betOption: BetOption, prediction: string) => {
    setSelectedPredictions(prev => {
      // Verificar si esta predicción específica ya está seleccionada
      const existingPrediction = prev.find(p => p.betOptionId === betOption.id && p.prediction === prediction);
      
      if (existingPrediction) {
        // Si ya está seleccionada, la removemos (toggle off)
        return prev.filter(p => p.id !== existingPrediction.id);
      } else {
        // Si no está seleccionada, removemos cualquier otra del mismo betOption y agregamos la nueva
        const filtered = prev.filter(p => p.betOptionId !== betOption.id);
        const newPrediction: SelectedPrediction = {
          id: `${betOption.id}-${Date.now()}`,
          betOptionId: betOption.id,
          betOptionLabel: betOption.label,
          prediction: prediction,
          type: betOption.type
        };
        return [...filtered, newPrediction];
      }
    });
  }, []);

  const removePrediction = useCallback((predictionId: string) => {
    setSelectedPredictions(prev => prev.filter(p => p.id !== predictionId));
  }, []);

  const clearAllPredictions = useCallback(() => {
    setSelectedPredictions([]);
  }, []);

  const handleAddAnotherGame = useCallback(() => {
    if (gameCount < 15 && matchData && selectedPredictions.length > 0) {
      // Guardar el partido actual y sus predicciones
      const currentMatch: StoredMatch = {
        matchData: matchData,
        predictions: selectedPredictions,
        selectedTeam: selectedTeam
      };
      
      const updatedStoredMatches = [...storedMatches, currentMatch];
      
      // Guardar en localStorage
      localStorage.setItem('storedMatches', JSON.stringify(updatedStoredMatches));
      
      setGameCount(prev => prev + 1);
      // Redirigir a la página de deportes con filtro de deporte específico
      router.push(`/sports?sport=${encodeURIComponent(matchData.sport)}&gameCount=${gameCount + 1}`);
    }
  }, [gameCount, matchData, selectedPredictions, selectedTeam, storedMatches, router]);

  const isPredictionSelected = useCallback((betOptionId: string, prediction: string) => {
    return selectedPredictions.some(p => p.betOptionId === betOptionId && p.prediction === prediction);
  }, [selectedPredictions]);

  const isOptionExpanded = useCallback((optionId: string) => {
    return selectedBetOptions.includes(optionId);
  }, [selectedBetOptions]);

  const getSportIcon = useCallback((sport: string) => {
    switch (sport?.toLowerCase()) {
      case 'fútbol':
        return '⚽';
      case 'baloncesto':
        return '🏀';
      case 'tenis':
        return '🎾';
      case 'béisbol':
        return '⚾';
      case 'hockey':
        return '🏒';
      case 'volleyball':
        return '🏐';
      case 'rugby':
        return '🏉';
      default:
        return '⚽';
    }
  }, []);

  const getBetOptionsForSport = useCallback((sport: string): BetOption[] => {
    const baseOptions = (() => {
      switch (sport.toLowerCase()) {
        case 'fútbol':
          return footballBetOptions;
        case 'baloncesto':
          return basketballBetOptions;
        default:
          return footballBetOptions; // Fallback
      }
    })();

    // Replace generic team names with actual team names
    if (!matchData?.teams) return baseOptions;

    const homeTeam = matchData.teams.home;
    const awayTeam = matchData.teams.away;

    return baseOptions.map(option => ({
      ...option,
      options: option.options.map(opt => 
        opt
          .replace(/Victoria Local/g, `Victoria ${homeTeam}`)
          .replace(/Victoria Visitante/g, `Victoria ${awayTeam}`)
          .replace(/Local o Empate/g, `${homeTeam} o Empate`)
          .replace(/Visitante o Empate/g, `${awayTeam} o Empate`)
          .replace(/Local o Visitante/g, `${homeTeam} o ${awayTeam}`)
          .replace(/Equipo Local/g, homeTeam)
          .replace(/Equipo Visitante/g, awayTeam)
          .replace(/Local Gana/g, `${homeTeam} Gana`)
          .replace(/Visitante Gana/g, `${awayTeam} Gana`)
          .replace(/Local\/Local/g, `${homeTeam}/${homeTeam}`)
          .replace(/Local\/Empate/g, `${homeTeam}/Empate`)
          .replace(/Local\/Visitante/g, `${homeTeam}/${awayTeam}`)
          .replace(/Empate\/Local/g, `Empate/${homeTeam}`)
          .replace(/Empate\/Visitante/g, `Empate/${awayTeam}`)
          .replace(/Visitante\/Local/g, `${awayTeam}/${homeTeam}`)
          .replace(/Visitante\/Empate/g, `${awayTeam}/Empate`)
          .replace(/Visitante\/Visitante/g, `${awayTeam}/${awayTeam}`)
          .replace(/Local (\d+) Córners/g, `${homeTeam} $1 Córners`)
          .replace(/Visitante (\d+) Córners/g, `${awayTeam} $1 Córners`)
      )
    }));
  }, [matchData?.teams]);

  const getCurrentBetOptions = useMemo((): BetOption[] => {
    if (!matchData || selectedBetOptions.length === 0) return [];
    const options = getBetOptionsForSport(matchData.sport);
    return options.filter(option => selectedBetOptions.includes(option.id));
  }, [matchData, selectedBetOptions, getBetOptionsForSport]);

  const betOptions = useMemo(() => 
    getBetOptionsForSport(matchData?.sport || 'Fútbol'), 
    [matchData?.sport, getBetOptionsForSport]
  );

  // Función para filtrar opciones de reto por categoría
  const getFilteredBetOptions = useMemo(() => {
    if (selectedFilter === 'Todos') return betOptions;
    
    return betOptions.filter(option => {
      const label = option.label.toLowerCase();
      const id = option.id.toLowerCase();
      
      switch (selectedFilter) {
        case 'Tiempo':
          return id.includes('half') || id.includes('second') || id.includes('first') || 
                 label.includes('tiempo') || label.includes('descanso');
        case 'Local/Visitante':
          return id.includes('team') || id.includes('first_goal_team') || 
                 id.includes('last_goal_team') || label.includes('equipo') || 
                 id.includes('match_result') || label.includes('local') || label.includes('visitante');
        case 'Tarjetas Amarillas':
        case 'Tarjetas':
          return id.includes('card') || label.includes('tarjeta');
        case 'Esquinas':
        case 'Córners':
          return id.includes('corner') || label.includes('córner');
        case 'Estadísticas':
          return id.includes('statistics') || id.includes('stats') || 
                 label.includes('estadística') || id.includes('both_teams_score');
        case 'Jugadores':
          return id.includes('player') || label.includes('jugador') || 
                 id.includes('first_goal') || id.includes('last_goal');
        case 'Handicaps':
          return id.includes('handicap') || id.includes('spread') || 
                 label.includes('handicap') || id.includes('point_difference');
        case 'Intervalos':
          return id.includes('range') || id.includes('interval') || 
                 label.includes('rango') || label.includes('intervalo');
        case 'Goles':
          return id.includes('goal') || id.includes('gol') || label.includes('gol') || 
                 id.includes('both_teams_score') || id.includes('exact_goals') || 
                 id.includes('total_goals') || id.includes('first_goal') || id.includes('last_goal');
        case 'Resultado':
          return id.includes('result') || id.includes('double_chance') || 
                 id.includes('correct_score') || id.includes('half_time') || 
                 label.includes('resultado') || label.includes('marcador');
        case 'Especiales':
          return id.includes('penalty') || id.includes('own_goal') || 
                 id.includes('odd_even') || label.includes('penalti') || 
                 label.includes('autogol') || label.includes('par/impar');
        case 'Equipos':
          return id.includes('team') || id.includes('first_goal_team') || 
                 id.includes('last_goal_team') || label.includes('equipo');
        case 'Más/Menos de':
          return id.includes('over') || id.includes('under') || id.includes('total') || 
                 label.includes('más') || label.includes('menos') || label.includes('total');
        case 'Primer Tiempo':
          return id.includes('first_half') || id.includes('half_time') || 
                 label.includes('primer tiempo') || label.includes('descanso');
        case 'Segundo Tiempo':
          return id.includes('second_half') || label.includes('segundo tiempo');
        default:
          return true;
      }
    });
  }, [betOptions, selectedFilter]);

  const handleCreateBet = () => {
    if (!matchData || selectedPredictions.length === 0) return;

    // Combinar todas las predicciones de todos los partidos
    const allPredictions = [...storedMatches.flatMap(match => match.predictions), ...selectedPredictions];
    const totalMatches = storedMatches.length + 1;

    const betData = {
      matchIds: [...storedMatches.map(match => match.matchData.id), matchData.id],
      title: `Apuesta Múltiple - ${totalMatches} partido${totalMatches > 1 ? 's' : ''} (${allPredictions.length} predicciones)`,
      sport: matchData.sport,
      matches: [...storedMatches, { matchData, predictions: selectedPredictions, selectedTeam }],
      totalPredictions: allPredictions,
      betAmount: betAmount,
      maxParticipants: parseInt(maxParticipants),
      endDateTime: endDateTime,
      multiplier: allPredictions.length > 1 ? (1.5 + allPredictions.length * 0.3).toFixed(1) : '1.0'
    };

    console.log('Crear reto:', betData);
    
    // Limpiar datos almacenados
    localStorage.removeItem('storedMatches');
    localStorage.removeItem('selectedBetConfig');
    localStorage.removeItem('completeBetConfig');
    
    // Aquí iría la lógica para crear el reto
    // Por ahora, redirigimos de vuelta a deportes
    router.push('/sports');
  };


  // Si no hay betConfig, intentar crear uno por defecto para navegación entre partidos
  if (!betConfig && matchData) {
    // Crear una configuración por defecto si estamos navegando entre partidos
    const defaultBetConfig = {
      id: 'battle-royal',
      title: 'Battle Royal',
      description: 'Compite contra todos los participantes',
      icon: '⚔️',
      betType: 'BATTLE_ROYAL',
      resolutionMode: 'CLOSEST',
      timestamp: Date.now()
    };
    setBetConfig(defaultBetConfig);
  }

  if (!betConfig) {
    return (
      <div className="min-h-screen bg-[#1a1d29] text-white">
        <div className="bg-[#1a1d29] border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-xl">Crear Reto Deportivo</h1>
              <p className="text-sm text-gray-400">Primero selecciona el tipo de reto</p>
            </div>
            <Link href="/sports">
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                ← Volver
              </button>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#2a2d47] rounded-xl p-8 border border-gray-600 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-semibold mb-4">Selecciona un Tipo de Reto</h2>
              <p className="text-gray-400 mb-6">
                Debes seleccionar un tipo de reto desde la página principal antes de configurar eventos deportivos.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="bg-gray-700/30 rounded-lg p-4 text-left">
                  <div className="text-lg font-medium text-white mb-2">💡 ¿Cómo funciona?</div>
                  <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Ve a la página principal y selecciona "Crear Reto"</li>
                    <li>Elige el tipo de reto: Battle Royal, Group Balanced, o Predicción Simple</li>
                    <li>Haz clic en "Completar [Tipo de Reto]"</li>
                    <li>Serás redirigido aquí para seleccionar eventos deportivos</li>
                  </ol>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Link href="/">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                    🎯 Ir a Crear Reto
                  </button>
                </Link>
                <Link href="/sports">
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg">
                    ← Volver a Deportes
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentBetOptions = getCurrentBetOptions;

  // Loading state while matchData is null
  if (!matchData) {
    return (
      <div className="min-h-screen bg-[#1a1d29] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚽</div>
          <div className="text-xl text-white mb-2">Cargando evento deportivo...</div>
          <div className="text-gray-400">Configurando el reto</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white w-full">
      {/* Header */}
      <div className="bg-[#1a1d29] border-b border-gray-700 px-2 lg:px-4 xl:px-6 py-4 sticky top-0 z-50 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <HomeButton />
            <div>
              <h1 className="font-semibold text-lg lg:text-xl">Crear Reto: {betConfig?.title}</h1>
              <p className="text-xs lg:text-sm text-gray-400">Configura tu reto para este partido</p>
            </div>
          </div>
          <Link href="/sports">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm">
              ← Volver
            </button>
          </Link>
        </div>
      </div>

      {matchData && betConfig && (
        <div className="w-full px-2 lg:px-4 xl:px-6">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 py-4 min-h-0 w-full">
        {/* Panel Izquierdo - Resumen de Configuración */}
        <div className="w-full lg:w-96 xl:w-80 lg:flex-shrink-0 order-1 lg:order-1">
          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">📋 Resumen de tu Apuesta</h3>
            
            {/* Tipo de reto */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Tipo de Reto</div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{betConfig?.icon || '⚽'}</span>
                <span className="text-white font-medium">{betConfig?.title || 'Configurando Apuesta...'}</span>
              </div>
            </div>

            {/* Deporte */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Deporte</div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getSportIcon(matchData?.sport || '')}</span>
                <span className="text-white font-medium">{matchData?.sport}</span>
              </div>
            </div>

            {/* Información de todos los partidos */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">
                {storedMatches.length > 0 ? `Partidos (${storedMatches.length + 1})` : 'Partido'}
              </div>
              
              {/* Área de partidos sin limitación de altura */}
              <div className="space-y-3">
                
                {/* Partidos anteriores con detalles completos */}
                {storedMatches.map((storedMatch, index) => (
                  <button 
                    key={index} 
                    onClick={async () => {
                      console.log('Navegando al partido:', storedMatch.matchData.title);
                      
                      // Guardar el progreso actual antes de navegar
                      const currentBetProgress = {
                        matchData,
                        predictions: selectedPredictions,
                        selectedTeam,
                        timestamp: Date.now(),
                        gameCount: gameCount
                      };
                      localStorage.setItem('currentBetProgress', JSON.stringify(currentBetProgress));
                      
                      // Actualizar los storedMatches sin el partido seleccionado
                      const updatedStoredMatches = storedMatches.filter((_, i) => i !== index);
                      
                      // Agregar el partido actual a los partidos guardados
                      const currentMatch = {
                        matchData: matchData,
                        predictions: selectedPredictions,
                        selectedTeam: selectedTeam
                      };
                      updatedStoredMatches.push(currentMatch);
                      
                      // Actualizar localStorage con los nuevos partidos guardados
                      localStorage.setItem('storedMatches', JSON.stringify(updatedStoredMatches));
                      
                      // Crear nueva URL para el partido seleccionado
                      const matchParams = new URLSearchParams({
                        matchId: storedMatch.matchData.id,
                        matchTitle: storedMatch.matchData.title,
                        teams: `${storedMatch.matchData.teams.home} vs ${storedMatch.matchData.teams.away}`,
                        date: storedMatch.matchData.date,
                        time: storedMatch.matchData.time,
                        league: storedMatch.matchData.league,
                        sport: storedMatch.matchData.sport,
                        gameCount: gameCount.toString()
                      });
                      
                      // Forzar navegación con window.location para asegurar recarga completa
                      window.location.href = `/sports/create?${matchParams.toString()}`;
                    }}
                    className="w-full p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg border border-gray-600 hover:border-yellow-500/50 transition-all duration-200 text-left cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-green-400">✅ Partido {index + 1}</div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                          Click para editar
                        </span>
                      </div>
                    </div>
                    <div className="text-white font-medium text-sm mb-1">{storedMatch.matchData.title}</div>
                    <div className="text-xs text-gray-400 mb-2">{storedMatch.matchData.date} - {storedMatch.matchData.time}</div>
                    
                    {/* Equipo favorito */}
                    {storedMatch.selectedTeam && (
                      <div className="flex items-center mb-2">
                        <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-xs text-green-400">
                          {storedMatch.selectedTeam === 'home' ? 
                            storedMatch.matchData.teams.home : 
                            storedMatch.matchData.teams.away}
                        </span>
                      </div>
                    )}
                    
                    {/* Predicciones detalladas */}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-400">Predicciones:</div>
                      {storedMatch.predictions.map((prediction, predIndex) => (
                        <div key={predIndex} className="ml-2 p-2 bg-gray-700/30 rounded text-xs">
                          <div className="text-green-300 font-medium">{prediction.betOptionLabel}</div>
                          <div className="text-white">{prediction.prediction}</div>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
                
                {/* Partido actual */}
                <button 
                  onClick={async () => {
                    console.log('Navegando al partido actual:', matchData?.title);
                    
                    // Crear URL para el partido actual
                    const matchParams = new URLSearchParams({
                      matchId: matchData.id,
                      matchTitle: matchData.title,
                      teams: `${matchData.teams.home} vs ${matchData.teams.away}`,
                      date: matchData.date,
                      time: matchData.time,
                      league: matchData.league,
                      sport: matchData.sport,
                      gameCount: gameCount.toString()
                    });
                    
                    // Forzar navegación con window.location para asegurar recarga completa
                    window.location.href = `/sports/create?${matchParams.toString()}`;
                  }}
                  className={`w-full ${storedMatches.length > 0 ? 'p-3 bg-blue-600/10 hover:bg-blue-600/20 rounded-lg border border-blue-600/30 hover:border-blue-500/60 transition-all duration-200 cursor-pointer group text-left' : ''}`}
                >
                  {storedMatches.length > 0 && (
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-blue-400">🔄 Partido Actual ({storedMatches.length + 1})</div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                          Click para recargar
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="text-white font-medium">{matchData?.title}</div>
                  <div className="text-sm text-gray-400">{matchData?.date} - {matchData?.time}</div>
                  
                  {/* Equipo seleccionado actual */}
                  {selectedTeam && (
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      <span className="text-blue-400 text-sm">
                        {selectedTeam === 'home' ? matchData?.teams.home : matchData?.teams.away}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Predicción seleccionada */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">
                Tu Predicción
                {storedMatches.length > 0 && (
                  <span className="ml-2 text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                    Total: {storedMatches.reduce((total, match) => total + match.predictions.length, 0) + selectedPredictions.length}
                  </span>
                )}
              </div>
              <div className="text-white">
                {selectedPredictions.length > 0 ? (
                  <div className="space-y-1">
                    {selectedPredictions.length > 1 && (
                      <div className="font-medium mb-2">Predicciones Múltiples</div>
                    )}
                    {selectedPredictions.map((prediction) => (
                      <div key={prediction.id} className="text-sm">
                        <span className="text-gray-300">{prediction.betOptionLabel}:</span>
                        <div className="text-white font-medium">{prediction.prediction}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">Selecciona una predicción</div>
                )}
              </div>
            </div>

            {/* Configuración de reto */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Monto Base:</span>
                <span className="text-white font-medium">${betAmount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Participantes:</span>
                <span className="text-white">Máximo {maxParticipants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Modo de Resolución:</span>
                <span className="text-white text-sm">
                  {betConfig?.resolutionMode === 'EXACT' ? 'Exacto' : 
                   betConfig?.resolutionMode === 'CLOSEST' ? 'Más Cercano' : 
                   betConfig?.resolutionMode === 'MULTI_WINNER' ? 'Múltiples Ganadores' : 
                   'Por definir'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Cierre:</span>
                <span className="text-white text-sm">
                  {endDateTime ? new Date(endDateTime).toLocaleDateString() : 'Sin definir'}
                </span>
              </div>
            </div>


            {/* Estado de validación */}
            <div className="pt-3 border-t border-gray-600">
              <div className="flex items-center">
                {selectedPredictions.length > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-green-400 text-sm">
                      {selectedPredictions.length} predicción{selectedPredictions.length > 1 ? 'es' : ''} lista{selectedPredictions.length > 1 ? 's' : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-yellow-400 text-sm">Selecciona al menos una predicción</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Eventos Deportivos */}
          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 mt-4">
            <h3 className="text-lg font-semibold text-white mb-4">🏆 Eventos Deportivos</h3>
            
            <div className="space-y-3">
              {/* Evento 1 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-400">⚽ En Vivo</span>
                  <span className="text-xs text-gray-400">85'</span>
                </div>
                <div className="text-sm text-white font-medium">Chelsea vs Arsenal</div>
                <div className="text-xs text-gray-400 mb-2">Premier League • 2-1</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Odds: 1.85x</span>
                  <span className="text-green-400">124 retos</span>
                </div>
              </div>

              {/* Evento 2 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-400">🏀 Próximo</span>
                  <span className="text-xs text-gray-400">45min</span>
                </div>
                <div className="text-sm text-white font-medium">Lakers vs Celtics</div>
                <div className="text-xs text-gray-400 mb-2">NBA • Staples Center</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Odds: 2.10x</span>
                  <span className="text-blue-400">89 retos</span>
                </div>
              </div>

              {/* Evento 3 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-400">🎾 Finalizado</span>
                  <span className="text-xs text-gray-400">Final</span>
                </div>
                <div className="text-sm text-white font-medium">Djokovic vs Nadal</div>
                <div className="text-xs text-gray-400 mb-2">French Open • 6-4, 6-2, 6-3</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Pagado: 1.75x</span>
                  <span className="text-yellow-400">267 retos</span>
                </div>
              </div>

              {/* Evento 4 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-400">🏈 Suspendido</span>
                  <span className="text-xs text-gray-400">Clima</span>
                </div>
                <div className="text-sm text-white font-medium">Chiefs vs Patriots</div>
                <div className="text-xs text-gray-400 mb-2">NFL • Arrowhead Stadium</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Reembolso</span>
                  <span className="text-red-400">156 retos</span>
                </div>
              </div>

              {/* Evento 5 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-400">🏐 Programado</span>
                  <span className="text-xs text-gray-400">2h 30m</span>
                </div>
                <div className="text-sm text-white font-medium">Brasil vs Argentina</div>
                <div className="text-xs text-gray-400 mb-2">Voleibol • Copa América</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Odds: 1.95x</span>
                  <span className="text-purple-400">43 retos</span>
                </div>
              </div>

              {/* Evento 6 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-400">🏒 En Pausa</span>
                  <span className="text-xs text-gray-400">2nd</span>
                </div>
                <div className="text-sm text-white font-medium">Rangers vs Bruins</div>
                <div className="text-xs text-gray-400 mb-2">NHL • Madison Square Garden</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Odds: 2.25x</span>
                  <span className="text-orange-400">78 retos</span>
                </div>
              </div>

              {/* Evento 7 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-cyan-400">⚾ Live</span>
                  <span className="text-xs text-gray-400">7th</span>
                </div>
                <div className="text-sm text-white font-medium">Yankees vs Red Sox</div>
                <div className="text-xs text-gray-400 mb-2">MLB • Yankee Stadium • 8-5</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Odds: 1.65x</span>
                  <span className="text-cyan-400">201 retos</span>
                </div>
              </div>

              {/* Evento 8 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-400">🏊 Upcoming</span>
                  <span className="text-xs text-gray-400">1h 15m</span>
                </div>
                <div className="text-sm text-white font-medium">100m Freestyle Final</div>
                <div className="text-xs text-gray-400 mb-2">Swimming • World Championships</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Odds: 3.40x</span>
                  <span className="text-indigo-400">34 retos</span>
                </div>
              </div>
            </div>

            {/* Botón ver más eventos */}
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
              Ver Más Eventos
            </button>
          </div>
        </div>

        {/* Panel Central - Configuración Principal */}
        <div className="flex-1 order-2 lg:order-2 min-w-0">
        {/* Configuración de reto seleccionada */}
        <div className="bg-[#2a2d47] rounded-xl p-4 lg:p-5 border border-gray-600 mb-4">
          <div className="flex items-center mb-4">
            <div className="text-4xl mr-4">{betConfig.icon}</div>
            <div>
              <h2 className="text-xl font-semibold text-white">{betConfig.title}</h2>
              <p className="text-gray-400">{betConfig.description}</p>
            </div>
            <div className="ml-auto bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
              Configuración Activa
            </div>
          </div>
        </div>

        {/* Barra de Filtros Horizontales */}
        <div className="bg-[#2a2d47] rounded-xl p-3 border border-gray-600 mb-4">
          <div className="relative">
            {/* Botón de navegación izquierda */}
            <button
              onClick={() => {
                const container = document.getElementById('filter-container');
                if (container) container.scrollLeft -= 200;
              }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 text-white p-1.5 lg:p-2 rounded-full shadow-lg transition-colors"
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Contenedor de filtros con scroll */}
            <div 
              id="filter-container"
              className="flex items-center space-x-1 overflow-x-auto scrollbar-hide px-6 lg:px-8 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                'Todos', 'Tiempo', 'Local/Visitante', 'Tarjetas Amarillas', 'Esquinas', 
                'Estadísticas', 'Jugadores', 'Handicaps', 'Intervalos', 'Goles', 
                'Resultado', 'Córners', 'Tarjetas', 'Especiales', 'Equipos', 
                'Más/Menos de', 'Primer Tiempo', 'Segundo Tiempo'
              ].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Botón de navegación derecha */}
            <button
              onClick={() => {
                const container = document.getElementById('filter-container');
                if (container) container.scrollLeft += 200;
              }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 text-white p-1.5 lg:p-2 rounded-full shadow-lg transition-colors"
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Información del partido */}
        <div className="bg-[#2a2d47] rounded-xl p-4 lg:p-5 border border-gray-600 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-2 lg:space-y-0">
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold text-white">{matchData.title}</h2>
              <p className="text-sm lg:text-base text-gray-400">{matchData.league} • {matchData.sport}</p>
            </div>
            <div className="lg:text-right">
              <div className="text-xs lg:text-sm text-gray-400">Fecha del partido</div>
              <div className="text-base lg:text-lg font-medium text-white">{matchData.date} - {matchData.time}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 lg:gap-4 text-center">
            <button
              onClick={() => setSelectedTeam(selectedTeam === 'home' ? null : 'home')}
              className={`rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                selectedTeam === 'home'
                  ? 'bg-green-600/20 border-2 border-green-500 ring-1 ring-green-500/20'
                  : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-600/50'
              }`}
            >
              <div className="text-lg font-semibold text-white">{matchData.teams.home}</div>
              <div className="text-sm text-gray-400">Local</div>
              {selectedTeam === 'home' && (
                <div className="mt-2 flex justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              )}
            </button>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400">VS</span>
            </div>
            <button
              onClick={() => setSelectedTeam(selectedTeam === 'away' ? null : 'away')}
              className={`rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                selectedTeam === 'away'
                  ? 'bg-green-600/20 border-2 border-green-500 ring-1 ring-green-500/20'
                  : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-600/50'
              }`}
            >
              <div className="text-lg font-semibold text-white">{matchData.teams.away}</div>
              <div className="text-sm text-gray-400">Visitante</div>
              {selectedTeam === 'away' && (
                <div className="mt-2 flex justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Configuración del reto */}
        <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-6">Configurar Apuesta</h3>
          
          {/* Selección de tipo de reto */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tipo de Predicción *
            </label>
            <div className="space-y-4">
              {getFilteredBetOptions.map((option) => (
                <div key={option.id}>
                  {/* Tarjeta del tipo de reto */}
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedBetOptions.includes(option.id)
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => {
                      if (selectedBetOptions.includes(option.id)) {
                        setSelectedBetOptions(selectedBetOptions.filter(id => id !== option.id));
                      } else {
                        setSelectedBetOptions([...selectedBetOptions, option.id]);
                      }
                      setSelectedPrediction('');
                      setNumberValue('');
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{option.label}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          isOptionExpanded(option.id) ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>

                  {/* Opciones de predicción para esta opción específica */}
                  {isOptionExpanded(option.id) && (
                    <div className="mt-3 ml-6">
                      {/* Opciones tipo prediction */}
                      {option.type === 'prediction' && option.options && (
                        <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4">
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-300">Tu Predicción:</span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {option.options.map((predictionOption) => (
                              <button
                                key={predictionOption}
                                onClick={() => addPrediction(option, predictionOption)}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                  isPredictionSelected(option.id, predictionOption)
                                    ? 'border-green-500 bg-green-500/10 text-green-400 ring-1 ring-green-500/20'
                                    : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
                                } min-h-[48px] flex items-center justify-center text-center`}
                              >
                                {predictionOption}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}



                      {/* Opciones tipo number */}
                      {option.type === 'number' && (
                        <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4">
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-300">Ingresa tu predicción:</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={numberValue}
                              onChange={(e) => setNumberValue(e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                              placeholder="Ingresa tu predicción numérica"
                              min="0"
                            />
                            <button
                              onClick={() => {
                                if (numberValue.trim()) {
                                  addPrediction(option, numberValue);
                                  setNumberValue('');
                                }
                              }}
                              disabled={!numberValue.trim()}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                            >
                              Agregar
                            </button>
                          </div>
                          {selectedPredictions.find(p => p.betOptionId === option.id) && (
                            <div className="mt-3 p-2 bg-green-600/10 border border-green-600/20 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                  <span className="text-green-400 text-sm">
                                    Predicción: {selectedPredictions.find(p => p.betOptionId === option.id)?.prediction}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    const pred = selectedPredictions.find(p => p.betOptionId === option.id);
                                    if (pred) removePrediction(pred.id);
                                  }}
                                  className="text-red-400 hover:text-red-300 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Opciones tipo boolean */}
                      {option.type === 'boolean' && option.options && (
                        <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-4">
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-300">Tu Predicción:</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {option.options.map((boolOption) => (
                              <button
                                key={boolOption}
                                onClick={() => addPrediction(option, boolOption)}
                                className={`p-3 rounded-lg border transition-colors ${
                                  isPredictionSelected(option.id, boolOption)
                                    ? 'border-green-500 bg-green-500/10 text-green-400'
                                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                                }`}
                              >
                                {boolOption}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de Predicciones Seleccionadas */}
          {selectedPredictions.length > 0 && (
            <div className="mb-6">
              <div className="bg-[#2a2d47] border border-gray-600 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span className="mr-2">📝</span>
                    Predicciones Seleccionadas ({selectedPredictions.length})
                  </h3>
                  <button
                    onClick={clearAllPredictions}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center"
                  >
                    🗑️ Limpiar todas
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedPredictions.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="bg-gray-800/50 border border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 mt-0.5"></div>
                            <h4 className="text-white font-medium text-base">{prediction.betOptionLabel}</h4>
                          </div>
                          <div className="ml-6">
                            <div className="bg-green-600/10 border border-green-600/30 rounded-lg px-3 py-2">
                              <span className="text-green-300 font-medium text-sm">
                                {prediction.prediction}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removePrediction(prediction.id)}
                          className="text-red-400 hover:text-red-300 ml-4 p-2 rounded-full hover:bg-red-400/10 transition-colors flex-shrink-0"
                          title="Eliminar predicción"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-blue-400 text-sm">
                      <strong>Reto combinado:</strong> Todas las predicciones deben cumplirse para ganar.
                      {selectedPredictions.length > 1 && (
                        <span className="block mt-1">
                          Multiplicador estimado: x{(1.5 + selectedPredictions.length * 0.3).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Resumen */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-medium text-white mb-3">Resumen de tu Reto</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Partido:</span>
                <span className="text-white">{matchData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Predicciones:</span>
                <span className="text-white">
                  {selectedPredictions.length > 0 
                    ? `${selectedPredictions.length} predicción${selectedPredictions.length > 1 ? 'es' : ''}`
                    : 'Sin seleccionar'
                  }
                </span>
              </div>
              {selectedPredictions.length > 1 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Multiplicador:</span>
                  <span className="text-green-400 font-medium">
                    x{(1.5 + selectedPredictions.length * 0.3).toFixed(1)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Reto:</span>
                <span className="text-white">${betAmount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Participantes:</span>
                <span className="text-white">Máximo {maxParticipants}</span>
              </div>
            </div>
          </div>

          {/* Contador de juegos */}
          {gameCount > 1 && (
            <div className="mb-4 text-center">
              <span className="inline-block bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm">
                Partido {gameCount} de 15
              </span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <Link href="/sports" className="flex-1">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Cancelar
              </button>
            </Link>
            
            <button
              onClick={handleAddAnotherGame}
              disabled={gameCount >= 15 || selectedPredictions.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Añadir Otro Partido {gameCount < 15 && `(${gameCount}/15)`}
            </button>
            
            <button
              onClick={handleCreateBet}
              disabled={selectedPredictions.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Crear Reto {selectedPredictions.length > 0 && `(${selectedPredictions.length})`}
            </button>
          </div>
        </div>
        </div>

        {/* Panel Derecho - Apuestas del Evento */}
        <div className="w-full lg:w-96 xl:w-80 lg:flex-shrink-0 order-3 lg:order-3">
          <div className="bg-[#2a2d47] rounded-xl p-4 lg:p-6 border border-gray-600"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none' 
            }}>
            <h3 className="text-base lg:text-lg font-semibold text-white mb-4">🎯 Retos en este Evento</h3>
            
            {/* Lista de retos existentes */}
            <div className="space-y-3"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none' 
              }}>
              {/* Apuesta ejemplo 1 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Battle Royal</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Activa</span>
                </div>
                <div className="text-xs text-gray-400">Total de Goles (Más/Menos)</div>
                <div className="text-sm text-white">Más de 2.5</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">12/20 participantes</span>
                  <span className="text-xs text-yellow-400">$50 USDC</span>
                </div>
              </div>

              {/* Apuesta ejemplo 2 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Group Balanced</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Llenándose</span>
                </div>
                <div className="text-xs text-gray-400">Total de Goles (Más/Menos)</div>
                <div className="text-sm text-white">Más de 2.5</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">8/15 participantes</span>
                  <span className="text-xs text-yellow-400">$25 USDC</span>
                </div>
              </div>

              {/* Apuesta ejemplo 3 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Desafío 1v1</span>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Cerrada</span>
                </div>
                <div className="text-xs text-gray-400">Ambos Equipos Anotan</div>
                <div className="text-sm text-white">Sí</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">2/2 participantes</span>
                  <span className="text-xs text-yellow-400">$100 USDC</span>
                </div>
              </div>

              {/* Apuesta ejemplo 4 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Group Balanced</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Activa</span>
                </div>
                <div className="text-xs text-gray-400">Total de Córners</div>
                <div className="text-sm text-white">Más de 6.5</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">5/15 participantes</span>
                  <span className="text-xs text-yellow-400">$25 USDC</span>
                </div>
              </div>
            </div>

            {/* Estadísticas del evento */}
            <div className="mt-6 pt-4 border-t border-gray-600">
              <div className="text-sm text-gray-400 mb-2">Estadísticas del Evento</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total retos:</span>
                  <span className="text-white">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Participantes:</span>
                  <span className="text-white">27</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volumen total:</span>
                  <span className="text-yellow-400">$1,250 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Más popular:</span>
                  <span className="text-white">Total de Goles</span>
                </div>
              </div>
            </div>

            {/* Botón ver todas */}
            <div className="pt-4">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                Ver Todos los Retos
              </button>
            </div>
          </div>
          
          {/* Apuestas Publicadas */}
          <div className="bg-[#2a2d47] rounded-xl p-6 border border-gray-600 mt-4">
            <h3 className="text-lg font-semibold text-white mb-4">📈 Retos Publicados</h3>
            
            <div className="space-y-3">
              {/* Apuesta 1 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-400">✅ Finalizada</span>
                  <span className="text-xs text-green-400">Pagada</span>
                </div>
                <div className="text-sm text-white font-medium">Barcelona vs PSG</div>
                <div className="text-xs text-gray-400 mb-2">Total de Goles: Más de 2.5</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Ganancia: +$45 USDC</span>
                  <span className="text-green-400">Odds: 1.85x</span>
                </div>
              </div>

              {/* Apuesta 2 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-400">🔄 Activa</span>
                  <span className="text-xs text-blue-400">En progreso</span>
                </div>
                <div className="text-sm text-white font-medium">Warriors vs Lakers</div>
                <div className="text-xs text-gray-400 mb-2">Battle Royal • Resultado Final</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Apostado: $30 USDC</span>
                  <span className="text-blue-400">12/20 jugadores</span>
                </div>
              </div>

              {/* Apuesta 3 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-400">❌ Perdida</span>
                  <span className="text-xs text-red-400">Finalizada</span>
                </div>
                <div className="text-sm text-white font-medium">Chiefs vs Bills</div>
                <div className="text-xs text-gray-400 mb-2">Primer Touchdown</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Perdida: -$25 USDC</span>
                  <span className="text-red-400">Odds: 2.40x</span>
                </div>
              </div>

              {/* Apuesta 4 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-400">⏳ Pendiente</span>
                  <span className="text-xs text-yellow-400">2h restantes</span>
                </div>
                <div className="text-sm text-white font-medium">Djokovic vs Alcaraz</div>
                <div className="text-xs text-gray-400 mb-2">Sets Totales: Exactamente 3</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Apostado: $50 USDC</span>
                  <span className="text-yellow-400">Odds: 3.20x</span>
                </div>
              </div>

              {/* Apuesta 5 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-400">🎯 Group Balanced</span>
                  <span className="text-xs text-purple-400">Activa</span>
                </div>
                <div className="text-sm text-white font-medium">Man United vs Arsenal</div>
                <div className="text-xs text-gray-400 mb-2">Ambos Equipos Anotan</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Apostado: $40 USDC</span>
                  <span className="text-purple-400">8/15 jugadores</span>
                </div>
              </div>

              {/* Apuesta 6 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-400">🚀 1vs1</span>
                  <span className="text-xs text-indigo-400">Esperando</span>
                </div>
                <div className="text-sm text-white font-medium">Cowboys vs Eagles</div>
                <div className="text-xs text-gray-400 mb-2">Total Puntos: Más de 45.5</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Apostado: $75 USDC</span>
                  <span className="text-indigo-400">1/2 jugadores</span>
                </div>
              </div>

              {/* Apuesta 7 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-400">✅ Ganada</span>
                  <span className="text-xs text-green-400">Cobrada</span>
                </div>
                <div className="text-sm text-white font-medium">Celtics vs Heat</div>
                <div className="text-xs text-gray-400 mb-2">Resultado: Victoria Local</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Ganancia: +$67 USDC</span>
                  <span className="text-green-400">Odds: 2.35x</span>
                </div>
              </div>

              {/* Apuesta 8 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-400">⌛ Programada</span>
                  <span className="text-xs text-orange-400">Mañana 19:00</span>
                </div>
                <div className="text-sm text-white font-medium">Real Madrid vs Juventus</div>
                <div className="text-xs text-gray-400 mb-2">Champions • Doble Oportunidad</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">A apostar: $35 USDC</span>
                  <span className="text-orange-400">Odds: 1.65x</span>
                </div>
              </div>

              {/* Apuesta 9 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-cyan-400">🏆 Torneo</span>
                  <span className="text-xs text-cyan-400">Final</span>
                </div>
                <div className="text-sm text-white font-medium">Copa Mundial 2024</div>
                <div className="text-xs text-gray-400 mb-2">Ganador del Torneo</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Apostado: $100 USDC</span>
                  <span className="text-cyan-400">Odds: 12.50x</span>
                </div>
              </div>

              {/* Apuesta 10 */}
              <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-pink-400">💎 Premium</span>
                  <span className="text-xs text-pink-400">VIP</span>
                </div>
                <div className="text-sm text-white font-medium">Formula 1 - Monaco GP</div>
                <div className="text-xs text-gray-400 mb-2">Ganador de la Carrera</div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Apostado: $200 USDC</span>
                  <span className="text-pink-400">Odds: 8.75x</span>
                </div>
              </div>
            </div>

            {/* Botón ver historial completo */}
            <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
              Ver Historial Completo
            </button>
          </div>
        </div>
        </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default function CreateBetFromSports() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1d29] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Cargando página de creación...</p>
        </div>
      </div>
    }>
      <CreateBetFromSportsContent />
    </Suspense>
  );
}