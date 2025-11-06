import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import WheelPicker from '@/components/ui/WheelPicker';
import { Header } from '@/components/ui/Header';

interface TimeInterval {
  label: string;
  value: number;
}

interface RoundInterval {
  label: string;
  value: number;
}

interface EMOMConfig {
  rounds: number;
  duration: number;
}

interface PortraitConfigProps {
  selectedTimeIndex: number;
  selectedRoundIndex: number;
  onTimeIndexChange: (index: number) => void;
  onRoundIndexChange: (index: number) => void;
  onStartWorkout: () => void;
  config: EMOMConfig;
  timeIntervals: TimeInterval[];
  roundIntervals: RoundInterval[];
}

export default function PortraitConfig({
  selectedTimeIndex,
  selectedRoundIndex,
  onTimeIndexChange,
  onRoundIndexChange,
  onStartWorkout,
  config,
  timeIntervals,
  roundIntervals,
}: PortraitConfigProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header générique */}
      <Header
        title="EMOM"
        subtitle="Every Minute On the Minute"
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
          TIME CAP
        </Text>

        {/* Two WheelPickers side by side - taller to use more height */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 40,
          gap: 16,
        }}>
          {/* Duration WheelPicker - Now first */}
          <View style={{
            backgroundColor: 'rgba(135, 206, 235, 0.05)',
            borderRadius: 16,
            padding: 20,
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
              DURATION
            </Text>
                    <View style={{ 
                      height: 240,
                      width: '100%',
                      borderRadius: 12,
                      overflow: 'hidden'
                    }}>
                      <WheelPicker
                        items={timeIntervals}
                        selectedIndex={selectedTimeIndex}
                        onIndexChange={onTimeIndexChange}
                        itemHeight={48}
                        visibleItems={5}
                        width="100%"
                      />
            </View>
          </View>

          {/* Rounds WheelPicker - Now second */}
          <View style={{
            backgroundColor: 'rgba(135, 206, 235, 0.05)',
            borderRadius: 16,
            padding: 20,
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
                        items={roundIntervals}
                        selectedIndex={selectedRoundIndex}
                        onIndexChange={onRoundIndexChange}
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
          {config.rounds} Rounds • {timeIntervals.find(item => item.value === config.duration)?.label || `${config.duration}s`} each
        </Text>

        {/* Start Button - Refined design */}
        <TouchableOpacity
          onPress={onStartWorkout}
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
