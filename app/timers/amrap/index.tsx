import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useOrientation } from '@/hooks/useOrientation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useAMRAPFlow } from '@/hooks/amrap/useAMRAPFlow';
import PortraitReady from '@/components/timers/screens/PortraitReady';
import LandscapeReady from '@/components/timers/screens/LandscapeReady';
import ConfigComponent from './ConfigComponent';
import TimerComponent from './TimerComponent';

export default function AMRAPScreen() {
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  
  const { isLandscape } = useOrientation();
  const { minutes: minutesParam, seconds: secondsParam } = useLocalSearchParams();
  const { state, actions } = useAMRAPFlow();

  if (!state.showTimer && !state.showReady) {
    return (
      <ConfigComponent
        onStartCountdown={actions.handleStartCountdown}
        initialMinutes={minutesParam ? parseInt(minutesParam as string) : undefined}
        initialSeconds={secondsParam ? parseInt(secondsParam as string) : undefined}
      />
    );
  }

  if (state.showReady || state.isCountdown) {
    if (isLandscape) {
      return (
        <LandscapeReady
          title="AMRAP"
          config={state.validatedConfig!}
          onStartCountdown={actions.handleReadyToStart}
          onBack={actions.handleBackToConfig}
          onSkipCountdown={actions.handleSkipCountdown}
          countdownValue={state.countdownValue}
          isCountdown={state.isCountdown}
          isPaused={state.isCountdownPaused}
          onTogglePause={actions.handleToggleCountdownPause}
        />
      );
    } else {
      return (
        <PortraitReady
          title="AMRAP"
          config={state.validatedConfig!}
          onStartCountdown={actions.handleReadyToStart}
          onBack={actions.handleBackToConfig}
          onSkipCountdown={actions.handleSkipCountdown}
          countdownValue={state.countdownValue}
          isCountdown={state.isCountdown}
          isPaused={state.isCountdownPaused}
          onTogglePause={actions.handleToggleCountdownPause}
        />
      );
    }
  }

  return (
    <TimerComponent
      config={state.validatedConfig!}
      onResetTimer={actions.handleResetTimer}
    />
  );
}
