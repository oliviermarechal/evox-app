import { useState, useEffect, useRef, useCallback } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useIncrementTimer } from '@/hooks/useTimerService';

export interface FreeTimerState {
  totalMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  finalTime: string | null;
  currentRound: number;
}

export interface FreeTimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  incrementRound: () => void;
  finishTimer: () => void;
}

export function useFreeTimer() {
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const hasAutoStarted = useRef(false);

  const timer = useIncrementTimer({});

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
  }, []);

  // Utiliser directement elapsedTime du timer au lieu de recalculer
  const totalMilliseconds = timer.elapsedTime * 1000;

  // Activer le keep awake dès le montage du composant et le garder actif même en pause
  useEffect(() => {
    activateKeepAwakeAsync();
    
    // Désactiver uniquement au démontage
    return () => {
      deactivateKeepAwake();
    };
  }, []);

  const startTimer = useCallback(() => {
    timer.start();
  }, [timer]);

  const pauseTimer = useCallback(() => {
    timer.pause();
  }, [timer]);

  const incrementRound = useCallback(() => {
    setCurrentRound(prev => prev + 1);
  }, []);

  const finishTimer = useCallback(() => {
    timer.pause();
    setFinalTime(formatTime(timer.elapsedTime));
  }, [timer, formatTime]);

  const resetTimer = useCallback(() => {
    timer.reset();
    setFinalTime(null);
    setCurrentRound(0);
    hasAutoStarted.current = false;
  }, [timer]);

  useEffect(() => {
    if (!hasAutoStarted.current) {
      hasAutoStarted.current = true;
      const timer = setTimeout(() => {
        startTimer();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const state: FreeTimerState = {
    totalMilliseconds: totalMilliseconds,
    isRunning: timer.isRunning,
    isPaused: timer.isPaused,
    finalTime,
    currentRound,
  };

  const actions: FreeTimerActions = {
    startTimer,
    pauseTimer,
    resetTimer,
    incrementRound,
    finishTimer,
  };

  return { state, actions, formatTime };
}
