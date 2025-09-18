'use client'

import { useState, useEffect, useCallback } from 'react';
import { SearchAPI, SearchResult } from '@/lib/searchApi';
import { useRouter } from 'next/navigation';
import { useChallenges } from '@/contexts/ChallengesContext';

export default function TopHeader() {
  const { challenges } = useChallenges();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>(SearchAPI.getPopularSuggestions().slice(0, 6));
  const router = useRouter();

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (query.trim().length < 1) {
            setSearchResults([]);
            setShowResults(false);
            setIsLoading(false);
            return;
          }

          setIsLoading(true);
          try {
            const results = await SearchAPI.search(query, challenges);
            setSearchResults(results);
            setShowResults(true);
            
            // Actualizar sugerencias inteligentes basadas en los resultados
            const newSuggestions = SearchAPI.getSmartSuggestions(query, results);
            setSmartSuggestions(newSuggestions);
          } catch (error) {
            console.error('Error searching:', error);
            setSearchResults([]);
          } finally {
            setIsLoading(false);
          }
        }, 150); // Reducido el debounce para mayor responsividad
      };
    })(),
    [challenges]
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 1) {
      debouncedSearch(query);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setIsLoading(false);
  };

  const handleResultClick = (result: SearchResult) => {
    clearSearch();
    if (result.type === 'challenge') {
      // Navegar al reto específico
      router.push(`/challenge/${result.id}`);
    } else if (result.type === 'match') {
      // Navegar al partido específico o crear reto para este partido
      router.push(`/match/${result.id}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  // Cerrar sugerencias cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const searchContainer = target.closest('.search-container');
      
      if (!searchContainer) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#1a1d29] w-full relative z-50">
      <div className="w-full px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo VB y barra de búsqueda */}
          <div className="flex items-center ml-16 space-x-8">
            <img 
              src="/vb.png" 
              alt="VB Logo" 
              width={288} 
              height={144} 
              className="drop-shadow-lg"
              style={{
                objectFit: 'contain',
                background: 'transparent'
              }}
            />
            
            {/* Barra de búsqueda de retos y partidos */}
            <div className="relative search-container">
              <input
                type="text"
                placeholder="Buscar retos y partidos..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  if (searchQuery) {
                    setShowResults(true);
                  } else {
                    // Mostrar sugerencias populares cuando se hace focus sin texto
                    setShowResults(true);
                  }
                }}
                className="w-[691px] bg-[#2a2d47] border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}

              {/* Resultados de búsqueda */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2d47] border border-gray-600 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                  {!searchQuery ? (
                    // Mostrar sugerencias populares cuando no hay texto
                    <div className="p-4">
                      <div className="text-white text-sm font-medium mb-3">
                        🔥 Búsquedas Populares
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {smartSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-left p-2 rounded hover:bg-[#1a1d29] transition-colors text-sm text-gray-300 hover:text-white border border-gray-600/50 hover:border-gray-500"
                          >
                            🔍 {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : isLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <div className="text-gray-400 text-sm">Buscando...</div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="p-3 border-b border-gray-600">
                        <div className="text-white text-sm font-medium">
                          🎯 {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      {searchResults.map((result) => (
                        <div 
                          key={`${result.type}-${result.id}`} 
                          onClick={() => handleResultClick(result)}
                          className="p-3 hover:bg-[#1a1d29] transition-all cursor-pointer border-b border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{result.icon}</span>
                              <div>
                                <div className="text-white text-sm font-medium">{result.title}</div>
                                <div className="text-gray-400 text-xs">
                                  {result.league} • {result.type === 'challenge' ? 'Reto' : 'Partido'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {result.type === 'challenge' && result.stake && (
                                <div className="text-green-400 text-sm font-bold">{result.stake}</div>
                              )}
                              {result.type === 'challenge' && result.participants && (
                                <div className="text-gray-400 text-xs">{result.participants}</div>
                              )}
                              {result.type === 'match' && result.date && (
                                <div className="text-blue-400 text-xs">{result.date}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            {result.timeLeft && (
                              <span className="text-blue-400 text-xs">⏰ {result.timeLeft}</span>
                            )}
                            {result.status && (
                              <span className="text-yellow-400 text-xs">📊 {result.status}</span>
                            )}
                            <div className="text-right">
                              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                                {result.type === 'challenge' ? 'Ver Reto' : 'Ver Partido'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : searchQuery ? (
                    <div className="p-4 text-center">
                      <div className="text-gray-400 text-sm mb-2">❌ No se encontraron resultados</div>
                      <div className="text-gray-500 text-xs mb-3">
                        Intenta buscar por otro equipo, partido o liga
                      </div>
                      <div className="text-gray-400 text-xs mb-2">💡 Sugerencias:</div>
                      <div className="flex flex-wrap gap-2">
                        {smartSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-2 py-1 rounded text-xs transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Espacio vacío en la derecha */}
          <div className="flex items-center">
            {/* Logo removido */}
          </div>
        </div>
      </div>
    </header>
  );
}