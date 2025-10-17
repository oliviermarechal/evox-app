import { useState, useEffect, useCallback, useRef } from 'react';

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
  const [remainingMilliseconds, setRemainingMilliseconds] = useState(config.duration * 1000); // EMOM: Use config.duration
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1); // Start at round 1
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }, []);

  const startTimer = useCallback(() => {
    if (isPaused) {
      // Resume from pause
      const pausedDuration = Date.now() - pausedTimeRef.current;
      startTimeRef.current += pausedDuration;
    } else {
      // Start fresh
      startTimeRef.current = Date.now();
    }
    
    setIsRunning(true);
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      setRemainingMilliseconds(prev => {
        const newRemaining = prev - 10;
        
        if (newRemaining <= 0) {
          // Round completed, move to next round
          setCurrentRound(prevRound => {
            const nextRound = prevRound + 1;
            
            if (nextRound > config.rounds) {
              // All rounds completed
              setIsRunning(false);
              setFinalTime(formatTime(config.duration * 1000 * config.rounds));
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              return prevRound;
            } else {
              // Start next round
              return nextRound;
            }
          });
          
          // Return new duration for next round or 0 if finished
          return currentRound >= config.rounds ? 0 : config.duration * 1000;
        }
        
        // Timer continues normally
        
        return newRemaining;
      });
    }, 10);
  }, [isPaused, config.duration, config.rounds, formatTime]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
    pausedTimeRef.current = Date.now();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingMilliseconds(config.duration * 1000); // EMOM: Use config.duration
    setFinalTime(null);
    setCurrentRound(1); // Start at round 1
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [config.duration]);

  // EMOM: Rounds are auto-incremented, no manual increment needed

  const finishTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    
    // Calculate total elapsed time
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    setFinalTime(formatTime(elapsed));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [formatTime]);

  // Auto-start timer when component mounts
  useEffect(() => {
    if (!isRunning && !isPaused && !finalTime) {
      startTimer();
    }
  }, [isRunning, isPaused, finalTime, startTimer]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    remainingMilliseconds,
    isRunning,
    isPaused,
    finalTime,
    currentRound,
    startTimer,
    pauseTimer,
    resetTimer,
    finishTimer,
    formatTime,
  };
}
