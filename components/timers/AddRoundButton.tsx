import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';

export function AddRoundButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animation de glow au press
    Animated.sequence([
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        width: 84,
        height: 84,
        borderRadius: 42,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#87CEEB',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      <LinearGradient
        colors={['#121212', '#0A0A0A']}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 42,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#87CEEB',
        }}
      >
        <Plus size={34} color="#F5F5DC" strokeWidth={2} />
      </LinearGradient>
      
      {/* Glow effect au press */}
      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 42,
          backgroundColor: 'rgba(135, 206, 235, 0.2)',
          opacity: glowOpacity,
          shadowColor: '#87CEEB',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 20,
        }}
      />
    </TouchableOpacity>
  );
}
