import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface CountdownComponentProps {
  countdownValue: number;
  isCountdownPaused: boolean;
  onSkipCountdown: () => void;
  onPauseCountdown: () => void;
  onResumeCountdown: () => void;
  onCancelCountdown: () => void;
}

export default function CountdownComponent({
  countdownValue,
  isCountdownPaused,
  onSkipCountdown,
  onPauseCountdown,
  onResumeCountdown,
  onCancelCountdown
}: CountdownComponentProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{
          color: '#87CEEB',
          fontSize: 32,
          fontWeight: 'bold',
          marginBottom: 40,
          letterSpacing: 2,
          textAlign: 'center'
        }}>
          GET READY
        </Text>
        
        {/* Countdown Circle */}
        <View style={{
          width: 300,
          height: 300,
          borderRadius: 150,
          borderWidth: 15,
          borderColor: '#FFD700',
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#FFD700',
          shadowOffset: { width: 0, height: 15 },
          shadowOpacity: 0.7,
          shadowRadius: 30,
          elevation: 25,
          marginBottom: 40
        }}>
          <Text style={{
            color: '#FFD700',
            fontSize: 80,
            fontWeight: 'bold',
            textAlign: 'center',
            textShadowColor: '#FFD700',
            textShadowOffset: { width: 0, height: 5 },
            textShadowRadius: 15
          }}>
            {countdownValue}
          </Text>
        </View>

        {/* Countdown Controls */}
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={onSkipCountdown}
            style={{
              backgroundColor: '#FFD700',
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 25,
              borderWidth: 3,
              borderColor: '#FFD700',
              shadowColor: '#FFD700',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 15,
              elevation: 12
            }}
          >
            <Text style={{
              color: '#000000',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: 1
            }}>
              SKIP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isCountdownPaused ? onResumeCountdown : onPauseCountdown}
            style={{
              backgroundColor: isCountdownPaused ? '#FFD700' : '#87CEEB',
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 25,
              borderWidth: 3,
              borderColor: isCountdownPaused ? '#FFD700' : '#87CEEB',
              shadowColor: isCountdownPaused ? '#FFD700' : '#87CEEB',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 15,
              elevation: 12
            }}
          >
            <Text style={{
              color: '#000000',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: 1
            }}>
              {isCountdownPaused ? 'RESUME' : 'PAUSE'}
            </Text>
          </TouchableOpacity>
        </View>

        {isCountdownPaused && (
          <TouchableOpacity
            onPress={onCancelCountdown}
            style={{
              backgroundColor: '#000000',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#87CEEB',
              marginTop: 20,
              shadowColor: '#87CEEB',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8
            }}
          >
            <Text style={{
              color: '#87CEEB',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: 1
            }}>
              CANCEL
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
