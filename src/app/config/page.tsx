'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  difficulty: string;
  estimatedTime: string;
  features: string[];
}

function ConfigPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [challengeType, setChallengeType] = useState<ChallengeConfig | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    baseAmount: '50',
    maxParticipants: '100',
    resolutionMode: 'EXACT',
    sport: 'Fútbol'
  });

  useEffect(() => {
    const typeId = searchParams.get('type');
    const typeTitle = searchParams.get('title');
    const typeIcon = searchParams.get('icon');
    const typeDescription = searchParams.get('description');
    
    if (typeId && typeTitle && typeIcon && typeDescription) {
      setChallengeType({
        id: typeId,
        title: typeTitle,
        description: typeDescription,
        icon: decodeURIComponent(typeIcon),
        iconColor: 'text-red-400', // Default for Battle Royal
        backgroundColor: 'from-red-900/20 to-red-800/10',
        difficulty: 'Básico',
        estimatedTime: '5 min',
        features: []
      });
      
      // Set default title based on challenge type
      setFormData(prev => ({
        ...prev,
        title: `${typeTitle} - ${new Date().toLocaleDateString()}`
      }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save configuration to localStorage
    const config = {
      ...challengeType,
      ...formData,
      timestamp: Date.now()
    };
    
    localStorage.setItem('completeBetConfig', JSON.stringify(config));
    
    // Redirect to sports selection
    router.push('/sports');
  };

  const handleSportChange = (sport: string) => {
    setFormData(prev => ({ ...prev, sport }));
  };

  if (!challengeType) {
    return (
      <div className="min-h-screen bg-[#1a1d29] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚙️</div>
          <div className="text-xl text-white mb-2">Cargando configuración...</div>
          <div className="text-gray-400">Preparando el reto</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/create" className="text-gray-400 hover:text-white flex items-center mb-4">
            ← Cambiar Tipo
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Configurar Reto</h1>
          <p className="text-gray-400">Configura los detalles de tu reto</p>
        </div>

        {/* Selected Challenge Type */}
        <div className={`bg-gradient-to-br ${challengeType.backgroundColor} border border-gray-600 rounded-xl p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-[#2a2d47] rounded-xl flex items-center justify-center text-3xl mr-4">
                {challengeType.icon}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">{challengeType.title}</h2>
                <p className="text-gray-300">{challengeType.description}</p>
              </div>
            </div>
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
              Seleccionado
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-[#2a2d47] rounded-xl p-8 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-6">Configuración General</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del Reto *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Describe los detalles de tu reto..."
              />
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Base Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reto Base (USDC) *
                </label>
                <input
                  type="number"
                  value={formData.baseAmount}
                  onChange={(e) => setFormData({...formData, baseAmount: e.target.value})}
                  min="1"
                  className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Máximo de Participantes *
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  min="2"
                  max="100"
                  className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Resolution Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Modo de Resolución * 
                <span className="text-gray-400 text-sm ml-2">¿Cómo se determina el ganador?</span>
              </label>
              <select
                value={formData.resolutionMode}
                onChange={(e) => setFormData({...formData, resolutionMode: e.target.value})}
                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                required
              >
                <option value="EXACT">Exacto - Predicción exacta gana</option>
                <option value="CLOSEST">Más Cercano - Predicción más cercana gana</option>
                <option value="MULTI_WINNER">Múltiples Ganadores - Varios ganadores posibles</option>
              </select>
            </div>

            {/* Sport Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Deportes
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Fútbol', icon: '⚽' },
                  { name: 'Baloncesto', icon: '🏀' },
                  { name: 'Tenis', icon: '🎾' },
                  { name: 'Béisbol', icon: '⚾' }
                ].map((sport) => (
                  <button
                    key={sport.name}
                    type="button"
                    onClick={() => handleSportChange(sport.name)}
                    className={`p-4 rounded-lg border transition-all ${
                      formData.sport === sport.name
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{sport.icon}</div>
                    <div className="text-sm font-medium">{sport.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#1a1d29] rounded-lg p-4 border border-gray-600">
              <h4 className="text-lg font-medium text-white mb-3">Resumen de Configuración</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="text-white">{challengeType.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deporte:</span>
                    <span className="text-white">{formData.sport}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">USDC Base:</span>
                    <span className="text-white">${formData.baseAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Participantes:</span>
                    <span className="text-white">Max {formData.maxParticipants}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Link href="/create" className="flex-1">
                <button
                  type="button"
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  ← Cambiar Tipo
                </button>
              </Link>
              
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Continuar →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ConfigPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1d29] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    }>
      <ConfigPageContent />
    </Suspense>
  );
}