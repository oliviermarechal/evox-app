import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import WheelPicker from '@/components/ui/WheelPicker';
import { Header } from '@/components/ui/Header';

interface LandscapeConfigProps {
  onStartCountdown: () => void;
  selectedIndex: number;
  onTimeChange: (index: number) => void;
  timeIntervals: string[];
  initialMinutes?: number;
  initialSeconds?: number;
}

export default function LandscapeConfig({ 
  onStartCountdown, 
  selectedIndex, 
  onTimeChange, 
  timeIntervals 
}: LandscapeConfigProps) {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header générique */}
      <Header 
        onBackPress={() => router.back()}
        title="FOR TIME"
        subtitle="Complete as many rounds as possible"
      />

      {/* Main Content - Direct layout without container */}
      <View style={{ 
        flex: 1, 
        flexDirection: 'row',
        paddingHorizontal: 32, 
        paddingVertical: 20,
        alignItems: 'center',
        gap: 40
      }}>
        {/* Left Side - Time Picker */}
        <View style={{ 
          flex: 1,
          alignItems: 'center'
        }}>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.8)',
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
            letterSpacing: 3,
            marginBottom: 8
          }}>
            CONFIGURATION
          </Text>

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
            width: 180
          }}>
            <View style={{ 
              height: 180,
              width: 160,
              borderRadius: 12,
              overflow: 'hidden'
            }}>
              <WheelPicker
                items={timeIntervals}
                selectedIndex={selectedIndex}
                onIndexChange={onTimeChange}
                itemHeight={36}
                visibleItems={5}
                width={160}
              />
            </View>
          </View>
        </View>

        {/* Center Separator */}
        <View style={{
          width: 1,
          height: 200,
          backgroundColor: 'rgba(135, 206, 235, 0.08)',
          alignSelf: 'center'
        }} />

        {/* Right Side - Summary and Button */}
        <View style={{ 
          flex: 1,
          alignItems: 'center'
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
            marginBottom: 16,
            textShadowColor: 'rgba(135, 206, 235, 0.3)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 15
          }}>
            {timeIntervals[selectedIndex]}
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
