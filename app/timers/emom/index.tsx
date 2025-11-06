import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { useOrientation } from '@/hooks/useOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEMOMFlow } from '@/hooks/emom/useEMOMFlow';
import ConfigComponent from './ConfigComponent';
import TimerComponent from './TimerComponent';
import PortraitReady from '@/components/timers/screens/PortraitReady';
import LandscapeReady from '@/components/timers/screens/LandscapeReady';

interface EMOMConfig {
  rounds: number;
  duration: number;
}

export default function EMOMScreen() {
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  
  const { rounds: roundsParam, duration: durationParam } = useLocalSearchParams<{
    rounds?: string;
    duration?: string;
  }>();
  
  const { isLandscape } = useOrientation();
  const state = useEMOMFlow();

  if (roundsParam && durationParam) {
    const config: EMOMConfig = {
      rounds: parseInt(roundsParam, 10),
      duration: parseInt(durationParam, 10)
    };
    
    return (
      <TimerComponent 
        config={config}
        onResetTimer={() => router.back()}
      />
    );
  }

  if (state.showTimer && state.validatedConfig) {
    return (
      <TimerComponent 
        config={state.validatedConfig}
        onResetTimer={() => router.back()}
      />
    );
  }

  if (state.isCountdown) {
    return isLandscape ? (
      <LandscapeReady
        title="EMOM"
        config={state.validatedConfig ? {
          minutes: Math.floor(state.validatedConfig.duration / 60),
          seconds: state.validatedConfig.duration % 60
        } : undefined}
        onStartCountdown={state.handleReadyToStart}
        onBack={state.handleBackToConfig}
        onSkipCountdown={state.handleSkipCountdown}
        countdownValue={state.countdownValue}
        isCountdown={state.isCountdown}
        isPaused={state.isCountdownPaused}
        onTogglePause={state.handleToggleCountdownPause}
      />
    ) : (
      <PortraitReady
        title="EMOM"
        config={state.validatedConfig ? {
          minutes: Math.floor(state.validatedConfig.duration / 60),
          seconds: state.validatedConfig.duration % 60
        } : undefined}
        onStartCountdown={state.handleReadyToStart}
        onBack={state.handleBackToConfig}
        onSkipCountdown={state.handleSkipCountdown}
        countdownValue={state.countdownValue}
        isCountdown={state.isCountdown}
        isPaused={state.isCountdownPaused}
        onTogglePause={state.handleToggleCountdownPause}
      />
    );
  }

  // Configuration phase
  return (
    <ConfigComponent 
      onStartCountdown={state.handleStartCountdown}
      initialRounds={roundsParam ? parseInt(roundsParam, 10) : 8}
      initialDuration={durationParam ? parseInt(durationParam, 10) : 60}
    />
  );
}