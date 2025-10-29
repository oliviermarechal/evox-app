import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useFreeTimer } from '@/hooks/free/useFreeTimer';
import PortraitTimer from './portrait/PortraitTimer';
import LandscapeTimer from './landscape/LandscapeTimer';
import { FreeFinalScreen } from '@/components/timers/screens/FreeFinalScreen';

interface TimerComponentProps {
  onResetTimer: () => void;
  onBackPress?: () => void;
  skipFinalScreen?: boolean;
}

export default function TimerComponent({ onResetTimer, onBackPress, skipFinalScreen = false }: TimerComponentProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useFreeTimer();

  // Dans le contexte workout, si finalTime est défini, appeler directement onResetTimer
  React.useEffect(() => {
    if (skipFinalScreen && state.finalTime && onResetTimer) {
      const timer = setTimeout(() => {
        onResetTimer();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [skipFinalScreen, state.finalTime, onResetTimer]);

  // Dans le contexte workout, ne pas afficher l'écran final
  if (skipFinalScreen && state.finalTime) {
    return null;
  }

  // Afficher l'écran final si le timer est terminé (sauf si skipFinalScreen)
  if (state.finalTime && !skipFinalScreen) {
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
    onBackPress,
    // Passer l'état et les actions du hook
    totalMilliseconds: state.totalMilliseconds,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
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