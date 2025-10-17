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

interface LandscapeConfigProps {
  selectedTimeIndex: number;
  selectedRoundIndex: number;
  onTimeIndexChange: (index: number) => void;
  onRoundIndexChange: (index: number) => void;
  onStartWorkout: () => void;
  config: EMOMConfig;
  timeIntervals: TimeInterval[];
  roundIntervals: RoundInterval[];
}

export default function LandscapeConfig({
  selectedTimeIndex,
  selectedRoundIndex,
  onTimeIndexChange,
  onRoundIndexChange,
  onStartWorkout,
  config,
  timeIntervals,
  roundIntervals,
}: LandscapeConfigProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header générique */}
      <Header
        title="EMOM"
        subtitle="Every Minute On the Minute"
        onBackPress={() => router.back()}
      />

      {/* Content - Horizontal Layout */}
      <View style={{ 
        flex: 1, 
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 20,
      }}>
        {/* Left Side - Time Pickers */}
        <View style={{ 
          flex: 1,
          alignItems: 'center',
          paddingRight: 20
        }}>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.8)',
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 24,
            textAlign: 'center',
            letterSpacing: 2,
            opacity: 0.8
          }}>
            TIME CAP
          </Text>

          {/* Two WheelPickers side by side - closer together */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
            width: '100%',
            marginBottom: 32,
          }}>
            {/* Duration WheelPicker */}
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
              width: 140
            }}>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.8)',
                fontSize: 10,
                fontWeight: '500',
                marginBottom: 16,
                textAlign: 'center',
                letterSpacing: 1,
                opacity: 0.8
              }}>
                DURATION
              </Text>
              <View style={{ 
                height: 160,
                width: 120,
                borderRadius: 12,
                overflow: 'hidden'
              }}>
                <WheelPicker
                  items={timeIntervals}
                  selectedIndex={selectedTimeIndex}
                  onIndexChange={onTimeIndexChange}
                  itemHeight={32}
                  visibleItems={5}
                  width={120}
                />
              </View>
            </View>

            {/* Rounds WheelPicker */}
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
              width: 140
            }}>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.8)',
                fontSize: 10,
                fontWeight: '500',
                marginBottom: 16,
                textAlign: 'center',
                letterSpacing: 1,
                opacity: 0.8
              }}>
                ROUNDS
              </Text>
              <View style={{ 
                height: 160,
                width: 120,
                borderRadius: 12,
                overflow: 'hidden'
              }}>
                <WheelPicker
                  items={roundIntervals}
                  selectedIndex={selectedRoundIndex}
                  onIndexChange={onRoundIndexChange}
                  itemHeight={32}
                  visibleItems={5}
                  width={120}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Center Separator with more space */}
        <View style={{
          width: 1,
          height: 200,
          backgroundColor: 'rgba(135, 206, 235, 0.08)',
          alignSelf: 'center',
          marginHorizontal: 40
        }} />

        {/* Right Side - Summary and Button */}
        <View style={{ 
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.8)',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 24,
            letterSpacing: 1
          }}>
            Configuration Summary
          </Text>
          
          <Text style={{
            color: '#F5F5DC',
            fontSize: 32,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 32,
            textShadowColor: 'rgba(135, 206, 235, 0.3)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 15
          }}>
            {config.rounds} Rounds • {timeIntervals.find(item => item.value === config.duration)?.label || `${config.duration}s`} each
          </Text>

          {/* Start Button - White text like AMRAP */}
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
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Text style={{
              color: '#F5F5DC',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: 1
            }}>
              START WORKOUT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
