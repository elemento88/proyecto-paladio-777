import { ResolutionMode, ResolutionModeInfo } from '@/types/betting';

export const RESOLUTION_MODES: Record<ResolutionMode, ResolutionModeInfo> = {
  [ResolutionMode.EXACT]: {
    name: 'Exacta',
    icon: '🎯',
    description: 'Solo ganan los participantes que acierten exactamente el resultado final. Si nadie acierta, se regresan las criptomonedas a todos los participantes',
    example: 'Si el resultado es "Barcelona 2-1 Real Madrid", solo ganan quienes predijeron exactamente "2-1". Si nadie predijo 2-1, todos recuperan su apuesta',
    difficulty: 'Difícil',
    winChance: 'Baja',
    prizeDistribution: 'Los ganadores se dividen el 95% del pozo total. Sin ganadores: reembolso completo'
  },
  [ResolutionMode.CLOSEST]: {
    name: 'Más Cercano',
    icon: '🔥',
    description: 'Gana quien más se acerque al resultado real, aunque no sea exacto',
    example: 'Si el resultado son 78 puntos y las predicciones son 75, 80, 85, gana quien predijo 80',
    difficulty: 'Medio',
    winChance: 'Media',
    prizeDistribution: 'El participante más cercano gana el 95% del pozo'
  },
  [ResolutionMode.MULTI_WINNER]: {
    name: 'Multi-Ganador',
    icon: '🏆',
    description: 'Múltiples participantes pueden ganar según criterios flexibles',
    example: 'Top 3 predicciones más cercanas, o todos dentro de un rango específico',
    difficulty: 'Fácil',
    winChance: 'Alta',
    prizeDistribution: 'Se divide entre ganadores (ej: 1° 60%, 2° 25%, 3° 15%)'
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
      // En modo exacto, todos los ganadores se dividen el premio equitativamente
      // Si no hay ganadores (estimatedWinners = 0), se devuelve el 100% a cada participante
      if (estimatedWinners === 0) {
        return [{
          position: 0, // 0 indica reembolso
          percentage: 100,
          amount: totalPrize // Reembolso completo sin fees
        }];
      }
      return [{
        position: 1,
        percentage: 95,
        amount: netPrize / Math.max(1, estimatedWinners)
      }];

    case ResolutionMode.CLOSEST:
      // En modo más cercano, solo hay un ganador
      return [{
        position: 1,
        percentage: 95,
        amount: netPrize
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
      return 'Si nadie acierta exactamente, se devuelve el 100% de las apuestas sin fees';
    case ResolutionMode.CLOSEST:
      return 'Siempre hay ganador: quien esté más cerca del resultado';
    case ResolutionMode.MULTI_WINNER:
      return 'Múltiples criterios de victoria: mayor probabilidad de ganar';
    default:
      return '';
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