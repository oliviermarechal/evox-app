import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Exercise } from '@/lib/types';
import ExerciseDetailModal from './ExerciseDetailModal';

interface WorkoutExerciseListProps {
  exercises: Exercise[];
  variant: 'portrait' | 'landscape';
}

export default function WorkoutExerciseList({ exercises, variant }: WorkoutExerciseListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedExercise(null);
  };

  const toggleExpanded = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  if (variant === 'landscape') {
    // Liste verticale scrollable à gauche
    return (
      <View style={{
        width: '30%',
        paddingRight: 16,
        borderRightWidth: 1,
        borderRightColor: 'rgba(135, 206, 235, 0.1)',
      }}>
        <Text style={{
          color: 'rgba(135, 206, 235, 0.9)',
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 12,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          Exercises ({exercises.length})
        </Text>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {exercises.map((exercise, index) => (
            <View 
              key={exercise.id || index}
              style={{
                backgroundColor: 'rgba(135, 206, 235, 0.08)',
                borderRadius: 12,
                padding: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: 'rgba(135, 206, 235, 0.2)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#87CEEB',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8,
                }}>
                  <Text style={{
                    color: '#0F0F10',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={{
                  color: '#F5F5DC',
                  fontSize: 13,
                  fontWeight: '600',
                  flex: 1,
                }}>
                  {exercise.name}
                </Text>
                {exercise.instructions && (
                  <TouchableOpacity
                    onPress={() => handleOpenDetails(exercise)}
                    style={{
                      marginLeft: 8,
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: 'rgba(135, 206, 235, 0.2)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(135, 206, 235, 0.4)',
                    }}
                  >
                    <FontAwesome 
                      name="exclamation-circle" 
                      size={9} 
                      color="#87CEEB" 
                    />
                  </TouchableOpacity>
                )}
              </View>
              {exercise.volume && (
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.8)',
                  fontSize: 11,
                  marginLeft: 28,
                }}>
                  {exercise.volume} {exercise.unit}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Portrait : Liste repliable
  return (
    <View style={{
      marginBottom: 16,
    }}>
      <TouchableOpacity
        onPress={toggleExpanded}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(135, 206, 235, 0.08)',
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: 'rgba(135, 206, 235, 0.2)',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <FontAwesome 
            name="list" 
            size={14} 
            color="#87CEEB" 
            style={{ marginRight: 10 }}
          />
          <Text style={{
            color: '#87CEEB',
            fontSize: 13,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            Exercises ({exercises.length})
          </Text>
        </View>
        <FontAwesome 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={12} 
          color="rgba(135, 206, 235, 0.7)" 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={{
          marginTop: 8,
          backgroundColor: 'rgba(135, 206, 235, 0.05)',
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: 'rgba(135, 206, 235, 0.15)',
        }}>
          {exercises.map((exercise, index) => (
            <View 
              key={exercise.id || index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: index < exercises.length - 1 ? 1 : 0,
                borderBottomColor: 'rgba(135, 206, 235, 0.1)',
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#87CEEB',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Text style={{
                  color: '#0F0F10',
                  fontSize: 11,
                  fontWeight: 'bold',
                }}>
                  {index + 1}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: 14,
                    fontWeight: '600',
                  }}>
                    {exercise.name}
                  </Text>
                  {exercise.volume && (
                    <Text style={{
                      color: 'rgba(135, 206, 235, 0.8)',
                      fontSize: 12,
                      marginTop: 2,
                    }}>
                      {exercise.volume} {exercise.unit}
                    </Text>
                  )}
                </View>
                {exercise.instructions && (
                  <TouchableOpacity
                    onPress={() => handleOpenDetails(exercise)}
                    style={{
                      marginLeft: 8,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: 'rgba(135, 206, 235, 0.2)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(135, 206, 235, 0.4)',
                    }}
                  >
                    <FontAwesome 
                      name="exclamation-circle" 
                      size={10} 
                      color="#87CEEB" 
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      <ExerciseDetailModal
        visible={modalVisible}
        exercise={selectedExercise}
        onClose={handleCloseModal}
      />
    </View>
  );
}

