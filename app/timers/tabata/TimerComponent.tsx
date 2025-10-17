import React from 'react';
import { useTabataTimer } from '@/hooks/tabata/useTabataTimer';
import PortraitTimer from './portrait/PortraitTimer';
import LandscapeTimer from './landscape/LandscapeTimer';
import TabataFinalScreen from '@/components/timers/screens/TabataFinalScreen';

interface TabataConfig {
  rounds: number;
  workTime: number;
  restTime: number;
}

interface TimerComponentProps {
  config: TabataConfig;
  isLandscape: boolean;
  onResetTimer: () => void;
}

export default function TimerComponent({ config, isLandscape, onResetTimer }: TimerComponentProps) {
  const state = useTabataTimer(config);

  if (state.finalTime) {
    return (
      <TabataFinalScreen
        finalTime={state.finalTime}
        currentRound={state.currentRound}
        workTime={config.workTime}
        restTime={config.restTime}
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
    isWorkPhase: state.isWorkPhase,
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