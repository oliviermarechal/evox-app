import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { AddRoundButton } from '@/components/timers/AddRoundButton';
import { PortraitTimeDisplay } from '@/components/timers/displays/PortraitTimeDisplay';
import { AMRAPFinalScreen } from '@/components/timers/screens/AMRAPFinalScreen';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface PortraitTimerProps {
  config: AMRAPConfig;
  onResetTimer: () => void;
  remainingMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  currentRound: number;
  finalTime: string | null;
  isOnFire: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  incrementRound: () => void;
  formatTime: (ms: number) => string;
}

export default function PortraitTimer({ 
  config, 
  onResetTimer,
  remainingMilliseconds,
  isRunning,
  isPaused,
  currentRound,
  finalTime,
  isOnFire,
  startTimer,
  pauseTimer,
  resetTimer,
  incrementRound,
  formatTime
}: PortraitTimerProps) {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Background avec gradient subtil */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0F0F10',
      }}>
        {/* Gradient overlay subtil */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(135, 206, 235, 0.02)',
        }} />
      </View>
      {/* Header minimaliste - comme le concurrent */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        zIndex: 10,
      }}>
        <TouchableOpacity onPress={onResetTimer}>
          <FontAwesome name="arrow-left" size={24} color="#87CEEB" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ 
            color: 'rgba(135, 206, 235, 0.8)', 
            fontSize: 18, 
            fontWeight: 'bold', 
            letterSpacing: 1.2 
          }}>
            AMRAP TIMER
          </Text>
          <Text style={{ 
            color: '#F5F5DC', 
            fontSize: 10, 
            opacity: 0.8, 
            letterSpacing: 0.5 
          }}>
            Round {currentRound}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 24, 
        paddingVertical: 20,
        zIndex: 10,
      }}>
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
              onPress={isPaused ? startTimer : pauseTimer}
              style={{
                width: 350,
                height: 350,
                borderRadius: 175,
                borderWidth: 1.5,
                borderColor: isOnFire ? '#FF4500' : 'rgba(135, 206, 235, 0.6)',
                backgroundColor: '#000000',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: isOnFire ? '#FF4500' : '#87CEEB',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isOnFire ? 1.0 : 0.3,
                shadowRadius: isOnFire ? 50 : 20,
                elevation: isOnFire ? 50 : 12,
              }}
            >
              {/* PortraitTimeDisplay réutilisable */}
              <PortraitTimeDisplay 
                timeString={formatTime(remainingMilliseconds)}
                isPaused={isPaused}
                isOnFire={isOnFire}
              />
            </TouchableOpacity>
        </View>

        {/* Round Counter avec bouton */}
        <View style={{ 
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          {/* Round Counter - Design sophistiqué */}
          <View style={{
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{
              color: 'rgba(135, 206, 235, 0.8)',
              fontSize: 11,
              fontWeight: '500',
              letterSpacing: 1,
              textAlign: 'center',
              marginBottom: 8,
              textTransform: 'uppercase',
            }}>
              Round
            </Text>
            <Text style={{
              color: '#F5F5DC',
              fontSize: 32,
              fontWeight: '600',
              textAlign: 'center',
              textShadowColor: 'rgba(245, 245, 220, 0.3)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
              letterSpacing: -1,
              fontFamily: 'monospace',
              lineHeight: 32,
            }}>
              {currentRound}
            </Text>
          </View>

          <AddRoundButton onPress={incrementRound} />
        </View>
      </View>

      {/* Final Time Display */}
      {finalTime && (
        <AMRAPFinalScreen
          finalTime={finalTime}
          currentRound={currentRound}
          timeCap={`${config.minutes}:${config.seconds.toString().padStart(2, '0')}`}
          onReset={onResetTimer}
          isLandscape={false}
        />
      )}
    </SafeAreaView>
  );
}
