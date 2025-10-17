import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { useOrientation } from '@/hooks/useOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useTabataFlow } from '@/hooks/tabata/useTabataFlow';
import ConfigComponent from './ConfigComponent';
import TimerComponent from './TimerComponent';
import PortraitReady from '@/components/timers/screens/PortraitReady';
import LandscapeReady from '@/components/timers/screens/LandscapeReady';

interface TabataConfig {
  rounds: number;
  workTime: number;
  restTime: number;
}

export default function TabataScreen() {
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  
  const { rounds: roundsParam, workTime: workTimeParam, restTime: restTimeParam } = useLocalSearchParams<{
    rounds?: string;
    workTime?: string;
    restTime?: string;
  }>();
  
  const { isLandscape } = useOrientation();
  const state = useTabataFlow();

  if (roundsParam && workTimeParam && restTimeParam) {
    const config: TabataConfig = {
      rounds: parseInt(roundsParam, 10),
      workTime: parseInt(workTimeParam, 10),
      restTime: parseInt(restTimeParam, 10)
    };
    
    return (
      <TimerComponent 
        config={config}
        isLandscape={isLandscape}
        onResetTimer={() => router.back()}
      />
    );
  }

  if (state.showTimer && state.validatedConfig) {
    return (
      <TimerComponent 
        config={state.validatedConfig}
        isLandscape={isLandscape}
        onResetTimer={() => router.back()}
      />
    );
  }

  if (state.isCountdown) {
    return isLandscape ? (
      <LandscapeReady
        title="TABATA"
        config={state.validatedConfig ? {
          minutes: Math.floor(state.validatedConfig.workTime / 60),
          seconds: state.validatedConfig.workTime % 60
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
        title="TABATA"
        config={state.validatedConfig ? {
          minutes: Math.floor(state.validatedConfig.workTime / 60),
          seconds: state.validatedConfig.workTime % 60
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
      initialWorkTime={workTimeParam ? parseInt(workTimeParam, 10) : 20}
      initialRestTime={restTimeParam ? parseInt(restTimeParam, 10) : 10}
    />
  );
}