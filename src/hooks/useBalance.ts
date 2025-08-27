'use client'

import { useState, useEffect } from 'react';
import { UserBalance, Transaction } from '@/types/betting';

interface UseBalanceReturn {
  balance: UserBalance;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateBalance: (amount: number, type: 'bet' | 'win' | 'deposit') => void;
  isLoading: boolean;
}

const initialBalance: UserBalance = {
  usdc: '1,250.00',
  locked: '350.00',
  available: '900.00',
  pendingRewards: '125.50'
};

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'BET_WON',
    betId: '3',
    betTitle: 'Champions League Final',
    amount: '+125.75',
    date: '2024-01-27',
    status: 'COMPLETED'
  },
  {
    id: '2',
    type: 'BET_PLACED',
    betId: '1',
    betTitle: 'Real Madrid vs Barcelona',
    amount: '-100.00',
    date: '2024-01-28',
    status: 'COMPLETED'
  },
  {
    id: '3',
    type: 'BET_PLACED',
    betId: '2',
    betTitle: 'Lakers vs Warriors',
    amount: '-200.00',
    date: '2024-01-27',
    status: 'COMPLETED'
  }
];

export function useBalance(): UseBalanceReturn {
  const [balance, setBalance] = useState<UserBalance>(initialBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isLoading, setIsLoading] = useState(false);

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: (Date.now() + Math.random()).toString(),
      date: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      status: 'COMPLETED'
    };

    setTransactions(prev => [transaction, ...prev]);
    
    // Actualizar balance basado en el tipo de transacción
    const amount = parseFloat(newTransaction.amount.replace(/[+\-$,]/g, ''));
    
    if (newTransaction.type === 'BET_PLACED') {
      updateBalance(-amount, 'bet');
    } else if (newTransaction.type === 'BET_WON' || newTransaction.type === 'REWARD_CLAIMED') {
      updateBalance(amount, 'win');
    }
  };

  const updateBalance = (amount: number, type: 'bet' | 'win' | 'deposit') => {
    setBalance(prev => {
      const currentAvailable = parseFloat(prev.available.replace(/[,$]/g, ''));
      const currentLocked = parseFloat(prev.locked.replace(/[,$]/g, ''));
      const currentUsdc = parseFloat(prev.usdc.replace(/[,$]/g, ''));

      let newAvailable = currentAvailable;
      let newLocked = currentLocked;
      let newUsdc = currentUsdc;

      switch (type) {
        case 'bet':
          // Apostar: mover dinero de disponible a bloqueado
          newAvailable = Math.max(0, currentAvailable - amount);
          newLocked = currentLocked + amount;
          break;
        case 'win':
          // Ganar: mover dinero de bloqueado a disponible
          newLocked = Math.max(0, currentLocked - amount);
          newAvailable = currentAvailable + amount;
          newUsdc = currentUsdc + amount;
          break;
        case 'deposit':
          // Depósito: agregar directamente a disponible
          newAvailable = currentAvailable + amount;
          newUsdc = currentUsdc + amount;
          break;
      }

      return {
        ...prev,
        available: newAvailable.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        locked: newLocked.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        usdc: newUsdc.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      };
    });
  };

  // Simular carga inicial
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    balance,
    transactions,
    addTransaction,
    updateBalance,
    isLoading
  };
}