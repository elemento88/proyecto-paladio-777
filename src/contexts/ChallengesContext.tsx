'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { BettingChallenge } from '@/types/betting';

interface ChallengesContextType {
  challenges: BettingChallenge[];
  setChallenges: (challenges: BettingChallenge[]) => void;
  addChallenge: (challenge: BettingChallenge) => void;
  updateChallenge: (id: string, challenge: Partial<BettingChallenge>) => void;
  removeChallenge: (id: string) => void;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

export function ChallengesProvider({ children }: { children: React.ReactNode }) {
  const [challenges, setChallenges] = useState<BettingChallenge[]>([]);

  const addChallenge = (challenge: BettingChallenge) => {
    setChallenges(prev => [challenge, ...prev]);
  };

  const updateChallenge = (id: string, updatedChallenge: Partial<BettingChallenge>) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, ...updatedChallenge }
          : challenge
      )
    );
  };

  const removeChallenge = (id: string) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== id));
  };

  return (
    <ChallengesContext.Provider value={{
      challenges,
      setChallenges,
      addChallenge,
      updateChallenge,
      removeChallenge
    }}>
      {children}
    </ChallengesContext.Provider>
  );
}

export function useChallenges() {
  const context = useContext(ChallengesContext);
  if (context === undefined) {
    // Devolver valores por defecto si no está dentro del provider
    return {
      challenges: [],
      setChallenges: () => {},
      addChallenge: () => {},
      updateChallenge: () => {},
      removeChallenge: () => {}
    };
  }
  return context;
}