import { useState, useEffect, useRef, useCallback } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useForTimeTimer as useForTimeTimerService } from '@/hooks/useTimerService';

export interface ForTimeConfig {
  minutes: number;
  seconds: number;
}

export interface ForTimeTimerState {
  remainingMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  finalTime: string | null;
  isOnFire: boolean;
  currentRound: number;
}

export interface ForTimeTimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  incrementRound: () => void;
  finishTimer: () => void;
}

export function useForTimeTimer(config: ForTimeConfig) {
  // Utiliser le nouveau service de timer
  const timer = useForTimeTimerService({
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

  const state: ForTimeTimerState = {
    remainingMilliseconds: timer.remainingMilliseconds,
    isRunning: timer.isRunning,
    isPaused: timer.isPaused,
    finalTime: timer.finalTime,
    isOnFire: timer.isOnFire,
    currentRound: timer.currentRound,
  };

  const actions: ForTimeTimerActions = {
    startTimer,
    pauseTimer,
    resetTimer,
    incrementRound,
    finishTimer,
  };

  return { state, actions, formatTime: timer.formatTime };
}
