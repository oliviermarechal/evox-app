import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useAMRAPTimer } from '@/hooks/amrap/useAMRAPTimer';
import PortraitTimer from './portrait/PortraitTimer';
import LandscapeTimer from './landscape/LandscapeTimer';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface TimerComponentProps {
  config: AMRAPConfig;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
}

export default function TimerComponent({ config, onResetTimer, skipFinalScreen = false }: TimerComponentProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useAMRAPTimer(config);
  
  // Dans le contexte workout, si finalTime est défini, appeler directement onResetTimer
  React.useEffect(() => {
    if (skipFinalScreen && state.finalTime && onResetTimer) {
      // Petit délai pour s'assurer que le timer a bien fini
      const timer = setTimeout(() => {
        onResetTimer();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [skipFinalScreen, state.finalTime, onResetTimer]);

  // Dans le contexte workout, ne pas afficher l'écran final, retourner null
  // Le useEffect ci-dessus appellera onResetTimer
  if (skipFinalScreen && state.finalTime) {
    return null;
  }
  
  const commonProps = {
    config,
    onResetTimer,
    // Passer l'état et les actions du hook
    remainingMilliseconds: state.remainingMilliseconds,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    currentRound: state.currentRound,
    finalTime: state.finalTime,
    startTimer: actions.startTimer,
    pauseTimer: actions.pauseTimer,
    resetTimer: actions.resetTimer,
    incrementRound: actions.incrementRound,
    finishTimer: actions.finishTimer,
    formatTime
  };

  if (isLandscape) {
    return <LandscapeTimer {...commonProps} />;
  } else {
    return <PortraitTimer {...commonProps} />;
  }
}
