import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { WorkoutBlock } from '@/lib/types';
import BlockSummaryCard from './BlockSummaryCard';
import BlockRecapAnimation from './BlockRecapAnimation';

interface BlockTransitionScreenProps {
  currentBlock: WorkoutBlock | null;
  nextBlock: WorkoutBlock | null;
  blockIndex: number;
  totalBlocks: number;
  isLastBlock: boolean;
  showCelebration: boolean;
  isLandscape: boolean;
  onStartBlock: () => void;
  onNextBlock: () => void;
  onBack?: () => void;
}

export default function BlockTransitionScreen({
  currentBlock,
  nextBlock,
  blockIndex,
  totalBlocks,
  isLastBlock,
  showCelebration,
  isLandscape,
  onStartBlock,
  onNextBlock,
  onBack,
}: BlockTransitionScreenProps) {
  const [showRecapAnimation, setShowRecapAnimation] = useState(showCelebration);

  const handleAnimationComplete = () => {
    setShowRecapAnimation(false);
  };

  // Si on vient de finir le dernier bloc, afficher la célébration finale
  if (isLastBlock && showCelebration) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: isLandscape ? 24 : 32 }}>
        <View style={{
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          borderRadius: isLandscape ? 20 : 24,
          padding: isLandscape ? 32 : 40,
          alignItems: 'center',
          borderWidth: 2,
          borderColor: '#87CEEB',
          shadowColor: '#87CEEB',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 8,
          width: '100%',
          maxWidth: isLandscape ? 700 : 500,
        }}>
          <FontAwesome name="trophy" size={64} color="#87CEEB" />
          <Text style={{
            color: '#87CEEB',
            fontSize: isLandscape ? 28 : 32,
            fontWeight: 'bold',
            marginTop: 20,
            textAlign: 'center',
          }}>
            Workout Completed!
          </Text>
          <Text style={{
            color: 'rgba(245, 245, 220, 0.8)',
            fontSize: isLandscape ? 16 : 18,
            textAlign: 'center',
            marginTop: 12,
          }}>
            Congratulations! You finished all {totalBlocks} blocks!
          </Text>
          
          <TouchableOpacity
            onPress={onNextBlock}
            style={{
              backgroundColor: 'rgba(18, 18, 18, 0.95)',
              borderRadius: 16,
              paddingVertical: 18,
              paddingHorizontal: 40,
              marginTop: 32,
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
              fontSize: 18,
              fontWeight: 'bold',
              letterSpacing: 1,
            }}>
              GO HOME
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Déterminer le bloc à afficher
  const blockToDisplay = showCelebration && nextBlock ? nextBlock : currentBlock;
  const displayBlockIndex = showCelebration && nextBlock ? blockIndex + 1 : blockIndex;

  if (!blockToDisplay) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Animation de recap si nécessaire */}
      {showRecapAnimation && currentBlock && (
        <BlockRecapAnimation
          blockName={currentBlock.name}
          blockIndex={blockIndex}
          onAnimationComplete={handleAnimationComplete}
          isLandscape={isLandscape}
        />
      )}

      {/* Contenu principal - utilise tout l'écran */}
      <BlockSummaryCard 
        block={blockToDisplay}
        blockIndex={displayBlockIndex}
        totalBlocks={totalBlocks}
        isLandscape={isLandscape}
        showCompletedRecap={showCelebration}
        onStartBlock={onStartBlock}
        onBack={blockIndex === 0 && !showCelebration ? onBack : undefined}
      />
    </View>
  );
}
