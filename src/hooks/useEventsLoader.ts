// Hook para carga progresiva de eventos deportivos masivos
import { useState, useEffect, useCallback, useRef } from 'react'
import { LiveScore } from '@/types/sports'
import { eventsCache } from '@/lib/eventsCache'
import { UnifiedSportsAPI } from '@/lib/unifiedSportsApi'

interface UseEventsLoaderResult {
  // Datos
  events: LiveScore[]
  filteredEvents: LiveScore[]
  
  // Estados de carga
  loading: boolean
  loadingMore: boolean
  initialLoading: boolean
  
  // Información de paginación
  hasMore: boolean
  currentPage: number
  totalEvents: number
  totalPages: number
  
  // Acciones
  loadMore: () => Promise<void>
  searchEvents: (query: string) => void
  filterEvents: (filters: EventFilters) => void
  refreshEvents: () => Promise<void>
  
  // Utilidades
  cacheStats: {
    totalEvents: number
    loadedChunks: number
    totalChunks: number
    cacheSize: string
    uptime: string
  }
  error: string | null
}

interface EventFilters {
  sport?: string
  league?: string
  date?: string
  status?: string
}

const EVENTS_PER_PAGE = 10000 // Cargar MUCHOS más eventos inicialmente

export function useEventsLoader(): UseEventsLoaderResult {
  console.log('🔥 useEventsLoader function called!', typeof window !== 'undefined' ? '[CLIENT]' : '[SERVER]')
  
  // Solo ejecutar carga de datos en el cliente
  const [isClient, setIsClient] = useState(false)
  
  // Estados principales
  const [events, setEvents] = useState<LiveScore[]>([])
  const [filteredEvents, setFilteredEvents] = useState<LiveScore[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  console.log('🔥 useEventsLoader states initialized!', typeof window !== 'undefined' ? '[CLIENT]' : '[SERVER]')
  
  // Detectar si estamos en el cliente
  useEffect(() => {
    console.log('🔥 Setting isClient to true')
    setIsClient(true)
  }, [])
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalEvents, setTotalEvents] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Filtros activos
  const [activeFilters, setActiveFilters] = useState<EventFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  
  // Referencias para control
  const mounted = useRef(true)
  const loadingRef = useRef(false)

  // Obtener estadísticas del cache y forzar carga si no hay eventos
  const [cacheStats, setCacheStats] = useState(() => {
    const stats = eventsCache.getCacheStats()
    console.log('🔍 Initial cache stats:', stats)
    return stats
  })

  // Actualizar estadísticas del cache
  const updateCacheStats = useCallback(() => {
    setCacheStats(eventsCache.getCacheStats())
  }, [])

  // Cargar eventos iniciales
  const loadInitialEvents = useCallback(async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    
    setInitialLoading(true)
    setError(null)
    
    try {
      console.log('🚀 Loading initial events...')
      console.log('🔍 Environment check:', typeof window !== 'undefined' ? 'Client' : 'Server')
      
      // Verificar si hay cache válido
      if (eventsCache.hasValidCache()) {
        console.log('📦 Using cached events')
        const cachedResult = eventsCache.getEvents(0, EVENTS_PER_PAGE)
        
        if (mounted.current) {
          setEvents(cachedResult.events)
          setFilteredEvents(cachedResult.events)
          setTotalEvents(cachedResult.totalEvents)
          setTotalPages(cachedResult.totalPages)
          setHasMore(cachedResult.hasMore)
          setCurrentPage(0)
          updateCacheStats()
        }
      } else {
        console.log('🔄 Loading fresh events from API...')
        
        // Cargar eventos frescos de la API REAL
        console.log('🚀 useEventsLoader: Calling NEW UnifiedSportsAPI...');
        const freshEvents = await UnifiedSportsAPI.getAllEvents()
        console.log(`✅ REAL DATA LOADED: ${freshEvents.length} fresh events from ${freshEvents.length > 0 ? freshEvents[0]?.sport || 'Unknown' : 'empty'} API`)
        console.log('📊 Sample event:', freshEvents[0])
        
        // Almacenar en cache
        eventsCache.storeEvents(freshEvents)
        
        // Obtener primera página
        const pagedResult = eventsCache.getEvents(0, EVENTS_PER_PAGE)
        
        if (mounted.current) {
          setEvents(pagedResult.events)
          setFilteredEvents(pagedResult.events)
          setTotalEvents(pagedResult.totalEvents)
          setTotalPages(pagedResult.totalPages)
          setHasMore(pagedResult.hasMore)
          setCurrentPage(0)
          updateCacheStats()
        }
      }
      
    } catch (err) {
      console.error('❌ Error loading events:', err)
      if (mounted.current) {
        setError(err instanceof Error ? err.message : 'Error loading events')
      }
    } finally {
      if (mounted.current) {
        setInitialLoading(false)
        setLoading(false)
      }
      loadingRef.current = false
    }
  }, [updateCacheStats])

  // Cargar más eventos (paginación infinita)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loadingRef.current) return
    
    setLoadingMore(true)
    setError(null)
    
    try {
      const nextPage = currentPage + 1
      console.log(`📄 Loading page ${nextPage}...`)
      
      // Si hay filtros activos, usar búsqueda filtrada
      if (searchQuery.trim() || Object.keys(activeFilters).length > 0) {
        // Para búsquedas, cargar más resultados de una vez
        const searchResults = eventsCache.searchEvents(searchQuery, activeFilters)
        const startIndex = currentPage * EVENTS_PER_PAGE
        const endIndex = (nextPage + 1) * EVENTS_PER_PAGE
        const newEvents = searchResults.slice(startIndex, endIndex)
        
        if (mounted.current && newEvents.length > 0) {
          setFilteredEvents(prev => [...prev, ...newEvents])
          setCurrentPage(nextPage)
          setHasMore(endIndex < searchResults.length)
        }
      } else {
        // Carga normal de cache
        const pagedResult = eventsCache.getEvents(nextPage, EVENTS_PER_PAGE)
        
        if (mounted.current && pagedResult.events.length > 0) {
          setEvents(prev => [...prev, ...pagedResult.events])
          setFilteredEvents(prev => [...prev, ...pagedResult.events])
          setCurrentPage(nextPage)
          setHasMore(pagedResult.hasMore)
        }
      }
      
      updateCacheStats()
      
    } catch (err) {
      console.error('❌ Error loading more events:', err)
      if (mounted.current) {
        setError(err instanceof Error ? err.message : 'Error loading more events')
      }
    } finally {
      if (mounted.current) {
        setLoadingMore(false)
      }
    }
  }, [currentPage, hasMore, loadingMore, searchQuery, activeFilters, updateCacheStats])

  // Buscar eventos
  const searchEvents = useCallback((query: string) => {
    setSearchQuery(query)
    setLoading(true)
    
    try {
      console.log(`🔍 Searching events: "${query}"`)
      const results = eventsCache.searchEvents(query, activeFilters)
      const initialResults = results.slice(0, EVENTS_PER_PAGE)
      
      setFilteredEvents(initialResults)
      setCurrentPage(0)
      setHasMore(results.length > EVENTS_PER_PAGE)
      setTotalEvents(results.length)
      setTotalPages(Math.ceil(results.length / EVENTS_PER_PAGE))
      
      console.log(`🎯 Found ${results.length} matching events`)
      
    } catch (err) {
      console.error('❌ Search error:', err)
      setError(err instanceof Error ? err.message : 'Search error')
    } finally {
      setLoading(false)
    }
  }, [activeFilters])

  // Filtrar eventos
  const filterEvents = useCallback((filters: EventFilters) => {
    setActiveFilters(filters)
    setLoading(true)
    
    try {
      console.log('🎛️ Applying filters:', filters)
      const results = eventsCache.searchEvents(searchQuery, filters)
      const initialResults = results.slice(0, EVENTS_PER_PAGE)
      
      setFilteredEvents(initialResults)
      setCurrentPage(0)
      setHasMore(results.length > EVENTS_PER_PAGE)
      setTotalEvents(results.length)
      setTotalPages(Math.ceil(results.length / EVENTS_PER_PAGE))
      
      console.log(`🎯 Filtered to ${results.length} events`)
      
    } catch (err) {
      console.error('❌ Filter error:', err)
      setError(err instanceof Error ? err.message : 'Filter error')
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  // Refrescar eventos
  const refreshEvents = useCallback(async () => {
    console.log('🔄 Refreshing events...')
    eventsCache.clearCache()
    setEvents([])
    setFilteredEvents([])
    setCurrentPage(0)
    setSearchQuery('')
    setActiveFilters({})
    await loadInitialEvents()
  }, [loadInitialEvents])

  // Efecto para cargar eventos iniciales - Solo cuando estamos en cliente
  useEffect(() => {
    // Solo ejecutar cuando isClient es true (garantiza que estamos en el cliente)
    if (!isClient) {
      console.log('🔄 useEventsLoader waiting for client...')
      return
    }
    
    console.log('🔄 useEventsLoader mounted on client, starting initial load...')
    console.log('🔍 Cache check:', eventsCache.hasValidCache())
    console.log('🔍 Loading ref status:', loadingRef.current)
    console.log('🔍 Current cache stats:', eventsCache.getCacheStats())
    mounted.current = true
    
    // Llamar directamente para evitar problemas de dependencias
    const initLoad = async () => {
      try {
        setInitialLoading(true)
        setError(null)
        
        console.log('🚀 Loading initial events directly...')
        console.log('🔍 Environment check:', typeof window !== 'undefined' ? 'Client' : 'Server')
        
        // Verificar si hay cache válido
        if (eventsCache.hasValidCache()) {
          console.log('📦 Using cached events')
          const cachedResult = eventsCache.getEvents(0, EVENTS_PER_PAGE)
          
          setEvents(cachedResult.events)
          setFilteredEvents(cachedResult.events)
          setTotalEvents(cachedResult.totalEvents)
          setTotalPages(cachedResult.totalPages)
          setHasMore(cachedResult.hasMore)
          setCurrentPage(0)
          updateCacheStats()
        } else {
          console.log('🔄 Loading fresh events from API...')
          
          // Cargar eventos frescos de la API
          const freshEvents = await UnifiedSportsAPI.getAllEvents()
          console.log(`✅ Loaded ${freshEvents.length} fresh events`)
          
          // Almacenar en cache
          eventsCache.storeEvents(freshEvents)
          
          // Obtener primera página
          const pagedResult = eventsCache.getEvents(0, EVENTS_PER_PAGE)
          
          setEvents(pagedResult.events)
          setFilteredEvents(pagedResult.events)
          setTotalEvents(pagedResult.totalEvents)
          setTotalPages(pagedResult.totalPages)
          setHasMore(pagedResult.hasMore)
          setCurrentPage(0)
          updateCacheStats()
        }
      } catch (err) {
        console.error('❌ Error loading events:', err)
        setError(err instanceof Error ? err.message : 'Error loading events')
      } finally {
        setInitialLoading(false)
        setLoading(false)
      }
    }
    
    // Usar setTimeout para asegurar que el componente esté completamente montado
    const timeoutId = setTimeout(initLoad, 0)
    
    return () => {
      console.log('🔄 useEventsLoader unmounting...')
      mounted.current = false
      clearTimeout(timeoutId)
    }
  }, [isClient, updateCacheStats]) // Depender de isClient para ejecutar solo en cliente

  // Actualizar estadísticas periódicamente
  useEffect(() => {
    const interval = setInterval(updateCacheStats, 30000) // Cada 30 segundos
    return () => clearInterval(interval)
  }, [updateCacheStats])

  return {
    // Datos
    events,
    filteredEvents,
    
    // Estados de carga
    loading,
    loadingMore,
    initialLoading,
    
    // Información de paginación
    hasMore,
    currentPage,
    totalEvents,
    totalPages,
    
    // Acciones
    loadMore,
    searchEvents,
    filterEvents,
    refreshEvents,
    
    // Utilidades
    cacheStats,
    error
  }
}