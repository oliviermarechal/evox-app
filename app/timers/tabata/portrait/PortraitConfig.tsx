import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import WheelPicker from '@/components/ui/WheelPicker';
import { Header } from '@/components/ui/Header';

interface TabataConfig {
  rounds: number;
  workTime: number;
  restTime: number;
}

interface TimeInterval {
  label: string;
  value: number;
}

interface PortraitConfigProps {
  config: TabataConfig;
  onRoundsChange: (value: number) => void;
  workTimeIndex: number;
  restTimeIndex: number;
  onWorkTimeIndexChange: (index: number) => void;
  onRestTimeIndexChange: (index: number) => void;
  timeIntervals: TimeInterval[];
  onStartCountdown: () => void;
}

export default function PortraitConfig({
  config,
  onRoundsChange,
  workTimeIndex,
  restTimeIndex,
  onWorkTimeIndexChange,
  onRestTimeIndexChange,
  timeIntervals,
  onStartCountdown,
}: PortraitConfigProps) {
  // Generate options for rounds (1-20)
  const roundsOptions = Array.from({ length: 20 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  // Get selected index for rounds
  const selectedRoundsIndex = config.rounds - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header générique */}
      <Header
        title="TABATA"
        subtitle="High Intensity Interval Training"
        onBackPress={() => router.back()}
      />

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 20 }}>
        {/* Time Selection */}
        <Text style={{
          color: 'rgba(135, 206, 235, 0.8)',
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 32,
          textAlign: 'center',
          letterSpacing: 2,
          opacity: 0.8
        }}>
          TABATA CONFIGURATION
        </Text>

        {/* Three WheelPickers side by side - taller to use more height */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 40,
          gap: 12,
        }}>
          {/* Rounds WheelPicker */}
          <View style={{
            backgroundColor: 'rgba(135, 206, 235, 0.05)',
            borderRadius: 16,
            paddingVertical: 20,
            borderWidth: 1.5,
            borderColor: 'rgba(135, 206, 235, 0.3)',
            alignItems: 'center',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            elevation: 8,
            flex: 1
          }}>
            <Text style={{
              color: 'rgba(135, 206, 235, 0.8)',
              fontSize: 12,
              fontWeight: '500',
              marginBottom: 20,
              textAlign: 'center',
              letterSpacing: 1,
              opacity: 0.8
            }}>
              ROUNDS
            </Text>
            <View style={{ 
              height: 240,
              width: '100%',
              borderRadius: 12,
              overflow: 'hidden'
            }}>
              <WheelPicker
                items={roundsOptions}
                selectedIndex={selectedRoundsIndex}
                onIndexChange={(index) => onRoundsChange(index + 1)}
                itemHeight={48}
                visibleItems={5}
                width="100%"
              />
            </View>
          </View>

          {/* Work Time WheelPicker */}
          <View style={{
            backgroundColor: 'rgba(135, 206, 235, 0.05)',
            borderRadius: 16,
            paddingVertical: 20,
            borderWidth: 1.5,
            borderColor: 'rgba(135, 206, 235, 0.3)',
            alignItems: 'center',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            elevation: 8,
            flex: 1
          }}>
            <Text style={{
              color: 'rgba(135, 206, 235, 0.8)',
              fontSize: 12,
              fontWeight: '500',
              marginBottom: 20,
              textAlign: 'center',
              letterSpacing: 1,
              opacity: 0.8
            }}>
              WORK
            </Text>
            <View style={{ 
              height: 240,
              width: '100%',
              borderRadius: 12,
              overflow: 'hidden'
            }}>
              <WheelPicker
                items={timeIntervals}
                selectedIndex={workTimeIndex}
                onIndexChange={onWorkTimeIndexChange}
                itemHeight={48}
                visibleItems={5}
                width="100%"
              />
            </View>
          </View>

          {/* Rest Time WheelPicker */}
          <View style={{
            backgroundColor: 'rgba(135, 206, 235, 0.05)',
            borderRadius: 16,
            paddingVertical: 20,
            borderWidth: 1.5,
            borderColor: 'rgba(135, 206, 235, 0.3)',
            alignItems: 'center',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            elevation: 8,
            flex: 1
          }}>
            <Text style={{
              color: 'rgba(135, 206, 235, 0.8)',
              fontSize: 12,
              fontWeight: '500',
              marginBottom: 20,
              textAlign: 'center',
              letterSpacing: 1,
              opacity: 0.8
            }}>
              REST
            </Text>
            <View style={{ 
              height: 240,
              width: '100%',
              borderRadius: 12,
              overflow: 'hidden'
            }}>
              <WheelPicker
                items={timeIntervals}
                selectedIndex={restTimeIndex}
                onIndexChange={onRestTimeIndexChange}
                itemHeight={48}
                visibleItems={5}
                width="100%"
              />
            </View>
          </View>
        </View>

        {/* Configuration Summary */}
        <Text style={{
          color: 'rgba(135, 206, 235, 0.8)',
          fontSize: 14,
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: 16,
          letterSpacing: 1
        }}>
          Configuration Summary
        </Text>

        {/* Selected Time Display */}
        <Text style={{
          color: '#F5F5DC',
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 32,
          textShadowColor: 'rgba(135, 206, 235, 0.3)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 15
        }}>
          {config.rounds} Rounds • {timeIntervals.find(item => item.value === config.workTime)?.label || `${config.workTime}s`} work • {timeIntervals.find(item => item.value === config.restTime)?.label || `${config.restTime}s`} rest
        </Text>

        {/* Start Button - Refined design */}
        <TouchableOpacity
          onPress={onStartCountdown}
          style={{
            backgroundColor: '#121212',
            borderRadius: 16,
            paddingVertical: 18,
            paddingHorizontal: 32,
            borderWidth: 1.5,
            borderColor: '#87CEEB',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{
            color: '#87CEEB',
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 2
          }}>
            START WORKOUT
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}