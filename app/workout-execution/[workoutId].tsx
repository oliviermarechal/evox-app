import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Workout, WorkoutBlock } from '@/lib/types';
import { WorkoutStorage } from '@/lib/storage';
import { useOrientation } from '@/hooks/useOrientation';

// Import des TimerComponents
import AMRAPTimer from '@/app/timers/amrap/TimerComponent';
import EMOMTimer from '@/app/timers/emom/TimerComponent';
import ForTimeTimer from '@/app/timers/fortime/TimerComponent';
import FreeTimer from '@/app/timers/free/TimerComponent';
import TabataTimer from '@/app/timers/tabata/TimerComponent';

export default function WorkoutExecutionScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { isLandscape, dimensions } = useOrientation();
  
  // Permettre l'orientation libre pendant l'exécution des workouts
  useEffect(() => {
    // Débloquer l'orientation pour permettre le libre choix
    ScreenOrientation.unlockAsync();
    
    // Nettoyer en quittant l'écran
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isBlockActive, setIsBlockActive] = useState(false);
  const [isBlockCompleted, setIsBlockCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

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
  const isLastBlock = currentBlockIndex === (workout?.blocks.length || 0) - 1;

  const handleStartBlock = () => {
    setIsBlockActive(true);
  };

  const handleBlockComplete = () => {
    setIsBlockActive(false);
    setIsBlockCompleted(true);
    setShowCelebration(true);
  };

  const handleNextBlock = () => {
    if (isLastBlock) {
      // Workout completed
      router.back();
    } else {
      setCurrentBlockIndex(prev => prev + 1);
      setIsBlockCompleted(false);
      setShowCelebration(false);
    }
  };

  const getBlockSummary = (block: WorkoutBlock) => {
    let timerInfo = '';
    switch (block.timerType) {
      case 'AMRAP':
        timerInfo = `${block.timerConfig.duration}min • As Many Rounds As Possible`;
        break;
      case 'EMOM':
        timerInfo = `${block.timerConfig.rounds} rounds × ${block.timerConfig.intervalDuration}s • Every Minute On the Minute`;
        break;
      case 'ForTime':
        const setsText = block.sets ? `${block.sets} sets` : 'Unlimited sets';
        const restText = (block.sets && block.sets > 0 && block.timerConfig.restTime) ? ` • ${block.timerConfig.restTime}s rest` : '';
        const targetText = block.timerConfig.targetTime ? ` • Target: ${block.timerConfig.targetTime}s` : '';
        timerInfo = `${setsText}${restText}${targetText} • As fast as possible`;
        break;
      case 'Tabata':
        timerInfo = `${block.timerConfig.rounds} rounds × ${block.timerConfig.workTime}s/${block.timerConfig.restTime}s • High Intensity Interval`;
        break;
    }

    return { timerInfo };
  };

  const renderExerciseList = (exercises: any[]) => {
    return (
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: isLandscape ? 6 : 8,
      }}>
        {exercises.map((exercise, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: isLandscape ? 4 : 6,
            paddingHorizontal: isLandscape ? 8 : 10,
            backgroundColor: 'rgba(135, 206, 235, 0.15)',
            borderRadius: isLandscape ? 16 : 20,
            borderWidth: 1,
            borderColor: 'rgba(135, 206, 235, 0.3)',
          }}>
            <View style={{
              width: isLandscape ? 16 : 18,
              height: isLandscape ? 16 : 18,
              borderRadius: isLandscape ? 8 : 9,
              backgroundColor: '#87CEEB',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: isLandscape ? 6 : 8,
            }}>
              <Text style={{
                color: '#0F0F10',
                fontSize: isLandscape ? 9 : 10,
                fontWeight: 'bold',
              }}>
                {index + 1}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                color: '#F5F5DC',
                fontSize: isLandscape ? 12 : 14,
                fontWeight: '600',
                marginRight: exercise.volume ? 6 : 0,
              }}>
                {exercise.name}
              </Text>
              {exercise.volume && (
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.8)',
                  fontSize: isLandscape ? 10 : 12,
                }}>
                  {exercise.volume} {exercise.unit}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderTimerComponent = () => {
    if (!currentBlock || !isBlockActive) return null;

    const commonProps = {
      onResetTimer: () => {
        handleBlockComplete();
      },
    };

    switch (currentBlock.timerType) {
      case 'AMRAP':
        // Convert duration (minutes) to minutes and seconds
        const duration = currentBlock.timerConfig.duration!;
        const amrapConfig = {
          minutes: Math.floor(duration),
          seconds: 0,
        };
        return (
          <AMRAPTimer
            config={amrapConfig}
            {...commonProps}
          />
        );
      case 'EMOM':
        const intervalDuration = currentBlock.timerConfig.intervalDuration!;
        const emomConfig = {
          rounds: currentBlock.timerConfig.rounds!,
          duration: intervalDuration,
        };
        return (
          <EMOMTimer
            config={emomConfig}
            {...commonProps}
          />
        );
      case 'ForTime':
        // Si pas de targetTime, utiliser le Free timer (mode infini)
        if (!currentBlock.timerConfig.targetTime) {
          return (
            <FreeTimer
              {...commonProps}
            />
          );
        }
        
        // Sinon, utiliser le ForTime timer avec targetTime
        const targetTime = currentBlock.timerConfig.targetTime;
        const forTimeConfig = {
          minutes: Math.floor(targetTime / 60),
          seconds: targetTime % 60,
        };
        return (
          <ForTimeTimer
            config={forTimeConfig}
            {...commonProps}
          />
        );
      case 'Tabata':
        const tabataConfig = {
          rounds: currentBlock.timerConfig.rounds!,
          workTime: currentBlock.timerConfig.workTime!,
          restTime: currentBlock.timerConfig.restTime!,
        };
        return (
          <TabataTimer
            config={tabataConfig}
            isLandscape={isLandscape}
            {...commonProps}
          />
        );
      default:
        return null;
    }
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

  const { timerInfo } = getBlockSummary(currentBlock);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Background with subtle gradient */}
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

      {isBlockActive ? (
        // Timer Component - Full screen access
        <View style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5 
        }}>
          {renderTimerComponent()}
        </View>
      ) : (
        // Block Summary or Celebration
        <View style={{ flex: 1, zIndex: 5 }}>
          {showCelebration ? (
            // Celebration Screen
            <View style={{
              flex: 1,
              justifyContent: isLandscape ? 'flex-start' : 'center',
              alignItems: 'center',
              padding: isLandscape ? 16 : 24,
              paddingTop: isLandscape ? 40 : 24,
            }}>
              <View style={{
                backgroundColor: 'rgba(18, 18, 18, 0.9)',
                borderRadius: 24,
                padding: isLandscape ? 24 : 40,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#4CAF50',
                shadowColor: '#4CAF50',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 8,
                width: '100%',
                maxWidth: isLandscape ? 600 : 400,
              }}>
                <FontAwesome name="trophy" size={64} color="#4CAF50" />
                <Text style={{
                  color: '#4CAF50',
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginTop: 16,
                  textAlign: 'center',
                }}>
                  Block Completed!
                </Text>
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.8)',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                  Great job! Ready for the next block?
                </Text>
                
                {/* Continue Button */}
                <TouchableOpacity
                  onPress={handleNextBlock}
                  style={{
                    backgroundColor: '#4CAF50',
                    borderRadius: 16,
                    paddingVertical: 16,
                    paddingHorizontal: 32,
                    marginTop: 24,
                    shadowColor: '#4CAF50',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 15,
                    elevation: 8,
                  }}
                >
                  <Text style={{
                    color: '#0F0F10',
                    fontSize: 16,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                  }}>
                    {isLastBlock ? 'FINISH WORKOUT' : 'NEXT BLOCK'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Block Summary Screen
            <View style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }}>
                <View style={{
                  padding: isLandscape ? 12 : 16,
                  paddingTop: isLandscape ? 20 : 24,
                  paddingBottom: isLandscape ? 100 : 120, // Espace pour le bouton fixe
                }}>
                {/* Block Number */}
                <View style={{
                  backgroundColor: 'rgba(135, 206, 235, 0.05)',
                  borderRadius: isLandscape ? 12 : 16,
                  padding: isLandscape ? 12 : 16,
                  marginBottom: isLandscape ? 16 : 24,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(135, 206, 235, 0.2)',
                }}>
                  <Text style={{
                    color: '#87CEEB',
                    fontSize: isLandscape ? 12 : 14,
                    fontWeight: '600',
                    marginBottom: isLandscape ? 2 : 4,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    Block {currentBlockIndex + 1} of {workout.blocks.length}
                  </Text>
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: isLandscape ? 18 : 20,
                    fontWeight: 'bold',
                  }}>
                    {currentBlock.name}
                  </Text>
                </View>

                {/* Timer Info */}
                <View style={{
                  backgroundColor: 'rgba(135, 206, 235, 0.05)',
                  borderRadius: isLandscape ? 12 : 16,
                  padding: isLandscape ? 12 : 20,
                  marginBottom: isLandscape ? 16 : 24,
                  borderWidth: 1,
                  borderColor: 'rgba(135, 206, 235, 0.2)',
                }}>
                  <Text style={{
                    color: 'rgba(135, 206, 235, 0.8)',
                    fontSize: isLandscape ? 12 : 14,
                    fontWeight: '600',
                    marginBottom: isLandscape ? 4 : 8,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    Timer Configuration
                  </Text>
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: isLandscape ? 14 : 16,
                    lineHeight: isLandscape ? 18 : 24,
                  }}>
                    {timerInfo}
                  </Text>
                </View>

                {/* Exercises */}
                <View style={{
                  backgroundColor: 'rgba(135, 206, 235, 0.05)',
                  borderRadius: isLandscape ? 12 : 16,
                  padding: isLandscape ? 12 : 20,
                  marginBottom: isLandscape ? 16 : 24,
                  borderWidth: 1,
                  borderColor: 'rgba(135, 206, 235, 0.2)',
                  flex: 1,
                }}>
                  <Text style={{
                    color: 'rgba(135, 206, 235, 0.8)',
                    fontSize: isLandscape ? 12 : 14,
                    fontWeight: '600',
                    marginBottom: isLandscape ? 8 : 12,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    Exercises ({currentBlock.exercises.length})
                  </Text>
                  <ScrollView 
                    style={{
                      maxHeight: isLandscape ? 80 : 200,
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    {renderExerciseList(currentBlock.exercises)}
                  </ScrollView>
                </View>
                </View>
              </ScrollView>
              
              <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: isLandscape ? 12 : 16,
                backgroundColor: '#0F0F10',
              }}>
                <TouchableOpacity
                  onPress={handleStartBlock}
                  style={{
                    backgroundColor: 'rgba(18, 18, 18, 0.9)',
                    borderRadius: isLandscape ? 12 : 16,
                    paddingVertical: isLandscape ? 14 : 20,
                    paddingHorizontal: isLandscape ? 24 : 32,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#87CEEB',
                    shadowColor: '#87CEEB',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 8,
                  }}
                >
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: isLandscape ? 16 : 18,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                  }}>
                    START BLOCK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Next Block Button (only if block completed) */}
      {isBlockCompleted && !showCelebration && (
        <View style={{ padding: 24 }}>
          <TouchableOpacity
            onPress={handleNextBlock}
            style={{
              backgroundColor: isLastBlock ? '#4CAF50' : '#87CEEB',
              borderRadius: 16,
              paddingVertical: 18,
              paddingHorizontal: 32,
              alignItems: 'center',
              shadowColor: isLastBlock ? '#4CAF50' : '#87CEEB',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <Text style={{
              color: '#0F0F10',
              fontSize: 16,
              fontWeight: 'bold',
              letterSpacing: 1,
            }}>
              {isLastBlock ? 'FINISH WORKOUT' : 'NEXT BLOCK'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
