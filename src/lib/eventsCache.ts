// Sistema de cache simplificado para eventos deportivos mock
import { LiveScore } from '@/types/sports'

export interface CacheMetadata {
  totalEvents: number
  lastUpdated: number
  sports: string[]
  leagues: string[]
  version: string
}

export interface EventsCache {
  events: LiveScore[]
  metadata: CacheMetadata
  chunks: {
    [key: string]: LiveScore[]  // Chunks paginados para carga progresiva
  }
}

class EventsCacheManager {
  private static readonly CACHE_KEY = 'sports_events_cache_mock_only'
  private static readonly CHUNK_SIZE = 10000 // Eventos por chunk para carga progresiva
  private static readonly MAX_CACHE_AGE = 30 * 60 * 1000 // 30 minutos para datos mock
  private static readonly MAX_CACHE_SIZE = 10 * 1024 * 1024 // 10MB máximo para datos mock

  private cache: EventsCache | null = null
  private loadedChunks = new Set<string>()

  constructor() {
    // Limpiar caches anteriores para migrar a solo mock
    this.clearAllOldCaches()
    this.loadFromStorage()
    // Si no hay cache válido en el cliente, cargar eventos mock inmediatamente
    if (typeof window !== 'undefined' && !this.hasValidCache()) {
      console.log('🎭 No valid cache found, auto-loading mock events...')
      this.autoLoadEvents()
    }
  }

  // Limpiar todos los caches anteriores
  private clearAllOldCaches(): void {
    if (typeof window === 'undefined') return

    try {
      const oldCacheKeys = [
        'sports_events_cache_v1',
        'sports_events_cache_v2',
        'sports_events_cache_v3',
        'sports_events_cache_v4',
        'sports_events_cache_v5',
        'sports_events_cache_v6',
        'sports_events_cache_v7',
        'sports_events_cache_v8',
        'sports_events_cache_v9',
        'sports_events_cache_v10',
        'sports_events_cache_v11',
        'sports_events_cache_v12',
        'sports_events_cache_v13_future_only'
      ]

      oldCacheKeys.forEach(key => {
        localStorage.removeItem(key)
      })

      console.log('🗑️ Cleared all old cache versions')
    } catch (error) {
      console.error('Error clearing old caches:', error)
    }
  }

  // Cargar eventos automáticamente si no hay cache
  private async autoLoadEvents(): Promise<void> {
    try {
      console.log('🎭 Auto-loading mock events from UnifiedSportsAPI...')
      const { UnifiedSportsAPI } = await import('./unifiedSportsApi')
      const events = await UnifiedSportsAPI.getAllEvents()
      console.log(`✅ Auto-loaded ${events.length} mock events`)
      this.storeEvents(events)
    } catch (error) {
      console.warn('⚠️ Auto-load failed:', error)
    }
  }

  // Cargar cache desde localStorage con manejo de errores
  private loadFromStorage(): void {
    try {
      if (typeof window === 'undefined') return // Skip on server
      const stored = localStorage.getItem(EventsCacheManager.CACHE_KEY)
      if (!stored) {
        console.log('📦 No cache found, will create fresh')
        return
      }

      const parsed = JSON.parse(stored) as EventsCache
      
      // Validar que el cache no esté expirado
      const now = Date.now()
      if (now - parsed.metadata.lastUpdated > EventsCacheManager.MAX_CACHE_AGE) {
        console.log('⏰ Cache expired, clearing')
        this.clearCache()
        return
      }

      this.cache = parsed
      console.log(`📦 Cache loaded: ${parsed.metadata.totalEvents} events from ${parsed.metadata.sports.length} sports`)
    } catch (error) {
      console.error('❌ Error loading cache, clearing:', error)
      this.clearCache()
    }
  }

  // Guardar cache en localStorage con compresión
  private saveToStorage(): void {
    if (!this.cache || typeof window === 'undefined') return

    try {
      const serialized = JSON.stringify(this.cache)
      
      // Verificar tamaño antes de guardar
      const sizeInBytes = new Blob([serialized]).size
      if (sizeInBytes > EventsCacheManager.MAX_CACHE_SIZE) {
        console.warn(`⚠️ Cache size too large (${Math.round(sizeInBytes / 1024 / 1024)}MB), truncating...`)
        this.truncateCache()
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(EventsCacheManager.CACHE_KEY, serialized)
          console.log(`💾 Cache saved: ${this.cache.metadata.totalEvents} events (${Math.round(sizeInBytes / 1024)}KB)`)
        } catch (storageError: any) {
          if (storageError.name === 'QuotaExceededError') {
            console.warn('⚠️ localStorage quota exceeded, truncating cache...')
            this.truncateCache()
            const truncatedSerialized = JSON.stringify(this.cache)
            try {
              localStorage.setItem(EventsCacheManager.CACHE_KEY, truncatedSerialized)
              console.log(`💾 Truncated cache saved: ${this.cache?.metadata.totalEvents} events`)
            } catch (retryError) {
              console.error('❌ Failed to save even truncated cache:', retryError)
              // Clear all localStorage if needed
              try {
                localStorage.clear()
                localStorage.setItem(EventsCacheManager.CACHE_KEY, truncatedSerialized)
                console.log('🗑️ Cleared localStorage and saved truncated cache')
              } catch (finalError) {
                console.error('❌ Complete localStorage failure:', finalError)
              }
            }
          } else {
            throw storageError
          }
        }
      } else {
        console.log(`💾 Cache prepared (SSR): ${this.cache.metadata.totalEvents} events (${Math.round(sizeInBytes / 1024)}KB)`)
      }
    } catch (error) {
      console.error('❌ Error preparing cache:', error)
    }
  }

  // Truncar cache de forma inteligente cuando localStorage se llena
  private truncateCache(): void {
    if (!this.cache) return

    console.log(`⚠️ TRUNCATING CACHE - Original events: ${this.cache.events.length}`)

    // Distribuir eventos por deporte para mantener variedad
    const eventsBySport = this.cache.events.reduce((acc, event) => {
      if (!acc[event.sport]) acc[event.sport] = []
      acc[event.sport].push(event)
      return acc
    }, {} as Record<string, any[]>)

    // Tomar hasta 500 eventos por deporte para mantener diversidad
    const maxPerSport = 500
    const truncatedEvents: any[] = []

    Object.entries(eventsBySport).forEach(([sport, events]) => {
      const eventsToTake = Math.min(maxPerSport, events.length)
      truncatedEvents.push(...events.slice(0, eventsToTake))
      console.log(`🏆 ${sport}: ${eventsToTake} eventos (de ${events.length} disponibles)`)
    })

    this.cache.events = truncatedEvents
    this.cache.metadata.totalEvents = truncatedEvents.length
    this.rebuildChunks()

    console.log(`✂️ Cache truncated INTELLIGENTLY to ${truncatedEvents.length} events (balanced across ${Object.keys(eventsBySport).length} sports)`)
  }

  // Almacenar eventos masivos con chunking automático
  public storeEvents(events: LiveScore[]): void {
    const now = Date.now()
    const sports = [...new Set(events.map(e => e.sport))].sort()
    const leagues = [...new Set(events.map(e => e.league))].sort()

    console.log('🚀 STORING EVENTS:');
    console.log(`📊 TOTAL EVENTS RECEIVED: ${events.length}`);
    console.log(`📊 SPORTS FOUND: ${sports.length} - ${sports.join(', ')}`);

    const sportCounts = sports.reduce((acc, sport) => {
      acc[sport] = events.filter(e => e.sport === sport).length;
      return acc;
    }, {} as Record<string, number>);

    console.log('📊 SPORT DISTRIBUTION:');
    Object.entries(sportCounts).forEach(([sport, count]) => {
      console.log(`   ${sport}: ${count} eventos`);
    });

    // Usar todos los eventos disponibles sin limitación
    let processedEvents = events
    console.log(`✅ Processing ${events.length} total events without limitations`)

    // Crear chunks para carga progresiva
    const chunks: { [key: string]: LiveScore[] } = {}
    for (let i = 0; i < processedEvents.length; i += EventsCacheManager.CHUNK_SIZE) {
      const chunkIndex = Math.floor(i / EventsCacheManager.CHUNK_SIZE)
      const chunkKey = `chunk_${chunkIndex}`
      chunks[chunkKey] = processedEvents.slice(i, i + EventsCacheManager.CHUNK_SIZE)
    }

    this.cache = {
      events: processedEvents,
      metadata: {
        totalEvents: processedEvents.length,
        lastUpdated: now,
        sports,
        leagues,
        version: '2.0'
      },
      chunks
    }

    this.loadedChunks.clear() // Reset loaded chunks
    this.saveToStorage()
    
    console.log(`🎯 Stored ${processedEvents.length} events in ${Object.keys(chunks).length} chunks`)
    console.log(`📊 Sports: ${sports.length}, Leagues: ${leagues.length}`)
  }

  // Reconstruir chunks (útil después de filtros)
  private rebuildChunks(): void {
    if (!this.cache) return

    const chunks: { [key: string]: LiveScore[] } = {}
    for (let i = 0; i < this.cache.events.length; i += EventsCacheManager.CHUNK_SIZE) {
      const chunkIndex = Math.floor(i / EventsCacheManager.CHUNK_SIZE)
      const chunkKey = `chunk_${chunkIndex}`
      chunks[chunkKey] = this.cache.events.slice(i, i + EventsCacheManager.CHUNK_SIZE)
    }
    this.cache.chunks = chunks
  }

  // Obtener eventos con carga progresiva (paginado)
  public getEvents(page: number = 0, pageSize: number = EventsCacheManager.CHUNK_SIZE): {
    events: LiveScore[]
    hasMore: boolean
    totalEvents: number
    totalPages: number
    currentPage: number
  } {
    if (!this.cache) {
      return {
        events: [],
        hasMore: false,
        totalEvents: 0,
        totalPages: 0,
        currentPage: 0
      }
    }

    const startIndex = page * pageSize
    const endIndex = startIndex + pageSize
    const events = this.cache.events.slice(startIndex, endIndex)
    const totalPages = Math.ceil(this.cache.events.length / pageSize)

    return {
      events,
      hasMore: endIndex < this.cache.events.length,
      totalEvents: this.cache.metadata.totalEvents,
      totalPages,
      currentPage: page
    }
  }

  // Obtener chunk específico
  public getChunk(chunkIndex: number): LiveScore[] {
    if (!this.cache) return []
    
    const chunkKey = `chunk_${chunkIndex}`
    this.loadedChunks.add(chunkKey)
    return this.cache.chunks[chunkKey] || []
  }

  // Obtener múltiples chunks de una vez
  public getChunks(startChunk: number, endChunk: number): LiveScore[] {
    const allEvents: LiveScore[] = []
    for (let i = startChunk; i <= endChunk; i++) {
      allEvents.push(...this.getChunk(i))
    }
    return allEvents
  }

  // Buscar eventos (con cache de resultados)
  public searchEvents(query: string, filters?: {
    sport?: string
    league?: string
    date?: string
  }): LiveScore[] {
    if (!this.cache) {
      console.log('❌ NO CACHE AVAILABLE for searchEvents')
      return []
    }

    console.log(`🔍 SEARCH EVENTS - Total cached events: ${this.cache.events.length}`)
    console.log(`🔍 SEARCH PARAMS - Query: "${query}", Filters:`, filters)

    // Si no hay query ni filtros, devolver TODOS los eventos disponibles
    if (!query.trim() && !filters) {
      console.log(`🔍 NO FILTERS - Returning all ${this.cache.events.length} events`)
      return this.cache.events
    }

    const searchTerm = query.toLowerCase().trim()
    let results = this.cache.events.filter(event => {
      // Si hay query de búsqueda, verificar que coincida
      if (searchTerm) {
        const matchesQuery =
          event.homeTeam.toLowerCase().includes(searchTerm) ||
          event.awayTeam.toLowerCase().includes(searchTerm) ||
          event.league.toLowerCase().includes(searchTerm) ||
          event.sport.toLowerCase().includes(searchTerm)

        if (!matchesQuery) return false
      }

      // Aplicar filtros adicionales (incluso sin query)
      if (filters?.sport && event.sport.toLowerCase() !== filters.sport.toLowerCase()) {
        console.log(`❌ Sport mismatch: "${event.sport}" !== "${filters.sport}"`)
        return false
      }
      if (filters?.league && event.league.toLowerCase() !== filters.league.toLowerCase()) return false
      if (filters?.date && !event.date.startsWith(filters.date)) return false

      return true
    })

    console.log(`🎯 FINAL RESULTS: ${results.length} events for sport: ${filters?.sport || 'all'}`)

    // Mostrar estadísticas de eventos por deporte
    if (this.cache.events.length > 0) {
      const sportStats = this.cache.events.reduce((acc, event) => {
        acc[event.sport] = (acc[event.sport] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      console.log('📊 SPORT STATISTICS:', sportStats)
    }

    // Devolver TODOS los resultados sin limitación
    return results
  }

  // Obtener metadatos del cache
  public getCacheInfo(): CacheMetadata | null {
    return this.cache?.metadata || null
  }

  // Verificar si hay cache válido
  public hasValidCache(): boolean {
    if (!this.cache) return false
    
    const now = Date.now()
    return now - this.cache.metadata.lastUpdated < EventsCacheManager.MAX_CACHE_AGE
  }

  // Limpiar cache
  public clearCache(): void {
    this.cache = null
    this.loadedChunks.clear()
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(EventsCacheManager.CACHE_KEY)
      }
      console.log('🗑️ Cache cleared')
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  // Obtener estadísticas del cache
  public getCacheStats(): {
    totalEvents: number
    loadedChunks: number
    totalChunks: number
    cacheSize: string
    uptime: string
  } {
    if (!this.cache) {
      return {
        totalEvents: 0,
        loadedChunks: 0,
        totalChunks: 0,
        cacheSize: '0KB',
        uptime: 'No cache'
      }
    }

    const totalChunks = Object.keys(this.cache.chunks).length
    const cacheAge = Date.now() - this.cache.metadata.lastUpdated
    const uptime = `${Math.floor(cacheAge / 1000 / 60)}m`
    
    try {
      if (typeof window === 'undefined') {
        return {
          totalEvents: this.cache.metadata.totalEvents,
          loadedChunks: this.loadedChunks.size,
          totalChunks,
          cacheSize: 'SSR',
          uptime
        }
      }
      const sizeInBytes = new Blob([JSON.stringify(this.cache)]).size
      const cacheSize = `${Math.round(sizeInBytes / 1024)}KB`
      
      return {
        totalEvents: this.cache.metadata.totalEvents,
        loadedChunks: this.loadedChunks.size,
        totalChunks,
        cacheSize,
        uptime
      }
    } catch {
      return {
        totalEvents: this.cache.metadata.totalEvents,
        loadedChunks: this.loadedChunks.size,
        totalChunks,
        cacheSize: 'Unknown',
        uptime
      }
    }
  }
}

// Instancia singleton
export const eventsCache = new EventsCacheManager()