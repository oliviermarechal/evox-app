import { useState, useRef, useCallback } from 'react';
import { AMRAPConfig } from './useAMRAPTimer';

export interface AMRAPFlowState {
  showTimer: boolean;
  showReady: boolean;
  validatedConfig: AMRAPConfig | null;
  isCountdown: boolean;
  countdownValue: number;
  isCountdownPaused: boolean;
}

export interface AMRAPFlowActions {
  handleStartCountdown: (config: AMRAPConfig) => void;
  handleReadyToStart: () => void;
  handleResetTimer: () => void;
  handleSkipCountdown: () => void;
  handleCancelCountdown: () => void;
  handleBackToConfig: () => void;
  handleToggleCountdownPause: () => void;
}

export function useAMRAPFlow() {
  const [showTimer, setShowTimer] = useState(false);
  const [showReady, setShowReady] = useState(false);
  const [validatedConfig, setValidatedConfig] = useState<AMRAPConfig | null>(null);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const countdownIntervalRef = useRef<any>(null);

  const handleStartCountdown = useCallback((config: AMRAPConfig) => {
    console.log('handleStartCountdown amrap flow',config);
    setValidatedConfig(config);
    setShowReady(true);
  }, []);

  const handleReadyToStart = useCallback(() => {
    setShowReady(false);
    setShowTimer(true);
    setIsCountdown(true);
    setCountdownValue(10);
    startCountdown();
  }, []);

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

  const handleSkipCountdown = useCallback(() => {
    setIsCountdown(false);
    setIsCountdownPaused(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const handleCancelCountdown = useCallback(() => {
    setShowTimer(false);
    setValidatedConfig(null);
    setIsCountdown(false);
    setIsCountdownPaused(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const handleResetTimer = useCallback(() => {
    setShowTimer(false);
    setShowReady(false);
    setValidatedConfig(null);
    setIsCountdown(false);
    setIsCountdownPaused(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const handleBackToConfig = useCallback(() => {
    setShowTimer(false);
    setShowReady(false);
    setValidatedConfig(null);
    setIsCountdown(false);
    setIsCountdownPaused(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const state: AMRAPFlowState = {
    showTimer,
    showReady,
    validatedConfig,
    isCountdown,
    countdownValue,
    isCountdownPaused,
  };

  const actions: AMRAPFlowActions = {
    handleStartCountdown,
    handleReadyToStart,
    handleResetTimer,
    handleSkipCountdown,
    handleCancelCountdown,
    handleBackToConfig,
    handleToggleCountdownPause,
  };

  return { state, actions };
}
