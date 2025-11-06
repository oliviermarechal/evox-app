import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useTabataTimer } from '@/hooks/tabata/useTabataTimer';
import { WorkoutBlock } from '@/lib/types';
import WorkoutPortrait from '@/components/timers/layouts/WorkoutPortrait';
import WorkoutLandscape from '@/components/timers/layouts/WorkoutLandscape';
import TabataFinalScreen from '@/components/timers/screens/TabataFinalScreen';

interface TabataConfig {
  rounds: number;
  workTime: number;
  restTime: number;
}

interface WorkoutTabataTimerProps {
  config: TabataConfig;
  block: WorkoutBlock;
  blockIndex: number;
  isLandscape: boolean;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
}

export default function WorkoutTabataTimer({ 
  config, 
  block, 
  blockIndex,
  isLandscape,
  onResetTimer, 
  skipFinalScreen = false 
}: WorkoutTabataTimerProps) {
  const state = useTabataTimer(config);
  
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
    <TabataFinalScreen
      finalTime={state.finalTime}
      currentRound={state.currentRound}
      workTime={config.workTime}
      restTime={config.restTime}
      onReset={onResetTimer}
      isLandscape={isLandscape}
    />
  ) : undefined;

  const phaseLabel = state.isWorkPhase ? 'WORK' : 'REST';
  
  const props = {
    label: `Tabata - Block ${blockIndex + 1}`,
    subtitle: `Round ${state.currentRound} / ${config.rounds} • ${phaseLabel}`,
    timeString: state.formatTime(state.remainingMilliseconds),
    isPaused: state.isPaused,
    onTogglePause: state.isPaused ? state.startTimer : state.pauseTimer,
    currentRound: state.currentRound,
    totalRounds: config.rounds,
    onAddRound: undefined, // Tabata n'a pas de bouton add round
    onFinish: state.finishTimer,
    exercises: block.exercises,
    finalScreen,
  };

  return isLandscape 
    ? <WorkoutLandscape {...props} />
    : <WorkoutPortrait {...props} />;
}

