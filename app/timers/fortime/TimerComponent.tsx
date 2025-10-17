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
}

export default function TimerComponent({ config, onResetTimer }: TimerComponentProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useForTimeTimer(config);

  // Afficher l'écran final si le timer est terminé
  if (state.finalTime) {
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