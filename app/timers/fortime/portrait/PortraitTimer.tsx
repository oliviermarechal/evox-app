import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/ui/Header';
import { PortraitTimeDisplay } from '@/components/timers/displays/PortraitTimeDisplay';
import { AddRoundButton } from '@/components/timers/AddRoundButton';
import SlideToAction from '@/components/timers/SlideToAction';

export interface ForTimeConfig {
  minutes: number;
  seconds: number;
}

interface PortraitTimerProps {
  config: ForTimeConfig;
  onResetTimer: () => void;
  remainingMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isOnFire: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  formatTime: (ms: number) => string;
  currentRound?: number;
  incrementRound?: () => void;
  finishTimer?: () => void;
}

export default function PortraitTimer({
  config,
  onResetTimer,
  remainingMilliseconds,
  isRunning,
  isPaused,
  isOnFire,
  startTimer,
  pauseTimer,
  formatTime,
  currentRound = 0,
  incrementRound,
  finishTimer
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
        <View style={{
          position: 'absolute',
          top: '20%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: 'rgba(135, 206, 235, 0.05)',
          transform: [{ rotate: '-25deg' }],
          shadowColor: '#87CEEB',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 60,
          elevation: 15,
        }} />
        <View style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(255, 69, 0, 0.03)',
          transform: [{ rotate: '45deg' }],
          shadowColor: '#FF4500',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 50,
          elevation: 10,
        }} />
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(135, 206, 235, 0.02)',
        }} />
      </View>

      {/* Header générique sans flèche retour */}
      <Header
        title="FOR TIME"
        subtitle={isPaused ? 'PAUSED' : isRunning ? 'RUNNING' : 'READY'}
      />

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

          {/* Bouton Add Round - Même que AMRAP */}
          {incrementRound && (
            <AddRoundButton onPress={incrementRound} />
          )}
        </View>

        {/* SlideToAction pour portrait */}
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <SlideToAction
            onSlideComplete={finishTimer || onResetTimer}
            label="FINISH"
            width={280}
            height={50}
            orientation="horizontal"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
