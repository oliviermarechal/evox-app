import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddRoundButton } from '@/components/timers/AddRoundButton';
import { PortraitTimeDisplay } from '@/components/timers/displays/PortraitTimeDisplay';
import SlideToAction from '@/components/timers/SlideToAction';
import { Header } from '@/components/ui/Header';
import WorkoutExerciseList from '@/components/workout/execution/WorkoutExerciseList';
import { Exercise } from '@/lib/types';

interface WorkoutPortraitProps {
  label: string;
  subtitle?: string;
  timeString: string;
  isPaused: boolean;
  onTogglePause: () => void;
  currentRound?: number;
  onAddRound?: () => void;
  onFinish: () => void;
  exercises: Exercise[];
  finalScreen?: React.ReactNode; // Pour les écrans finaux spécifiques
}

export default function WorkoutPortrait({
  label,
  subtitle,
  timeString,
  isPaused,
  onTogglePause,
  currentRound = 0,
  onAddRound,
  onFinish,
  exercises,
  finalScreen,
}: WorkoutPortraitProps) {
  // Si on a un écran final, l'afficher
  if (finalScreen) {
    return <>{finalScreen}</>;
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
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(135, 206, 235, 0.02)',
        }} />
      </View>

      <Header
        title={label}
        subtitle={subtitle || (currentRound > 0 ? `Round ${currentRound}` : undefined)}
      />

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 24, 
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Liste exercices repliable */}
        <WorkoutExerciseList exercises={exercises} variant="portrait" />

        {/* Timer */}
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 400,
          marginVertical: 20,
        }}>
          <TouchableOpacity
            onPress={onTogglePause}
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
            <PortraitTimeDisplay 
              timeString={timeString}
              isPaused={isPaused}
            />
          </TouchableOpacity>
        </View>

        {/* Round Counter avec bouton */}
        {currentRound > 0 && (
          <View style={{ 
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
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

            {onAddRound && <AddRoundButton onPress={onAddRound} />}
          </View>
        )}

        {/* SlideToAction */}
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <SlideToAction
            onSlideComplete={onFinish}
            label="FINISH"
            width={280}
            height={50}
            orientation="horizontal"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

