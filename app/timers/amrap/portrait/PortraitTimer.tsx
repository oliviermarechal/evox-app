import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddRoundButton } from '@/components/timers/AddRoundButton';
import { PortraitTimeDisplay } from '@/components/timers/displays/PortraitTimeDisplay';
import { AMRAPFinalScreen } from '@/components/timers/screens/AMRAPFinalScreen';
import SlideToAction from '@/components/timers/SlideToAction';
import { Header } from '@/components/ui/Header';

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
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  incrementRound: () => void;
  finishTimer: () => void;
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
  startTimer,
  pauseTimer,
  resetTimer,
  incrementRound,
  finishTimer,
  formatTime
}: PortraitTimerProps) {

  // Afficher l'écran de fin si le timer est terminé
  if (finalTime) {
    return (
      <AMRAPFinalScreen
        finalTime={finalTime}
        currentRound={currentRound}
        timeCap={`${config.minutes}:${config.seconds.toString().padStart(2, '0')}`}
        onReset={onResetTimer}
        isLandscape={false}
      />
    );
  }

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
        title="AMRAP TIMER"
        subtitle={`Round ${currentRound}`}
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
                borderColor: 'rgba(135, 206, 235, 0.6)',
                backgroundColor: '#000000',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#87CEEB',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 12,
              }}
            >
              {/* PortraitTimeDisplay réutilisable */}
              <PortraitTimeDisplay 
                timeString={formatTime(remainingMilliseconds)}
                isPaused={isPaused}
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

        {/* SlideToAction pour portrait */}
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <SlideToAction
            onSlideComplete={finishTimer}
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
