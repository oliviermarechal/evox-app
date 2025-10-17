import { useState, useCallback, useRef } from 'react';

interface EMOMConfig {
  rounds: number;
  duration: number;
}

export function useEMOMFlow() {
  const [showTimer, setShowTimer] = useState(false);
  const [validatedConfig, setValidatedConfig] = useState<EMOMConfig | null>(null);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  
  const countdownRef = useRef<any>(null);

  const startCountdown = useCallback(() => {
    setIsCountdown(true);
    setCountdownValue(10);
    setIsCountdownPaused(false);
    
    countdownRef.current = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          setIsCountdown(false);
          setShowTimer(true);
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleStartCountdown = useCallback((config: EMOMConfig) => {
    setValidatedConfig(config);
    startCountdown();
  }, [startCountdown]);

  const handleReadyToStart = useCallback(() => {
    setIsCountdown(true);
    setShowTimer(true);
    startCountdown();
  }, [startCountdown]);

  const handleBackToConfig = useCallback(() => {
    setShowTimer(false);
    setValidatedConfig(null);
    setIsCountdown(false);
    setCountdownValue(10);
    setIsCountdownPaused(false);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, []);

  const handleSkipCountdown = useCallback(() => {
    setIsCountdown(false);
    setShowTimer(true);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, []);

  const handleToggleCountdownPause = useCallback(() => {
    if (isCountdownPaused) {
      setIsCountdownPaused(false);
      countdownRef.current = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            setIsCountdown(false);
            setShowTimer(true);
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsCountdownPaused(true);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    }
  }, [isCountdownPaused]);

  return {
    showTimer,
    validatedConfig,
    isCountdown,
    countdownValue,
    isCountdownPaused,
    handleStartCountdown,
    handleReadyToStart,
    handleBackToConfig,
    handleSkipCountdown,
    handleToggleCountdownPause,
  };
}
