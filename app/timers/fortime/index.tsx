import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useOrientation } from '@/hooks/useOrientation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useForTimeFlow } from '@/hooks/fortime/useForTimeFlow';
import PortraitReady from '@/components/timers/screens/PortraitReady';
import LandscapeReady from '@/components/timers/screens/LandscapeReady';
import ConfigComponent from './ConfigComponent';
import TimerComponent from './TimerComponent';

export default function ForTimeScreen() {
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  
  const { isLandscape } = useOrientation();
  const { minutes: minutesParam, seconds: secondsParam } = useLocalSearchParams();
  const { state, actions } = useForTimeFlow();

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
          title="FOR TIME"
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
          title="FOR TIME"
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
      onResetTimer={() => router.back()}
    />
  );
}
