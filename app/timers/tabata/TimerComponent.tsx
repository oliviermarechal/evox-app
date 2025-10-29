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
  skipFinalScreen?: boolean;
}

export default function TimerComponent({ config, isLandscape, onResetTimer, skipFinalScreen = false }: TimerComponentProps) {
  const state = useTabataTimer(config);

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

  if (state.finalTime && !skipFinalScreen) {
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