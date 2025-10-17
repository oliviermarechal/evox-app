import React, { useState, useRef, useCallback } from 'react';

export interface FreeFlowState {
  showTimer: boolean;
  showReady: boolean;
  isCountdown: boolean;
  countdownValue: number;
  isCountdownPaused: boolean;
}

export interface FreeFlowActions {
  handleStartCountdown: () => void;
  handleReadyToStart: () => void;
  handleResetTimer: () => void;
  handleSkipCountdown: () => void;
  handleCancelCountdown: () => void;
  handleBackToConfig: () => void;
  handleToggleCountdownPause: () => void;
}

export function useFreeFlow() {
  const [showTimer, setShowTimer] = useState(false);
  const [showReady, setShowReady] = useState(true);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const countdownIntervalRef = useRef<any>(null);

  const handleStartCountdown = useCallback(() => {
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
    setIsCountdown(false);
    setIsCountdownPaused(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const handleResetTimer = useCallback(() => {
    setShowTimer(false);
    setShowReady(false);
    setIsCountdown(false);
    setIsCountdownPaused(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const handleBackToConfig = useCallback(() => {
    setShowTimer(false);
    setShowReady(false);
    setIsCountdown(false);
    setIsCountdownPaused(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const state: FreeFlowState = {
    showTimer,
    showReady,
    isCountdown,
    countdownValue,
    isCountdownPaused,
  };

  const actions: FreeFlowActions = {
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
