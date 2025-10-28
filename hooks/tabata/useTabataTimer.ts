import { useState, useEffect, useCallback, useRef } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

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
  const [remainingMilliseconds, setRemainingMilliseconds] = useState(config.workTime * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(config.workTime * 1000);
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const currentPhaseRef = useRef<boolean>(true);
  const currentRoundRef = useRef<number>(1);

  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (isPaused) {
      // Resume from paused time
      const pausedDuration = Date.now() - pausedTimeRef.current;
      startTimeRef.current += pausedDuration;
    } else {
      // Start fresh
      startTimeRef.current = Date.now();
    }
    
    setIsRunning(true);
    setIsPaused(false);
    activateKeepAwakeAsync();
    
    intervalRef.current = setInterval(() => {
      setPhaseTimeRemaining(prev => {
        const newRemaining = prev - 10;
        
        if (newRemaining <= 0) {
          // Phase completed, switch to next phase
          if (currentPhaseRef.current) {
            // Work phase completed, switch to rest
            currentPhaseRef.current = false;
            setIsWorkPhase(false);
            return config.restTime * 1000;
          } else {
            // Rest phase completed, switch to next round or finish
            const nextRound = currentRoundRef.current + 1;
            
            if (nextRound > config.rounds) {
              // All rounds completed - stop immediately
              setIsRunning(false);
              setFinalTime(formatTime(config.workTime * 1000 * config.rounds + config.restTime * 1000 * (config.rounds - 1)));
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              return 0; // Stop the timer
            } else {
              // Start next round (work phase)
              currentRoundRef.current = nextRound;
              currentPhaseRef.current = true;
              setCurrentRound(nextRound);
              setIsWorkPhase(true);
              return config.workTime * 1000;
            }
          }
        }
        
        return newRemaining;
      });
    }, 10);
  }, [isPaused, config.workTime, config.restTime, config.rounds, isWorkPhase, formatTime]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
    pausedTimeRef.current = Date.now();
    deactivateKeepAwake();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    deactivateKeepAwake();
    setRemainingMilliseconds(config.workTime * 1000);
    setFinalTime(null);
    setCurrentRound(1);
    setIsWorkPhase(true);
    setPhaseTimeRemaining(config.workTime * 1000);
    currentPhaseRef.current = true;
    currentRoundRef.current = 1;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [config.workTime]);

  const finishTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    deactivateKeepAwake();
    
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    setFinalTime(formatTime(elapsed));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [formatTime]);

  useEffect(() => {
    if (!isRunning && !isPaused && !finalTime) {
      startTimer();
    }
  }, [isRunning, isPaused, finalTime, startTimer]);

  useEffect(() => {
    return () => {
      deactivateKeepAwake();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    remainingMilliseconds: phaseTimeRemaining,
    isRunning,
    isPaused,
    finalTime,
    currentRound,
    isWorkPhase,
    phaseTimeRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    finishTimer,
    formatTime,
  };
}
