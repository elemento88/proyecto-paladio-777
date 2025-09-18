// Componente de scroll infinito para carga progresiva de eventos
import React, { useCallback, useEffect, useRef } from 'react'

interface InfiniteScrollLoaderProps {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => Promise<void>
  threshold?: number
  children?: React.ReactNode
}

export default function InfiniteScrollLoader({
  hasMore,
  loading,
  onLoadMore,
  threshold = 300,
  children
}: InfiniteScrollLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef(false)

  // Callback para el intersection observer
  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      
      if (entry.isIntersecting && hasMore && !loading && !loadingRef.current) {
        loadingRef.current = true
        console.log('📄 Infinite scroll triggered - loading more events...')
        
        try {
          await onLoadMore()
        } finally {
          loadingRef.current = false
        }
      }
    },
    [hasMore, loading, onLoadMore]
  )

  // Configurar intersection observer
  useEffect(() => {
    const currentLoaderRef = loaderRef.current
    
    if (!currentLoaderRef) return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1
    })

    observerRef.current.observe(currentLoaderRef)

    return () => {
      if (observerRef.current && currentLoaderRef) {
        observerRef.current.unobserve(currentLoaderRef)
      }
    }
  }, [handleIntersection, threshold])

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <div className="w-full">
      {children}
      
      {/* Loader element for intersection observer */}
      <div ref={loaderRef} className="w-full py-8">
        {loading && hasMore && (
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {/* Spinner */}
              <div className="relative">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              
              {/* Loading text */}
              <div className="text-center">
                <div className="text-blue-400 font-medium">Cargando más eventos...</div>
                <div className="text-xs text-gray-400 mt-1">Scroll infinito activado</div>
              </div>
            </div>
          </div>
        )}

        {/* End of results indicator */}
        {!hasMore && !loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-green-400 font-medium">¡Has visto todos los eventos!</div>
              <div className="text-xs text-gray-400 mt-1">No hay más eventos para cargar</div>
            </div>
          </div>
        )}

        {/* Load more button (fallback) */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={onLoadMore}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <div className="flex items-center space-x-2">
                <span>Cargar más eventos</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}