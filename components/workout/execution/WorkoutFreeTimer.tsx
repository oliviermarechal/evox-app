import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useFreeTimer } from '@/hooks/free/useFreeTimer';
import { WorkoutBlock } from '@/lib/types';
import WorkoutPortrait from '@/components/timers/layouts/WorkoutPortrait';
import WorkoutLandscape from '@/components/timers/layouts/WorkoutLandscape';
import { FreeFinalScreen } from '@/components/timers/screens/FreeFinalScreen';

interface WorkoutFreeTimerProps {
  block: WorkoutBlock;
  blockIndex: number;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
}

export default function WorkoutFreeTimer({ 
  block, 
  blockIndex,
  onResetTimer, 
  skipFinalScreen = false 
}: WorkoutFreeTimerProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useFreeTimer();
  
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
    <FreeFinalScreen
      finalTime={state.finalTime}
      currentRound={state.currentRound}
      onReset={onResetTimer}
      isLandscape={isLandscape}
    />
  ) : undefined;

  // Convertir les millisecondes en secondes pour formatTime
  const totalSeconds = Math.floor(state.totalMilliseconds / 1000);

  const props = {
    label: `Free Timer - Block ${blockIndex + 1}`,
    subtitle: state.currentRound > 0 ? `Round ${state.currentRound}` : undefined,
    timeString: formatTime(totalSeconds),
    isPaused: state.isPaused,
    onTogglePause: state.isPaused ? actions.startTimer : actions.pauseTimer,
    currentRound: state.currentRound,
    onAddRound: actions.incrementRound,
    onFinish: actions.finishTimer,
    exercises: block.exercises,
    finalScreen,
  };

  return isLandscape 
    ? <WorkoutLandscape {...props} />
    : <WorkoutPortrait {...props} />;
}

