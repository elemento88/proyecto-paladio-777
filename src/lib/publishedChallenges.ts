'use client'

export interface PublishedChallenge {
  id: string
  title: string
  type: 'battle-royal' | 'group-balanced' | 'prediction'
  description: string
  matchData: {
    id: string
    title: string
    teams: {
      home: string
      away: string
    }
    date: string
    time: string
    league: string
    sport: string
  }
  betConfig: {
    title: string
    description: string
    type: string
    options: string[]
  }
  selectedPredictions: Array<{
    id: string
    betOptionId: string
    selectedOption: string
    value?: string
  }>
  modality: string
  resolutionMode: string
  entryAmount: string
  createdAt: string
  createdBy: string
  status: 'active' | 'full' | 'ended'
  participants: number
  maxParticipants: number
  prize: string
}

class PublishedChallengesManager {
  private storageKey = 'published_challenges'

  // Obtener todos los retos publicados
  getAllChallenges(): PublishedChallenge[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading published challenges:', error)
      return []
    }
  }

  // Publicar un nuevo reto
  publishChallenge(challenge: Omit<PublishedChallenge, 'id' | 'createdAt' | 'status' | 'participants'>): PublishedChallenge {
    const newChallenge: PublishedChallenge = {
      ...challenge,
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      participants: 1 // El creador es el primer participante
    }

    const challenges = this.getAllChallenges()
    challenges.unshift(newChallenge) // Añadir al principio

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(challenges))
      console.log('✅ Challenge published:', newChallenge.id)
      return newChallenge
    } catch (error) {
      console.error('Error saving published challenge:', error)
      throw error
    }
  }

  // Obtener retos por partido específico
  getChallengesByMatch(matchId: string): PublishedChallenge[] {
    return this.getAllChallenges().filter(challenge =>
      challenge.matchData.id === matchId
    )
  }

  // Obtener retos por deporte
  getChallengesBySport(sport: string): PublishedChallenge[] {
    return this.getAllChallenges().filter(challenge =>
      challenge.matchData.sport === sport
    )
  }

  // Obtener retos por liga
  getChallengesByLeague(league: string): PublishedChallenge[] {
    return this.getAllChallenges().filter(challenge =>
      challenge.matchData.league === league
    )
  }

  // Obtener retos creados por el usuario
  getUserChallenges(userId: string): PublishedChallenge[] {
    return this.getAllChallenges().filter(challenge =>
      challenge.createdBy === userId
    )
  }

  // Obtener retos activos
  getActiveChallenges(): PublishedChallenge[] {
    return this.getAllChallenges().filter(challenge =>
      challenge.status === 'active'
    )
  }

  // Unirse a un reto
  joinChallenge(challengeId: string, userId: string): boolean {
    const challenges = this.getAllChallenges()
    const challengeIndex = challenges.findIndex(c => c.id === challengeId)

    if (challengeIndex === -1) return false

    const challenge = challenges[challengeIndex]

    if (challenge.status !== 'active' || challenge.participants >= challenge.maxParticipants) {
      return false
    }

    challenge.participants += 1

    if (challenge.participants >= challenge.maxParticipants) {
      challenge.status = 'full'
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(challenges))
      console.log(`✅ User ${userId} joined challenge ${challengeId}`)
      return true
    } catch (error) {
      console.error('Error joining challenge:', error)
      return false
    }
  }

  // Actualizar estado de un reto
  updateChallengeStatus(challengeId: string, status: PublishedChallenge['status']): boolean {
    const challenges = this.getAllChallenges()
    const challengeIndex = challenges.findIndex(c => c.id === challengeId)

    if (challengeIndex === -1) return false

    challenges[challengeIndex].status = status

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(challenges))
      console.log(`✅ Challenge ${challengeId} status updated to ${status}`)
      return true
    } catch (error) {
      console.error('Error updating challenge status:', error)
      return false
    }
  }

  // Eliminar un reto
  deleteChallenge(challengeId: string, userId: string): boolean {
    const challenges = this.getAllChallenges()
    const challengeIndex = challenges.findIndex(c => c.id === challengeId)

    if (challengeIndex === -1) return false

    const challenge = challenges[challengeIndex]

    // Solo el creador puede eliminar el reto
    if (challenge.createdBy !== userId) return false

    challenges.splice(challengeIndex, 1)

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(challenges))
      console.log(`✅ Challenge ${challengeId} deleted by ${userId}`)
      return true
    } catch (error) {
      console.error('Error deleting challenge:', error)
      return false
    }
  }

  // Limpiar todos los retos (para debugging)
  clearAllChallenges(): void {
    try {
      localStorage.removeItem(this.storageKey)
      console.log('✅ All published challenges cleared')
    } catch (error) {
      console.error('Error clearing challenges:', error)
    }
  }
}

export const publishedChallenges = new PublishedChallengesManager()