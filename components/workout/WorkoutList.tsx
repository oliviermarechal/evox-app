import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Workout } from '@/lib/types';

interface WorkoutListProps {
  workouts: Workout[];
  onCreateNew: () => void;
  onEditWorkout: (workout: Workout) => void;
  onDeleteWorkout: (workoutId: string) => void;
}

export default function WorkoutList({ 
  workouts, 
  onCreateNew, 
  onEditWorkout, 
  onDeleteWorkout 
}: WorkoutListProps) {
  const formatDate = (date: Date | string) => {
    // Convertir en Date si c'est une string
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Vérifier que la date est valide
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const renderWorkout = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      onPress={() => onEditWorkout(item)}
      style={{
        backgroundColor: 'rgba(135, 206, 235, 0.05)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(135, 206, 235, 0.2)',
        shadowColor: '#87CEEB',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            color: '#F5F5DC',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 4,
          }}>
            {item.name}
          </Text>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.7)',
            fontSize: 14,
            marginBottom: 8,
          }}>
            {item.blocks.length} block{item.blocks.length !== 1 ? 's' : ''}
          </Text>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.5)',
            fontSize: 12,
          }}>
            Created {formatDate(item.createdAt)}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => router.push(`/workout-execution/${item.id}`)}
            style={{
              backgroundColor: 'rgba(135, 206, 235, 0.15)',
              borderRadius: 8,
              padding: 8,
              borderWidth: 1,
              borderColor: 'rgba(135, 206, 235, 0.3)',
            }}
          >
            <FontAwesome name="play" size={16} color="#87CEEB" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onDeleteWorkout(item.id)}
            style={{
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderRadius: 8,
              padding: 8,
            }}
          >
            <FontAwesome name="trash" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {workouts.length === 0 ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}>
          <FontAwesome name="heart" size={48} color="rgba(135, 206, 235, 0.3)" />
          <Text style={{
            color: 'rgba(135, 206, 235, 0.6)',
            fontSize: 18,
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 8,
          }}>
            No workouts yet
          </Text>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.4)',
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            Create your first workout to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Button */}
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={onCreateNew}
          style={{
            backgroundColor: '#121212',
            borderRadius: 16,
            paddingVertical: 18,
            paddingHorizontal: 32,
            borderWidth: 1.5,
            borderColor: '#87CEEB',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: '#F5F5DC',
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 2,
          }}>
            CREATE NEW WORKOUT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
