'use client'

import { useState } from 'react';

export default function ForceDataRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const forceRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Limpiar todos los caches posibles
      localStorage.clear();
      sessionStorage.clear();

      console.log('🎭 Force refresh - regenerating mock data...');
      setLastRefresh(new Date());

      // Recargar la página para aplicar cambios
      window.location.reload();

    } catch (error) {
      console.error('❌ Force refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-900 bg-opacity-90 backdrop-blur border border-blue-600 rounded-lg p-4">
      <h3 className="text-blue-200 font-bold mb-2">🎭 REGENERAR DATOS MOCK</h3>
      <p className="text-blue-300 text-sm mb-3">
        Si quieres regenerar los datos de ejemplo, presiona este botón:
      </p>

      <button
        onClick={forceRefresh}
        disabled={isRefreshing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        {isRefreshing ? '🔄 Limpiando y recargando...' : '🎭 REGENERAR DATOS MOCK'}
      </button>

      {lastRefresh && (
        <p className="text-blue-400 text-xs mt-2">
          Último refresh: {lastRefresh.toLocaleTimeString()}
        </p>
      )}

      <div className="mt-3 text-xs text-blue-300">
        <p>✅ Limpia cache localStorage</p>
        <p>✅ Regenera datos mock</p>
        <p>✅ Recarga página completamente</p>
      </div>
    </div>
  );
}