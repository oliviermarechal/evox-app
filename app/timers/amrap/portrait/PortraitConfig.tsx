import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WheelPicker from '@/components/WheelPicker';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface PortraitConfigProps {
  onStartCountdown: (config: AMRAPConfig) => void;
  initialMinutes?: number;
  initialSeconds?: number;
  selectedIndex: number;
  onTimeChange: (index: number) => void;
  timeIntervals: string[];
}

export default function PortraitConfig({ 
  onStartCountdown, 
  selectedIndex, 
  onTimeChange, 
  timeIntervals 
}: PortraitConfigProps) {
  const handleStartTimer = () => {
    const selectedTime = timeIntervals[selectedIndex];
    const [minutes, seconds] = selectedTime.split(':').map(Number);
    onStartCountdown({ minutes, seconds });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#87CEEB" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#87CEEB', fontSize: 24, fontWeight: 'bold', letterSpacing: 2 }}>
            AMRAP
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: 4, opacity: 0.8 }}>
            As Many Rounds As Possible
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' }}>
        {/* Configuration */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{
              color: '#87CEEB',
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
              letterSpacing: 4,
              opacity: 0.9
            }}>
              CONFIGURATION
            </Text>
            <View style={{
              width: 40,
              height: 1,
              backgroundColor: '#F5F5DC',
              marginTop: 12,
              opacity: 0.6
            }} />
          </View>

          <View style={{
            backgroundColor: '#0F0F10',
            borderRadius: 24,
            padding: 28,
            borderWidth: 1,
            borderColor: '#87CEEB30',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 6
          }}>
            {/* Single time selector */}
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                color: '#87CEEB',
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 16,
                textAlign: 'center',
                letterSpacing: 3,
                opacity: 0.8
              }}>
                TIME CAP
              </Text>

              <View style={{
                backgroundColor: '#87CEEB10',
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: '#87CEEB40',
                width: 140,
                alignItems: 'center',
                shadowColor: '#87CEEB',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4
              }}>
                <View style={{ height: 200, width: 120 }}>
                  <WheelPicker
                    items={timeIntervals}
                    selectedIndex={selectedIndex}
                    onIndexChange={onTimeChange}
                    itemHeight={40}
                    visibleItems={5}
                    width={120}
                  />
                </View>
              </View>
            </View>

            {/* Configuration Summary */}
            <View style={{
              backgroundColor: '#F5F5DC15',
              borderRadius: 16,
              padding: 18,
              marginTop: 24,
              borderWidth: 1,
              borderColor: '#F5F5DC40',
              shadowColor: '#F5F5DC',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4
            }}>
              <Text style={{
                color: '#87CEEB',
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: 8
              }}>
                Configuration Summary
              </Text>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                Time Cap: {timeIntervals[selectedIndex]}
              </Text>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 14,
                textAlign: 'center',
                marginTop: 4,
                opacity: 0.8
              }}>
                Complete as many rounds as possible within the time limit
              </Text>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          onPress={handleStartTimer}
          style={{
            backgroundColor: '#F5F5DC',
            borderRadius: 20,
            paddingVertical: 16,
            marginHorizontal: 24,
            marginBottom: 32,
            shadowColor: '#F5F5DC',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8
          }}
        >
          <Text style={{
            color: '#000000',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: 1
          }}>
            START WORKOUT
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
