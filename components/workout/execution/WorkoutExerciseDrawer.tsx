import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Exercise } from '@/lib/types';
import ExerciseDetailModal from './ExerciseDetailModal';

interface WorkoutExerciseDrawerProps {
  exercises: Exercise[];
  onToggle?: (isOpen: boolean) => void;
}

export default function WorkoutExerciseDrawer({ exercises, onToggle }: WorkoutExerciseDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);
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

  const toggleDrawer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (onToggle) {
      onToggle(newIsOpen);
    }
  };

  const drawerWidth = 180; // Réduit de 280 à 220

  return (
    <>
      {/* Drawer */}
      <View
        style={{
          height: '100%',
          width: drawerWidth,
          backgroundColor: 'rgba(15, 15, 16, 0.85)', // Transparent
          borderRightWidth: 1,
          borderRightColor: 'rgba(135, 206, 235, 0.2)',
        }}
      >
        <View style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(135, 206, 235, 0.1)',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{
              color: 'rgba(135, 206, 235, 0.9)',
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              Exercises ({exercises.length})
            </Text>
            <TouchableOpacity
              onPress={toggleDrawer}
              style={{
                padding: 4,
              }}
            >
              <FontAwesome 
                name="chevron-left" 
                size={14} 
                color="rgba(135, 206, 235, 0.7)" 
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
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

      <ExerciseDetailModal
        visible={modalVisible}
        exercise={selectedExercise}
        onClose={handleCloseModal}
      />
    </>
  );
}

