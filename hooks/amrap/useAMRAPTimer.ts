import { useState, useEffect, useRef, useCallback } from 'react';

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
  timerPosition: { x: number; y: number; width: number; height: number } | undefined;
}

export interface AMRAPTimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  incrementRound: () => void;
  setTimerPosition: (position: { x: number; y: number; width: number; height: number }) => void;
}

export function useAMRAPTimer(config: AMRAPConfig) {
  const [remainingMilliseconds, setRemainingMilliseconds] = useState(
    config.minutes * 60 * 1000 + config.seconds * 1000
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [isOnFire, setIsOnFire] = useState(false);
  const [timerPosition, setTimerPosition] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);

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
      intervalRef.current = setInterval(() => {
        setRemainingMilliseconds(prev => {
          const newRemaining = prev - 10;
          if (newRemaining <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setFinalTime(formatTime(config.minutes * 60 * 1000 + config.seconds * 1000));
            setIsOnFire(true);
            return 0;
          }
          return newRemaining;
        });
      }, 10);
    } else if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setRemainingMilliseconds(prev => {
          const newRemaining = prev - 10;
          if (newRemaining <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setFinalTime(formatTime(config.minutes * 60 * 1000 + config.seconds * 1000));
            setIsOnFire(true);
            return 0;
          }
          return newRemaining;
        });
      }, 10);
    }
  }, [isRunning, isPaused, config.minutes, config.seconds, formatTime]);

  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingMilliseconds(config.minutes * 60 * 1000 + config.seconds * 1000);
    setCurrentRound(1);
    setFinalTime(null);
    setIsOnFire(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [config.minutes, config.seconds]);

  const incrementRound = useCallback(() => {
    setCurrentRound(prev => prev + 1);
  }, []);

  // Auto-start timer when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startTimer();
    }, 500);
    return () => clearTimeout(timer);
  }, [startTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const state: AMRAPTimerState = {
    remainingMilliseconds,
    isRunning,
    isPaused,
    currentRound,
    finalTime,
    isOnFire,
    timerPosition,
  };

  const actions: AMRAPTimerActions = {
    startTimer,
    pauseTimer,
    resetTimer,
    incrementRound,
    setTimerPosition,
  };

  return { state, actions, formatTime };
}
