import { useState, useEffect, useRef, useCallback } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useAMRAPTimer as useAMRAPTimerService } from '@/hooks/useTimerService';

export interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

export interface AMRAPTimerState {
  remainingMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  currentRound: number;
  finalTime: string | null;
  isOnFire: boolean;
  hasStarted: boolean;
}

export interface AMRAPTimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  incrementRound: () => void;
  finishTimer: () => void;
}

export function useAMRAPTimer(config: AMRAPConfig) {
  // Utiliser le nouveau service de timer
  const timer = useAMRAPTimerService({
    minutes: config.minutes,
    seconds: config.seconds,
  });

  // Activer le keep awake dès le montage du composant et le garder actif même en pause
  useEffect(() => {
    activateKeepAwakeAsync();
    
    // Désactiver uniquement au démontage
    return () => {
      deactivateKeepAwake();
    };
  }, []);

  const startTimer = useCallback(() => {
    timer.startTimer();
  }, [timer]);

  const pauseTimer = useCallback(() => {
    timer.pauseTimer();
  }, [timer]);

  const resetTimer = useCallback(() => {
    timer.resetTimer();
  }, [timer]);

  const incrementRound = useCallback(() => {
    timer.incrementRound();
  }, [timer]);

  const finishTimer = useCallback(() => {
    timer.finishTimer();
  }, [timer]);

  const state: AMRAPTimerState = {
    remainingMilliseconds: timer.remainingMilliseconds,
    isRunning: timer.isRunning,
    isPaused: timer.isPaused,
    currentRound: timer.currentRound,
    finalTime: timer.finalTime,
    isOnFire: timer.isOnFire,
    hasStarted: timer.hasStarted,
  };

  const actions: AMRAPTimerActions = {
    startTimer,
    pauseTimer,
    resetTimer,
    incrementRound,
    finishTimer,
  };

  return { state, actions, formatTime: timer.formatTime };
}
