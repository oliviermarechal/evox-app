import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useOrientation } from '@/hooks/useOrientation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import ConfigComponent from './ConfigComponent';
import CountdownComponent from './CountdownComponent';
import LandscapeCountdown from './landscape/LandscapeCountdown';
import TimerComponent from './TimerComponent';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

export default function AMRAPScreen() {
  // Allow all orientations for timer screens
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  
  const [showTimer, setShowTimer] = useState(false);
  const [validatedConfig, setValidatedConfig] = useState<AMRAPConfig | null>(null);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const countdownIntervalRef = useRef<any>(null);
  
  const { isLandscape } = useOrientation();
  const { minutes: minutesParam, seconds: secondsParam } = useLocalSearchParams();

  useFocusEffect(
    React.useCallback(() => {
      // Reset timer when screen is focused
      setShowTimer(false);
      setValidatedConfig(null);
      setIsCountdown(false);
    }, [])
  );

  const handleStartCountdown = (config: AMRAPConfig) => {
    setValidatedConfig(config);
    setShowTimer(true);
    setIsCountdown(true);
    setCountdownValue(10);
    startCountdown();
  };

  const startCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    countdownIntervalRef.current = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
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
    console.log('Pausing countdown');
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setIsCountdownPaused(true);
  };

  const handleResumeCountdown = () => {
    setIsCountdownPaused(false);
    startCountdown();
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
        initialMinutes={minutesParam ? parseInt(minutesParam as string) : undefined}
        initialSeconds={secondsParam ? parseInt(secondsParam as string) : undefined}
      />
    );
  }

  if (isCountdown) {
    if (isLandscape) {
      return (
        <LandscapeCountdown
          countdownValue={countdownValue}
          isCountdownPaused={isCountdownPaused}
          onSkipCountdown={handleSkipCountdown}
          onPauseCountdown={handlePauseCountdown}
          onResumeCountdown={handleResumeCountdown}
          onCancelCountdown={handleCancelCountdown}
        />
      );
    } else {
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
  }

  return (
    <TimerComponent
      config={validatedConfig!}
      isLandscape={isLandscape}
      onResetTimer={handleResetTimer}
    />
  );
}
