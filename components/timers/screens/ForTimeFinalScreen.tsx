import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withSequence
} from 'react-native-reanimated';

interface ForTimeFinalScreenProps {
  finalTime: string;
  currentRound: number;
  timeCap: string;
  onReset: () => void;
  isLandscape?: boolean;
}

export function ForTimeFinalScreen({ 
  finalTime, 
  currentRound, 
  timeCap,
  onReset, 
  isLandscape = false 
}: ForTimeFinalScreenProps) {
  // Animation values
  const finalScale = useSharedValue(0);
  const finalOpacity = useSharedValue(0);
  const finalRotation = useSharedValue(0);
  const finalGlow = useSharedValue(0);

  // Animation styles
  const finalAnimationStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: finalScale.value },
      { rotate: `${finalRotation.value}deg` }
    ],
    opacity: finalOpacity.value,
    shadowOpacity: finalGlow.value,
  }));

  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    finalScale.value = withSequence(
      withTiming(0.9, { duration: 150 }),
      withSpring(1.05, { damping: 10, stiffness: 120 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    finalOpacity.value = withTiming(1, { duration: 200 });
    finalRotation.value = withSequence(
      withTiming(-3, { duration: 100 }),
      withSpring(0, { damping: 12, stiffness: 150 })
    );
    finalGlow.value = withSequence(
      withTiming(0.6, { duration: 150 }),
      withTiming(0.4, { duration: 500 })
    );
  }, []);

  const containerStyle = isLandscape ? {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: 'rgba(15, 15, 16, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.3)',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    maxWidth: 600,
  } : {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 30,
    paddingVertical: 40,
    backgroundColor: 'rgba(15, 15, 16, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.3)',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    maxWidth: 350,
  };

  const titleStyle = isLandscape ? {
    color: '#87CEEB',
    fontSize: 24,
    fontWeight: 'bold' as const,
    letterSpacing: 2,
    textAlign: 'center' as const,
    marginBottom: 20,
    textShadowColor: 'rgba(135, 206, 235, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  } : {
    color: '#87CEEB',
    fontSize: 20,
    fontWeight: 'bold' as const,
    letterSpacing: 1.5,
    textAlign: 'center' as const,
    marginBottom: 16,
    textShadowColor: 'rgba(135, 206, 235, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  };

  const timeStyle = isLandscape ? {
    color: '#F5F5DC',
    fontSize: 48,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    marginBottom: 20,
    textShadowColor: 'rgba(245, 245, 220, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 2,
    fontFamily: 'monospace',
  } : {
    color: '#F5F5DC',
    fontSize: 36,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    marginBottom: 16,
    textShadowColor: 'rgba(245, 245, 220, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    letterSpacing: 1.5,
    fontFamily: 'monospace',
  };

  const buttonStyle = isLandscape ? {
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderWidth: 1,
    borderColor: '#87CEEB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
    maxWidth: 300,
  } : {
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderWidth: 1,
    borderColor: '#87CEEB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
    maxWidth: 300,
  };

  const buttonTextStyle = isLandscape ? {
    color: '#F5F5DC',
    fontWeight: 'bold' as const,
    fontSize: 18,
    letterSpacing: 1,
    textAlign: 'center' as const,
  } : {
    color: '#F5F5DC',
    fontWeight: 'bold' as const,
    fontSize: 18,
    letterSpacing: 1,
    textAlign: 'center' as const,
  };

  const recapPadding = isLandscape ? {
    paddingTop: 20,
    paddingHorizontal: 40,
  } : {
    paddingTop: 20,
    paddingHorizontal: 20,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingHorizontal: isLandscape ? 24 : 0 
      }}>
        <Animated.View style={[containerStyle, finalAnimationStyle]}>
          <Text style={titleStyle}>
            FOR TIME COMPLETED
          </Text>
          
          <Text style={timeStyle}>
            {finalTime}
          </Text>

          {/* Recap Section */}
          <View style={recapPadding}>
            <Text style={{
              color: 'rgba(135, 206, 235, 0.8)',
              fontSize: isLandscape ? 16 : 14,
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: 8,
              letterSpacing: 1,
            }}>
              Time Cap
            </Text>
            <Text style={{
              color: '#F5F5DC',
              fontSize: isLandscape ? 24 : 20,
              fontWeight: 'bold',
              textAlign: 'center',
              textShadowColor: 'rgba(245, 245, 220, 0.3)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
              letterSpacing: 1,
              fontFamily: 'monospace',
              marginBottom: 16,
            }}>
              {timeCap}
            </Text>
            
            <Text style={{
              color: 'rgba(135, 206, 235, 0.8)',
              fontSize: isLandscape ? 16 : 14,
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: 8,
              letterSpacing: 1,
            }}>
              Rounds Completed
            </Text>
            <Text style={{
              color: '#F5F5DC',
              fontSize: isLandscape ? 32 : 28,
              fontWeight: 'bold',
              textAlign: 'center',
              textShadowColor: 'rgba(245, 245, 220, 0.3)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
              letterSpacing: 1,
              fontFamily: 'monospace',
            }}>
              {currentRound}
            </Text>
          </View>

          <TouchableOpacity 
            style={buttonStyle}
            onPress={onReset}
            activeOpacity={0.7}
          >
            <Text style={buttonTextStyle}>
              BACK TO HOME
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
