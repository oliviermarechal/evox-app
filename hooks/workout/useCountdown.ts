import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCountdownOptions {
  initialValue?: number;
  onComplete?: () => void;
}

interface UseCountdownReturn {
  countdownValue: number;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  reset: () => void;
}

export function useCountdown({ 
  initialValue = 10,
  onComplete 
}: UseCountdownOptions = {}): UseCountdownReturn {
  const [countdownValue, setCountdownValue] = useState(initialValue);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<any>(null);

  const startCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onComplete?.();
          return initialValue;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialValue, onComplete]);

  const start = useCallback(() => {
    setCountdownValue(initialValue);
    setIsPaused(false);
    startCountdown();
  }, [initialValue, startCountdown]);

  const pause = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    startCountdown();
  }, [startCountdown]);

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPaused(false);
    setCountdownValue(initialValue);
    onComplete?.();
  }, [initialValue, onComplete]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPaused(false);
    setCountdownValue(initialValue);
  }, [initialValue]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    countdownValue,
    isPaused,
    start,
    pause,
    resume,
    skip,
    reset,
  };
}

