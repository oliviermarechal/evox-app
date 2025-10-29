import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Workout } from '@/lib/types';
import { WorkoutStorage } from '@/lib/storage';
import { useOrientation } from '@/hooks/useOrientation';
import { useCountdown } from '@/hooks/workout/useCountdown';
import { getTimerConfig } from '@/utils/workoutUtils';

import PortraitReady from '@/components/timers/screens/PortraitReady';
import LandscapeReady from '@/components/timers/screens/LandscapeReady';
import BlockTransitionScreen from '@/components/workout/execution/BlockTransitionScreen';
import TimerRenderer from '@/components/workout/execution/TimerRenderer';

export default function WorkoutExecutionScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { isLandscape } = useOrientation();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isBlockActive, setIsBlockActive] = useState(false);
  const [isBlockCompleted, setIsBlockCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  // Countdown hook
  const countdown = useCountdown({
    initialValue: 10,
    onComplete: () => {
      setIsCountdownActive(false);
      setIsBlockActive(true);
    },
  });

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    loadWorkout();
  }, [workoutId]);

  const loadWorkout = async () => {
    try {
      const workoutData = await WorkoutStorage.getWorkoutById(workoutId!);
      if (workoutData) {
        setWorkout(workoutData);
      }
    } catch (error) {
      console.error('Error loading workout:', error);
    }
  };

  const currentBlock = workout?.blocks[currentBlockIndex];
  const nextBlock = workout?.blocks[currentBlockIndex + 1] || null;
  const isLastBlock = currentBlockIndex === (workout?.blocks.length || 0) - 1;

  const handleStartBlock = () => {
    // Si on vient de terminer un bloc, passer au suivant d'abord
    if (showCelebration && !isLastBlock) {
      handleNextBlock();
    } else {
      setIsCountdownActive(true);
      countdown.start();
    }
  };

  const handleSkipCountdown = () => {
    setIsCountdownActive(false);
    countdown.skip();
  };

  const handleToggleCountdownPause = () => {
    if (countdown.isPaused) {
      countdown.resume();
    } else {
      countdown.pause();
    }
  };

  const handleReadyToStart = () => {
    setIsCountdownActive(true);
    countdown.start();
  };

  // Fonction unifiée pour gérer la fin de bloc (fin naturelle ou swipe to stop)
  const handleBlockEnd = useCallback(() => {
    setIsBlockActive(false);
    setIsBlockCompleted(true);
    setShowCelebration(true);
  }, []);

  const handleNextBlock = () => {
    if (isLastBlock) {
      router.back();
    } else {
      setCurrentBlockIndex(prev => prev + 1);
      setIsBlockCompleted(false);
      setShowCelebration(false);
      // Launch next block countdown immediately
      setIsCountdownActive(true);
      countdown.reset();
      countdown.start();
    }
  };

  const handleCountdownBack = () => {
    setIsCountdownActive(false);
    countdown.reset();
  };

  const handleBack = () => {
    router.back();
  };

  if (!workout || !currentBlock) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#F5F5DC', fontSize: 18 }}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const ReadyComponent = isLandscape ? LandscapeReady : PortraitReady;
  const timerConfig = getTimerConfig(currentBlock);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0F0F10',
      }}>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(135, 206, 235, 0.02)',
        }} />
      </View>

      {isCountdownActive ? (
        <ReadyComponent
          title={currentBlock.timerType}
          config={timerConfig}
          onStartCountdown={handleReadyToStart}
          onBack={handleCountdownBack}
          onSkipCountdown={handleSkipCountdown}
          countdownValue={countdown.countdownValue}
          isCountdown={true}
          isPaused={countdown.isPaused}
          onTogglePause={handleToggleCountdownPause}
        />
      ) : isBlockActive ? (
        <View style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5 
        }}>
          {currentBlock && (
            <TimerRenderer
              block={currentBlock}
              isLandscape={isLandscape}
              onResetTimer={handleBlockEnd}
              skipFinalScreen={true}
            />
          )}
        </View>
      ) : (
        <View style={{ flex: 1, zIndex: 5 }}>
          <BlockTransitionScreen
            currentBlock={currentBlock}
            nextBlock={nextBlock}
            blockIndex={currentBlockIndex}
            totalBlocks={workout.blocks.length}
            isLastBlock={isLastBlock}
            showCelebration={showCelebration}
            isLandscape={isLandscape}
            onStartBlock={handleStartBlock}
            onNextBlock={handleNextBlock}
            onBack={handleBack}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
