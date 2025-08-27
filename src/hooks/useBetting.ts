import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';
import { BetType, ResolutionMode, OneVsOneMode, TournamentType } from '@/config/contracts';

export interface BetInfo {
  id: number;
  betType: BetType;
  resolutionMode: ResolutionMode;
  stakeAmount: string;
  maxParticipants: number;
  locked: boolean;
  resolved: boolean;
  winningTeam: number;
  participants?: string[];
}

export const useBetting = () => {
  const { bettingContract, usdcContract, account, isConnected, isCorrectNetwork, updateBalances } = useWeb3();
  const [loading, setLoading] = useState(false);

  // Crear apuesta simple
  const createSimpleBet = useCallback(async (
    resolutionMode: ResolutionMode,
    stakeAmount: string,
    maxParticipants: number
  ) => {
    if (!bettingContract || !usdcContract || !account) {
      throw new Error('Wallet no conectado');
    }

    if (!isCorrectNetwork) {
      throw new Error('Red incorrecta');
    }

    setLoading(true);
    try {
      const stakeAmountWei = ethers.utils.parseEther(stakeAmount);

      // Aprobar USDC primero
      const approveTx = await usdcContract.approve(bettingContract.address, stakeAmountWei);
      await approveTx.wait();

      // Crear apuesta
      const createTx = await bettingContract.createSimpleBet(
        resolutionMode,
        stakeAmountWei,
        maxParticipants
      );

      const receipt = await createTx.wait();
      
      // Buscar el evento BetCreated
      const betCreatedEvent = receipt.events?.find((event: any) => event.event === 'BetCreated');
      const betId = betCreatedEvent ? betCreatedEvent.args.betId.toNumber() : null;

      await updateBalances();

      return {
        transaction: createTx,
        receipt,
        betId,
      };
    } catch (error) {
      console.error('Error creating simple bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, usdcContract, account, isCorrectNetwork, updateBalances]);

  // Unirse a una apuesta
  const joinBet = useCallback(async (betId: number, predictedValue: number) => {
    if (!bettingContract || !usdcContract || !account) {
      throw new Error('Wallet no conectado');
    }

    setLoading(true);
    try {
      // Obtener información de la apuesta para el monto
      const bet = await getBet(betId);
      const stakeAmountWei = ethers.utils.parseEther(bet.stakeAmount);

      // Aprobar USDC
      const approveTx = await usdcContract.approve(bettingContract.address, stakeAmountWei);
      await approveTx.wait();

      // Unirse a la apuesta
      const joinTx = await bettingContract.joinBet(betId, predictedValue);
      const receipt = await joinTx.wait();

      await updateBalances();

      return {
        transaction: joinTx,
        receipt,
      };
    } catch (error) {
      console.error('Error joining bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, usdcContract, account, updateBalances]);

  // Crear apuesta 1 vs 1
  const createOneVsOneBet = useCallback(async (
    prediction: number,
    stakeAmount: string,
    mode: OneVsOneMode
  ) => {
    if (!bettingContract || !usdcContract || !account) {
      throw new Error('Wallet no conectado');
    }

    setLoading(true);
    try {
      const stakeAmountWei = ethers.utils.parseEther(stakeAmount);
      
      // Aprobar USDC
      const approveTx = await usdcContract.approve(bettingContract.address, stakeAmountWei);
      await approveTx.wait();

      // Crear apuesta
      const createTx = await bettingContract.createOneVsOneBet(prediction, stakeAmountWei, mode);
      const receipt = await createTx.wait();

      const betCreatedEvent = receipt.events?.find((event: any) => event.event === 'OneVsOneBetCreated');
      const betId = betCreatedEvent ? betCreatedEvent.args.betId.toNumber() : null;

      await updateBalances();

      return {
        transaction: createTx,
        receipt,
        betId,
      };
    } catch (error) {
      console.error('Error creating 1 vs 1 bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, usdcContract, account, updateBalances]);

  // Hacer oferta contra apuesta 1 vs 1
  const offerAgainstBet = useCallback(async (betId: number, amount: string) => {
    if (!bettingContract || !usdcContract || !account) {
      throw new Error('Wallet no conectado');
    }

    setLoading(true);
    try {
      const amountWei = ethers.utils.parseEther(amount);
      
      // Aprobar USDC
      const approveTx = await usdcContract.approve(bettingContract.address, amountWei);
      await approveTx.wait();

      // Hacer oferta
      const offerTx = await bettingContract.offerAgainstBet(betId, amountWei);
      const receipt = await offerTx.wait();

      const offerMadeEvent = receipt.events?.find((event: any) => event.event === 'OfferMade');
      const offerId = offerMadeEvent ? offerMadeEvent.args.offerId.toNumber() : null;

      await updateBalances();

      return {
        transaction: offerTx,
        receipt,
        offerId,
      };
    } catch (error) {
      console.error('Error making offer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, usdcContract, account, updateBalances]);

  // Obtener información de una apuesta
  const getBet = useCallback(async (betId: number): Promise<BetInfo> => {
    if (!bettingContract) {
      throw new Error('Contrato no inicializado');
    }

    try {
      const bet = await bettingContract.bets(betId);
      return {
        id: betId,
        betType: bet.betType,
        resolutionMode: bet.resolutionMode,
        stakeAmount: ethers.utils.formatEther(bet.stakeAmount),
        maxParticipants: bet.maxParticipants,
        locked: bet.locked,
        resolved: bet.resolved,
        winningTeam: bet.winningTeam,
      };
    } catch (error) {
      console.error(`Error getting bet ${betId}:`, error);
      throw error;
    }
  }, [bettingContract]);

  // Obtener número total de apuestas
  const getBetCount = useCallback(async (): Promise<number> => {
    if (!bettingContract) {
      throw new Error('Contrato no inicializado');
    }

    try {
      const count = await bettingContract.betCount();
      return count.toNumber();
    } catch (error) {
      console.error('Error getting bet count:', error);
      throw error;
    }
  }, [bettingContract]);

  // Mintear USDC (solo para desarrollo)
  const mintUSDC = useCallback(async (amount: string) => {
    if (!bettingContract || !account) {
      throw new Error('Wallet no conectado');
    }

    setLoading(true);
    try {
      const amountWei = ethers.utils.parseEther(amount);
      const mintTx = await bettingContract.mintUSDC(account, amountWei);
      const receipt = await mintTx.wait();

      await updateBalances();

      return {
        transaction: mintTx,
        receipt,
      };
    } catch (error) {
      console.error('Error minting USDC:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account, updateBalances]);

  // Crear apuesta grupal balanceada
  const createBalancedGroupBet = useCallback(async (
    resolutionMode: ResolutionMode,
    stakeAmount: string,
    maxParticipants: number,
    groupSize: number
  ) => {
    if (!bettingContract || !usdcContract || !account) {
      throw new Error('Wallet no conectado');
    }

    setLoading(true);
    try {
      const stakeAmountWei = ethers.utils.parseEther(stakeAmount);
      
      // Aprobar USDC
      const approveTx = await usdcContract.approve(bettingContract.address, stakeAmountWei);
      await approveTx.wait();

      // Crear apuesta grupal
      const createTx = await bettingContract.createBalancedGroupBet(
        resolutionMode,
        stakeAmountWei,
        maxParticipants,
        groupSize
      );
      const receipt = await createTx.wait();

      const betCreatedEvent = receipt.events?.find((event: any) => event.event === 'BetCreated');
      const betId = betCreatedEvent ? betCreatedEvent.args.betId.toNumber() : null;

      await updateBalances();

      return {
        transaction: createTx,
        receipt,
        betId,
      };
    } catch (error) {
      console.error('Error creating group bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, usdcContract, account, updateBalances]);

  // Crear torneo
  const createTournament = useCallback(async (
    tournamentType: TournamentType,
    resolutionMode: ResolutionMode,
    maxParticipants: number,
    allowIdenticalBets: boolean,
    registrationEndTime: number
  ) => {
    if (!bettingContract || !account) {
      throw new Error('Wallet no conectado');
    }

    setLoading(true);
    try {
      const createTx = await bettingContract.createTournament(
        tournamentType,
        resolutionMode,
        maxParticipants,
        allowIdenticalBets,
        registrationEndTime
      );
      const receipt = await createTx.wait();

      const tournamentCreatedEvent = receipt.events?.find((event: any) => event.event === 'TournamentCreated');
      const tournamentId = tournamentCreatedEvent ? tournamentCreatedEvent.args.tournamentId.toNumber() : null;

      return {
        transaction: createTx,
        receipt,
        tournamentId,
      };
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  return {
    loading,
    createSimpleBet,
    joinBet,
    createOneVsOneBet,
    offerAgainstBet,
    createBalancedGroupBet,
    createTournament,
    getBet,
    getBetCount,
    mintUSDC,
  };
};