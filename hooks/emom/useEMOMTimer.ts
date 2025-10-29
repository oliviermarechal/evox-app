import { useState, useEffect, useCallback, useRef } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEMOMTimer as useEMOMTimerService } from '@/hooks/useTimerService';

interface EMOMConfig {
  rounds: number;
  duration: number;
}

interface EMOMTimerState {
  remainingMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  finalTime: string | null;
  currentRound: number;
}

interface EMOMTimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  finishTimer: () => void;
  formatTime: (milliseconds: number) => string;
}

export function useEMOMTimer(config: EMOMConfig): EMOMTimerState & EMOMTimerActions {
  // Utiliser le nouveau service de timer
  const timer = useEMOMTimerService({
    rounds: config.rounds,
    duration: config.duration,
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

  return {
    remainingMilliseconds: timer.remainingMilliseconds,
    isRunning: timer.isRunning,
    isPaused: timer.isPaused,
    finalTime: timer.finalTime,
    currentRound: timer.currentRound,
    startTimer,
    pauseTimer,
    resetTimer,
    finishTimer,
    formatTime: timer.formatTime,
  };
}
