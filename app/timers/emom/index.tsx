import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useOrientation } from '@/hooks/useOrientation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import ConfigComponent from './ConfigComponent';
import CountdownComponent from './CountdownComponent';
import TimerComponent from './TimerComponent';

interface EMOMConfig {
  rounds: number;
  duration: number;
}

export default function EMOMScreen() {
  // Allow all orientations for timer screens
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  
  const { rounds: roundsParam, duration: durationParam } = useLocalSearchParams<{
    rounds?: string;
    duration?: string;
  }>();
  
  // États principaux
  const [showTimer, setShowTimer] = useState(false);
  const [validatedConfig, setValidatedConfig] = useState<EMOMConfig | null>(null);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);

  const { isLandscape } = useOrientation();
  const countdownRef = useRef<any>(null);

  // Countdown logic
  const startCountdown = useCallback(() => {
    setIsCountdown(true);
    setCountdownValue(10);
    setIsCountdownPaused(false);
    
    countdownRef.current = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          setIsCountdown(false);
          setShowTimer(true);
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const skipCountdown = useCallback(() => {
    setIsCountdown(false);
    setShowTimer(true);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, []);

  const pauseCountdown = useCallback(() => {
    setIsCountdownPaused(true);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, []);

  const resumeCountdown = useCallback(() => {
    setIsCountdownPaused(false);
    countdownRef.current = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          setIsCountdown(false);
          setShowTimer(true);
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const cancelCountdown = useCallback(() => {
    setIsCountdown(false);
    setShowTimer(false);
    setValidatedConfig(null);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, []);

  const resetTimer = useCallback(() => {
    setShowTimer(false);
    setValidatedConfig(null);
    setIsCountdown(false);
    setCountdownValue(10);
    setIsCountdownPaused(false);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, []);

  // Si on a des paramètres URL, on va directement au timer
  if (roundsParam && durationParam) {
    const config: EMOMConfig = {
      rounds: parseInt(roundsParam, 10),
      duration: parseInt(durationParam, 10)
    };
    
    return (
      <TimerComponent 
        config={config}
        isLandscape={isLandscape}
        onResetTimer={resetTimer}
      />
    );
  }

  // Countdown phase
  if (isCountdown) {
    return (
      <CountdownComponent
        countdownValue={countdownValue}
        isCountdownPaused={isCountdownPaused}
        onSkipCountdown={skipCountdown}
        onPauseCountdown={pauseCountdown}
        onResumeCountdown={resumeCountdown}
        onCancelCountdown={cancelCountdown}
      />
    );
  }

  // Timer execution phase
  if (showTimer && validatedConfig) {
    return (
      <TimerComponent 
        config={validatedConfig}
        isLandscape={isLandscape}
        onResetTimer={resetTimer}
      />
    );
  }

  // Configuration phase
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#87CEEB" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#FFD700', fontSize: 24, fontWeight: 'bold', letterSpacing: 2 }}>
            EMOM
          </Text>
          <Text style={{ color: '#87CEEB', fontSize: 14, marginTop: 4 }}>
            Every Minute On the Minute
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ConfigComponent 
        onStartCountdown={(config) => {
          setValidatedConfig(config);
          startCountdown();
        }}
        initialRounds={roundsParam ? parseInt(roundsParam, 10) : 10}
        initialDuration={durationParam ? parseInt(durationParam, 10) : 60}
      />
    </SafeAreaView>
  );
}