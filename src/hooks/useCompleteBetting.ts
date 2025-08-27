import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';
import { BetType, ResolutionMode, OneVsOneMode, TournamentType } from '@/config/contracts';

export interface TournamentInfo {
  tournamentId: number;
  config: {
    tournamentType: TournamentType;
    resolutionMode: ResolutionMode;
    maxParticipants: number;
    allowIdenticalBets: boolean;
    registrationEndTime: number;
  };
  state: number; // TournamentState enum
  currentRound: number;
}

export interface GroupInfo {
  groupId: number;
  isPrivate: boolean;
  creator: string;
  members: string[];
}

export const useCompleteBetting = () => {
  const { bettingContract, usdcContract, account, isConnected, isCorrectNetwork, updateBalances } = useWeb3();
  const [loading, setLoading] = useState(false);

  // ============== FUNCIONES DE LECTURA AVANZADAS ===============

  const getProtocolInfo = useCallback(async () => {
    if (!bettingContract) throw new Error('Contrato no inicializado');

    try {
      const [
        oracleRole,
        maxParticipants,
        maxGroups,
        isPaused,
        generalFee,
        tournamentFee,
        feeRecipient,
        betCount,
        tournamentCount,
        topWinnersLarge,
        topWinnersSmall
      ] = await Promise.all([
        bettingContract.ORACLE_ROLE(),
        bettingContract.MAX_PARTICIPANTS_PER_GROUP(),
        bettingContract.MAX_GROUPS(),
        bettingContract.paused(),
        bettingContract.generalFee(),
        bettingContract.tournamentFee(),
        bettingContract.feeRecipient(),
        bettingContract.betCount(),
        bettingContract.tournamentCount(),
        bettingContract.topWinnersLargeTournaments(),
        bettingContract.topWinnersSmallTournaments()
      ]);

      return {
        oracleRole: oracleRole,
        maxParticipants: maxParticipants.toNumber(),
        maxGroups: maxGroups.toNumber(),
        isPaused,
        generalFee: generalFee.toNumber(),
        tournamentFee: tournamentFee.toNumber(),
        feeRecipient,
        betCount: betCount.toNumber(),
        tournamentCount: tournamentCount.toNumber(),
        topWinnersLarge: topWinnersLarge.toNumber(),
        topWinnersSmall: topWinnersSmall.toNumber()
      };
    } catch (error) {
      console.error('Error getting protocol info:', error);
      throw error;
    }
  }, [bettingContract]);

  const getTournamentInfo = useCallback(async (tournamentId: number): Promise<TournamentInfo> => {
    if (!bettingContract) throw new Error('Contrato no inicializado');

    try {
      const tournament = await bettingContract.tournaments(tournamentId);
      return {
        tournamentId,
        config: {
          tournamentType: tournament.config.tournamentType,
          resolutionMode: tournament.config.resolutionMode,
          maxParticipants: tournament.config.maxParticipants.toNumber(),
          allowIdenticalBets: tournament.config.allowIdenticalBets,
          registrationEndTime: tournament.config.registrationEndTime.toNumber()
        },
        state: tournament.state,
        currentRound: tournament.currentRound?.toNumber() || 0
      };
    } catch (error) {
      console.error(`Error getting tournament ${tournamentId}:`, error);
      throw error;
    }
  }, [bettingContract]);

  const getOracleData = useCallback(async () => {
    if (!bettingContract) throw new Error('Contrato no inicializado');

    try {
      const oracleData = await bettingContract.getLatestOracleData();
      return oracleData.toString();
    } catch (error) {
      console.error('Error getting oracle data:', error);
      throw error;
    }
  }, [bettingContract]);

  // ============== FUNCIONES AVANZADAS DE APUESTAS ===============

  const createPrivateGroup = useCallback(async (betId: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const createTx = await bettingContract.createPrivateGroup(betId);
      const receipt = await createTx.wait();

      const groupCreatedEvent = receipt.events?.find((event: any) => event.event === 'GroupCreated');
      const groupId = groupCreatedEvent ? groupCreatedEvent.args.groupId.toNumber() : null;

      await updateBalances();

      return {
        transaction: createTx,
        receipt,
        groupId
      };
    } catch (error) {
      console.error('Error creating private group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account, updateBalances]);

  const joinGroup = useCallback(async (betId: number, groupId: number, predictedValue: number) => {
    if (!bettingContract || !usdcContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      // Obtener información de la apuesta para el monto
      const bet = await bettingContract.bets(betId);
      const stakeAmountWei = bet.stakeAmount;

      // Aprobar USDC
      const approveTx = await usdcContract.approve(bettingContract.address, stakeAmountWei);
      await approveTx.wait();

      // Unirse al grupo
      const joinTx = await bettingContract.joinGroup(betId, groupId, predictedValue);
      const receipt = await joinTx.wait();

      await updateBalances();

      return {
        transaction: joinTx,
        receipt
      };
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, usdcContract, account, updateBalances]);

  const acceptOffer = useCallback(async (betId: number, offerIds: number[] = []) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const acceptTx = await bettingContract.acceptOffer(betId, offerIds);
      const receipt = await acceptTx.wait();

      return {
        transaction: acceptTx,
        receipt
      };
    } catch (error) {
      console.error('Error accepting offer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  // ============== FUNCIONES DE GESTIÓN DE APUESTAS ===============

  const lockBet = useCallback(async (betId: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const lockTx = await bettingContract.lockBet(betId);
      const receipt = await lockTx.wait();

      return {
        transaction: lockTx,
        receipt
      };
    } catch (error) {
      console.error('Error locking bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const cancelOneVsOneBet = useCallback(async (betId: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const cancelTx = await bettingContract.cancelOneVsOneBet(betId);
      const receipt = await cancelTx.wait();

      await updateBalances();

      return {
        transaction: cancelTx,
        receipt
      };
    } catch (error) {
      console.error('Error cancelling bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account, updateBalances]);

  const refundBet = useCallback(async (betId: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const refundTx = await bettingContract.refundBet(betId);
      const receipt = await refundTx.wait();

      await updateBalances();

      return {
        transaction: refundTx,
        receipt
      };
    } catch (error) {
      console.error('Error refunding bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account, updateBalances]);

  // ============== FUNCIONES DE RESOLUCIÓN (ORACLE ROLE) ===============

  const resolveSimpleBet = useCallback(async (betId: number, winningValue: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const resolveTx = await bettingContract.resolveSimpleBet(betId, winningValue);
      const receipt = await resolveTx.wait();

      return {
        transaction: resolveTx,
        receipt
      };
    } catch (error) {
      console.error('Error resolving simple bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const resolveOneVsOneBet = useCallback(async (betId: number, outcome: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const resolveTx = await bettingContract.resolveOneVsOneBet(betId, outcome);
      const receipt = await resolveTx.wait();

      return {
        transaction: resolveTx,
        receipt
      };
    } catch (error) {
      console.error('Error resolving 1vs1 bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const resolveBalancedGroupBet = useCallback(async (betId: number, winningValue: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const resolveTx = await bettingContract.resolveBalancedGroupBet(betId, winningValue);
      const receipt = await resolveTx.wait();

      return {
        transaction: resolveTx,
        receipt
      };
    } catch (error) {
      console.error('Error resolving group bet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  // ============== FUNCIONES DE TORNEOS ===============

  const registerForTournament = useCallback(async (tournamentId: number) => {
    if (!bettingContract || !usdcContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const registerTx = await bettingContract.registerForTournament(tournamentId);
      const receipt = await registerTx.wait();

      return {
        transaction: registerTx,
        receipt
      };
    } catch (error) {
      console.error('Error registering for tournament:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, usdcContract, account]);

  const startTournament = useCallback(async (tournamentId: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const startTx = await bettingContract.startTournament(tournamentId);
      const receipt = await startTx.wait();

      return {
        transaction: startTx,
        receipt
      };
    } catch (error) {
      console.error('Error starting tournament:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const pauseTournament = useCallback(async (tournamentId: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const pauseTx = await bettingContract.pauseTournament(tournamentId);
      const receipt = await pauseTx.wait();

      return {
        transaction: pauseTx,
        receipt
      };
    } catch (error) {
      console.error('Error pausing tournament:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const resumeTournament = useCallback(async (tournamentId: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const resumeTx = await bettingContract.resumeTournament(tournamentId);
      const receipt = await resumeTx.wait();

      return {
        transaction: resumeTx,
        receipt
      };
    } catch (error) {
      console.error('Error resuming tournament:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const cancelTournament = useCallback(async (tournamentId: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const cancelTx = await bettingContract.cancelTournament(tournamentId);
      const receipt = await cancelTx.wait();

      return {
        transaction: cancelTx,
        receipt
      };
    } catch (error) {
      console.error('Error cancelling tournament:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const resolveTournament = useCallback(async (tournamentId: number, winners: string[], isLarge: boolean) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const resolveTx = await bettingContract.resolveTournament(tournamentId, winners, isLarge);
      const receipt = await resolveTx.wait();

      return {
        transaction: resolveTx,
        receipt
      };
    } catch (error) {
      console.error('Error resolving tournament:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const updateLeaguePoints = useCallback(async (tournamentId: number, players: string[], points: number[]) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const updateTx = await bettingContract.updateLeaguePoints(tournamentId, players, points);
      const receipt = await updateTx.wait();

      return {
        transaction: updateTx,
        receipt
      };
    } catch (error) {
      console.error('Error updating league points:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const advanceKnockoutRound = useCallback(async (tournamentId: number, winners: string[]) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const advanceTx = await bettingContract.advanceKnockoutRound(tournamentId, winners);
      const receipt = await advanceTx.wait();

      return {
        transaction: advanceTx,
        receipt
      };
    } catch (error) {
      console.error('Error advancing knockout round:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  // ============== FUNCIONES DE ADMINISTRACIÓN ===============

  const setGeneralFee = useCallback(async (fee: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const setFeeTx = await bettingContract.setGeneralFee(fee);
      const receipt = await setFeeTx.wait();

      return {
        transaction: setFeeTx,
        receipt
      };
    } catch (error) {
      console.error('Error setting general fee:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const setTournamentFee = useCallback(async (fee: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const setFeeTx = await bettingContract.setTournamentFee(fee);
      const receipt = await setFeeTx.wait();

      return {
        transaction: setFeeTx,
        receipt
      };
    } catch (error) {
      console.error('Error setting tournament fee:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const pauseContract = useCallback(async () => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const pauseTx = await bettingContract.pause();
      const receipt = await pauseTx.wait();

      return {
        transaction: pauseTx,
        receipt
      };
    } catch (error) {
      console.error('Error pausing contract:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const unpauseContract = useCallback(async () => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const unpauseTx = await bettingContract.unpause();
      const receipt = await unpauseTx.wait();

      return {
        transaction: unpauseTx,
        receipt
      };
    } catch (error) {
      console.error('Error unpausing contract:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const setTopWinners = useCallback(async (large: number, small: number) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const setTx = await bettingContract.setTopWinners(large, small);
      const receipt = await setTx.wait();

      return {
        transaction: setTx,
        receipt
      };
    } catch (error) {
      console.error('Error setting top winners:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const setDistributionLarge = useCallback(async (distribution: number[]) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const setTx = await bettingContract.setDistributionLarge(distribution);
      const receipt = await setTx.wait();

      return {
        transaction: setTx,
        receipt
      };
    } catch (error) {
      console.error('Error setting large tournament distribution:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const setDistributionSmall = useCallback(async (distribution: number[]) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const setTx = await bettingContract.setDistributionSmall(distribution);
      const receipt = await setTx.wait();

      return {
        transaction: setTx,
        receipt
      };
    } catch (error) {
      console.error('Error setting small tournament distribution:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  const setDefaultOracle = useCallback(async (oracleAddress: string) => {
    if (!bettingContract || !account) throw new Error('Wallet no conectado');

    setLoading(true);
    try {
      const setTx = await bettingContract.setDefaultOracle(oracleAddress);
      const receipt = await setTx.wait();

      return {
        transaction: setTx,
        receipt
      };
    } catch (error) {
      console.error('Error setting default oracle:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract, account]);

  // ============== FUNCIONES DE CONTROL DE ACCESO ===============

  const grantRole = useCallback(async (role: string, account: string) => {
    if (!bettingContract) throw new Error('Contrato no inicializado');

    setLoading(true);
    try {
      const grantTx = await bettingContract.grantRole(role, account);
      const receipt = await grantTx.wait();

      return {
        transaction: grantTx,
        receipt
      };
    } catch (error) {
      console.error('Error granting role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract]);

  const revokeRole = useCallback(async (role: string, account: string) => {
    if (!bettingContract) throw new Error('Contrato no inicializado');

    setLoading(true);
    try {
      const revokeTx = await bettingContract.revokeRole(role, account);
      const receipt = await revokeTx.wait();

      return {
        transaction: revokeTx,
        receipt
      };
    } catch (error) {
      console.error('Error revoking role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [bettingContract]);

  const hasRole = useCallback(async (role: string, account: string): Promise<boolean> => {
    if (!bettingContract) throw new Error('Contrato no inicializado');

    try {
      return await bettingContract.hasRole(role, account);
    } catch (error) {
      console.error('Error checking role:', error);
      throw error;
    }
  }, [bettingContract]);

  return {
    loading,
    
    // Lectura
    getProtocolInfo,
    getTournamentInfo,
    getOracleData,
    
    // Apuestas avanzadas
    createPrivateGroup,
    joinGroup,
    acceptOffer,
    
    // Gestión
    lockBet,
    cancelOneVsOneBet,
    refundBet,
    
    // Resolución
    resolveSimpleBet,
    resolveOneVsOneBet,
    resolveBalancedGroupBet,
    
    // Torneos
    registerForTournament,
    startTournament,
    pauseTournament,
    resumeTournament,
    cancelTournament,
    resolveTournament,
    updateLeaguePoints,
    advanceKnockoutRound,
    
    // Administración
    setGeneralFee,
    setTournamentFee,
    setTopWinners,
    setDistributionLarge,
    setDistributionSmall,
    setDefaultOracle,
    pauseContract,
    unpauseContract,
    
    // Control de acceso
    grantRole,
    revokeRole,
    hasRole
  };
};