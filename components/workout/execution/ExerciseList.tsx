import React from 'react';
import { View, Text } from 'react-native';
import { Exercise } from '@/lib/types';

interface ExerciseListProps {
  exercises: Exercise[];
  isLandscape: boolean;
}

export default function ExerciseList({ exercises, isLandscape }: ExerciseListProps) {
  return (
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
        </View>
      ))}
    </View>
  );
}

