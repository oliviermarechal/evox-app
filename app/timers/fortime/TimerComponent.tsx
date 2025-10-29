import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useForTimeTimer } from '@/hooks/fortime/useForTimeTimer';
import PortraitTimer from './portrait/PortraitTimer';
import LandscapeTimer from './landscape/LandscapeTimer';
import { ForTimeFinalScreen } from '@/components/timers/screens/ForTimeFinalScreen';

export interface ForTimeConfig {
  minutes: number;
  seconds: number;
}

interface TimerComponentProps {
  config: ForTimeConfig;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
}

export default function TimerComponent({ config, onResetTimer, skipFinalScreen = false }: TimerComponentProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useForTimeTimer(config);

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
      <ForTimeFinalScreen
        finalTime={state.finalTime}
        currentRound={state.currentRound}
        timeCap={`${config.minutes}:${config.seconds.toString().padStart(2, '0')}`}
        onReset={onResetTimer}
        isLandscape={isLandscape}
      />
    );
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
    isOnFire: state.isOnFire,
    startTimer: actions.startTimer,
    pauseTimer: actions.pauseTimer,
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