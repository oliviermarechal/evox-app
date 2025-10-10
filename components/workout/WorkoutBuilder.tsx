import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { WorkoutStep, WorkoutSession } from '@/lib/workoutTypes';

interface WorkoutBuilderProps {
  onSaveSession: (session: WorkoutSession) => void;
  onCancel: () => void;
}

export default function WorkoutBuilder({ onSaveSession, onCancel }: WorkoutBuilderProps) {
  const [sessionName, setSessionName] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [steps, setSteps] = useState<WorkoutStep[]>([]);

  const addExerciseStep = () => {
    const newStep: WorkoutStep = {
      id: `step_${Date.now()}`,
      type: 'exercise',
      name: 'New Exercise',
      description: '',
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
  };

  const addTimerStep = () => {
    const newStep: WorkoutStep = {
      id: `step_${Date.now()}`,
      type: 'timer',
      name: 'Timer',
      description: '',
      timerType: 'stopwatch',
      timerConfig: {
        minutes: 5,
        seconds: 0
      },
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
  };

  const addRestStep = () => {
    const newStep: WorkoutStep = {
      id: `step_${Date.now()}`,
      type: 'rest',
      name: 'Rest',
      description: '',
      duration: 60, // 1 minute par défaut
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (stepId: string, updates: Partial<WorkoutStep>) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < steps.length) {
      [newSteps[stepIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[stepIndex]];
      // Mettre à jour les ordres
      newSteps.forEach((step, index) => {
        step.order = index + 1;
      });
      setSteps(newSteps);
    }
  };

  const saveSession = () => {
    if (!sessionName.trim()) {
      Alert.alert('Error', 'Please enter a session name');
      return;
    }

    if (steps.length === 0) {
      Alert.alert('Error', 'Please add at least one step to your workout');
      return;
    }

    const session: WorkoutSession = {
      id: `session_${Date.now()}`,
      name: sessionName.trim(),
      description: sessionDescription.trim(),
      difficulty,
      estimatedDuration: steps.reduce((total, step) => {
        if (step.type === 'timer' && step.timerConfig) {
          return total + (step.timerConfig.minutes || 0) * 60 + (step.timerConfig.seconds || 0);
        } else if (step.type === 'rest' && step.duration) {
          return total + step.duration;
        }
        return total + 60; // 1 minute par défaut pour les exercices
      }, 0) / 60,
      steps,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSaveSession(session);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <View style={{ padding: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: '#FFD700', fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
            Build Workout Session
          </Text>
        </View>

        {/* Session Info */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: '#87CEEB', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Session Details
          </Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#F4F4F4', fontSize: 16, marginBottom: 8 }}>Name *</Text>
            <TextInput
              style={{
                backgroundColor: '#000000',
                borderRadius: 12,
                padding: 16,
                color: '#F4F4F4',
                fontSize: 16,
                borderWidth: 2,
                borderColor: '#87CEEB40'
              }}
              value={sessionName}
              onChangeText={setSessionName}
              placeholder="Enter session name"
              placeholderTextColor="#F4F4F470"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#F4F4F4', fontSize: 16, marginBottom: 8 }}>Description</Text>
            <TextInput
              style={{
                backgroundColor: '#000000',
                borderRadius: 12,
                padding: 16,
                color: '#F4F4F4',
                fontSize: 16,
                borderWidth: 2,
                borderColor: '#87CEEB40',
                height: 80,
                textAlignVertical: 'top'
              }}
              value={sessionDescription}
              onChangeText={setSessionDescription}
              placeholder="Enter session description"
              placeholderTextColor="#F4F4F470"
              multiline
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#F4F4F4', fontSize: 16, marginBottom: 8 }}>Difficulty</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setDifficulty(level)}
                  style={{
                    flex: 1,
                    backgroundColor: difficulty === level ? '#87CEEB' : '#000000',
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 2,
                    borderColor: difficulty === level ? '#87CEEB' : '#87CEEB40',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ 
                    color: difficulty === level ? '#000000' : '#F4F4F4', 
                    fontSize: 14, 
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Steps */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: '#87CEEB', fontSize: 18, fontWeight: 'bold' }}>
              Workout Steps ({steps.length})
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={addExerciseStep}
                style={{
                  backgroundColor: '#87CEEB',
                  borderRadius: 8,
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesome name="plus" size={16} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addTimerStep}
                style={{
                  backgroundColor: '#FFD700',
                  borderRadius: 8,
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesome name="clock-o" size={16} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addRestStep}
                style={{
                  backgroundColor: '#F4F4F4',
                  borderRadius: 8,
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesome name="pause" size={16} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>

          {steps.length === 0 ? (
            <View style={{
              backgroundColor: '#000000',
              borderRadius: 12,
              padding: 24,
              borderWidth: 2,
              borderColor: '#87CEEB40',
              alignItems: 'center'
            }}>
              <Text style={{ color: '#F4F4F470', fontSize: 16, textAlign: 'center' }}>
                No steps added yet. Use the buttons above to add exercises, timers, or rest periods.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {steps.map((step, index) => (
                <View
                  key={step.id}
                  style={{
                    backgroundColor: '#000000',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: step.type === 'timer' ? '#FFD700' : step.type === 'rest' ? '#F4F4F4' : '#87CEEB',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ 
                        color: step.type === 'timer' ? '#FFD700' : step.type === 'rest' ? '#F4F4F4' : '#87CEEB',
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginRight: 8
                      }}>
                        {index + 1}.
                      </Text>
                      <Text style={{ 
                        color: step.type === 'timer' ? '#FFD700' : step.type === 'rest' ? '#F4F4F4' : '#87CEEB',
                        fontSize: 16,
                        fontWeight: 'bold'
                      }}>
                        {step.name}
                      </Text>
                    </View>
                    {step.description && (
                      <Text style={{ color: '#F4F4F470', fontSize: 14, marginBottom: 8 }}>
                        {step.description}
                      </Text>
                    )}
                    {step.type === 'timer' && step.timerConfig && (
                      <Text style={{ color: '#FFD700', fontSize: 12 }}>
                        {step.timerConfig.minutes || 0}:{(step.timerConfig.seconds || 0).toString().padStart(2, '0')}
                      </Text>
                    )}
                    {step.type === 'rest' && step.duration && (
                      <Text style={{ color: '#F4F4F4', fontSize: 12 }}>
                        {Math.floor(step.duration / 60)}:{(step.duration % 60).toString().padStart(2, '0')}
                      </Text>
                    )}
                  </View>
                  
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => moveStep(step.id, 'up')}
                      disabled={index === 0}
                      style={{
                        backgroundColor: index === 0 ? '#333333' : '#87CEEB',
                        borderRadius: 6,
                        padding: 8,
                        opacity: index === 0 ? 0.5 : 1
                      }}
                    >
                      <FontAwesome name="chevron-up" size={12} color="#000000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => moveStep(step.id, 'down')}
                      disabled={index === steps.length - 1}
                      style={{
                        backgroundColor: index === steps.length - 1 ? '#333333' : '#87CEEB',
                        borderRadius: 6,
                        padding: 8,
                        opacity: index === steps.length - 1 ? 0.5 : 1
                      }}
                    >
                      <FontAwesome name="chevron-down" size={12} color="#000000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeStep(step.id)}
                      style={{
                        backgroundColor: '#FF6B6B',
                        borderRadius: 6,
                        padding: 8
                      }}
                    >
                      <FontAwesome name="trash" size={12} color="#000000" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              backgroundColor: '#000000',
              borderRadius: 12,
              padding: 16,
              borderWidth: 2,
              borderColor: '#87CEEB',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#87CEEB', fontSize: 16, fontWeight: 'bold' }}>
              CANCEL
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={saveSession}
            style={{
              flex: 1,
              backgroundColor: '#FFD700',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#000000', fontSize: 16, fontWeight: 'bold' }}>
              SAVE SESSION
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
