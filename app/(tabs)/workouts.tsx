import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Workout, WorkoutBlock } from '@/lib/types';
import { WorkoutStorage } from '@/lib/storage';
import WorkoutList from '@/components/workout/WorkoutList';
import WorkoutNameModal from '@/components/workout/WorkoutNameModal';
import WorkoutDetailScreen from '@/components/workout/WorkoutDetailScreen';

export default function WorkoutsScreen() {
  useScreenOrientation(ScreenOrientation.OrientationLock.ALL);

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const savedWorkouts = await WorkoutStorage.loadWorkouts();
      setWorkouts(savedWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setShowNameModal(true);
  };

  const handleWorkoutNameConfirm = async (name: string) => {
    try {
      const newWorkout = await WorkoutStorage.createWorkout({
        name,
        blocks: [],
      });
      setCurrentWorkout(newWorkout);
      setShowNameModal(false);
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  const handleWorkoutUpdated = async (updatedWorkout: Workout) => {
    setCurrentWorkout(updatedWorkout);
    await loadWorkouts(); // Recharger la liste des workouts
  };

  const handleBackToList = () => {
    setCurrentWorkout(null);
  };

  const handleEditWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await WorkoutStorage.deleteWorkout(workoutId);
      await loadWorkouts(); // Recharger la liste
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }} edges={['top', 'left', 'right']}>
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

      {/* Header Premium - Compact */}
      <View style={{
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 12,
        alignItems: 'center',
        zIndex: 5,
      }}>
        <Text style={{
          color: '#F5F5DC',
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center',
          letterSpacing: 2,
          textShadowColor: 'rgba(135, 206, 235, 0.3)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 15,
          marginBottom: 4,
        }}>
          WORKOUTS
        </Text>
        <Text style={{
          color: 'rgba(135, 206, 235, 0.8)',
          fontSize: 12,
          textAlign: 'center',
          letterSpacing: 1,
          opacity: 0.8,
        }}>
          CREATE • EXECUTE • TRACK
        </Text>
      </View>

      {/* Main Content */}
      {currentWorkout ? (
        <View style={{ flex: 1, zIndex: 5 }}>
          <WorkoutDetailScreen
            workout={currentWorkout}
            onBack={handleBackToList}
            onWorkoutUpdated={handleWorkoutUpdated}
          />
        </View>
      ) : (
        <View style={{ flex: 1, zIndex: 5 }}>
          {loading ? (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.7)',
                fontSize: 16,
              }}>
                Loading workouts...
              </Text>
            </View>
          ) : (
            <WorkoutList
              workouts={workouts}
              onCreateNew={handleCreateNew}
              onEditWorkout={handleEditWorkout}
              onDeleteWorkout={handleDeleteWorkout}
            />
          )}
        </View>
      )}

      {/* Modals */}
      <WorkoutNameModal
        visible={showNameModal}
        onClose={() => setShowNameModal(false)}
        onConfirm={handleWorkoutNameConfirm}
      />
    </SafeAreaView>
  );
}