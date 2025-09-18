'use client'

import { useState, useEffect } from 'react';
import { UnifiedSportsAPI } from '@/lib/unifiedSportsApi';

export default function ApiStatusIndicator() {
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Actualizar info del cache cada 30 segundos
  useEffect(() => {
    const updateCacheInfo = () => {
      const info = UnifiedSportsAPI.getCacheInfo();
      setCacheInfo(info);
    };

    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Forzar refrescado de datos
      await UnifiedSportsAPI.clearCache();
      await UnifiedSportsAPI.getAllEvents();

      // Actualizar info del cache
      const info = UnifiedSportsAPI.getCacheInfo();
      setCacheInfo(info);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatAge = (ageMs: number) => {
    const minutes = Math.floor(ageMs / (1000 * 60));
    const seconds = Math.floor((ageMs % (1000 * 60)) / 1000);
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case 'real': return 'text-green-400';
      case 'mock': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'real': return '🔴'; // Live data
      case 'mock': return '🎭'; // Mock data
      default: return '❓';
    }
  };

  if (!cacheInfo) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur border border-gray-600 rounded-lg p-3 text-sm">
        <div className="flex items-center space-x-3">
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              cacheInfo.source === 'real' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`}></div>
            <span className={`font-medium ${getSourceColor(cacheInfo.source)}`}>
              {getSourceIcon(cacheInfo.source)} {cacheInfo.source?.toUpperCase() || 'LOADING'}
            </span>
          </div>

          {/* Cache info */}
          {cacheInfo.hasCache && (
            <>
              <div className="text-gray-400">|</div>
              <div className="text-gray-300">
                {cacheInfo.count} eventos
              </div>
              <div className="text-gray-400">
                {cacheInfo.quality?.toFixed(0)}% calidad
              </div>
              <div className="text-gray-400">
                {formatAge(cacheInfo.age || 0)} ago
              </div>
            </>
          )}

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ml-2 p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refrescar datos"
          >
            <span className={`text-sm ${isRefreshing ? 'animate-spin' : ''}`}>
              🔄
            </span>
          </button>
        </div>

        {/* Additional info on hover */}
        <div className="mt-1 text-xs text-gray-500">
          {cacheInfo.source === 'real'
            ? 'Datos en tiempo real de APIs deportivas'
            : 'Datos simulados (API offline o limitada)'
          }
        </div>
      </div>
    </div>
  );
}