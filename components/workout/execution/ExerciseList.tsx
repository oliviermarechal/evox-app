import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Exercise } from '@/lib/types';
import ExerciseDetailModal from './ExerciseDetailModal';

interface ExerciseListProps {
  exercises: Exercise[];
  isLandscape: boolean;
}

export default function ExerciseList({ exercises, isLandscape }: ExerciseListProps) {
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

  return (
    <>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: isLandscape ? 6 : 8,
      }}>
        {exercises.map((exercise, index) => (
          <View key={exercise.id || index} style={{
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
            {exercise.instructions && (
              <TouchableOpacity
                onPress={() => handleOpenDetails(exercise)}
                style={{
                  marginLeft: 8,
                  width: isLandscape ? 20 : 22,
                  height: isLandscape ? 20 : 22,
                  borderRadius: isLandscape ? 10 : 11,
                  backgroundColor: 'rgba(135, 206, 235, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(135, 206, 235, 0.4)',
                }}
              >
                <FontAwesome 
                  name="exclamation-circle" 
                  size={isLandscape ? 10 : 12} 
                  color="#87CEEB" 
                />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <ExerciseDetailModal
        visible={modalVisible}
        exercise={selectedExercise}
        onClose={handleCloseModal}
      />
    </>
  );
}

