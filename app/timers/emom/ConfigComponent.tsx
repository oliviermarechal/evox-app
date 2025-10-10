import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import WheelPicker from '@/components/WheelPicker';

// Styles constants supprimés - utilisent maintenant les styles par défaut du WheelPicker

// Items constants pour éviter les re-créations
const ROUNDS_ITEMS = Array.from({ length: 20 }, (_, i) => `${i + 1}`);
const DURATION_ITEMS = ['1', '30s', '45s', '1:00', '1:30', '2:00', '3:00', '5:00'];
const DURATION_VALUES = [1, 30, 45, 60, 90, 120, 180, 300];

interface EMOMConfig {
  rounds: number;
  duration: number;
}

interface ConfigComponentProps {
  onStartCountdown: (config: EMOMConfig) => void;
  initialRounds?: number;
  initialDuration?: number;
}

export default function ConfigComponent({ 
  onStartCountdown, 
  initialRounds = 10, 
  initialDuration = 60 
}: ConfigComponentProps) {
  const [config, setConfig] = useState<EMOMConfig>({
    rounds: initialRounds,
    duration: initialDuration
  });
  
  const handleRoundsChange = useCallback((index: number) => {
    setConfig(prev => ({ ...prev, rounds: index + 1 }));
  }, []);
  
  const handleDurationChange = useCallback((index: number) => {
    setConfig(prev => ({ ...prev, duration: DURATION_VALUES[index] }));
  }, []);
  
  const handleStartTimer = useCallback(() => {
    onStartCountdown(config);
  }, [onStartCountdown, config]);
  
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' }}>
      {/* Configuration */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{
            color: '#FFD700',
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
            backgroundColor: '#FFD700',
            marginTop: 12,
            opacity: 0.6
          }} />
        </View>

        <View style={{
          backgroundColor: '#0F0F10',
          borderRadius: 24,
          padding: 28,
          borderWidth: 1,
          borderColor: '#00E0FF30',
          shadowColor: '#00E0FF',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 6
        }}>
          {/* Side-by-side selectors */}
          <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
            {/* Number of Rounds */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                color: '#00E0FF',
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 16,
                textAlign: 'center',
                letterSpacing: 3,
                opacity: 0.8
              }}>
                ROUNDS
              </Text>

              <View style={{
                backgroundColor: '#00E0FF10',
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: '#00E0FF40',
                width: '100%',
                alignItems: 'center',
                shadowColor: '#00E0FF',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4
              }}>
                <View style={{ height: 200, width: 100 }}>
                  <WheelPicker
                    items={ROUNDS_ITEMS}
                    selectedIndex={config.rounds - 1}
                    onIndexChange={handleRoundsChange}
                    itemHeight={40}
                    visibleItems={5}
                    width={100}
                  />
                </View>
              </View>
            </View>

            {/* Separator */}
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                width: 1,
                height: 100,
                backgroundColor: '#00E0FF',
                borderRadius: 1,
                opacity: 0.3
              }} />
            </View>

            {/* Duration per Round */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                color: '#00E0FF',
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 16,
                textAlign: 'center',
                letterSpacing: 3,
                opacity: 0.8
              }}>
                DURATION
              </Text>

              <View style={{
                backgroundColor: '#00E0FF10',
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: '#00E0FF40',
                width: '100%',
                alignItems: 'center',
                shadowColor: '#00E0FF',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4
              }}>
                <View style={{ height: 200, width: 100 }}>
                  <WheelPicker
                    items={DURATION_ITEMS}
                    selectedIndex={DURATION_VALUES.indexOf(config.duration)}
                    onIndexChange={handleDurationChange}
                    itemHeight={40}
                    visibleItems={5}
                    width={100}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Configuration Summary */}
          <View style={{
            backgroundColor: '#FFD70015',
            borderRadius: 16,
            padding: 18,
            marginTop: 24,
            borderWidth: 1,
            borderColor: '#FFD70040',
            shadowColor: '#FFD700',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4
          }}>
            <Text style={{
              color: '#FFD700',
              fontSize: 15,
              fontWeight: '500',
              textAlign: 'center',
              letterSpacing: 1,
              opacity: 0.9
            }}>
              {config.rounds} rounds of {config.duration === 60 ? '1:00' : `${config.duration}s`}
            </Text>
          </View>
        </View>
      </View>

      {/* Start Button */}
      <TouchableOpacity
        onPress={handleStartTimer}
        style={{
          backgroundColor: '#FFD700',
          borderRadius: 20,
          paddingVertical: 16,
          marginHorizontal: 24,
          marginBottom: 32,
          shadowColor: '#FFD700',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8
        }}
      >
        <Text style={{
          color: '#000000',
          fontSize: 18,
          fontWeight: '600',
          textAlign: 'center',
          letterSpacing: 3,
          opacity: 0.95
        }}>
          START WORKOUT
        </Text>
      </TouchableOpacity>
    </View>
  );
}
