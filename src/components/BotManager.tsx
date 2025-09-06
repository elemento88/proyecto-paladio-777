import { useState, useEffect } from 'react'
import { useBots } from '@/hooks/useBots'
import { useAuth } from '@/hooks/useAuth'

interface BotManagerProps {
  isOpen: boolean
  onClose: () => void
}

export default function BotManager({ isOpen, onClose }: BotManagerProps) {
  const { user } = useAuth()
  const { 
    bots, 
    loading, 
    createBot, 
    createMultipleBots, 
    deleteBot, 
    addBotBalance,
    getTotalBots,
    getTotalBotBalance,
    getActiveBots,
    getBotsByType
  } = useBots()

  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'manage'>('overview')
  const [createForm, setCreateForm] = useState({
    count: 5,
    botType: 'random' as 'aggressive' | 'conservative' | 'random' | 'smart',
    initialBalance: 100,
    singleBotName: ''
  })
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreateSingleBot = async () => {
    const result = await createBot({
      username: createForm.singleBotName || undefined,
      botType: createForm.botType,
      initialBalance: createForm.initialBalance
    })

    if (result.error) {
      showMessage('error', result.error)
    } else {
      showMessage('success', `Bot creado: ${result.data?.username}`)
      setCreateForm(prev => ({ ...prev, singleBotName: '' }))
    }
  }

  const handleCreateMultipleBots = async () => {
    const result = await createMultipleBots({
      count: createForm.count,
      botType: createForm.botType,
      initialBalance: createForm.initialBalance
    })

    if (result.error) {
      showMessage('error', result.error)
    } else {
      showMessage('success', `${result.data?.created_count} bots creados de ${result.data?.requested_count} solicitados`)
    }
  }

  const handleDeleteBot = async (botId: string, botUsername: string) => {
    if (!confirm(`¿Estás seguro de eliminar el bot "${botUsername}"?`)) return

    const result = await deleteBot(botId)
    if (result.error) {
      showMessage('error', result.error)
    } else {
      showMessage('success', `Bot "${botUsername}" eliminado`)
    }
  }

  const handleAddBalance = async (botId: string, amount: number) => {
    const result = await addBotBalance(botId, amount)
    if (result.error) {
      showMessage('error', result.error)
    } else {
      showMessage('success', `$${amount} USDC agregado al bot`)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1d29] border border-gray-700 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Gestión de Bots</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500 text-green-400'
              : 'bg-red-500/10 border border-red-500 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          {[
            { id: 'overview', name: 'Resumen' },
            { id: 'create', name: 'Crear Bots' },
            { id: 'manage', name: 'Gestionar' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#2a2d3a] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Bots</h3>
                <p className="text-3xl font-bold text-blue-400">{getTotalBots()}</p>
              </div>
              <div className="bg-[#2a2d3a] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Bots Activos</h3>
                <p className="text-3xl font-bold text-green-400">{getActiveBots().length}</p>
              </div>
              <div className="bg-[#2a2d3a] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Balance Total</h3>
                <p className="text-3xl font-bold text-yellow-400">${getTotalBotBalance().toFixed(2)}</p>
              </div>
              <div className="bg-[#2a2d3a] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Promedio Win Rate</h3>
                <p className="text-3xl font-bold text-purple-400">
                  {bots.length > 0 
                    ? (bots.reduce((sum, bot) => sum + bot.stats.win_rate, 0) / bots.length).toFixed(1)
                    : '0.0'
                  }%
                </p>
              </div>
            </div>

            {/* Bot Types Distribution */}
            <div className="bg-[#2a2d3a] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Distribución por Tipo</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['aggressive', 'conservative', 'random', 'smart'].map(type => (
                  <div key={type} className="text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {getBotsByType(type).length}
                    </p>
                    <p className="text-sm text-gray-400 capitalize">{type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Single Bot Creation */}
            <div className="bg-[#2a2d3a] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Crear Bot Individual</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Nombre (opcional)"
                  value={createForm.singleBotName}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, singleBotName: e.target.value }))}
                  className="bg-[#1a1d29] border border-gray-600 rounded px-3 py-2 text-white"
                />
                <select
                  value={createForm.botType}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, botType: e.target.value as any }))}
                  className="bg-[#1a1d29] border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="random">Aleatorio</option>
                  <option value="aggressive">Agresivo</option>
                  <option value="conservative">Conservador</option>
                  <option value="smart">Inteligente</option>
                </select>
                <input
                  type="number"
                  placeholder="Balance inicial"
                  value={createForm.initialBalance}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, initialBalance: Number(e.target.value) }))}
                  className="bg-[#1a1d29] border border-gray-600 rounded px-3 py-2 text-white"
                  min="1"
                />
                <button
                  onClick={handleCreateSingleBot}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded transition-colors"
                >
                  {loading ? 'Creando...' : 'Crear Bot'}
                </button>
              </div>
            </div>

            {/* Multiple Bots Creation */}
            <div className="bg-[#2a2d3a] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Crear Múltiples Bots</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={createForm.count}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, count: Number(e.target.value) }))}
                  className="bg-[#1a1d29] border border-gray-600 rounded px-3 py-2 text-white"
                  min="1"
                  max="20"
                />
                <select
                  value={createForm.botType}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, botType: e.target.value as any }))}
                  className="bg-[#1a1d29] border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="random">Tipos Aleatorios</option>
                  <option value="aggressive">Todos Agresivos</option>
                  <option value="conservative">Todos Conservadores</option>
                  <option value="smart">Todos Inteligentes</option>
                </select>
                <input
                  type="number"
                  placeholder="Balance inicial c/u"
                  value={createForm.initialBalance}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, initialBalance: Number(e.target.value) }))}
                  className="bg-[#1a1d29] border border-gray-600 rounded px-3 py-2 text-white"
                  min="1"
                />
                <button
                  onClick={handleCreateMultipleBots}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded transition-colors"
                >
                  {loading ? 'Creando...' : `Crear ${createForm.count} Bots`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Cargando bots...</p>
              </div>
            ) : bots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No tienes bots creados aún</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Crear tu primer bot
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {bots.map((bot) => (
                  <div key={bot.id} className="bg-[#2a2d3a] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{bot.avatar_url}</span>
                        <div>
                          <h4 className="font-semibold text-white">{bot.username}</h4>
                          <p className="text-sm text-gray-400 capitalize">Tipo: {bot.bot_type}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBot(bot.id, bot.username)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Balance</p>
                        <p className="font-semibold text-green-400">${bot.balance_usdc.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Bloqueado</p>
                        <p className="font-semibold text-yellow-400">${bot.balance_locked.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Apuestas</p>
                        <p className="font-semibold text-blue-400">{bot.stats.total_bets}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Win Rate</p>
                        <p className="font-semibold text-purple-400">{bot.stats.win_rate.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddBalance(bot.id, 50)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded"
                      >
                        +$50
                      </button>
                      <button
                        onClick={() => handleAddBalance(bot.id, 100)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                      >
                        +$100
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}