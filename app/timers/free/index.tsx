import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useOrientation } from '@/hooks/useOrientation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFreeFlow } from '@/hooks/free/useFreeFlow';
import PortraitReady from '@/components/timers/screens/PortraitReady';
import LandscapeReady from '@/components/timers/screens/LandscapeReady';
import TimerComponent from '@/app/timers/free/TimerComponent';

export default function FreeTimerScreen() {
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  
  const { isLandscape } = useOrientation();
  const { state, actions } = useFreeFlow();

  if (state.showReady || state.isCountdown) {
    if (isLandscape) {
      return (
        <LandscapeReady
          title="FREE TIMER"
          onStartCountdown={actions.handleReadyToStart}
          onBack={() => router.back()}
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
          title="FREE TIMER"
          onStartCountdown={actions.handleReadyToStart}
          onBack={() => router.back()}
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
      onResetTimer={() => router.back()}
      onBackPress={() => router.back()}
    />
  );
}
