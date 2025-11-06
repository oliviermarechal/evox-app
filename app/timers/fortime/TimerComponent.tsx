import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import { useForTimeTimer } from '@/hooks/fortime/useForTimeTimer';
import StandalonePortrait from '@/components/timers/layouts/StandalonePortrait';
import StandaloneLandscape from '@/components/timers/layouts/StandaloneLandscape';
import { ForTimeFinalScreen } from '@/components/timers/screens/ForTimeFinalScreen';

export interface ForTimeConfig {
  minutes: number;
  seconds: number;
}

interface TimerComponentProps {
  config: ForTimeConfig;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
}

export default function TimerComponent({ config, onResetTimer, skipFinalScreen = false }: TimerComponentProps) {
  const { isLandscape } = useOrientation();
  const { state, actions, formatTime } = useForTimeTimer(config);

  // Dans le contexte workout, si finalTime est défini, appeler directement onResetTimer
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
    label: 'FOR TIME',
    subtitle: state.isPaused ? 'PAUSED' : state.isRunning ? 'RUNNING' : 'READY',
    timeString: formatTime(state.remainingMilliseconds),
    isPaused: state.isPaused,
    onTogglePause: state.isPaused ? actions.startTimer : actions.pauseTimer,
    currentRound: state.currentRound,
    onAddRound: actions.incrementRound,
    onFinish: actions.finishTimer,
    finalScreen,
  };

  return isLandscape 
    ? <StandaloneLandscape {...props} />
    : <StandalonePortrait {...props} />;
}