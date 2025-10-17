import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/Header';
import { PortraitTimeDisplay } from '@/components/timers/displays/PortraitTimeDisplay';
import SlideToAction from '@/components/timers/SlideToAction';

interface TabataConfig {
  rounds: number;
  workTime: number;
  restTime: number;
}

interface PortraitTimerProps {
  config: TabataConfig;
  remainingMilliseconds: number;
  isRunning: boolean;
  isPaused: boolean;
  currentRound: number;
  isWorkPhase: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  finishTimer: () => void;
  onResetTimer: () => void;
  formatTime: (milliseconds: number) => string;
}

export default function PortraitTimer({
  config,
  remainingMilliseconds,
  isRunning,
  isPaused,
  currentRound,
  isWorkPhase,
  startTimer,
  pauseTimer,
  finishTimer,
  onResetTimer,
  formatTime,
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
      {/* Header générique sans flèche retour */}
      <Header
        title="TABATA TIMER"
        subtitle={`Round ${currentRound} • ${isWorkPhase ? 'WORK' : 'REST'}`}
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
                borderColor: isWorkPhase ? 'rgba(135, 206, 235, 0.6)' : 'rgba(255, 165, 0, 0.6)', // Orange for rest
                backgroundColor: '#000000',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: isWorkPhase ? '#87CEEB' : '#FFA500', // Orange glow for rest
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 20,
              }}
            >
              <PortraitTimeDisplay
                timeString={formatTime(remainingMilliseconds)}
                isPaused={isPaused}
              />
            </TouchableOpacity>
        </View>

        {/* Round Counter and Phase Info */}
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
            {/* Progress indicator */}
            <Text style={{
              color: 'rgba(135, 206, 235, 0.6)',
              fontSize: 12,
              fontWeight: '500',
              textAlign: 'center',
              marginTop: 4,
            }}>
              {currentRound - 1}/{config.rounds} completed
            </Text>
          </View>

          {/* Phase Indicator */}
          <View style={{
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{
              color: isWorkPhase ? 'rgba(135, 206, 235, 0.8)' : 'rgba(255, 165, 0, 0.8)',
              fontSize: 14,
              fontWeight: '600',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              {isWorkPhase ? 'WORK' : 'REST'}
            </Text>
          </View>
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
