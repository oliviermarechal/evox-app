import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddRoundButton } from '@/components/timers/AddRoundButton';
import { LandscapeTimeDisplay } from '@/components/timers/displays/LandscapeTimeDisplay';
import { AMRAPFinalScreen } from '@/components/timers/screens/AMRAPFinalScreen';
import SlideToAction from '@/components/timers/SlideToAction';
import { Header } from '@/components/ui/Header';

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
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  incrementRound: () => void;
  finishTimer: () => void;
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
  startTimer,
  pauseTimer,
  resetTimer,
  incrementRound,
  finishTimer,
  formatTime
}: LandscapeTimerProps) {

  if (finalTime) {
    return (
      <AMRAPFinalScreen
        finalTime={finalTime}
        currentRound={currentRound}
        timeCap={`${config.minutes}:${config.seconds.toString().padStart(2, '0')}`}
        onReset={onResetTimer}
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
      {/* Header générique sans flèche retour */}
      <Header
        title="AMRAP TIMER"
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
              onSlideComplete={finishTimer}
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

        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 160,
          gap: 20,
        }}>
          {/* Round Counter */}
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
