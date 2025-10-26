import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { WorkoutBlock, Exercise, ExerciseTemplate } from '@/lib/types';
import ExerciseSelector from './ExerciseSelector';
import ExerciseCard from './ExerciseCard';
import WheelPicker from '@/components/ui/WheelPicker';

interface BlockBuilderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (block: Omit<WorkoutBlock, 'id'>) => void;
  blockNumber: number;
  editingBlock?: WorkoutBlock | null;
}

export default function BlockBuilderModal({ 
  visible, 
  onClose, 
  onSave, 
  blockNumber,
  editingBlock = null
}: BlockBuilderModalProps) {
  const [currentStep, setCurrentStep] = useState<'timer' | 'config' | 'exercises'>('timer');
  const [selectedTimer, setSelectedTimer] = useState<'AMRAP' | 'EMOM' | 'ForTime' | 'Tabata'>('AMRAP');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [sets, setSets] = useState<number | undefined>(undefined);
  const [showRestTime, setShowRestTime] = useState(false);
  
  // WheelPicker states
  const [selectedDurationIndex, setSelectedDurationIndex] = useState(0);
  const [selectedRoundsIndex, setSelectedRoundsIndex] = useState(0);
  const [selectedIntervalIndex, setSelectedIntervalIndex] = useState(0);
  const [selectedWorkTimeIndex, setSelectedWorkTimeIndex] = useState(0);
  const [selectedRestTimeIndex, setSelectedRestTimeIndex] = useState(0);
  const [selectedForTimeIndex, setSelectedForTimeIndex] = useState(0);
  const [timerConfig, setTimerConfig] = useState({
    duration: 10, // AMRAP
    rounds: 10, // EMOM
    intervalDuration: 60, // EMOM
    workTime: 20, // Tabata
    restTime: 10, // Tabata
    targetTime: 0, // ForTime
  });

  // Initialiser avec les données du bloc en cours d'édition
  useEffect(() => {
    if (editingBlock) {
      setSelectedTimer(editingBlock.timerType);
      setSelectedExercises(editingBlock.exercises);
      setTimerConfig(editingBlock.timerConfig);
      setSets(editingBlock.sets);
      setCurrentStep('exercises'); // Aller directement aux exercices si on édite
      
      // Initialiser les indices des WheelPickers
      // Convert AMRAP duration from seconds to minutes for editing
      const durationValue = editingBlock.timerType === 'AMRAP' 
        ? Math.floor(editingBlock.timerConfig.duration! / 60) 
        : editingBlock.timerConfig.duration;
      const durationIndex = durationOptions.findIndex(opt => opt.value === durationValue);
      const roundsIndex = roundsOptions.findIndex(opt => opt.value === editingBlock.timerConfig.rounds);
      const intervalIndex = intervalOptions.findIndex(opt => opt.value === editingBlock.timerConfig.intervalDuration);
      const workTimeIndex = workTimeOptions.findIndex(opt => opt.value === editingBlock.timerConfig.workTime);
      const restTimeIndex = restTimeOptions.findIndex(opt => opt.value === editingBlock.timerConfig.restTime);
      const forTimeIndex = forTimeOptions.findIndex(opt => opt.value === editingBlock.timerConfig.targetTime);
      
      setSelectedDurationIndex(durationIndex >= 0 ? durationIndex : 0);
      setSelectedRoundsIndex(roundsIndex >= 0 ? roundsIndex : 0);
      setSelectedIntervalIndex(intervalIndex >= 0 ? intervalIndex : 0);
      setSelectedWorkTimeIndex(workTimeIndex >= 0 ? workTimeIndex : 0);
      setSelectedRestTimeIndex(restTimeIndex >= 0 ? restTimeIndex : 0);
      setSelectedForTimeIndex(forTimeIndex >= 0 ? forTimeIndex : 0);
      
      // Initialiser la case à cocher Rest Time
      setShowRestTime(editingBlock.timerConfig.restTime ? editingBlock.timerConfig.restTime > 0 : false);
    } else {
      // Reset pour nouveau bloc
      setCurrentStep('timer');
      setSelectedTimer('AMRAP');
      setSelectedExercises([]);
      setSets(undefined);
      setTimerConfig({
        duration: 10,
        rounds: 10,
        intervalDuration: 60,
        workTime: 20,
        restTime: 60, // Rest time par défaut pour ForTime
        targetTime: 0,
      });
      
      // Reset des indices
      setSelectedDurationIndex(0);
      setSelectedRoundsIndex(0);
      setSelectedIntervalIndex(0);
      setSelectedWorkTimeIndex(0);
      setSelectedRestTimeIndex(0);
      setSelectedForTimeIndex(0);
      setShowRestTime(false);
    }
  }, [editingBlock, visible]);

  // Reset restTime quand on revient à 1 set ou moins
  useEffect(() => {
    if (sets && sets <= 1) {
      setShowRestTime(false);
      setTimerConfig(prev => ({ ...prev, restTime: 0 }));
    }
  }, [sets]);

  const timerTypes = [
    { type: 'AMRAP' as const, icon: 'repeat', color: '#F44336', name: 'AMRAP' },
    { type: 'EMOM' as const, icon: 'clock-o', color: '#FF9800', name: 'EMOM' },
    { type: 'ForTime' as const, icon: 'clock-o', color: '#4CAF50', name: 'For Time' },
    { type: 'Tabata' as const, icon: 'fire', color: '#E91E63', name: 'Tabata' },
  ];

  // WheelPicker data - basées sur les timersConfiguration
  const generateTimeIntervals = () => {
    const intervals = [];
    
    intervals.push({ value: 10, label: '10s' });
    intervals.push({ value: 20, label: '20s' });
    intervals.push({ value: 30, label: '30s' });
    intervals.push({ value: 40, label: '40s' });
    intervals.push({ value: 45, label: '45s' });
    intervals.push({ value: 60, label: '1 min' });
    
    for (let seconds = 75; seconds <= 900; seconds += 15) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      if (remainingSeconds === 0) {
        intervals.push({ value: seconds, label: `${minutes} min` });
      } else {
        intervals.push({ value: seconds, label: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` });
      }
    }
    
    return intervals;
  };

  const generateAMRAPIntervals = () => {
    const intervals = [];
    
    // Générer des intervalles de 1 à 60 minutes pour AMRAP
    for (let minutes = 1; minutes <= 60; minutes++) {
      intervals.push({ 
        value: minutes, 
        label: `${minutes} min` 
      });
    }
    
    return intervals;
  };

  const generateForTimeIntervals = () => {
    const intervals = [];
    
    // Ajouter l'option "Infinity" en premier
    intervals.push({ value: 0, label: '∞' });
    
    // Générer les intervalles de 0:15 à 19:45 (par incréments de 15 secondes)
    for (let minutes = 0; minutes <= 19; minutes++) {
      for (let seconds = 0; seconds < 60; seconds += 15) {
        if (minutes === 0 && seconds === 0) continue; // Skip 0:00
        intervals.push({ 
          value: minutes * 60 + seconds, 
          label: `${minutes}:${seconds.toString().padStart(2, '0')}` 
        });
      }
    }
    
    intervals.push({ value: 1200, label: '20:00' });
    
    return intervals;
  };

  const generateRoundIntervals = () => {
    const intervals = [];
    for (let i = 1; i <= 50; i++) {
      intervals.push({
        value: i,
        label: `${i}`,
      });
    }
    return intervals;
  };

  const TIME_INTERVALS = generateTimeIntervals();
  const AMRAP_INTERVALS = generateAMRAPIntervals();
  const ROUND_INTERVALS = generateRoundIntervals();
  const FOR_TIME_INTERVALS = generateForTimeIntervals();
  
  const durationOptions = selectedTimer === 'AMRAP' ? AMRAP_INTERVALS : TIME_INTERVALS;
  const roundsOptions = ROUND_INTERVALS;
  const intervalOptions = TIME_INTERVALS;
  const workTimeOptions = TIME_INTERVALS;
  const restTimeOptions = TIME_INTERVALS;
  const forTimeOptions = FOR_TIME_INTERVALS;

  const handleTimerSelect = (timer: typeof selectedTimer) => {
    setSelectedTimer(timer);
    setCurrentStep('config');
  };

  const handleConfigComplete = () => {
    setCurrentStep('exercises');
  };

  const handleExerciseSelect = (template: ExerciseTemplate) => {
    const exercise: Exercise = {
      id: Date.now().toString(),
      templateId: template.id,
      name: template.name,
      unit: template.unit,
      volume: undefined,
    };
    setSelectedExercises(prev => [...prev, exercise]);
    setShowExerciseSelector(false);
  };

  const handleExerciseUpdate = (updatedExercise: Exercise) => {
    setSelectedExercises(prev => 
      prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex)
    );
  };

  const handleExerciseRemove = (exerciseId: string) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const resetState = () => {
    setCurrentStep('timer');
    setSelectedTimer('AMRAP');
    setSelectedExercises([]);
    setSets(undefined);
    setShowExerciseSelector(false);
    setTimerConfig({
      duration: 10,
      rounds: 10,
      intervalDuration: 60,
      workTime: 20,
      restTime: 60, // Rest time par défaut pour ForTime
      targetTime: 0,
    });
  };

  const handleSave = () => {
    // Convert AMRAP duration from minutes to seconds for storage
    const finalTimerConfig = { ...timerConfig };
    if (selectedTimer === 'AMRAP') {
      finalTimerConfig.duration = timerConfig.duration * 60; // Convert minutes to seconds
    }
    
    const block: Omit<WorkoutBlock, 'id'> = {
      name: `Block ${blockNumber} - ${selectedTimer}`,
      timerType: selectedTimer,
      exercises: selectedExercises,
      sets: sets,
      timerConfig: finalTimerConfig,
    };
    onSave(block);
    resetState();
    onClose();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const getBlockSubtitle = () => {
    if (selectedExercises.length === 0) return 'No exercises selected';
    
    const exerciseSummary = selectedExercises.map(ex => {
      const volume = ex.volume ? `${ex.volume} ${ex.unit}` : ex.name;
      return volume;
    }).join(', ');
    
    switch (selectedTimer) {
      case 'AMRAP':
        return `${timerConfig.duration}min • ${exerciseSummary}`;
      case 'EMOM':
        return `${timerConfig.rounds} rounds × ${timerConfig.intervalDuration}s • ${exerciseSummary}`;
      case 'Tabata':
        return `${timerConfig.rounds} rounds × ${timerConfig.workTime}s/${timerConfig.restTime}s • ${exerciseSummary}`;
      case 'ForTime':
        const setsText = sets ? `${sets} sets` : '';
        const restText = (sets && sets > 0 && timerConfig.restTime) ? ` • ${timerConfig.restTime}s rest` : '';
        return `${setsText}${restText} • As fast as possible • ${exerciseSummary}`;
      default:
        return exerciseSummary;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(135, 206, 235, 0.1)',
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              color: '#F5F5DC',
              fontSize: 18,
              fontWeight: 'bold',
              letterSpacing: 1,
            }}>
              Block {blockNumber} - {selectedTimer}
            </Text>
            {selectedExercises.length > 0 && (
              <Text style={{
                color: 'rgba(135, 206, 235, 0.7)',
                fontSize: 12,
                marginTop: 2,
              }}>
                {getBlockSubtitle()}
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            onPress={handleClose}
            style={{
              backgroundColor: 'rgba(135, 206, 235, 0.1)',
              borderRadius: 20,
              padding: 8,
              borderWidth: 1,
              borderColor: 'rgba(135, 206, 235, 0.3)',
            }}
          >
            <FontAwesome name="times" size={16} color="#87CEEB" />
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 24,
          paddingVertical: 12,
        }}>
          <View style={{
            flex: 1,
            height: 4,
            backgroundColor: 'rgba(135, 206, 235, 0.2)',
            borderRadius: 2,
            marginRight: 8,
          }}>
            <View style={{
              width: currentStep === 'timer' ? '33%' : currentStep === 'config' ? '66%' : '100%',
              height: '100%',
              backgroundColor: '#87CEEB',
              borderRadius: 2,
            }} />
          </View>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.7)',
            fontSize: 12,
            marginLeft: 8,
          }}>
            {currentStep === 'timer' ? '1/3' : currentStep === 'config' ? '2/3' : '3/3'}
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {currentStep === 'timer' ? (
            <View style={{ padding: 24 }}>
              <Text style={{
                color: '#F5F5DC',
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 12,
              }}>
                Choose timer type
              </Text>
              
              <Text style={{
                color: 'rgba(135, 206, 235, 0.7)',
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 32,
              }}>
                What type of workout is this?
              </Text>

              {timerTypes.map((timer) => (
                <TouchableOpacity
                  key={timer.type}
                  onPress={() => handleTimerSelect(timer.type)}
                  style={{
                    backgroundColor: 'rgba(135, 206, 235, 0.05)',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(135, 206, 235, 0.2)',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <FontAwesome 
                    name={timer.icon as any} 
                    size={24} 
                    color={timer.color} 
                  />
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: 18,
                    fontWeight: '600',
                    marginLeft: 16,
                  }}>
                    {timer.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : currentStep === 'config' ? (
            <View style={{ padding: 24 }}>
              <Text style={{
                color: '#F5F5DC',
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 12,
              }}>
                Configure {selectedTimer}
              </Text>
              
              <Text style={{
                color: 'rgba(135, 206, 235, 0.7)',
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 32,
              }}>
                Set up your timer parameters
              </Text>

              {/* Back to Exercises Link for Editing Mode */}
              {editingBlock && (
                <TouchableOpacity
                  onPress={() => setCurrentStep('exercises')}
                  style={{
                    backgroundColor: 'rgba(135, 206, 235, 0.1)',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: 'rgba(135, 206, 235, 0.3)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FontAwesome name="list" size={16} color="#87CEEB" style={{ marginRight: 8 }} />
                  <Text style={{
                    color: '#87CEEB',
                    fontSize: 14,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}>
                    Back to Exercises
                  </Text>
                  <FontAwesome name="chevron-right" size={12} color="#87CEEB" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              )}

              {/* Timer Configuration */}
              <View style={{
                backgroundColor: 'rgba(135, 206, 235, 0.05)',
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: 'rgba(135, 206, 235, 0.2)',
              }}>
                {selectedTimer === 'AMRAP' && (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{
                      color: '#F5F5DC',
                      fontSize: 18,
                      fontWeight: '600',
                      marginBottom: 24,
                      textAlign: 'center',
                    }}>
                      AMRAP Configuration
                    </Text>
                    
                    <View style={{
                      backgroundColor: 'rgba(135, 206, 235, 0.05)',
                      borderRadius: 16,
                      padding: 20,
                      borderWidth: 1.5,
                      borderColor: 'rgba(135, 206, 235, 0.3)',
                      alignItems: 'center',
                      shadowColor: '#87CEEB',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.4,
                      elevation: 8,
                      width: 240
                    }}>
                      <Text style={{
                        color: 'rgba(135, 206, 235, 0.8)',
                        fontSize: 12,
                        fontWeight: '500',
                        marginBottom: 16,
                        textAlign: 'center',
                        letterSpacing: 1,
                        opacity: 0.8
                      }}>
                        DURATION
                      </Text>
                      <View style={{ 
                        height: 200,
                        width: 200,
                        borderRadius: 12,
                        overflow: 'hidden'
                      }}>
                        <WheelPicker
                          items={durationOptions}
                          selectedIndex={selectedDurationIndex}
                          onIndexChange={(index) => {
                            setSelectedDurationIndex(index);
                            setTimerConfig(prev => ({ ...prev, duration: durationOptions[index].value }));
                          }}
                          width={200}
                          itemHeight={40}
                          visibleItems={5}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {selectedTimer === 'EMOM' && (
                  <View>
                    <Text style={{
                      color: '#F5F5DC',
                      fontSize: 18,
                      fontWeight: '600',
                      marginBottom: 24,
                      textAlign: 'center',
                    }}>
                      EMOM Configuration
                    </Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
                      {/* Rounds WheelPicker */}
                      <View style={{
                        backgroundColor: 'rgba(135, 206, 235, 0.05)',
                        borderRadius: 16,
                        padding: 20,
                        borderWidth: 1.5,
                        borderColor: 'rgba(135, 206, 235, 0.3)',
                        alignItems: 'center',
                        shadowColor: '#87CEEB',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        elevation: 8,
                        flex: 1
                      }}>
                        <Text style={{
                          color: 'rgba(135, 206, 235, 0.8)',
                          fontSize: 12,
                          fontWeight: '500',
                          marginBottom: 16,
                          textAlign: 'center',
                          letterSpacing: 1,
                          opacity: 0.8
                        }}>
                          ROUNDS
                        </Text>
                        <View style={{ 
                          height: 200,
                          width: '100%',
                          borderRadius: 12,
                          overflow: 'hidden'
                        }}>
                          <WheelPicker
                            items={roundsOptions}
                            selectedIndex={selectedRoundsIndex}
                            onIndexChange={(index) => {
                              setSelectedRoundsIndex(index);
                              setTimerConfig(prev => ({ ...prev, rounds: roundsOptions[index].value }));
                            }}
                            width="100%"
                            itemHeight={40}
                            visibleItems={5}
                          />
                        </View>
                      </View>

                      {/* Duration WheelPicker */}
                      <View style={{
                        backgroundColor: 'rgba(135, 206, 235, 0.05)',
                        borderRadius: 16,
                        padding: 20,
                        borderWidth: 1.5,
                        borderColor: 'rgba(135, 206, 235, 0.3)',
                        alignItems: 'center',
                        shadowColor: '#87CEEB',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        elevation: 8,
                        flex: 1
                      }}>
                        <Text style={{
                          color: 'rgba(135, 206, 235, 0.8)',
                          fontSize: 12,
                          fontWeight: '500',
                          marginBottom: 16,
                          textAlign: 'center',
                          letterSpacing: 1,
                          opacity: 0.8
                        }}>
                          DURATION
                        </Text>
                        <View style={{ 
                          height: 200,
                          width: '100%',
                          borderRadius: 12,
                          overflow: 'hidden'
                        }}>
                          <WheelPicker
                            items={intervalOptions}
                            selectedIndex={selectedIntervalIndex}
                            onIndexChange={(index) => {
                              setSelectedIntervalIndex(index);
                              setTimerConfig(prev => ({ ...prev, intervalDuration: intervalOptions[index].value }));
                            }}
                            width="100%"
                            itemHeight={40}
                            visibleItems={5}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                {selectedTimer === 'ForTime' && (
                  <View>
                    <Text style={{
                      color: '#F5F5DC',
                      fontSize: 18,
                      fontWeight: '600',
                      marginBottom: 24,
                      textAlign: 'center',
                    }}>
                      ForTime Configuration
                    </Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
                      {/* Sets WheelPicker */}
                      <View style={{
                        backgroundColor: 'rgba(135, 206, 235, 0.05)',
                        borderRadius: 16,
                        padding: 20,
                        borderWidth: 1.5,
                        borderColor: 'rgba(135, 206, 235, 0.3)',
                        alignItems: 'center',
                        shadowColor: '#87CEEB',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        elevation: 8,
                        flex: 1
                      }}>
                        <Text style={{
                          color: 'rgba(135, 206, 235, 0.8)',
                          fontSize: 12,
                          fontWeight: '500',
                          marginBottom: 16,
                          textAlign: 'center',
                          letterSpacing: 1,
                          opacity: 0.8
                        }}>
                          SETS
                        </Text>
                        <View style={{ 
                          height: 200,
                          width: '100%',
                          borderRadius: 12,
                          overflow: 'hidden'
                        }}>
                          <WheelPicker
                            items={roundsOptions}
                            selectedIndex={selectedRoundsIndex}
                            onIndexChange={(index) => {
                              setSelectedRoundsIndex(index);
                              setSets(roundsOptions[index].value);
                            }}
                            width="100%"
                            itemHeight={40}
                            visibleItems={5}
                          />
                        </View>
                      </View>

                      {/* Target Time WheelPicker */}
                      <View style={{
                        backgroundColor: 'rgba(135, 206, 235, 0.05)',
                        borderRadius: 16,
                        padding: 20,
                        borderWidth: 1.5,
                        borderColor: 'rgba(135, 206, 235, 0.3)',
                        alignItems: 'center',
                        shadowColor: '#87CEEB',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        elevation: 8,
                        flex: 1
                      }}>
                        <Text style={{
                          color: 'rgba(135, 206, 235, 0.8)',
                          fontSize: 12,
                          fontWeight: '500',
                          marginBottom: 16,
                          textAlign: 'center',
                          letterSpacing: 1,
                          opacity: 0.8
                        }}>
                          TARGET TIME
                        </Text>
                        <View style={{ 
                          height: 200,
                          width: '100%',
                          borderRadius: 12,
                          overflow: 'hidden'
                        }}>
                          <WheelPicker
                            items={forTimeOptions}
                            selectedIndex={selectedForTimeIndex}
                            onIndexChange={(index) => {
                              setSelectedForTimeIndex(index);
                              setTimerConfig(prev => ({ ...prev, targetTime: forTimeOptions[index].value }));
                            }}
                            width="100%"
                            itemHeight={40}
                            visibleItems={5}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Rest Time - case à cocher toujours visible */}
                    <View style={{ marginTop: 16 }}>
                      {/* Case à cocher pour afficher/masquer Rest Time */}
                      <TouchableOpacity
                        onPress={() => {
                          if (sets && sets > 1) {
                            setShowRestTime(!showRestTime);
                          }
                        }}
                        disabled={!sets || sets <= 1}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 16,
                          paddingVertical: 8,
                          opacity: (!sets || sets <= 1) ? 0.4 : 1,
                        }}
                      >
                        <View style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: showRestTime && sets && sets > 1 ? '#87CEEB' : 'rgba(135, 206, 235, 0.3)',
                          backgroundColor: showRestTime && sets && sets > 1 ? '#87CEEB' : 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 12,
                        }}>
                          {showRestTime && sets && sets > 1 && (
                            <FontAwesome name="check" size={12} color="#0F0F10" />
                          )}
                        </View>
                        <Text style={{
                          color: showRestTime && sets && sets > 1 ? '#87CEEB' : 'rgba(135, 206, 235, 0.6)',
                          fontSize: 14,
                          fontWeight: '500',
                        }}>
                          Add rest time between sets
                          {(!sets || sets <= 1) && ' (requires 2+ sets)'}
                        </Text>
                      </TouchableOpacity>

                      {/* WheelPicker Rest Time - seulement si case cochée et sets > 1 */}
                      {showRestTime && sets && sets > 1 && (
                        <View style={{
                          backgroundColor: 'rgba(135, 206, 235, 0.05)',
                          borderRadius: 16,
                          padding: 20,
                          borderWidth: 1.5,
                          borderColor: 'rgba(135, 206, 235, 0.3)',
                          alignItems: 'center',
                          shadowColor: '#87CEEB',
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.4,
                          elevation: 8,
                        }}>
                          <Text style={{
                            color: 'rgba(135, 206, 235, 0.8)',
                            fontSize: 12,
                            fontWeight: '500',
                            marginBottom: 16,
                            textAlign: 'center',
                            letterSpacing: 1,
                            opacity: 0.8
                          }}>
                            REST TIME
                          </Text>
                          <View style={{ 
                            height: 200,
                            width: 200,
                            borderRadius: 12,
                            overflow: 'hidden'
                          }}>
                            <WheelPicker
                              items={restTimeOptions}
                              selectedIndex={selectedRestTimeIndex}
                              onIndexChange={(index) => {
                                setSelectedRestTimeIndex(index);
                                setTimerConfig(prev => ({ ...prev, restTime: restTimeOptions[index].value }));
                              }}
                              width={200}
                              itemHeight={40}
                              visibleItems={5}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {selectedTimer === 'Tabata' && (
                  <View>
                    <Text style={{
                      color: '#F5F5DC',
                      fontSize: 18,
                      fontWeight: '600',
                      marginBottom: 24,
                      textAlign: 'center',
                    }}>
                      Tabata Configuration
                    </Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                      {/* Rounds WheelPicker */}
                      <View style={{
                        backgroundColor: 'rgba(135, 206, 235, 0.05)',
                        borderRadius: 16,
                        padding: 16,
                        borderWidth: 1.5,
                        borderColor: 'rgba(135, 206, 235, 0.3)',
                        alignItems: 'center',
                        shadowColor: '#87CEEB',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        elevation: 8,
                        flex: 1
                      }}>
                        <Text style={{
                          color: 'rgba(135, 206, 235, 0.8)',
                          fontSize: 10,
                          fontWeight: '500',
                          marginBottom: 12,
                          textAlign: 'center',
                          letterSpacing: 1,
                          opacity: 0.8
                        }}>
                          ROUNDS
                        </Text>
                        <View style={{ 
                          height: 180,
                          width: '100%',
                          borderRadius: 12,
                          overflow: 'hidden'
                        }}>
                          <WheelPicker
                            items={roundsOptions}
                            selectedIndex={selectedRoundsIndex}
                            onIndexChange={(index) => {
                              setSelectedRoundsIndex(index);
                              setTimerConfig(prev => ({ ...prev, rounds: roundsOptions[index].value }));
                            }}
                            width="100%"
                            itemHeight={36}
                            visibleItems={5}
                          />
                        </View>
                      </View>

                      {/* Work Time WheelPicker */}
                      <View style={{
                        backgroundColor: 'rgba(135, 206, 235, 0.05)',
                        borderRadius: 16,
                        padding: 16,
                        borderWidth: 1.5,
                        borderColor: 'rgba(135, 206, 235, 0.3)',
                        alignItems: 'center',
                        shadowColor: '#87CEEB',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        elevation: 8,
                        flex: 1
                      }}>
                        <Text style={{
                          color: 'rgba(135, 206, 235, 0.8)',
                          fontSize: 10,
                          fontWeight: '500',
                          marginBottom: 12,
                          textAlign: 'center',
                          letterSpacing: 1,
                          opacity: 0.8
                        }}>
                          WORK
                        </Text>
                        <View style={{ 
                          height: 180,
                          width: '100%',
                          borderRadius: 12,
                          overflow: 'hidden'
                        }}>
                          <WheelPicker
                            items={workTimeOptions}
                            selectedIndex={selectedWorkTimeIndex}
                            onIndexChange={(index) => {
                              setSelectedWorkTimeIndex(index);
                              setTimerConfig(prev => ({ ...prev, workTime: workTimeOptions[index].value }));
                            }}
                            width="100%"
                            itemHeight={36}
                            visibleItems={5}
                          />
                        </View>
                      </View>

                      {/* Rest Time WheelPicker */}
                      <View style={{
                        backgroundColor: 'rgba(135, 206, 235, 0.05)',
                        borderRadius: 16,
                        padding: 16,
                        borderWidth: 1.5,
                        borderColor: 'rgba(135, 206, 235, 0.3)',
                        alignItems: 'center',
                        shadowColor: '#87CEEB',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.4,
                        elevation: 8,
                        flex: 1
                      }}>
                        <Text style={{
                          color: 'rgba(135, 206, 235, 0.8)',
                          fontSize: 10,
                          fontWeight: '500',
                          marginBottom: 12,
                          textAlign: 'center',
                          letterSpacing: 1,
                          opacity: 0.8
                        }}>
                          REST
                        </Text>
                        <View style={{ 
                          height: 180,
                          width: '100%',
                          borderRadius: 12,
                          overflow: 'hidden'
                        }}>
                          <WheelPicker
                            items={restTimeOptions}
                            selectedIndex={selectedRestTimeIndex}
                            onIndexChange={(index) => {
                              setSelectedRestTimeIndex(index);
                              setTimerConfig(prev => ({ ...prev, restTime: restTimeOptions[index].value }));
                            }}
                            width="100%"
                            itemHeight={36}
                            visibleItems={5}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={{ padding: 24 }}>
              <Text style={{
                color: '#F5F5DC',
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 12,
              }}>
                Select exercises
              </Text>
              
              <Text style={{
                color: 'rgba(135, 206, 235, 0.7)',
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 32,
              }}>
                Add exercises to this block
              </Text>

              {/* Timer Settings Link for Editing Mode */}
              {editingBlock && (
                <TouchableOpacity
                  onPress={() => setCurrentStep('config')}
                  style={{
                    backgroundColor: 'rgba(135, 206, 235, 0.1)',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: 'rgba(135, 206, 235, 0.3)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FontAwesome name="clock-o" size={16} color="#87CEEB" style={{ marginRight: 8 }} />
                  <Text style={{
                    color: '#87CEEB',
                    fontSize: 14,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}>
                    Edit Timer Settings
                  </Text>
                  <FontAwesome name="chevron-right" size={12} color="#87CEEB" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              )}

              {/* Add Exercise Button */}
              <TouchableOpacity
                onPress={() => setShowExerciseSelector(true)}
                style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.8)',
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(135, 206, 235, 0.2)',
                  alignItems: 'center',
                  marginBottom: 20,
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <FontAwesome name="plus" size={24} color="rgba(135, 206, 235, 0.8)" />
                <Text style={{
                  color: '#F5F5DC',
                  fontSize: 16,
                  fontWeight: '600',
                  marginTop: 8,
                  letterSpacing: 1,
                }}>
                  ADD EXERCISE
                </Text>
              </TouchableOpacity>

              {/* Selected Exercises */}
              {selectedExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onUpdate={handleExerciseUpdate}
                  onRemove={() => handleExerciseRemove(exercise.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Actions */}
        <View style={{ 
          flexDirection: 'row', 
          gap: 16,
          padding: 24,
        }}>
          {/* Cancel button for editing mode */}
          {editingBlock && (
            <TouchableOpacity
              onPress={handleClose}
              style={{
                flex: 1,
                backgroundColor: '#121212',
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 24,
                borderWidth: 1.5,
                borderColor: 'rgba(245, 245, 220, 0.3)',
                alignItems: 'center',
                marginRight: 8,
              }}
            >
              <Text style={{ 
                color: '#F5F5DC', 
                fontSize: 16, 
                fontWeight: 'bold',
                letterSpacing: 1,
              }}>
                CANCEL
              </Text>
            </TouchableOpacity>
          )}

          {/* Back button for new blocks */}
          {!editingBlock && (currentStep === 'config' || currentStep === 'exercises') && (
            <TouchableOpacity
              onPress={() => {
                if (currentStep === 'config') {
                  setCurrentStep('timer');
                } else if (currentStep === 'exercises') {
                  setCurrentStep('config');
                }
              }}
              style={{
                flex: 1,
                backgroundColor: '#121212',
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 24,
                borderWidth: 1.5,
                borderColor: 'rgba(245, 245, 220, 0.3)',
                alignItems: 'center',
                marginRight: 8,
              }}
            >
              <Text style={{ 
                color: '#F5F5DC', 
                fontSize: 16, 
                fontWeight: 'bold',
                letterSpacing: 1,
              }}>
                BACK
              </Text>
            </TouchableOpacity>
          )}

          
          <TouchableOpacity
            onPress={() => {
              if (currentStep === 'timer') {
                // This shouldn't happen as timer selection goes to config or exercises
              } else if (currentStep === 'config') {
                handleConfigComplete();
              } else {
                handleSave();
              }
            }}
            disabled={currentStep === 'exercises' && selectedExercises.length === 0}
            style={{
              flex: 1,
              backgroundColor: '#121212',
              borderRadius: 16,
              paddingVertical: 18,
              paddingHorizontal: 24,
              borderWidth: 1.5,
              borderColor: (currentStep === 'exercises' && selectedExercises.length === 0) 
                ? 'rgba(245, 245, 220, 0.3)' 
                : '#87CEEB',
              shadowColor: (currentStep === 'exercises' && selectedExercises.length === 0) 
                ? 'transparent' 
                : '#87CEEB',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: (currentStep === 'exercises' && selectedExercises.length === 0) ? 0 : 8,
              alignItems: 'center',
              marginLeft: (currentStep === 'config' || currentStep === 'exercises') ? 8 : 0,
            }}
          >
            <Text style={{ 
              color: (currentStep === 'exercises' && selectedExercises.length === 0) 
                ? 'rgba(245, 245, 220, 0.5)' 
                : '#F5F5DC', 
              fontSize: 16, 
              fontWeight: 'bold',
              letterSpacing: 2,
            }}>
              {editingBlock ? 'SAVE' : (currentStep === 'config' ? 'NEXT' : 'SAVE')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Exercise Selector Modal */}
      <ExerciseSelector
        visible={showExerciseSelector}
        onClose={() => setShowExerciseSelector(false)}
        onSelect={handleExerciseSelect}
      />
    </Modal>
  );
}
