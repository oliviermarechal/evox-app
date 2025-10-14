import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import WheelPicker from '@/components/WheelPicker';

interface LandscapeConfigProps {
  onStartCountdown: (time: { minutes: number; seconds: number }) => void;
}

export default function LandscapeConfig({ onStartCountdown }: LandscapeConfigProps) {
  const timeIntervals = [
    '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00'
  ];

  const [selectedIndex, setSelectedIndex] = useState(10); // Default to 10:00

  const onTimeChange = (index: number) => {
    setSelectedIndex(index);
  };

  const handleStartTimer = () => {
    const selectedTime = timeIntervals[selectedIndex];
    const [minutes, seconds] = selectedTime.split(':').map(Number);
    onStartCountdown({ minutes, seconds });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header - Full width */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 24, 
        paddingVertical: 16,
      }}>
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

      {/* Main Content - Aligned containers */}
      <View style={{ 
        flex: 1, 
        flexDirection: 'row', 
        paddingHorizontal: 24, 
        paddingTop: 20,
        alignItems: 'flex-start',
        gap: 20
      }}>
        {/* Left Side - Configuration */}
        <View style={{ flex: 1 }}>

          {/* Configuration Section */}
          <View style={{
            backgroundColor: '#0F0F10',
            borderRadius: 20,
            padding: 20,
            borderWidth: 2,
            borderColor: '#87CEEB40',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              color: '#87CEEB',
              fontSize: 14,
              fontWeight: '600',
              textAlign: 'center',
              letterSpacing: 3,
              opacity: 0.9,
              marginBottom: 8
            }}>
              CONFIGURATION
            </Text>

            <Text style={{
              color: '#87CEEB',
              fontSize: 12,
              fontWeight: '500',
              marginBottom: 20,
              textAlign: 'center',
              letterSpacing: 2,
              opacity: 0.8
            }}>
              TIME CAP
            </Text>

            <View style={{
              backgroundColor: '#87CEEB10',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: '#87CEEB40',
              alignItems: 'center',
              shadowColor: '#87CEEB',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              overflow: 'hidden',
              width: 140
            }}>
              <View style={{ 
                height: 140,
                width: 120
              }}>
                <WheelPicker
                  items={timeIntervals}
                  selectedIndex={selectedIndex}
                  onIndexChange={onTimeChange}
                  itemHeight={28}
                  visibleItems={5}
                  width={120}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Right Side - Summary with integrated button */}
        <View style={{ flex: 1 }}>
          {/* Configuration Summary */}
          <View style={{
            backgroundColor: '#F5F5DC15',
            borderRadius: 20,
            padding: 24,
            borderWidth: 2,
            borderColor: '#F5F5DC40',
            shadowColor: '#F5F5DC',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 6,
            justifyContent: 'space-between'
          }}>
            <View>
              <Text style={{
                color: '#87CEEB',
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: 16
              }}>
                Configuration Summary
              </Text>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 12
              }}>
                Time Cap: {timeIntervals[selectedIndex]}
              </Text>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 14,
                textAlign: 'center',
                opacity: 0.8,
                lineHeight: 18
              }}>
                Complete as many rounds as possible within the time limit
              </Text>
            </View>

            {/* Start Button - Inside the summary container */}
            <TouchableOpacity
              onPress={handleStartTimer}
              style={{
                backgroundColor: '#F5F5DC',
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 32,
                marginTop: 24,
                shadowColor: '#F5F5DC',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
                width: '100%'
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
        </View>
      </View>
    </SafeAreaView>
  );
}