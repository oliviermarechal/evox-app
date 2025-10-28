import { useState, useEffect, useRef, useCallback } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

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
  const [remainingMilliseconds, setRemainingMilliseconds] = useState(
    config.minutes * 60 * 1000 + config.seconds * 1000
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [isOnFire, setIsOnFire] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
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
      setHasStarted(true);
      activateKeepAwakeAsync();
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
      activateKeepAwakeAsync();
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
      deactivateKeepAwake();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    deactivateKeepAwake();
    setRemainingMilliseconds(config.minutes * 60 * 1000 + config.seconds * 1000);
    setCurrentRound(1);
    setFinalTime(null);
    setIsOnFire(false);
    setHasStarted(false);
    hasAutoStarted.current = false; // Reset pour permettre le redémarrage auto
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [config.minutes, config.seconds]);

  const incrementRound = useCallback(() => {
    setCurrentRound(prev => prev + 1);
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
      deactivateKeepAwake();
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
    hasStarted,
  };

  const finishTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    deactivateKeepAwake();
    
    // Calculate total elapsed time
    const totalTime = (config.minutes * 60 + config.seconds) * 1000;
    const elapsed = totalTime - remainingMilliseconds;
    setFinalTime(formatTime(elapsed));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [config.minutes, config.seconds, remainingMilliseconds, formatTime]);

  const actions: AMRAPTimerActions = {
    startTimer,
    pauseTimer,
    resetTimer,
    incrementRound,
    finishTimer,
  };

  return { state, actions, formatTime };
}
