import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WorkoutBlock } from '@/lib/types';
import ExerciseList from './ExerciseList';
import { getBlockSummary } from '@/utils/workoutUtils';

interface BlockSummaryCardProps {
  block: WorkoutBlock;
  blockIndex: number;
  totalBlocks: number;
  isLandscape: boolean;
  showCompletedRecap: boolean;
  onStartBlock?: () => void;
  onBack?: () => void;
}

export default function BlockSummaryCard({ 
  block, 
  blockIndex, 
  totalBlocks, 
  isLandscape,
  showCompletedRecap,
  onStartBlock,
  onBack
}: BlockSummaryCardProps) {
  const { timerInfo } = getBlockSummary(block);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      {/* Header du bloc */}
      <View style={{
        marginTop: isLandscape ? 20 : 0,
        marginBottom: isLandscape ? 20 : 24,
        paddingBottom: isLandscape ? 16 : 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(135, 206, 235, 0.2)',
        paddingHorizontal: isLandscape ? 20 : 28,
      }}>
        {/* Ligne avec bouton de retour et titre */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Bouton de retour - uniquement si onBack est fourni */}
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={{
                position: 'absolute',
                left: 0,
                backgroundColor: 'rgba(18, 18, 18, 0.8)',
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: 'rgba(135, 206, 235, 0.3)',
                shadowColor: '#87CEEB',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <FontAwesome name="arrow-left" size={isLandscape ? 16 : 18} color="#F5F5DC" />
            </TouchableOpacity>
          )}
          
          {/* Titre centré */}
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{
              color: '#87CEEB',
              fontSize: isLandscape ? 13 : 14,
              fontWeight: '600',
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
            }}>
              {showCompletedRecap ? 'Next Block' : 'Block'} {blockIndex + 1} of {totalBlocks}
            </Text>
            <Text style={{
              color: '#F5F5DC',
              fontSize: isLandscape ? 22 : 26,
              fontWeight: 'bold',
              marginTop: 4,
              textAlign: 'center',
            }}>
              {block.name}
            </Text>
          </View>
        </View>
      </View>

      {isLandscape ? (
        // Layout landscape : timer et exercises côte à côte avec bouton en bas
        <View style={{ flex: 1 }}>
          {/* Contenu principal */}
          <View style={{ flex: 1, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'flex-start' }}>
            {/* Timer Configuration à gauche */}
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(135, 206, 235, 0.08)',
              borderRadius: 12,
              padding: 16,
              alignSelf: 'flex-start',
            }}>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.9)',
                fontSize: 12,
                fontWeight: '600',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                Timer Configuration
              </Text>
              <Text style={{
                color: '#F5F5DC',
                fontSize: 15,
                lineHeight: 22,
                fontWeight: '500',
              }}>
                {timerInfo}
              </Text>
            </View>

            {/* Exercises à droite */}
            <View style={{ flex: 2, alignSelf: 'flex-start' }}>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.9)',
                fontSize: 12,
                fontWeight: '600',
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                Exercises ({block.exercises.length})
              </Text>
              <ExerciseList exercises={block.exercises} isLandscape={isLandscape} />
            </View>
          </View>

          {/* Bouton en bas pour landscape */}
          {onStartBlock && (
            <View style={{
              backgroundColor: '#0F0F10',
              paddingTop: 16,
              paddingBottom: insets.bottom,
              paddingHorizontal: 20,
              borderTopWidth: 1,
              borderTopColor: 'rgba(135, 206, 235, 0.1)',
            }}>
              <TouchableOpacity
                onPress={onStartBlock}
                style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.95)',
                  borderRadius: 14,
                  paddingVertical: 14,
                  paddingHorizontal: 28,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#87CEEB',
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 15,
                  elevation: 8,
                }}
              >
                <Text style={{
                  color: '#F5F5DC',
                  fontSize: 16,
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}>
                  START BLOCK
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        // Layout portrait : vertical avec bouton en bas
        <View style={{ flex: 1 }}>
          {/* Contenu principal */}
          <View style={{ flex: 1, paddingHorizontal: 28 }}>
            {/* Timer Configuration */}
            <View style={{
              backgroundColor: 'rgba(135, 206, 235, 0.08)',
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
            }}>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.9)',
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                Timer Configuration
              </Text>
              <Text style={{
                color: '#F5F5DC',
                fontSize: 17,
                lineHeight: 26,
                fontWeight: '500',
              }}>
                {timerInfo}
              </Text>
            </View>

            {/* Exercises */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.9)',
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                Exercises ({block.exercises.length})
              </Text>
              <ExerciseList exercises={block.exercises} isLandscape={isLandscape} />
            </View>
          </View>

          {/* Bouton en bas pour portrait */}
          {onStartBlock && (
            <View style={{
              backgroundColor: '#0F0F10',
              paddingHorizontal: 28,
              paddingTop: 20,
              paddingBottom: insets.bottom,
              borderTopWidth: 1,
              borderTopColor: 'rgba(135, 206, 235, 0.1)',
            }}>
              <TouchableOpacity
                onPress={onStartBlock}
                style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.95)',
                  borderRadius: 18,
                  paddingVertical: 20,
                  paddingHorizontal: 40,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#87CEEB',
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 8,
                }}
              >
                <Text style={{
                  color: '#F5F5DC',
                  fontSize: 19,
                  fontWeight: 'bold',
                  letterSpacing: 1.2,
                }}>
                  START BLOCK
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}