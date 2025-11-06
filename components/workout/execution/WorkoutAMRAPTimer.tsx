import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useAMRAPTimer } from '@/hooks/amrap/useAMRAPTimer';
import { WorkoutBlock } from '@/lib/types';
import WorkoutPortrait from '@/components/timers/layouts/WorkoutPortrait';
import WorkoutLandscape from '@/components/timers/layouts/WorkoutLandscape';
import { AMRAPFinalScreen } from '@/components/timers/screens/AMRAPFinalScreen';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface WorkoutAMRAPTimerProps {
  config: AMRAPConfig;
  block: WorkoutBlock;
  blockIndex: number;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
}

export default function WorkoutAMRAPTimer({ 
  config, 
  block, 
  blockIndex,
  onResetTimer, 
  skipFinalScreen = false 
}: WorkoutAMRAPTimerProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useAMRAPTimer(config);
  
  // Dans le contexte workout, si finalTime est défini, appeler directement onResetTimer
  React.useEffect(() => {
    if (skipFinalScreen && state.finalTime && onResetTimer) {
      const timer = setTimeout(() => {
        onResetTimer();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [skipFinalScreen, state.finalTime, onResetTimer]);

  // Si skipFinalScreen et timer terminé, ne rien afficher
  if (skipFinalScreen && state.finalTime) {
    return null;
  }

  // Préparer l'écran final si nécessaire
  const finalScreen = state.finalTime ? (
    <AMRAPFinalScreen
      finalTime={state.finalTime}
      currentRound={state.currentRound}
      timeCap={`${config.minutes}:${config.seconds.toString().padStart(2, '0')}`}
      onReset={onResetTimer}
      isLandscape={isLandscape}
    />
  ) : undefined;

  const props = {
    label: `AMRAP - Block ${blockIndex + 1}`,
    subtitle: `Round ${state.currentRound}`,
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

