'use client';

import { useEffect, useState } from 'react';
import { UnifiedSportsAPI } from '@/lib/unifiedSportsApi';
import { eventsCache } from '@/lib/eventsCache';

export default function EventsForcer() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState(0);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log('🚀 EventsForcer: Forcing event load...');

        // Limpiar cache completamente
        eventsCache.clearCache();

        // Cargar eventos frescos
        const freshEvents = await UnifiedSportsAPI.getAllEvents();
        console.log('✅ EventsForcer: Events loaded:', freshEvents.length);

        // Almacenar en cache
        eventsCache.storeEvents(freshEvents);

        setEvents(freshEvents.length);
        setLoading(false);
      } catch (error) {
        console.error('❌ EventsForcer: Error loading events:', error);
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-blue-900 text-white p-2 rounded-lg text-xs z-50">
      {loading ? (
        <div>🔄 Forzando carga de eventos...</div>
      ) : (
        <div>✅ {events} eventos cargados</div>
      )}
    </div>
  );
}