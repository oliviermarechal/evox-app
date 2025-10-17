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

interface TabataFinalScreenProps {
  finalTime: string;
  currentRound: number;
  workTime: number; // Work time in seconds
  restTime: number; // Rest time in seconds
  onReset: () => void;
  isLandscape?: boolean;
}

export default function TabataFinalScreen({ 
  finalTime, 
  currentRound, 
  workTime,
  restTime,
  onReset, 
  isLandscape = false 
}: TabataFinalScreenProps) {
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
    backgroundColor: 'rgba(135, 206, 235, 0.08)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: 'rgba(135, 206, 235, 0.4)',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
    width: '70%' as const,
    maxWidth: 500,
  } : {
    backgroundColor: 'rgba(135, 206, 235, 0.08)',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: 'rgba(135, 206, 235, 0.4)',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
    width: '100%' as const,
    maxWidth: 340,
    marginHorizontal: 24,
    marginBottom: 20,
  };

  const titleStyle = isLandscape ? {
    color: 'rgba(135, 206, 235, 0.9)',
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: 16,
    textAlign: 'center' as const,
    letterSpacing: 2,
  } : {
    color: 'rgba(135, 206, 235, 0.9)',
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
    textAlign: 'center' as const,
    letterSpacing: 2,
  };

  const timeStyle = isLandscape ? {
    color: '#F5F5DC',
    fontSize: 48,
    fontWeight: 'bold' as const,
    textShadowColor: 'rgba(135, 206, 235, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 24,
    textAlign: 'center' as const,
    letterSpacing: 1,
  } : {
    color: '#F5F5DC',
    fontSize: 36,
    fontWeight: 'bold' as const,
    textShadowColor: 'rgba(135, 206, 235, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 20,
    textAlign: 'center' as const,
    letterSpacing: 1,
  };

  const summaryTitleStyle = isLandscape ? {
    color: 'rgba(135, 206, 235, 0.8)',
    fontSize: 16,
    fontWeight: '500' as const,
    marginBottom: 16,
    letterSpacing: 1,
  } : {
    color: 'rgba(135, 206, 235, 0.8)',
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 8,
    letterSpacing: 1,
  };

  const numberStyle = isLandscape ? {
    color: '#F5F5DC',
    fontSize: 28,
    fontWeight: 'bold' as const,
    textShadowColor: 'rgba(135, 206, 235, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    marginBottom: 6,
  } : {
    color: '#F5F5DC',
    fontSize: 24,
    fontWeight: 'bold' as const,
    textShadowColor: 'rgba(135, 206, 235, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  };

  const labelStyle = isLandscape ? {
    color: 'rgba(135, 206, 235, 0.7)',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 1,
  } : {
    color: 'rgba(135, 206, 235, 0.7)',
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 1,
  };

  const buttonStyle = isLandscape ? {
    backgroundColor: '#121212',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 28,
    borderWidth: 1.5,
    borderColor: '#87CEEB',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  } : {
    backgroundColor: '#121212',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 32,
    borderWidth: 1.5,
    borderColor: '#87CEEB',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
    width: '100%' as const,
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
            TABATA COMPLETED
          </Text>
          
          <Text style={timeStyle}>
            {finalTime}
          </Text>

          {/* Recap Section */}
          <View style={{
            width: '100%',
            borderTopWidth: 1,
            borderTopColor: 'rgba(135, 206, 235, 0.2)',
            alignItems: 'center',
            ...recapPadding,
          }}>
            <Text style={summaryTitleStyle}>
              SESSION SUMMARY
            </Text>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
            }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={numberStyle}>
                  {currentRound}
                </Text>
                <Text style={labelStyle}>
                  ROUNDS
                </Text>
              </View>
              
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={numberStyle}>
                  {workTime}s
                </Text>
                <Text style={labelStyle}>
                  WORK TIME
                </Text>
              </View>
              
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={numberStyle}>
                  {restTime}s
                </Text>
                <Text style={labelStyle}>
                  REST TIME
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Continue Button */}
        <TouchableOpacity
          style={buttonStyle}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onReset();
          }}
        >
          <Text style={buttonTextStyle}>
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}