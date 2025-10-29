import { useState, useEffect, useCallback, useRef } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useTabataTimer as useTabataTimerService } from '@/hooks/useTimerService';

interface TabataConfig {
  rounds: number;
  workTime: number;
  restTime: number;
}

interface TabataTimerState {
  remainingMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  finalTime: string | null;
  currentRound: number;
  isWorkPhase: boolean;
  phaseTimeRemaining: number;
}

interface TabataTimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  finishTimer: () => void;
  formatTime: (milliseconds: number) => string;
}

export function useTabataTimer(config: TabataConfig): TabataTimerState & TabataTimerActions {
  // Utiliser le nouveau service de timer
  const timer = useTabataTimerService({
    rounds: config.rounds,
    workTime: config.workTime,
    restTime: config.restTime,
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
    isWorkPhase: timer.isWorkPhase,
    phaseTimeRemaining: timer.phaseTimeRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    finishTimer,
    formatTime: timer.formatTime,
  };
}
