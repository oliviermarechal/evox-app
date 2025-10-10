import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WheelPicker from '@/components/WheelPicker';

interface ForTimeConfig {
  minutes: number;
  seconds: number;
}

interface ConfigComponentProps {
  onStartCountdown: (config: ForTimeConfig) => void;
  initialMinutes?: number;
  initialSeconds?: number;
}

const MINUTES_ITEMS = Array.from({ length: 60 }, (_, i) => i.toString());
const SECONDS_ITEMS = Array.from({ length: 60 }, (_, i) => i.toString());

// Styles constants supprimés - utilisent maintenant les styles par défaut du WheelPicker

export default function ConfigComponent({ onStartCountdown, initialMinutes = 0, initialSeconds = 0 }: ConfigComponentProps) {
  const [config, setConfig] = useState<ForTimeConfig>({
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  const handleMinutesChange = useCallback((index: number) => {
    setConfig(prev => ({ ...prev, minutes: index }));
  }, []);

  const handleSecondsChange = useCallback((index: number) => {
    setConfig(prev => ({ ...prev, seconds: index }));
  }, []);

  const handleStartTimer = () => {
    onStartCountdown(config);
  };

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header avec flèche de retour */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#87CEEB" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#FFD700', fontSize: 24, fontWeight: 'bold', letterSpacing: 2 }}>
            FOR TIME
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: 4, opacity: 0.8 }}>
            Set your target time
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

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
              {/* Minutes */}
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
                  MINUTES
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
                      items={MINUTES_ITEMS}
                      selectedIndex={config.minutes}
                      onIndexChange={handleMinutesChange}
                      itemHeight={40}
                      visibleItems={5}
                      width={100}
                    />
                  </View>
                </View>
              </View>

              {/* Separator */}
              <View style={{
                width: 1,
                height: 100,
                backgroundColor: '#00E0FF',
                borderRadius: 1,
                opacity: 0.3
              }} />

              {/* Seconds */}
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
                  SECONDS
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
                      items={SECONDS_ITEMS}
                      selectedIndex={config.seconds}
                      onIndexChange={handleSecondsChange}
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
                Target Time: {formatTime(config.minutes, config.seconds)}
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