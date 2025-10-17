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

interface LandscapeConfigProps {
  config: TabataConfig;
  onRoundsChange: (value: number) => void;
  onWorkTimeChange: (value: number) => void;
  onRestTimeChange: (value: number) => void;
  onStartCountdown: () => void;
}

export default function LandscapeConfig({
  config,
  onRoundsChange,
  onWorkTimeChange,
  onRestTimeChange,
  onStartCountdown,
}: LandscapeConfigProps) {
  // Generate options for rounds (1-20)
  const roundsOptions = Array.from({ length: 20 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  // Generate options for work time (5-60 seconds)
  const workTimeOptions = Array.from({ length: 56 }, (_, i) => ({
    label: `${i + 5}s`,
    value: i + 5
  }));

  // Generate options for rest time (5-60 seconds)
  const restTimeOptions = Array.from({ length: 56 }, (_, i) => ({
    label: `${i + 5}s`,
    value: i + 5
  }));

  // Get selected indices
  const selectedRoundsIndex = config.rounds - 1;
  const selectedWorkTimeIndex = config.workTime - 5;
  const selectedRestTimeIndex = config.restTime - 5;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header générique */}
      <Header
        title="TABATA"
        subtitle="High Intensity Interval Training"
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
            TABATA CONFIGURATION
          </Text>

          {/* Three WheelPickers side by side - closer together */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
            width: '100%',
            marginBottom: 32,
          }}>
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
              width: 120
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
                width: 100,
                borderRadius: 12,
                overflow: 'hidden'
              }}>
                <WheelPicker
                  items={roundsOptions}
                  selectedIndex={selectedRoundsIndex}
                  onIndexChange={(index) => onRoundsChange(index + 1)}
                  itemHeight={32}
                  visibleItems={5}
                  width={100}
                />
              </View>
            </View>

            {/* Work Time WheelPicker */}
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
              width: 120
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
                WORK
              </Text>
              <View style={{ 
                height: 160,
                width: 100,
                borderRadius: 12,
                overflow: 'hidden'
              }}>
                <WheelPicker
                  items={workTimeOptions}
                  selectedIndex={selectedWorkTimeIndex}
                  onIndexChange={(index) => onWorkTimeChange(index + 5)}
                  itemHeight={32}
                  visibleItems={5}
                  width={100}
                />
              </View>
            </View>

            {/* Rest Time WheelPicker */}
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
              width: 120
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
                REST
              </Text>
              <View style={{ 
                height: 160,
                width: 100,
                borderRadius: 12,
                overflow: 'hidden'
              }}>
                <WheelPicker
                  items={restTimeOptions}
                  selectedIndex={selectedRestTimeIndex}
                  onIndexChange={(index) => onRestTimeChange(index + 5)}
                  itemHeight={32}
                  visibleItems={5}
                  width={100}
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
            {config.rounds} Rounds • {config.workTime}s work • {config.restTime}s rest
          </Text>

          {/* Start Button - White text like AMRAP */}
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