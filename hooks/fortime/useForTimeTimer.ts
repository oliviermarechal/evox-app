import { useState, useEffect, useRef, useCallback } from 'react';

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
  const [remainingMilliseconds, setRemainingMilliseconds] = useState(config.minutes * 60 * 1000 + config.seconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [isOnFire, setIsOnFire] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(true);
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setRemainingMilliseconds(prev => {
        const newRemaining = prev - 10;
        if (newRemaining <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setFinalTime(formatTime(config.minutes * 60 * 1000 + config.seconds * 1000));
          return 0;
        }
        // Effet "on fire" quand il reste moins de 10% du temps
        const totalTime = config.minutes * 60 * 1000 + config.seconds * 1000;
        if (newRemaining <= totalTime * 0.1 && !isOnFire) {
          setIsOnFire(true);
        }
        return newRemaining;
      });
    }, 10);
  }, [config.minutes, config.seconds, formatTime, isOnFire]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const incrementRound = useCallback(() => {
    setCurrentRound(prev => prev + 1);
  }, []);

  const finishTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setIsPaused(false);
    setFinalTime(formatTime(config.minutes * 60 * 1000 + config.seconds * 1000 - remainingMilliseconds));
  }, [remainingMilliseconds, config.minutes, config.seconds, formatTime]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingMilliseconds(config.minutes * 60 * 1000 + config.seconds * 1000);
    setFinalTime(null);
    setIsOnFire(false);
    setCurrentRound(0);
    hasAutoStarted.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [config.minutes, config.seconds]);


  // Auto-start timer when component mounts (only once)
  useEffect(() => {
    if (!hasAutoStarted.current) {
      hasAutoStarted.current = true;
      const timer = setTimeout(() => {
        startTimer();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const state: ForTimeTimerState = {
    remainingMilliseconds,
    isRunning,
    isPaused,
    finalTime,
    isOnFire,
    currentRound,
  };

  const actions: ForTimeTimerActions = {
    startTimer,
    pauseTimer,
    resetTimer,
    incrementRound,
    finishTimer,
  };

  return { state, actions, formatTime };
}
