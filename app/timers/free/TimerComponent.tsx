import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useFreeTimer } from '@/hooks/free/useFreeTimer';
import PortraitTimer from './portrait/PortraitTimer';
import LandscapeTimer from './landscape/LandscapeTimer';
import { FreeFinalScreen } from '@/components/timers/screens/FreeFinalScreen';

interface TimerComponentProps {
  onResetTimer: () => void;
}

export default function TimerComponent({ onResetTimer }: TimerComponentProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useFreeTimer();

  // Afficher l'écran final si le timer est terminé
  if (state.finalTime) {
    return (
      <FreeFinalScreen
        finalTime={state.finalTime}
        currentRound={state.currentRound}
        onReset={onResetTimer}
        isLandscape={isLandscape}
      />
    );
  }
  
  const commonProps = {
    onResetTimer,
    // Passer l'état et les actions du hook
    totalMilliseconds: state.totalMilliseconds,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    isOnFire: state.isOnFire,
    currentRound: state.currentRound,
    startTimer: actions.startTimer,
    pauseTimer: actions.pauseTimer,
    incrementRound: actions.incrementRound,
    finishTimer: actions.finishTimer, // Added
    formatTime
  };

  if (isLandscape) {
    return <LandscapeTimer {...commonProps} />;
  } else {
    return <PortraitTimer {...commonProps} />;
  }
}