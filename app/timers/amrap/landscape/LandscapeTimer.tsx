import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { AddRoundButton } from '@/components/AddRoundButton';
import { LandscapeTimeDisplay } from '@/components/LandscapeTimeDisplay';
import { AMRAPFinalScreen } from '@/components/AMRAPFinalScreen';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface LandscapeTimerProps {
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

export default function LandscapeTimer({ 
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
}: LandscapeTimerProps) {

  if (finalTime) {
    return (
      <AMRAPFinalScreen
        finalTime={finalTime}
        currentRound={currentRound}
        timeCap={`${config.minutes}:${config.seconds.toString().padStart(2, '0')}`}
        onReset={resetTimer}
        isLandscape={true}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Background simple */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0F0F10',
      }} />
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        zIndex: 20,
      }}>
        <TouchableOpacity 
          onPress={onResetTimer}
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 25,
          }}
        >
          <FontAwesome name="arrow-left" size={24} color="#87CEEB" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ 
            color: 'rgba(135, 206, 235, 0.8)', 
            fontSize: 20, 
            fontWeight: 'bold', 
            letterSpacing: 1.5,
            textShadowColor: 'rgba(135, 206, 235, 0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}>
            AMRAP TIMER
          </Text>
          <Text style={{ 
            color: '#F5F5DC', 
            fontSize: 11, 
            opacity: 0.8, 
            letterSpacing: 0.5,
            textShadowColor: 'rgba(245, 245, 220, 0.3)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}>
            Round {currentRound} • {isPaused ? 'PAUSED' : isRunning ? 'RUNNING' : 'READY'}
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={{ 
        flex: 1, 
        flexDirection: 'row',
        paddingHorizontal: 32,
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}>
        
        <TouchableOpacity
          onPress={isPaused ? startTimer : pauseTimer}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 48,
            paddingVertical: 120,
            minHeight: 400,
            position: 'relative',
          }}
        >
          {/* LandscapeTimeDisplay réutilisable */}
          <LandscapeTimeDisplay 
            timeString={formatTime(remainingMilliseconds)}
            isPaused={isPaused}
            isOnFire={isOnFire}
          />
          
        </TouchableOpacity>

        <View style={{
          width: 1,
          height: 200,
          backgroundColor: 'rgba(135, 206, 235, 0.08)',
          alignSelf: 'center',
          marginLeft: 15
        }} />

        <View style={{ 
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 160,
        }}>
          <View style={{
            alignItems: 'center',
            marginBottom: 32,
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
              fontSize: 58,
              fontWeight: '600',
              textAlign: 'center',
              textShadowColor: 'rgba(245, 245, 220, 0.3)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
              letterSpacing: -1,
              fontFamily: 'monospace',
              lineHeight: 58,
            }}>
              {currentRound}
            </Text>
          </View>

          <AddRoundButton onPress={incrementRound} />
        </View>
      </View>
    </SafeAreaView>
  );
}
