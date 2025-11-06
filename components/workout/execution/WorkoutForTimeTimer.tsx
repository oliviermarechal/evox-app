import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useForTimeTimer } from '@/hooks/fortime/useForTimeTimer';
import { WorkoutBlock } from '@/lib/types';
import WorkoutPortrait from '@/components/timers/layouts/WorkoutPortrait';
import WorkoutLandscape from '@/components/timers/layouts/WorkoutLandscape';
import { ForTimeFinalScreen } from '@/components/timers/screens/ForTimeFinalScreen';

interface ForTimeConfig {
  minutes: number;
  seconds: number;
}

interface WorkoutForTimeTimerProps {
  config: ForTimeConfig;
  block: WorkoutBlock;
  blockIndex: number;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
}

export default function WorkoutForTimeTimer({ 
  config, 
  block, 
  blockIndex,
  onResetTimer, 
  skipFinalScreen = false 
}: WorkoutForTimeTimerProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useForTimeTimer(config);
  
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
    <ForTimeFinalScreen
      finalTime={state.finalTime}
      currentRound={state.currentRound}
      timeCap={`${config.minutes}:${config.seconds.toString().padStart(2, '0')}`}
      onReset={onResetTimer}
      isLandscape={isLandscape}
    />
  ) : undefined;

  const props = {
    label: `ForTime - Block ${blockIndex + 1}`,
    subtitle: state.currentRound > 0 ? `Round ${state.currentRound}` : undefined,
    timeString: formatTime(state.remainingMilliseconds),
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

