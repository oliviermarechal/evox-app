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
import BlockSelectorModal from '@/components/workout/execution/BlockSelectorModal';

export default function WorkoutExecutionScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { isLandscape } = useOrientation();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isBlockActive, setIsBlockActive] = useState(false);
  const [isBlockCompleted, setIsBlockCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [showBlockSelector, setShowBlockSelector] = useState(false);

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

  const getNextUncompletedBlockIndex = useCallback(() => {
    if (!workout) return null;
    
    for (let i = 0; i < workout.blocks.length; i++) {
      if (!completedBlocks.has(workout.blocks[i].id)) {
        return i;
      }
    }
    return null;
  }, [workout, completedBlocks]);

  const currentBlock = workout?.blocks[currentBlockIndex];
  const nextUncompletedBlockIndex = getNextUncompletedBlockIndex();
  const nextBlock = nextUncompletedBlockIndex !== null && workout 
    ? workout.blocks[nextUncompletedBlockIndex] 
    : null;
  const isLastBlock = nextUncompletedBlockIndex === null;

  const handleStartBlock = () => {
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

  const handleBlockEnd = useCallback(() => {
    setIsBlockActive(false);
    setIsBlockCompleted(true);
    setShowCelebration(true);
    
    if (currentBlock) {
      setCompletedBlocks(prev => {
        const newSet = new Set([...prev, currentBlock.id]);
        return newSet;
      });
    }
  }, [currentBlock]);

  const handleNextBlock = () => {
    const nextIndex = getNextUncompletedBlockIndex();
    
    if (nextIndex === null) {
      router.back();
    } else {
      setCurrentBlockIndex(nextIndex);
      setIsBlockCompleted(false);
      setShowCelebration(false);
      setIsCountdownActive(true);
      countdown.reset();
      countdown.start();
    }
  };

  const handleSelectBlock = (blockId: string) => {
    const blockIndex = workout?.blocks.findIndex(b => b.id === blockId);
    if (blockIndex !== undefined && blockIndex >= 0) {
      setCurrentBlockIndex(blockIndex);
      setIsBlockCompleted(false);
      setShowCelebration(false);
      setIsCountdownActive(false);
      countdown.reset();
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
            currentBlockIndex={currentBlockIndex}
            nextBlockIndex={nextUncompletedBlockIndex}
            totalBlocks={workout.blocks.length}
            isLastBlock={isLastBlock}
            showCelebration={showCelebration}
            isLandscape={isLandscape}
            onStartBlock={handleStartBlock}
            onNextBlock={handleNextBlock}
            onBack={handleBack}
            onSelectBlock={() => setShowBlockSelector(true)}
          />
        </View>
      )}

      {workout && (
        <BlockSelectorModal
          visible={showBlockSelector}
          blocks={workout.blocks}
          currentBlockId={currentBlock?.id || ''}
          completedBlocks={completedBlocks}
          onSelectBlock={handleSelectBlock}
          onClose={() => setShowBlockSelector(false)}
        />
      )}
    </SafeAreaView>
  );
}
