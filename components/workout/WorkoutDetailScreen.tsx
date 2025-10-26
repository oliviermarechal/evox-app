import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
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
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState(workout.name);

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

  const handleRenameWorkout = () => {
    setNewWorkoutName(currentWorkout.name);
    setShowRenameModal(true);
  };

  const handleRenameConfirm = async () => {
    if (newWorkoutName.trim() && newWorkoutName.trim() !== currentWorkout.name) {
      try {
        const updatedWorkout = await WorkoutStorage.updateWorkout(currentWorkout.id, { name: newWorkoutName.trim() });
        if (updatedWorkout) {
          setCurrentWorkout(updatedWorkout);
          onWorkoutUpdated(updatedWorkout);
          setShowRenameModal(false);
        }
      } catch (error) {
        console.error('Error renaming workout:', error);
      }
    } else {
      setShowRenameModal(false);
    }
  };

  const handleRenameCancel = () => {
    setNewWorkoutName(currentWorkout.name);
    setShowRenameModal(false);
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
        const amrapMinutes = Math.floor(block.timerConfig.duration! / 60);
        return `${amrapMinutes}min • ${exerciseSummary}`;
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
        
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => handleEditBlock(item)}
            style={{
              backgroundColor: '#121212',
              borderRadius: 12,
              padding: 10,
              borderWidth: 1.5,
              borderColor: 'rgba(135, 206, 235, 0.3)',
              shadowColor: '#87CEEB',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <FontAwesome name="edit" size={16} color="#87CEEB" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleDeleteBlock(item.id)}
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
    <View style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Background with subtle gradient */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(135, 206, 235, 0.02)',
      }} />

      {/* Header - Compact */}
      <View style={{
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(135, 206, 235, 0.1)',
        zIndex: 5,
      }}>
        {/* Workout title and back button */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text style={{
                color: '#F5F5DC',
                fontSize: 24,
                fontWeight: 'bold',
                letterSpacing: 1,
                flex: 1,
              }}>
                {currentWorkout.name}
              </Text>
              <TouchableOpacity
                onPress={handleRenameWorkout}
                style={{
                  backgroundColor: '#121212',
                  borderRadius: 12,
                  padding: 8,
                  marginLeft: 12,
                  borderWidth: 1.5,
                  borderColor: 'rgba(135, 206, 235, 0.3)',
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <FontAwesome name="edit" size={14} color="#87CEEB" />
              </TouchableOpacity>
            </View>
            <Text style={{
              color: 'rgba(135, 206, 235, 0.7)',
              fontSize: 14,
            }}>
              {currentWorkout.blocks.length} block{currentWorkout.blocks.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Content - Scrollable blocks list */}
      <View style={{ flex: 1, zIndex: 5 }}>
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
          <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={currentWorkout.blocks}
              renderItem={renderBlock}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </ScrollView>
        )}

        {/* Fixed Add Block Button */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingVertical: 16,
          paddingBottom: 24,
          borderTopWidth: 1,
          borderTopColor: 'rgba(135, 206, 235, 0.1)',
          backgroundColor: '#0F0F10',
          zIndex: 10,
        }}>
          <TouchableOpacity
            onPress={handleAddBlock}
            style={{
              backgroundColor: '#121212',
              borderRadius: 16,
              paddingVertical: 16,
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
      </View>


      {/* Block Builder Modal */}
      <BlockBuilderModal
        visible={showBlockModal}
        onClose={handleBlockModalClose}
        onSave={handleBlockSave}
        blockNumber={currentWorkout.blocks.length + 1}
        editingBlock={editingBlock}
      />

      {/* Rename Workout Modal */}
      <Modal
        visible={showRenameModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleRenameCancel}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
            <View style={{
              backgroundColor: '#121212',
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 400,
              borderWidth: 1,
              borderColor: 'rgba(135, 206, 235, 0.2)',
              shadowColor: '#87CEEB',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 8,
            }}>
              <Text style={{
                color: '#F5F5DC',
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 20,
                letterSpacing: 1,
              }}>
                Rename Workout
              </Text>
              
              <TextInput
                value={newWorkoutName}
                onChangeText={setNewWorkoutName}
                placeholder="Enter workout name"
                placeholderTextColor="rgba(135, 206, 235, 0.5)"
                style={{
                  backgroundColor: 'rgba(135, 206, 235, 0.05)',
                  borderRadius: 12,
                  padding: 16,
                  color: '#F5F5DC',
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(135, 206, 235, 0.2)',
                  marginBottom: 24,
                }}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleRenameConfirm}
              />
              
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={handleRenameCancel}
                  style={{
                    flex: 1,
                    backgroundColor: '#121212',
                    borderRadius: 12,
                    paddingVertical: 14,
                    borderWidth: 1.5,
                    borderColor: 'rgba(135, 206, 235, 0.3)',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: 16,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleRenameConfirm}
                  style={{
                    flex: 1,
                    backgroundColor: '#121212',
                    borderRadius: 12,
                    paddingVertical: 14,
                    borderWidth: 1.5,
                    borderColor: '#87CEEB',
                    alignItems: 'center',
                    shadowColor: '#87CEEB',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text style={{
                    color: '#87CEEB',
                    fontSize: 16,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
