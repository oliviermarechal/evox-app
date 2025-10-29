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

  const finishTimer = useCallback(() => {
    timer.finishTimer();
  }, [timer]);

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
