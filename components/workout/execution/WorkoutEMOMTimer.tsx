import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useEMOMTimer } from '@/hooks/emom/useEMOMTimer';
import { WorkoutBlock } from '@/lib/types';
import WorkoutPortrait from '@/components/timers/layouts/WorkoutPortrait';
import WorkoutLandscape from '@/components/timers/layouts/WorkoutLandscape';
import EMOMFinalScreen from '@/components/timers/screens/EMOMFinalScreen';

interface EMOMConfig {
  rounds: number;
  duration: number;
}

interface WorkoutEMOMTimerProps {
  config: EMOMConfig;
  block: WorkoutBlock;
  blockIndex: number;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
}

export default function WorkoutEMOMTimer({ 
  config, 
  block, 
  blockIndex,
  onResetTimer, 
  skipFinalScreen = false 
}: WorkoutEMOMTimerProps) {
  const { isLandscape } = useOrientation();
  const state = useEMOMTimer(config);
  
  React.useEffect(() => {
    if (skipFinalScreen && state.finalTime && onResetTimer) {
      const timer = setTimeout(() => {
        onResetTimer();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [skipFinalScreen, state.finalTime, onResetTimer]);

  if (skipFinalScreen && state.finalTime) {
    return null;
  }

  const finalScreen = state.finalTime && !skipFinalScreen ? (
    <EMOMFinalScreen
      finalTime={state.finalTime}
      currentRound={state.currentRound}
      durationPerRound={config.duration}
      onReset={onResetTimer}
      isLandscape={isLandscape}
    />
  ) : undefined;

  const props = {
    label: `EMOM - Block ${blockIndex + 1}`,
    subtitle: `Round ${state.currentRound} / ${config.rounds}`,
    timeString: state.formatTime(state.remainingMilliseconds),
    isPaused: state.isPaused,
    onTogglePause: state.isPaused ? state.startTimer : state.pauseTimer,
    currentRound: state.currentRound,
    totalRounds: config.rounds,
    onAddRound: undefined, // EMOM n'a pas de bouton add round
    onFinish: state.finishTimer,
    exercises: block.exercises,
    finalScreen,
  };

  return isLandscape 
    ? <WorkoutLandscape {...props} />
    : <WorkoutPortrait {...props} />;
}

