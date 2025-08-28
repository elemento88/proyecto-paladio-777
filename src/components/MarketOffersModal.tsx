'use client'

import { useState } from 'react';

interface Offer {
  id: string;
  bidder: string;
  amount: string;
  prediction: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface MarketOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeTitle: string;
  creatorPrediction: string;
  creatorStake: string;
  offers: Offer[];
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  onMakeOffer?: (amount: string, prediction: string) => void;
  isCreator: boolean;
}

export default function MarketOffersModal({ 
  isOpen, 
  onClose, 
  challengeTitle, 
  creatorPrediction, 
  creatorStake,
  offers, 
  onAcceptOffer, 
  onRejectOffer,
  onMakeOffer,
  isCreator 
}: MarketOffersModalProps) {
  const [offerAmount, setOfferAmount] = useState('');
  const [offerPrediction, setOfferPrediction] = useState('');

  if (!isOpen) return null;

  const handleMakeOffer = () => {
    if (onMakeOffer && offerAmount && offerPrediction) {
      onMakeOffer(offerAmount, offerPrediction);
      setOfferAmount('');
      setOfferPrediction('');
    }
  };

  const pendingOffers = offers.filter(offer => offer.status === 'pending');
  const acceptedOffers = offers.filter(offer => offer.status === 'accepted');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2d47] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-600">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">📈 Mercado de Ofertas</h2>
              <p className="text-gray-400 text-sm">{challengeTitle}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel izquierdo - Información del desafío */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">🎯 Desafío Original</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Predicción del creador:</span>
                    <span className="text-white font-medium">{creatorPrediction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Apuesta inicial:</span>
                    <span className="text-green-400 font-medium">${creatorStake} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total ofertas:</span>
                    <span className="text-blue-400 font-medium">{offers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ofertas pendientes:</span>
                    <span className="text-yellow-400 font-medium">{pendingOffers.length}</span>
                  </div>
                </div>
              </div>

              {/* Formulario para hacer oferta (solo si no es el creador) */}
              {!isCreator && onMakeOffer && (
                <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">💰 Hacer Oferta</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tu Predicción
                      </label>
                      <input
                        type="number"
                        value={offerPrediction}
                        onChange={(e) => setOfferPrediction(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        placeholder="Tu predicción contra la del creador"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cantidad a Apostar (USDC)
                      </label>
                      <input
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        placeholder="Ej: 50"
                        min="1"
                      />
                    </div>
                    <button
                      onClick={handleMakeOffer}
                      disabled={!offerAmount || !offerPrediction}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      🚀 Enviar Oferta
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Panel derecho - Lista de ofertas */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">📋 Ofertas Activas</h3>
                
                {pendingOffers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">📭</div>
                    <p>No hay ofertas pendientes</p>
                    {!isCreator && <p className="text-sm">¡Sé el primero en hacer una oferta!</p>}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingOffers.map((offer) => (
                      <div key={offer.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm text-gray-400">Ofertante: {offer.bidder}</div>
                            <div className="text-white font-medium">Predicción: {offer.prediction}</div>
                            <div className="text-green-400 font-medium">Apuesta: ${offer.amount} USDC</div>
                          </div>
                          <div className="text-xs text-gray-500">{offer.timestamp}</div>
                        </div>
                        
                        {isCreator && (
                          <div className="flex space-x-2 mt-3">
                            <button
                              onClick={() => onAcceptOffer(offer.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
                            >
                              ✅ Aceptar
                            </button>
                            <button
                              onClick={() => onRejectOffer(offer.id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded text-sm font-medium transition-colors"
                            >
                              ❌ Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ofertas aceptadas */}
              {acceptedOffers.length > 0 && (
                <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">✅ Ofertas Aceptadas</h3>
                  <div className="space-y-2">
                    {acceptedOffers.map((offer) => (
                      <div key={offer.id} className="bg-green-800/20 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-white font-medium">{offer.bidder}</div>
                            <div className="text-sm text-gray-400">
                              Predicción: {offer.prediction} | ${offer.amount} USDC
                            </div>
                          </div>
                          <div className="text-green-400 text-sm font-medium">ACEPTADA</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}