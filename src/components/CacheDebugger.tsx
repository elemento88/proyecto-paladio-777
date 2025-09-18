'use client'

import { useEffect, useState } from 'react'
import { eventsCache } from '@/lib/eventsCache'
import { UnifiedSportsAPI } from '@/lib/unifiedSportsApi'

export default function CacheDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const updateDebugInfo = () => {
      const stats = eventsCache.getCacheStats()
      const hasValidCache = eventsCache.hasValidCache()
      const cacheInfo = eventsCache.getCacheInfo()
      
      setDebugInfo({
        stats,
        hasValidCache,
        cacheInfo,
        isClient: typeof window !== 'undefined',
        timestamp: new Date().toISOString()
      })
    }

    updateDebugInfo()
    const interval = setInterval(updateDebugInfo, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleForceLoad = async () => {
    setLoading(true)
    try {
      console.log('🔴 Force loading events...')
      const events = await UnifiedSportsAPI.getAllEvents()
      console.log(`🔴 Loaded ${events.length} events, storing in cache...`)
      eventsCache.storeEvents(events)
      console.log('🔴 Events stored in cache')
      
      // Update debug info
      const stats = eventsCache.getCacheStats()
      setDebugInfo(prev => ({ ...prev, stats, forceLoadResult: `Loaded ${events.length} events` }))
    } catch (error) {
      console.error('🔴 Force load error:', error)
      setDebugInfo(prev => ({ ...prev, forceLoadError: error.message }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Cache Debug Info</h3>
      <pre className="mb-4 bg-gray-800 p-2 rounded overflow-auto max-h-40">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button 
        onClick={handleForceLoad}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Force Load Events'}
      </button>
    </div>
  )
}