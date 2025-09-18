import { LiveScore } from '@/types/sports';
import { MockSportsAPI } from './mockSportsApi';

// API simplificada - Solo datos mock, sin APIs externas
export class UnifiedSportsAPI {
  // Cache simple para datos mock
  private static cache: {
    data: LiveScore[];
    timestamp: number;
  } | null = null;

  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos para datos mock

  // Obtener todos los eventos deportivos - Solo datos mock
  static async getAllEvents(): Promise<LiveScore[]> {
    console.log('🎭 UnifiedSportsAPI: Loading mock sports data...');

    // Verificar cache válido
    if (this.cache && this.isCacheValid()) {
      console.log(`📦 Using cached mock data (${this.cache.data.length} events)`);
      return this.cache.data;
    }

    // Generar datos mock
    console.log('🎭 Generating fresh mock data...');
    const mockEvents = await MockSportsAPI.getAllEvents();

    // Actualizar cache
    this.cache = {
      data: mockEvents,
      timestamp: Date.now()
    };

    console.log(`✅ Loaded ${mockEvents.length} mock events`);
    return mockEvents;
  }

  // Verificar si el cache es válido
  private static isCacheValid(): boolean {
    if (!this.cache) return false;
    const age = Date.now() - this.cache.timestamp;
    return age < this.CACHE_DURATION;
  }

  // Obtener metadatos del cache actual
  static getCacheInfo(): {
    hasCache: boolean;
    age?: number;
    count?: number;
  } {
    if (!this.cache) {
      return { hasCache: false };
    }

    return {
      hasCache: true,
      age: Date.now() - this.cache.timestamp,
      count: this.cache.data.length
    };
  }

  // Limpiar cache manualmente
  static clearCache(): void {
    this.cache = null;
    console.log('🗑️ Sports cache cleared');
  }

  // Refrescar datos
  static async refreshData(): Promise<LiveScore[]> {
    this.clearCache();
    return this.getAllEvents();
  }

  // Buscar eventos específicos
  static async searchEvents(query: string): Promise<LiveScore[]> {
    return MockSportsAPI.searchEvents(query);
  }
}