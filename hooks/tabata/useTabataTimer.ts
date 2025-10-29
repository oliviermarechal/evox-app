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
    isWorkPhase: timer.isWorkPhase,
    phaseTimeRemaining: timer.phaseTimeRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    finishTimer,
    formatTime: timer.formatTime,
  };
}
