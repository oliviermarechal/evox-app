import { useState, useEffect, useRef, useCallback } from 'react';
import { CountdownTimerService, IncrementTimerService, TabataTimerService, EMOMTimerService, AMRAPTimerService, ForTimeTimerService, TimerConfig, TabataConfig, EMOMConfig, AMRAPConfig, ForTimeConfig } from '@/services/TimerService';

// Hook simple pour le timer de décompte (compatible avec les workflows existants)
export function useCountdownTimer(config: TimerConfig) {
  const [state, setState] = useState({
    remainingTime: config.duration,
    isRunning: false,
    isPaused: false,
    hasStarted: false,
    isCompleted: false,
  });
  
  const timerRef = useRef<CountdownTimerService | null>(null);
  
  // Initialiser le timer
  useEffect(() => {
    timerRef.current = new CountdownTimerService(config);
    
    const unsubscribe = timerRef.current.subscribe((newState) => {
      setState(newState);
    });
    
    return () => {
      unsubscribe();
      timerRef.current?.destroy();
    };
  }, [config.duration]);
  
  const start = useCallback(() => {
    timerRef.current?.start();
  }, []);
  
  const pause = useCallback(() => {
    timerRef.current?.pause();
  }, []);
  
  const reset = useCallback(() => {
    timerRef.current?.reset();
  }, []);
  
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  
  return {
    ...state,
    start,
    pause,
    reset,
    formatTime,
  };
}

// Hook simple pour le timer d'incrémentation (compatible avec les workflows existants)
export function useIncrementTimer(config: { onTick?: (elapsedTime: number) => void }) {
  const [state, setState] = useState({
    elapsedTime: 0,
    isRunning: false,
    isPaused: false,
    hasStarted: false,
  });
  
  const timerRef = useRef<IncrementTimerService | null>(null);
  
  // Initialiser le timer
  useEffect(() => {
    timerRef.current = new IncrementTimerService(config);
    
    const unsubscribe = timerRef.current.subscribe((newState) => {
      setState(newState);
    });
    
    return () => {
      unsubscribe();
      timerRef.current?.destroy();
    };
  }, []);
  
  const start = useCallback(() => {
    timerRef.current?.start();
  }, []);
  
  const pause = useCallback(() => {
    timerRef.current?.pause();
  }, []);
  
  const reset = useCallback(() => {
    timerRef.current?.reset();
  }, []);
  
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  
  const getInternalState = useCallback(() => {
    return timerRef.current?.getInternalState();
  }, []);
  
  return {
    ...state,
    start,
    pause,
    reset,
    formatTime,
    getInternalState,
  };
}

// Hook spécialisé pour Tabata
export function useTabataTimer(config: TabataConfig) {
  const [state, setState] = useState({
    remainingTime: config.workTime,
    isRunning: false,
    isPaused: false,
    hasStarted: false,
    isCompleted: false,
    currentRound: 1,
    isWorkPhase: true,
  });
  
  const [preciseMilliseconds, setPreciseMilliseconds] = useState(config.workTime * 1000);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  
  const timerRef = useRef<TabataTimerService | null>(null);
  
  // Initialiser le timer
  useEffect(() => {
    timerRef.current = new TabataTimerService(config);
    
    const unsubscribe = timerRef.current.subscribe((newState) => {
      setState(newState);
      // Définir automatiquement la finalTime à la complétion pour déclencher l'écran final
      if (newState.isCompleted && !finalTime) {
        const totalMs = (config.workTime * 1000 * config.rounds) + (config.restTime * 1000 * Math.max(0, config.rounds - 1));
        setFinalTime(formatTime(totalMs));
      }
    });
    
    return () => {
      unsubscribe();
      timerRef.current?.destroy();
    };
  }, [config.rounds, config.workTime, config.restTime]);
  
  const start = useCallback(() => {
    timerRef.current?.start();
  }, []);
  
  const pause = useCallback(() => {
    timerRef.current?.pause();
  }, []);
  
  const reset = useCallback(() => {
    timerRef.current?.reset();
    setFinalTime(null);
    setPreciseMilliseconds(config.workTime * 1000);
  }, [config.workTime]);
  
  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }, []);
  
  const getInternalState = useCallback(() => {
    return timerRef.current?.getInternalState();
  }, []);
  
  const finishTimer = useCallback(() => {
    timerRef.current?.pause();
    setFinalTime(formatTime(preciseMilliseconds));
  }, [formatTime, preciseMilliseconds]);
  
  // Mettre à jour les millisecondes précises toutes les 10ms pour l'effet "nerveux"
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      const internalState = getInternalState();
      if (internalState) {
        const now = Date.now();
        const elapsedInPhase = now - internalState.phaseStartTime - internalState.totalPausedDuration;
        const remainingMs = Math.max(0, internalState.phaseDuration - elapsedInPhase);
        setPreciseMilliseconds(remainingMs);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [state.isRunning, state.currentRound, state.isWorkPhase, getInternalState]);
  
  // Auto-start timer when component mounts
  useEffect(() => {
    if (!state.isRunning && !state.isPaused && !finalTime) {
      start();
    }
  }, [state.isRunning, state.isPaused, finalTime, start]);
  
  return {
    remainingMilliseconds: preciseMilliseconds,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    finalTime,
    currentRound: state.currentRound,
    isWorkPhase: state.isWorkPhase,
    phaseTimeRemaining: preciseMilliseconds,
    startTimer: start,
    pauseTimer: pause,
    resetTimer: reset,
    finishTimer,
    formatTime,
  };
}

// Hook spécialisé pour EMOM
export function useEMOMTimer(config: EMOMConfig) {
  const [state, setState] = useState({
    remainingTime: config.duration,
    isRunning: false,
    isPaused: false,
    hasStarted: false,
    isCompleted: false,
    currentRound: 1,
  });
  
  const [preciseMilliseconds, setPreciseMilliseconds] = useState(config.duration * 1000);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  
  const timerRef = useRef<EMOMTimerService | null>(null);
  
  // Initialiser le timer
  useEffect(() => {
    timerRef.current = new EMOMTimerService(config);
    
    const unsubscribe = timerRef.current.subscribe((newState) => {
      setState(newState);
      // Définir automatiquement la finalTime à la complétion pour déclencher l'écran final
      if (newState.isCompleted && !finalTime) {
        const totalMs = config.duration * 1000 * config.rounds;
        setFinalTime(formatTime(totalMs));
      }
    });
    
    return () => {
      unsubscribe();
      timerRef.current?.destroy();
    };
  }, [config.rounds, config.duration]);
  
  const start = useCallback(() => {
    timerRef.current?.start();
  }, []);
  
  const pause = useCallback(() => {
    timerRef.current?.pause();
  }, []);
  
  const reset = useCallback(() => {
    timerRef.current?.reset();
    setFinalTime(null);
    setPreciseMilliseconds(config.duration * 1000);
  }, [config.duration]);
  
  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }, []);
  
  const getInternalState = useCallback(() => {
    return timerRef.current?.getInternalState();
  }, []);
  
  const finishTimer = useCallback(() => {
    timerRef.current?.pause();
    setFinalTime(formatTime(preciseMilliseconds));
  }, [formatTime, preciseMilliseconds]);
  
  // Mettre à jour les millisecondes précises toutes les 10ms pour l'effet "nerveux"
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      const internalState = getInternalState();
      if (internalState) {
        const now = Date.now();
        const roundDurationMs = internalState.roundDurationMs;
        const elapsedTotalMs = Math.max(0, now - internalState.startTime - internalState.totalPausedDuration);
        const remainingInRoundMs = roundDurationMs - (elapsedTotalMs % roundDurationMs);
        setPreciseMilliseconds(Math.max(0, remainingInRoundMs));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [state.isRunning, getInternalState]);
  
  // Auto-start timer when component mounts
  useEffect(() => {
    if (!state.isRunning && !state.isPaused && !finalTime) {
      start();
    }
  }, [state.isRunning, state.isPaused, finalTime, start]);
  
  return {
    remainingMilliseconds: preciseMilliseconds,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    finalTime,
    currentRound: state.currentRound,
    startTimer: start,
    pauseTimer: pause,
    resetTimer: reset,
    finishTimer,
    formatTime,
  };
}

// Hook spécialisé pour AMRAP
export function useAMRAPTimer(config: AMRAPConfig) {
  const [state, setState] = useState({
    remainingTime: config.minutes * 60 + config.seconds,
    isRunning: false,
    isPaused: false,
    hasStarted: false,
    isCompleted: false,
    currentRound: 1,
  });
  
  const [preciseMilliseconds, setPreciseMilliseconds] = useState((config.minutes * 60 + config.seconds) * 1000);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [isOnFire, setIsOnFire] = useState(false);
  
  const timerRef = useRef<AMRAPTimerService | null>(null);
  
  // Initialiser le timer
  useEffect(() => {
    timerRef.current = new AMRAPTimerService(config);
    
    const unsubscribe = timerRef.current.subscribe((newState) => {
      setState(newState);
      // Définir automatiquement la finalTime à la complétion pour déclencher l'écran final
      if (newState.isCompleted && !finalTime) {
        const totalMs = (config.minutes * 60 + config.seconds) * 1000;
        setFinalTime(formatTime(totalMs));
        setIsOnFire(true);
      }
    });
    
    return () => {
      unsubscribe();
      timerRef.current?.destroy();
    };
  }, [config.minutes, config.seconds]);
  
  const start = useCallback(() => {
    timerRef.current?.start();
  }, []);
  
  const pause = useCallback(() => {
    timerRef.current?.pause();
  }, []);
  
  const reset = useCallback(() => {
    timerRef.current?.reset();
    setFinalTime(null);
    setIsOnFire(false);
    setPreciseMilliseconds((config.minutes * 60 + config.seconds) * 1000);
  }, [config.minutes, config.seconds]);
  
  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((milliseconds % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);
  
  const getInternalState = useCallback(() => {
    return timerRef.current?.getInternalState();
  }, []);
  
  const incrementRound = useCallback(() => {
    timerRef.current?.incrementRound();
  }, []);
  
  const finishTimer = useCallback(() => {
    timerRef.current?.pause();
    const totalMs = (config.minutes * 60 + config.seconds) * 1000;
    const elapsed = totalMs - preciseMilliseconds;
    setFinalTime(formatTime(elapsed));
  }, [formatTime, preciseMilliseconds, config.minutes, config.seconds]);
  
  // Mettre à jour les millisecondes précises toutes les 10ms pour l'effet "nerveux"
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      const internalState = getInternalState();
      if (internalState) {
        const now = Date.now();
        const remainingMs = Math.max(0, internalState.targetEndTime - now);
        setPreciseMilliseconds(remainingMs);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [state.isRunning, getInternalState]);
  
  // Auto-start timer when component mounts
  useEffect(() => {
    if (!state.isRunning && !state.isPaused && !finalTime) {
      const timer = setTimeout(() => {
        start();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.isRunning, state.isPaused, finalTime, start]);
  
  return {
    remainingMilliseconds: preciseMilliseconds,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    finalTime,
    currentRound: state.currentRound,
    isOnFire,
    hasStarted: state.hasStarted,
    startTimer: start,
    pauseTimer: pause,
    resetTimer: reset,
    incrementRound,
    finishTimer,
    formatTime,
  };
}

// Hook spécialisé pour ForTime
export function useForTimeTimer(config: ForTimeConfig) {
  const [state, setState] = useState({
    remainingTime: config.minutes * 60 + config.seconds,
    isRunning: false,
    isPaused: false,
    hasStarted: false,
    isCompleted: false,
    currentRound: 0,
  });
  
  const [preciseMilliseconds, setPreciseMilliseconds] = useState((config.minutes * 60 + config.seconds) * 1000);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [isOnFire, setIsOnFire] = useState(false);
  
  const timerRef = useRef<ForTimeTimerService | null>(null);
  
  // Initialiser le timer
  useEffect(() => {
    timerRef.current = new ForTimeTimerService(config);
    
    const unsubscribe = timerRef.current.subscribe((newState) => {
      setState(newState);
      // Définir automatiquement la finalTime à la complétion pour déclencher l'écran final
      if (newState.isCompleted && !finalTime) {
        const totalMs = (config.minutes * 60 + config.seconds) * 1000;
        setFinalTime(formatTime(totalMs));
      }
    });
    
    return () => {
      unsubscribe();
      timerRef.current?.destroy();
    };
  }, [config.minutes, config.seconds]);
  
  const start = useCallback(() => {
    timerRef.current?.start();
  }, []);
  
  const pause = useCallback(() => {
    timerRef.current?.pause();
  }, []);
  
  const reset = useCallback(() => {
    timerRef.current?.reset();
    setFinalTime(null);
    setIsOnFire(false);
    setPreciseMilliseconds((config.minutes * 60 + config.seconds) * 1000);
  }, [config.minutes, config.seconds]);
  
  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((milliseconds % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);
  
  const getInternalState = useCallback(() => {
    return timerRef.current?.getInternalState();
  }, []);
  
  const incrementRound = useCallback(() => {
    timerRef.current?.incrementRound();
  }, []);
  
  const finishTimer = useCallback(() => {
    timerRef.current?.pause();
    const totalMs = (config.minutes * 60 + config.seconds) * 1000;
    const elapsed = totalMs - preciseMilliseconds;
    setFinalTime(formatTime(elapsed));
  }, [formatTime, preciseMilliseconds, config.minutes, config.seconds]);
  
  // Mettre à jour les millisecondes précises toutes les 10ms pour l'effet "nerveux"
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      const internalState = getInternalState();
      if (internalState) {
        const now = Date.now();
        const remainingMs = Math.max(0, internalState.targetEndTime - now);
        setPreciseMilliseconds(remainingMs);
        
        // Effet "on fire" quand il reste moins de 10% du temps
        const totalTime = (config.minutes * 60 + config.seconds) * 1000;
        if (remainingMs <= totalTime * 0.1 && !isOnFire) {
          setIsOnFire(true);
        }
      }
    }, 10);

    return () => clearInterval(interval);
  }, [state.isRunning, getInternalState, config.minutes, config.seconds, isOnFire]);
  
  // Auto-start timer when component mounts
  useEffect(() => {
    if (!state.isRunning && !state.isPaused && !finalTime) {
      const timer = setTimeout(() => {
        start();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.isRunning, state.isPaused, finalTime, start]);
  
  return {
    remainingMilliseconds: preciseMilliseconds,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    finalTime,
    currentRound: state.currentRound,
    isOnFire,
    startTimer: start,
    pauseTimer: pause,
    resetTimer: reset,
    incrementRound,
    finishTimer,
    formatTime,
  };
}

