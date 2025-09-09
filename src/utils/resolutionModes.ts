import { ResolutionMode, ResolutionModeInfo } from '@/types/betting';

export const RESOLUTION_MODES: Record<ResolutionMode, ResolutionModeInfo> = {
  [ResolutionMode.EXACT]: {
    name: 'Exacta',
    icon: '🎯',
    description: 'SOLO UNA PERSONA puede ganar. Debe acertar exactamente el resultado final. Si nadie acierta exactamente, se devuelve el 100% de las criptomonedas a todos los participantes sin penalización',
    example: 'Si el resultado es "Barcelona 2-1 Real Madrid", SOLO gana UNA PERSONA: quien predijo exactamente "2-1". Si múltiples predicen 2-1, el PRIMERO que apostó gana todo. Si nadie predijo 2-1 exactamente, todos recuperan su dinero',
    difficulty: 'Difícil',
    winChance: 'Baja',
    prizeDistribution: 'Ganador único toma el 95% del pozo total. Sin ganadores: reembolso completo del 100%'
  },
  [ResolutionMode.CLOSEST]: {
    name: 'Más Cercano',
    icon: '🔥',
    description: 'SOLO UNA PERSONA gana: quien más se acerque al resultado real, aunque no sea exacto. Siempre hay un ganador garantizado',
    example: 'Si el resultado son 78 puntos y las predicciones son 75, 80, 85, gana SOLO UNA PERSONA: quien predijo 80 (diferencia de 2 puntos)',
    difficulty: 'Medio',
    winChance: 'Media',
    prizeDistribution: 'El participante más cercano gana el 95% del pozo. Solo un ganador'
  },
  [ResolutionMode.MULTI_WINNER]: {
    name: 'Multi-Ganador',
    icon: '🏆',
    description: 'MÚLTIPLES participantes pueden ganar según criterios flexibles. Mayor oportunidad de ganar, pero premios divididos',
    example: 'Top 3 predicciones más cercanas: 1° lugar gana 60%, 2° lugar gana 25%, 3° lugar gana 15%',
    difficulty: 'Fácil',
    winChance: 'Alta',
    prizeDistribution: 'Se divide entre múltiples ganadores (ej: 1° 60%, 2° 25%, 3° 15%)'
  },
  [ResolutionMode.GROUP_WINNER]: {
    name: 'Grupo Ganador',
    icon: '⚖️',
    description: 'El grupo con más predicciones acertadas gana. Las ganancias se distribuyen equitativamente entre TODOS los integrantes del grupo ganador',
    example: 'Grupo A: 8 aciertos de 20 participantes, Grupo B: 6 aciertos de 20 participantes. Los 20 integrantes del Grupo A ganan y se reparten el premio',
    difficulty: 'Medio',
    winChance: 'Media-Alta',
    prizeDistribution: 'El 95% del pozo se divide equitativamente entre todos los integrantes del grupo ganador'
  }
};

/**
 * Obtiene la información detallada de un modo de resolución
 */
export function getResolutionModeInfo(mode: ResolutionMode): ResolutionModeInfo {
  return RESOLUTION_MODES[mode];
}

/**
 * Calcula la distribución estimada de premios según el modo
 */
export function calculatePrizeDistribution(
  mode: ResolutionMode,
  totalPrize: number,
  estimatedWinners: number = 1
): { position: number; percentage: number; amount: number }[] {
  const netPrize = totalPrize * 0.95; // 95% después de fees

  switch (mode) {
    case ResolutionMode.EXACT:
      // En modo exacto, SOLO UNA PERSONA puede ganar
      // Si no hay ganadores (estimatedWinners = 0), se devuelve el 100% a cada participante
      if (estimatedWinners === 0) {
        return [{
          position: 0, // 0 indica reembolso
          percentage: 100,
          amount: totalPrize // Reembolso completo sin fees
        }];
      }
      // SOLO UN GANADOR - el primero que apostó con la predicción correcta
      return [{
        position: 1,
        percentage: 95,
        amount: netPrize // TODO el premio para UNA SOLA PERSONA
      }];

    case ResolutionMode.CLOSEST:
      // En modo más cercano, SOLO UNA PERSONA gana - la más cercana
      return [{
        position: 1,
        percentage: 95,
        amount: netPrize // TODO el premio para UNA SOLA PERSONA
      }];

    case ResolutionMode.MULTI_WINNER:
      // En modo multi-ganador, distribución típica por posiciones
      const distributions = [
        { position: 1, percentage: 60 },
        { position: 2, percentage: 25 },
        { position: 3, percentage: 15 }
      ];

      return distributions.slice(0, Math.min(3, estimatedWinners)).map(dist => ({
        ...dist,
        amount: (netPrize * dist.percentage) / 100
      }));

    case ResolutionMode.GROUP_WINNER:
      // En modo grupo ganador, todos los integrantes del grupo ganador se dividen el premio equitativamente
      return [{
        position: 1,
        percentage: 95,
        amount: netPrize / Math.max(1, estimatedWinners)
      }];

    default:
      return [];
  }
}

/**
 * Verifica si un modo de resolución permite reembolsos
 */
export function allowsRefunds(mode: ResolutionMode): boolean {
  return mode === ResolutionMode.EXACT;
}

/**
 * Obtiene el texto de reembolso para un modo específico
 */
export function getRefundText(mode: ResolutionMode): string {
  switch (mode) {
    case ResolutionMode.EXACT:
      return 'Si nadie acierta exactamente, se devuelve el 100% de los retos sin fees. SOLO UNA PERSONA puede ganar';
    case ResolutionMode.CLOSEST:
      return 'Siempre hay UN SOLO ganador: quien esté más cerca del resultado';
    case ResolutionMode.MULTI_WINNER:
      return 'Múltiples criterios de victoria: mayor probabilidad de ganar para varios participantes';
    case ResolutionMode.GROUP_WINNER:
      return 'Competencia por grupos: todos los integrantes del grupo con más aciertos ganan';
    default:
      return '';
  }
}

/**
 * Indica si el modo permite solo un ganador
 */
export function isSingleWinnerMode(mode: ResolutionMode): boolean {
  return mode === ResolutionMode.EXACT || mode === ResolutionMode.CLOSEST;
}

/**
 * Indica si el modo permite múltiples ganadores
 */
export function isMultiWinnerMode(mode: ResolutionMode): boolean {
  return mode === ResolutionMode.MULTI_WINNER || mode === ResolutionMode.GROUP_WINNER;
}

/**
 * Obtiene el número máximo de ganadores para un modo
 */
export function getMaxWinners(mode: ResolutionMode): number {
  switch (mode) {
    case ResolutionMode.EXACT:
      return 1; // SOLO UNA PERSONA
    case ResolutionMode.CLOSEST:
      return 1; // SOLO UNA PERSONA
    case ResolutionMode.MULTI_WINNER:
      return 5; // Configurable, hasta 5
    case ResolutionMode.GROUP_WINNER:
      return Infinity; // Todos los integrantes del grupo ganador
    default:
      return 1;
  }
}

/**
 * Obtiene el color del tema para un modo de resolución
 */
export function getResolutionModeTheme(mode: ResolutionMode) {
  switch (mode) {
    case ResolutionMode.EXACT:
      return {
        color: 'green',
        bg: 'bg-green-500/10',
        border: 'border-green-500',
        text: 'text-green-400',
        badge: 'bg-green-600/20'
      };
    case ResolutionMode.CLOSEST:
      return {
        color: 'blue',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500',
        text: 'text-blue-400',
        badge: 'bg-blue-600/20'
      };
    case ResolutionMode.MULTI_WINNER:
      return {
        color: 'purple',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500',
        text: 'text-purple-400',
        badge: 'bg-purple-600/20'
      };
    case ResolutionMode.GROUP_WINNER:
      return {
        color: 'teal',
        bg: 'bg-teal-500/10',
        border: 'border-teal-500',
        text: 'text-teal-400',
        badge: 'bg-teal-600/20'
      };
    default:
      return {
        color: 'gray',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500',
        text: 'text-gray-400',
        badge: 'bg-gray-600/20'
      };
  }
}