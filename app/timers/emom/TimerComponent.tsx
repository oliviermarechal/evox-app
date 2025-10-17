import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useEMOMTimer } from '@/hooks/emom/useEMOMTimer';
import PortraitTimer from './portrait/PortraitTimer';
import LandscapeTimer from './landscape/LandscapeTimer';
import EMOMFinalScreen from '@/components/timers/screens/EMOMFinalScreen';

interface EMOMConfig {
  rounds: number;
  duration: number;
}

interface TimerComponentProps {
  config: EMOMConfig;
  onResetTimer: () => void;
}

export default function TimerComponent({ config, onResetTimer }: TimerComponentProps) {
  const { isLandscape } = useOrientation();

  const state = useEMOMTimer(config);

  // If timer is finished, show final screen
  if (state.finalTime) {
    return (
      <EMOMFinalScreen
        finalTime={state.finalTime}
        currentRound={state.currentRound}
        durationPerRound={config.duration}
        onReset={onResetTimer}
        isLandscape={isLandscape}
      />
    );
  }

  const commonProps = {
    config,
    remainingMilliseconds: state.remainingMilliseconds,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    currentRound: state.currentRound,
    startTimer: state.startTimer,
    pauseTimer: state.pauseTimer,
    finishTimer: state.finishTimer,
    formatTime: state.formatTime,
    onResetTimer,
  };

  return isLandscape ? (
    <LandscapeTimer {...commonProps} />
  ) : (
    <PortraitTimer {...commonProps} />
  );
}