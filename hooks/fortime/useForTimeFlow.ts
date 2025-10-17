import { useState, useCallback, useRef, useEffect } from 'react';

export interface ForTimeConfig {
  minutes: number;
  seconds: number;
}

export interface ForTimeFlowState {
  showTimer: boolean;
  showReady: boolean;
  isCountdown: boolean;
  countdownValue: number;
  isCountdownPaused: boolean;
  validatedConfig: ForTimeConfig | null;
}

export interface ForTimeFlowActions {
  handleStartCountdown: (config: ForTimeConfig) => void;
  handleReadyToStart: () => void;
  handleSkipCountdown: () => void;
  handleToggleCountdownPause: () => void;
  handleBackToConfig: () => void;
  handleResetTimer: () => void;
}

export function useForTimeFlow() {
  const [showTimer, setShowTimer] = useState(false);
  const [showReady, setShowReady] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const [validatedConfig, setValidatedConfig] = useState<ForTimeConfig | null>(null);
  const countdownIntervalRef = useRef<any>(null);

  const startCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setIsCountdownPaused(false);
    countdownIntervalRef.current = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          setIsCountdown(false);
          setIsCountdownPaused(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleStartCountdown = useCallback((config: ForTimeConfig) => {
    setValidatedConfig(config);
    setShowReady(true);
    setIsCountdown(false);
  }, []);

  const handleReadyToStart = useCallback(() => {
    setShowReady(false);
    setShowTimer(true);
    setIsCountdown(true);
    setCountdownValue(10);
    startCountdown();
  }, [startCountdown]);

  const handleSkipCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setIsCountdown(false);
    setIsCountdownPaused(false);
    setShowTimer(true);
  }, []);

  const handleToggleCountdownPause = useCallback(() => {
    if (isCountdown) {
      if (isCountdownPaused) {
        // Reprendre le countdown
        startCountdown();
      } else {
        // Mettre en pause le countdown
        setIsCountdownPaused(true);
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      }
    }
  }, [isCountdown, isCountdownPaused, startCountdown]);

  const handleBackToConfig = useCallback(() => {
    setShowReady(false);
    setShowTimer(false);
    setIsCountdown(false);
    setIsCountdownPaused(false);
    setValidatedConfig(null);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const handleResetTimer = useCallback(() => {
    setShowTimer(false);
    setShowReady(false);
    setIsCountdown(false);
    setIsCountdownPaused(false);
    setValidatedConfig(null);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  const state: ForTimeFlowState = {
    showTimer,
    showReady,
    isCountdown,
    countdownValue,
    isCountdownPaused,
    validatedConfig,
  };

  const actions: ForTimeFlowActions = {
    handleStartCountdown,
    handleReadyToStart,
    handleSkipCountdown,
    handleToggleCountdownPause,
    handleBackToConfig,
    handleResetTimer,
  };

  return { state, actions };
}
