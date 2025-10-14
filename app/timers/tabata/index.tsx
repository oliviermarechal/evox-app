import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useOrientation } from '@/hooks/useOrientation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import ConfigComponent from './ConfigComponent';
import CountdownComponent from './CountdownComponent';
import TimerComponent from './TimerComponent';

interface TabataConfig {
  rounds: number;
  workTime: number;
  restTime: number;
}

export default function TabataScreen() {
  // Allow all orientations for timer screens
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  
  const [showTimer, setShowTimer] = useState(false);
  const [validatedConfig, setValidatedConfig] = useState<TabataConfig | null>(null);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  
  const { isLandscape } = useOrientation();
  const { rounds: roundsParam, workTime: workTimeParam, restTime: restTimeParam } = useLocalSearchParams();

  useFocusEffect(
    React.useCallback(() => {
      // Reset timer when screen is focused
      setShowTimer(false);
      setValidatedConfig(null);
      setIsCountdown(false);
    }, [])
  );

  const handleStartCountdown = (config: TabataConfig) => {
    setValidatedConfig(config);
    setShowTimer(true);
    setIsCountdown(true);
    setCountdownValue(10);
    startCountdown();
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCountdown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSkipCountdown = () => {
    setIsCountdown(false);
  };

  const handlePauseCountdown = () => {
    setIsCountdownPaused(true);
  };

  const handleResumeCountdown = () => {
    setIsCountdownPaused(false);
  };

  const handleCancelCountdown = () => {
    setShowTimer(false);
    setValidatedConfig(null);
    setIsCountdown(false);
  };

  const handleResetTimer = () => {
    setShowTimer(false);
    setValidatedConfig(null);
    setIsCountdown(false);
  };

  if (!showTimer) {
    return (
      <ConfigComponent
        onStartCountdown={handleStartCountdown}
        initialRounds={roundsParam ? parseInt(roundsParam as string) : undefined}
        initialWorkTime={workTimeParam ? parseInt(workTimeParam as string) : undefined}
        initialRestTime={restTimeParam ? parseInt(restTimeParam as string) : undefined}
      />
    );
  }

  if (isCountdown) {
    return (
      <CountdownComponent
        countdownValue={countdownValue}
        isCountdownPaused={isCountdownPaused}
        onSkipCountdown={handleSkipCountdown}
        onPauseCountdown={handlePauseCountdown}
        onResumeCountdown={handleResumeCountdown}
        onCancelCountdown={handleCancelCountdown}
      />
    );
  }

  return (
    <TimerComponent
      config={validatedConfig!}
      isLandscape={isLandscape}
      onResetTimer={handleResetTimer}
    />
  );
}
