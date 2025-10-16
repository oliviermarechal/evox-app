import { useState, useEffect, useRef, useCallback } from 'react';

export interface FreeTimerState {
  totalMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  finalTime: string | null;
  isOnFire: boolean;
  currentRound: number;
  timerPosition: { x: number; y: number; width: number; height: number } | undefined;
}

export interface FreeTimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  incrementRound: () => void;
  setTimerPosition: (position: { x: number; y: number; width: number; height: number }) => void;
  finishTimer: () => void;
}

export function useFreeTimer() {
  const [totalMilliseconds, setTotalMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [isOnFire, setIsOnFire] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [timerPosition, setTimerPosition] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);
  const hasAutoStarted = useRef(false);

  const intervalRef = useRef<any>(null);

  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  const startTimer = useCallback(() => {
    if (!isRunning && !isPaused) {
      setIsRunning(true);
      setTotalMilliseconds(0); // Reset to 0 when starting fresh
      intervalRef.current = setInterval(() => {
        setTotalMilliseconds(prev => {
          const newTotal = prev + 10;
          // Effet "on fire" après 1 heure
          if (newTotal >= 3600000 && !isOnFire) {
            setIsOnFire(true);
          }
          return newTotal;
        });
      }, 10);
    } else if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTotalMilliseconds(prev => {
          const newTotal = prev + 10;
          // Effet "on fire" après 1 heure
          if (newTotal >= 3600000 && !isOnFire) {
            setIsOnFire(true);
          }
          return newTotal;
        });
      }, 10);
    }
  }, [isRunning, isPaused, isOnFire]);

  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRunning]);

  const incrementRound = useCallback(() => {
    setCurrentRound(prev => prev + 1);
  }, []);

  const finishTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setIsPaused(false);
    setFinalTime(formatTime(totalMilliseconds));
  }, [totalMilliseconds, formatTime]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTotalMilliseconds(0);
    setFinalTime(null);
    setIsOnFire(false);
    setCurrentRound(0);
    hasAutoStarted.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Auto-start timer when component mounts (only once)
  useEffect(() => {
    if (!hasAutoStarted.current) {
      hasAutoStarted.current = true;
      const timer = setTimeout(() => {
        startTimer();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []); // Dépendances vides pour ne se déclencher qu'une fois

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const state: FreeTimerState = {
    totalMilliseconds,
    isRunning,
    isPaused,
    finalTime,
    isOnFire,
    currentRound,
    timerPosition,
  };

  const actions: FreeTimerActions = {
    startTimer,
    pauseTimer,
    resetTimer,
    incrementRound,
    setTimerPosition,
    finishTimer,
  };

  return { state, actions, formatTime };
}
