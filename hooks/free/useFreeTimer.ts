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
  const [preciseMilliseconds, setPreciseMilliseconds] = useState(0);
  const hasAutoStarted = useRef(false);

  const timer = useIncrementTimer({});

  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (!timer.isRunning) return;

    const interval = setInterval(() => {
      // Accéder aux propriétés internes du timer
      const internalState = timer.getInternalState?.();
      if (internalState) {
        const now = Date.now();
        const elapsedMs = now - internalState.startTime - internalState.totalPausedDuration;
        setPreciseMilliseconds(Math.max(0, elapsedMs));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [timer.isRunning, timer]);

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
    setFinalTime(formatTime(preciseMilliseconds));
  }, [timer, formatTime, preciseMilliseconds]);

  const resetTimer = useCallback(() => {
    timer.reset();
    setFinalTime(null);
    setCurrentRound(0);
    setPreciseMilliseconds(0);
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
    totalMilliseconds: preciseMilliseconds,
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
