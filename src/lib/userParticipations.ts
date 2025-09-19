'use client'

export interface UserParticipation {
  id: string
  userId: string
  challengeId: string
  joinedAt: string
  predictions?: Array<{
    betOptionId: string
    selectedOption: string
    value?: string
  }>
  entryAmount: string
  status: 'active' | 'won' | 'lost' | 'pending'
  position?: number
  payout?: string
}

class UserParticipationsManager {
  private storageKey = 'user_participations'

  // Obtener todas las participaciones
  getAllParticipations(): UserParticipation[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading user participations:', error)
      return []
    }
  }

  // Unirse a un reto
  joinChallenge(
    userId: string,
    challengeId: string,
    entryAmount: string,
    predictions?: UserParticipation['predictions']
  ): UserParticipation {
    const participation: UserParticipation = {
      id: `participation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      challengeId,
      joinedAt: new Date().toISOString(),
      predictions,
      entryAmount,
      status: 'active'
    }

    const participations = this.getAllParticipations()
    participations.unshift(participation) // Añadir al principio

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(participations))
      console.log('✅ User joined challenge:', participation.id)
      return participation
    } catch (error) {
      console.error('Error saving participation:', error)
      throw error
    }
  }

  // Obtener participaciones de un usuario
  getUserParticipations(userId: string): UserParticipation[] {
    return this.getAllParticipations().filter(p => p.userId === userId)
  }

  // Obtener participaciones activas de un usuario
  getUserActiveParticipations(userId: string): UserParticipation[] {
    return this.getUserParticipations(userId).filter(p => p.status === 'active')
  }

  // Obtener participaciones en un reto específico
  getChallengeParticipations(challengeId: string): UserParticipation[] {
    return this.getAllParticipations().filter(p => p.challengeId === challengeId)
  }

  // Verificar si un usuario ya está en un reto
  isUserInChallenge(userId: string, challengeId: string): boolean {
    return this.getAllParticipations().some(p =>
      p.userId === userId && p.challengeId === challengeId
    )
  }

  // Actualizar estado de participación
  updateParticipationStatus(
    participationId: string,
    status: UserParticipation['status'],
    position?: number,
    payout?: string
  ): boolean {
    const participations = this.getAllParticipations()
    const participationIndex = participations.findIndex(p => p.id === participationId)

    if (participationIndex === -1) return false

    participations[participationIndex].status = status
    if (position !== undefined) participations[participationIndex].position = position
    if (payout !== undefined) participations[participationIndex].payout = payout

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(participations))
      console.log(`✅ Participation ${participationId} updated to ${status}`)
      return true
    } catch (error) {
      console.error('Error updating participation:', error)
      return false
    }
  }

  // Obtener estadísticas del usuario
  getUserStats(userId: string) {
    const participations = this.getUserParticipations(userId)

    return {
      total: participations.length,
      active: participations.filter(p => p.status === 'active').length,
      won: participations.filter(p => p.status === 'won').length,
      lost: participations.filter(p => p.status === 'lost').length,
      pending: participations.filter(p => p.status === 'pending').length,
      totalStaked: participations.reduce((sum, p) => sum + parseFloat(p.entryAmount), 0),
      totalWinnings: participations
        .filter(p => p.status === 'won' && p.payout)
        .reduce((sum, p) => sum + parseFloat(p.payout || '0'), 0)
    }
  }

  // Eliminar participación
  removeParticipation(participationId: string, userId: string): boolean {
    const participations = this.getAllParticipations()
    const participationIndex = participations.findIndex(p =>
      p.id === participationId && p.userId === userId
    )

    if (participationIndex === -1) return false

    participations.splice(participationIndex, 1)

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(participations))
      console.log(`✅ Participation ${participationId} removed`)
      return true
    } catch (error) {
      console.error('Error removing participation:', error)
      return false
    }
  }

  // Limpiar todas las participaciones (para debugging)
  clearAllParticipations(): void {
    try {
      localStorage.removeItem(this.storageKey)
      console.log('✅ All participations cleared')
    } catch (error) {
      console.error('Error clearing participations:', error)
    }
  }
}

export const userParticipations = new UserParticipationsManager()