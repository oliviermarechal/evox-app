import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/ui/Header';

interface ConfigComponentProps {
  onStartCountdown: () => void;
}

export default function ConfigComponent({ onStartCountdown }: ConfigComponentProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header générique */}
      <Header 
        onBackPress={() => router.back()}
        title="FREE TIMER"
        subtitle="Stopwatch"
      />

      {/* Main Content */}
      <View style={{ 
        flex: 1, 
        paddingHorizontal: 32, 
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{
          color: 'rgba(135, 206, 235, 0.8)',
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: 24,
          letterSpacing: 1,
          textShadowColor: 'rgba(135, 206, 235, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 4,
        }}>
          Start your stopwatch and track your time without any limits.
        </Text>
        
        <TouchableOpacity 
          onPress={onStartCountdown}
          style={{
            backgroundColor: 'rgba(135, 206, 235, 0.1)',
            borderWidth: 2,
            borderColor: '#87CEEB',
            borderRadius: 20,
            paddingHorizontal: 48,
            paddingVertical: 20,
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <Text style={{
            color: '#87CEEB',
            fontSize: 18,
            fontWeight: '700',
            textAlign: 'center',
            letterSpacing: 1,
            textShadowColor: 'rgba(135, 206, 235, 0.5)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          }}>
            START TIMER
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
