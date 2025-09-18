// Componente para mostrar el estado del cache y estadísticas de carga
import React from 'react'

interface CacheStatusProps {
  stats: {
    totalEvents: number
    loadedChunks: number
    totalChunks: number
    cacheSize: string
    uptime: string
  }
  currentlyShowing: number
  onRefreshCache?: () => void
  onClearCache?: () => void
  loading?: boolean
}

export default function CacheStatus({ 
  stats, 
  currentlyShowing, 
  onRefreshCache, 
  onClearCache,
  loading = false 
}: CacheStatusProps) {
  const loadingPercentage = stats.totalChunks > 0 
    ? Math.round((stats.loadedChunks / stats.totalChunks) * 100)
    : 0

  return (
    <div className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 border border-gray-700 rounded-xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.79 4 8.5 4s8.5-1.79 8.5-4V7M4 7c0 2.21 3.79 4 8.5 4s8.5-1.79 8.5-4M4 7c0-2.21 3.79-4 8.5-4s8.5 1.79 8.5 4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Estado del Cache</h3>
            <p className="text-xs text-gray-400">Sistema de carga progresiva activo</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          {onRefreshCache && (
            <button
              onClick={onRefreshCache}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              title="Refrescar eventos"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          
          {onClearCache && (
            <button
              onClick={onClearCache}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              title="Limpiar cache"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        {/* Total Events */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-white mb-1">
            {stats.totalEvents.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Eventos Totales</div>
        </div>

        {/* Currently Showing */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {currentlyShowing.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Cargados</div>
        </div>

        {/* Cache Size */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {stats.cacheSize}
          </div>
          <div className="text-xs text-gray-400">Tamaño Cache</div>
        </div>

        {/* Chunks */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {stats.loadedChunks}/{stats.totalChunks}
          </div>
          <div className="text-xs text-gray-400">Chunks</div>
        </div>

        {/* Loading Percentage */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {loadingPercentage}%
          </div>
          <div className="text-xs text-gray-400">Progreso</div>
        </div>

        {/* Uptime */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-300 mb-1">
            {stats.uptime}
          </div>
          <div className="text-xs text-gray-400">Antigüedad</div>
        </div>
      </div>

      {/* Progress Bar */}
      {stats.totalChunks > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Progreso de carga</span>
            <span className="text-sm text-gray-400">{loadingPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {/* Cache Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${stats.totalEvents > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-300">
              Cache: {stats.totalEvents > 0 ? 'Activo' : 'Vacío'}
            </span>
          </div>

          {/* Loading Status */}
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-blue-400">Cargando...</span>
            </div>
          )}
        </div>

        {/* Performance Indicator */}
        <div className="flex items-center space-x-1">
          <span className="text-gray-400">Rendimiento:</span>
          <span className={`font-medium ${
            loadingPercentage > 80 ? 'text-green-400' :
            loadingPercentage > 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {loadingPercentage > 80 ? 'Excelente' :
             loadingPercentage > 50 ? 'Bueno' : 'Cargando...'}
          </span>
        </div>
      </div>

      {/* Debug Info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-400">Debug Info</summary>
            <div className="mt-2 bg-black/30 p-2 rounded text-mono">
              <div>Total Events: {stats.totalEvents}</div>
              <div>Loaded Chunks: {stats.loadedChunks}</div>
              <div>Total Chunks: {stats.totalChunks}</div>
              <div>Cache Size: {stats.cacheSize}</div>
              <div>Currently Showing: {currentlyShowing}</div>
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}