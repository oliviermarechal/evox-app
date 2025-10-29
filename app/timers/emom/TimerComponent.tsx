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
  skipFinalScreen?: boolean;
}

export default function TimerComponent({ config, onResetTimer, skipFinalScreen = false }: TimerComponentProps) {
  const { isLandscape } = useOrientation();

  const state = useEMOMTimer(config);

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

  // If timer is finished, show final screen (sauf si skipFinalScreen)
  if (state.finalTime && !skipFinalScreen) {
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