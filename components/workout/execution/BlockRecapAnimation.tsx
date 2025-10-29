import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface BlockRecapAnimationProps {
  blockName: string;
  blockIndex: number;
  onAnimationComplete: () => void;
  isLandscape: boolean;
}

export default function BlockRecapAnimation({ 
  blockName, 
  blockIndex, 
  onAnimationComplete,
  isLandscape 
}: BlockRecapAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de sortie après 2.5 secondes
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [scaleAnim, opacityAnim, onAnimationComplete]);

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 15, 16, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    }}>
      <Animated.View style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: 'rgba(135, 206, 235, 0.15)',
          borderRadius: isLandscape ? 20 : 24,
          padding: isLandscape ? 32 : 40,
          alignItems: 'center',
          borderWidth: 3,
          borderColor: '#87CEEB',
          shadowColor: '#87CEEB',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 30,
          elevation: 15,
          minWidth: isLandscape ? 300 : 250,
        }}>
          <FontAwesome 
            name="check-circle" 
            size={isLandscape ? 48 : 64} 
            color="#87CEEB" 
            style={{ marginBottom: 16 }}
          />
          <Text style={{
            color: '#87CEEB',
            fontSize: isLandscape ? 18 : 24,
            fontWeight: 'bold',
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Block {blockIndex + 1} Completed!
          </Text>
          <Text style={{
            color: 'rgba(245, 245, 220, 0.9)',
            fontSize: isLandscape ? 14 : 18,
            textAlign: 'center',
            marginBottom: 12,
          }}>
            {blockName}
          </Text>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.8)',
            fontSize: isLandscape ? 12 : 14,
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            Great job! 🎉
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
