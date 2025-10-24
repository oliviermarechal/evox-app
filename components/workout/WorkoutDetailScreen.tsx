import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Workout, WorkoutBlock } from '@/lib/types';
import { WorkoutStorage } from '@/lib/storage';
import BlockBuilderModal from './BlockBuilderModal';

interface WorkoutDetailScreenProps {
  workout: Workout;
  onBack: () => void;
  onWorkoutUpdated: (workout: Workout) => void;
}

export default function WorkoutDetailScreen({ 
  workout, 
  onBack, 
  onWorkoutUpdated 
}: WorkoutDetailScreenProps) {
  const [currentWorkout, setCurrentWorkout] = useState<Workout>(workout);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<WorkoutBlock | null>(null);

  useEffect(() => {
    setCurrentWorkout(workout);
  }, [workout]);

  const handleAddBlock = () => {
    setEditingBlock(null);
    setShowBlockModal(true);
  };

  const handleEditBlock = (block: WorkoutBlock) => {
    setEditingBlock(block);
    setShowBlockModal(true);
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await WorkoutStorage.deleteBlockFromWorkout(currentWorkout.id, blockId);
      const updatedWorkout = await WorkoutStorage.getWorkoutById(currentWorkout.id);
      if (updatedWorkout) {
        setCurrentWorkout(updatedWorkout);
        onWorkoutUpdated(updatedWorkout);
      }
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  const handleBlockSave = async (blockData: Omit<WorkoutBlock, 'id'>) => {
    try {
      if (editingBlock) {
        // Modifier un bloc existant
        await WorkoutStorage.updateBlockInWorkout(currentWorkout.id, editingBlock.id, blockData);
      } else {
        // Ajouter un nouveau bloc
        await WorkoutStorage.addBlockToWorkout(currentWorkout.id, blockData);
      }
      
      const updatedWorkout = await WorkoutStorage.getWorkoutById(currentWorkout.id);
      if (updatedWorkout) {
        setCurrentWorkout(updatedWorkout);
        onWorkoutUpdated(updatedWorkout);
      }
      
      setShowBlockModal(false);
      setEditingBlock(null);
    } catch (error) {
      console.error('Error saving block:', error);
    }
  };

  const handleBlockModalClose = () => {
    setShowBlockModal(false);
    setEditingBlock(null);
  };

  const getBlockSubtitle = (block: WorkoutBlock) => {
    if (block.exercises.length === 0) return 'No exercises';
    
    const exerciseSummary = block.exercises.map(ex => {
      const volume = ex.volume ? `${ex.volume} ${ex.unit}` : ex.name;
      return volume;
    }).join(', ');
    
    switch (block.timerType) {
      case 'AMRAP':
        return `${block.timerConfig.duration}min • ${exerciseSummary}`;
      case 'EMOM':
        return `${block.timerConfig.rounds} rounds × ${block.timerConfig.intervalDuration}s • ${exerciseSummary}`;
      case 'Tabata':
        return `${block.timerConfig.rounds} rounds × ${block.timerConfig.workTime}s/${block.timerConfig.restTime}s • ${exerciseSummary}`;
      case 'ForTime':
        const setsText = block.sets ? `${block.sets} sets` : '';
        const restText = (block.sets && block.sets > 0 && block.timerConfig.restTime) ? ` • ${block.timerConfig.restTime}s rest` : '';
        return `${setsText}${restText} • As fast as possible • ${exerciseSummary}`;
      default:
        return exerciseSummary;
    }
  };

  const renderBlock = ({ item, index }: { item: WorkoutBlock; index: number }) => (
    <View style={{
      backgroundColor: 'rgba(18, 18, 18, 0.8)',
      borderRadius: 16,
      padding: 18,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: 'rgba(135, 206, 235, 0.2)',
      shadowColor: '#87CEEB',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
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
            {getBlockSubtitle(item)}
          </Text>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.5)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}>
            {item.exercises.length} exercise{item.exercises.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity
            onPress={() => handleEditBlock(item)}
            style={{
              backgroundColor: 'rgba(135, 206, 235, 0.12)',
              borderRadius: 10,
              padding: 8,
              borderWidth: 1,
              borderColor: 'rgba(135, 206, 235, 0.2)',
            }}
          >
            <FontAwesome name="edit" size={12} color="rgba(135, 206, 235, 0.8)" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleDeleteBlock(item.id)}
            style={{
              backgroundColor: 'rgba(255, 107, 107, 0.15)',
              borderRadius: 10,
              padding: 8,
              borderWidth: 1,
              borderColor: 'rgba(255, 107, 107, 0.3)',
            }}
          >
            <FontAwesome name="trash" size={12} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(135, 206, 235, 0.1)',
        zIndex: 5,
      }}>
        <TouchableOpacity
          onPress={onBack}
          style={{
            backgroundColor: 'rgba(135, 206, 235, 0.1)',
            borderRadius: 20,
            padding: 8,
            marginRight: 16,
            borderWidth: 1,
            borderColor: 'rgba(135, 206, 235, 0.3)',
          }}
        >
          <FontAwesome name="arrow-left" size={16} color="#87CEEB" />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            color: '#F5F5DC',
            fontSize: 24,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}>
            {currentWorkout.name}
          </Text>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.7)',
            fontSize: 14,
            marginTop: 2,
          }}>
            {currentWorkout.blocks.length} block{currentWorkout.blocks.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push(`/workout-execution/${currentWorkout.id}`)}
          style={{
            backgroundColor: '#87CEEB',
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: '#87CEEB',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{
            color: '#0F0F10',
            fontSize: 14,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}>
            START WORKOUT
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1, zIndex: 5 }} showsVerticalScrollIndicator={false}>
        {currentWorkout.blocks.length === 0 ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 60,
          }}>
            <FontAwesome name="list" size={48} color="rgba(135, 206, 235, 0.3)" />
            <Text style={{
              color: 'rgba(135, 206, 235, 0.6)',
              fontSize: 18,
              textAlign: 'center',
              marginTop: 16,
              marginBottom: 8,
            }}>
              No blocks yet
            </Text>
            <Text style={{
              color: 'rgba(135, 206, 235, 0.4)',
              fontSize: 14,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              Add your first block to get started
            </Text>
          </View>
        ) : (
          <View style={{ padding: 24 }}>
            <FlatList
              data={currentWorkout.blocks}
              renderItem={renderBlock}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Add Block Button */}
        <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={handleAddBlock}
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
            ADD BLOCK
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Block Builder Modal */}
      <BlockBuilderModal
        visible={showBlockModal}
        onClose={handleBlockModalClose}
        onSave={handleBlockSave}
        blockNumber={currentWorkout.blocks.length + 1}
        editingBlock={editingBlock}
      />
    </SafeAreaView>
  );
}
