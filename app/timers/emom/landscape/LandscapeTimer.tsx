import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/Header';
import { LandscapeTimeDisplay } from '@/components/timers/displays/LandscapeTimeDisplay';
// EMOM doesn't need AddRoundButton - rounds are auto-incremented
import SlideToAction from '@/components/timers/SlideToAction';

interface EMOMConfig {
  rounds: number;
  duration: number;
}

interface LandscapeTimerProps {
  config: EMOMConfig;
  remainingMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  currentRound: number;
  startTimer: () => void;
  pauseTimer: () => void;
  finishTimer: () => void;
  onResetTimer: () => void;
  formatTime: (milliseconds: number) => string;
}

export default function LandscapeTimer({
  config,
  remainingMilliseconds,
  isRunning,
  isPaused,
  currentRound,
  startTimer,
  pauseTimer,
  finishTimer,
  onResetTimer,
  formatTime,
}: LandscapeTimerProps) {
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
      {/* Header générique sans flèche retour */}
      <Header
        title="EMOM TIMER"
        subtitle={`Round ${currentRound} • ${isPaused ? 'PAUSED' : isRunning ? 'RUNNING' : 'READY'}`}
      />

      <View style={{ 
        flex: 1, 
        flexDirection: 'row',
        paddingHorizontal: 32,
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}>
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 48,
          paddingVertical: 40,
          height: '100%',
        }}>
          <TouchableOpacity
            onPress={isPaused ? startTimer : pauseTimer}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LandscapeTimeDisplay 
              timeString={formatTime(remainingMilliseconds)}
              isPaused={isPaused}
            />
          </TouchableOpacity>

          <View style={{
            bottom: 30,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
            marginTop: 40,
            zIndex: 10,
          }}>
            <SlideToAction
              onSlideComplete={finishTimer || onResetTimer}
              label="FINISH"
              width={270}
              height={50}
              orientation="horizontal"
            />
          </View>
        </View>

        <View style={{
          width: 1,
          height: 200,
          backgroundColor: 'rgba(135, 206, 235, 0.08)',
          alignSelf: 'center',
          marginLeft: 15
        }} />

        {/* Round Counter with Progress */}
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 160,
          gap: 20,
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
              fontSize: 48,
              fontWeight: '600',
              textAlign: 'center',
              textShadowColor: 'rgba(245, 245, 220, 0.3)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
              letterSpacing: -1,
              fontFamily: 'monospace',
              lineHeight: 48,
            }}>
              {currentRound}
            </Text>
            {/* Progress indicator */}
            <Text style={{
              color: 'rgba(135, 206, 235, 0.6)',
              fontSize: 14,
              fontWeight: '500',
              textAlign: 'center',
              marginTop: 8,
            }}>
              {currentRound - 1}/{config.rounds} completed
            </Text>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}