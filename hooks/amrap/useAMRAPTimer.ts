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

  const startTimer = useCallback(() => {
    timer.startTimer();
    activateKeepAwakeAsync();
  }, [timer]);

  const pauseTimer = useCallback(() => {
    timer.pauseTimer();
    deactivateKeepAwake();
  }, [timer]);

  const resetTimer = useCallback(() => {
    timer.resetTimer();
    deactivateKeepAwake();
  }, [timer]);

  const incrementRound = useCallback(() => {
    timer.incrementRound();
  }, [timer]);

  const finishTimer = useCallback(() => {
    timer.finishTimer();
    deactivateKeepAwake();
  }, [timer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      deactivateKeepAwake();
    };
  }, []);

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
