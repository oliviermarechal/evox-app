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
    <View style={{
      backgroundColor: 'rgba(18, 18, 18, 0.8)',
      borderRadius: 16,
      padding: 18,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'rgba(135, 206, 235, 0.2)',
      shadowColor: '#87CEEB',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <TouchableOpacity 
          onPress={() => onEditWorkout(item)}
          style={{ flex: 1 }}
        >
          <Text style={{
            color: '#F5F5DC',
            fontSize: 17,
            fontWeight: 'bold',
            marginBottom: 4,
          }}>
            {item.name}
          </Text>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.7)',
            fontSize: 13,
            marginBottom: 6,
            lineHeight: 18,
          }}>
            {item.blocks.length} block{item.blocks.length !== 1 ? 's' : ''}
          </Text>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.5)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}>
            Created {formatDate(item.createdAt)}
          </Text>
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity
            onPress={item.blocks.length > 0 ? () => router.push(`/workout-execution/${item.id}`) : undefined}
            disabled={item.blocks.length === 0}
            style={{
              backgroundColor: '#121212',
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1.5,
              borderColor: item.blocks.length > 0 ? 'rgba(135, 206, 235, 0.3)' : 'rgba(135, 206, 235, 0.1)',
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: item.blocks.length > 0 ? '#87CEEB' : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: item.blocks.length > 0 ? 0.3 : 0,
              shadowRadius: 8,
              elevation: item.blocks.length > 0 ? 4 : 0,
              opacity: item.blocks.length > 0 ? 1 : 0.4,
            }}
          >
            <FontAwesome name="play" size={12} color={item.blocks.length > 0 ? "#F5F5DC" : "rgba(245, 245, 220, 0.4)"} style={{ marginRight: 4 }} />
            <Text style={{
              color: item.blocks.length > 0 ? '#F5F5DC' : 'rgba(245, 245, 220, 0.4)',
              fontSize: 12,
              fontWeight: '600',
              letterSpacing: 0.5,
            }}>
              START
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onDeleteWorkout(item.id)}
            style={{
              backgroundColor: '#121212',
              borderRadius: 12,
              padding: 10,
              borderWidth: 1.5,
              borderColor: 'rgba(255, 107, 107, 0.3)',
              shadowColor: '#FF6B6B',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <FontAwesome name="trash" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
