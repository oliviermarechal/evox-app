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
}

export default function TimerComponent({ config, onResetTimer }: TimerComponentProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useAMRAPTimer(config);
  
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
