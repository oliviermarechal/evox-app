import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { WorkoutBlock } from '@/lib/types';
import { getBlockSummary } from '@/utils/workoutUtils';

interface BlockSelectorModalProps {
  visible: boolean;
  blocks: WorkoutBlock[];
  currentBlockId: string;
  completedBlocks: Set<string>;
  onSelectBlock: (blockId: string) => void;
  onClose: () => void;
}

export default function BlockSelectorModal({
  visible,
  blocks,
  currentBlockId,
  completedBlocks,
  onSelectBlock,
  onClose,
}: BlockSelectorModalProps) {
  const handleSelectBlock = (blockId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectBlock(blockId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 20,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(135, 206, 235, 0.1)',
        }}>
          <Text style={{
            color: '#F5F5DC',
            fontSize: 24,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}>
            Choose Block
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: 'rgba(135, 206, 235, 0.1)',
              borderRadius: 20,
              padding: 10,
              borderWidth: 1,
              borderColor: 'rgba(135, 206, 235, 0.3)',
            }}
          >
            <FontAwesome name="times" size={18} color="#87CEEB" />
          </TouchableOpacity>
        </View>

        {/* Liste des blocs */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {blocks.map((block, index) => {
            const isCompleted = completedBlocks.has(block.id);
            const isCurrent = block.id === currentBlockId;
            const { timerInfo } = getBlockSummary(block);

            return (
              <TouchableOpacity
                key={block.id}
                onPress={() => handleSelectBlock(block.id)}
                disabled={isCurrent}
                style={{
                  backgroundColor: isCurrent 
                    ? 'rgba(135, 206, 235, 0.15)' 
                    : isCompleted 
                      ? 'rgba(135, 206, 235, 0.08)' 
                      : 'rgba(18, 18, 18, 0.8)',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 12,
                  borderWidth: isCurrent ? 2 : 1,
                  borderColor: isCurrent 
                    ? '#87CEEB' 
                    : isCompleted 
                      ? 'rgba(135, 206, 235, 0.4)' 
                      : 'rgba(135, 206, 235, 0.2)',
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: isCurrent ? 0.3 : 0.15,
                  shadowRadius: isCurrent ? 12 : 8,
                  elevation: isCurrent ? 6 : 4,
                  opacity: isCurrent ? 0.7 : 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    {/* Header avec numéro et status */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 }}>
                      <View style={{
                        backgroundColor: isCurrent 
                          ? '#87CEEB' 
                          : isCompleted 
                            ? 'rgba(135, 206, 235, 0.3)' 
                            : 'rgba(135, 206, 235, 0.1)',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderWidth: 1,
                        borderColor: isCurrent 
                          ? '#87CEEB' 
                          : 'rgba(135, 206, 235, 0.3)',
                      }}>
                        <Text style={{
                          color: isCurrent ? '#0F0F10' : '#87CEEB',
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}>
                          Block {index + 1}
                        </Text>
                      </View>
                      
                      {isCompleted && (
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}>
                          <FontAwesome name="check-circle" size={16} color="#87CEEB" />
                          <Text style={{
                            color: 'rgba(135, 206, 235, 0.9)',
                            fontSize: 12,
                            fontWeight: '600',
                          }}>
                            Completed
                          </Text>
                        </View>
                      )}
                      
                      {isCurrent && (
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}>
                          <View style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#87CEEB',
                          }} />
                          <Text style={{
                            color: '#87CEEB',
                            fontSize: 12,
                            fontWeight: '600',
                          }}>
                            Current
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Nom du bloc */}
                    <Text style={{
                      color: '#F5F5DC',
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginBottom: 8,
                    }}>
                      {block.name}
                    </Text>

                    {/* Timer info */}
                    <Text style={{
                      color: 'rgba(135, 206, 235, 0.8)',
                      fontSize: 14,
                      marginBottom: 8,
                      lineHeight: 20,
                    }}>
                      {timerInfo}
                    </Text>

                    {/* Exercices */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      {block.exercises.slice(0, 3).map((exercise, idx) => (
                        <View
                          key={exercise.id}
                          style={{
                            backgroundColor: 'rgba(135, 206, 235, 0.1)',
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderWidth: 1,
                            borderColor: 'rgba(135, 206, 235, 0.2)',
                          }}
                        >
                          <Text style={{
                            color: 'rgba(135, 206, 235, 0.9)',
                            fontSize: 12,
                            fontWeight: '500',
                          }}>
                            {exercise.name}
                            {exercise.volume !== undefined && ` • ${exercise.volume} ${exercise.unit}`}
                          </Text>
                        </View>
                      ))}
                      {block.exercises.length > 3 && (
                        <View style={{
                          backgroundColor: 'rgba(135, 206, 235, 0.1)',
                          borderRadius: 8,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderWidth: 1,
                          borderColor: 'rgba(135, 206, 235, 0.2)',
                        }}>
                          <Text style={{
                            color: 'rgba(135, 206, 235, 0.9)',
                            fontSize: 12,
                            fontWeight: '500',
                          }}>
                            +{block.exercises.length - 3} more
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Chevron */}
                  {!isCurrent && (
                    <View style={{
                      marginLeft: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 40,
                      height: 40,
                    }}>
                      <FontAwesome 
                        name="chevron-right" 
                        size={18} 
                        color={isCompleted ? 'rgba(135, 206, 235, 0.6)' : 'rgba(135, 206, 235, 0.8)'} 
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

