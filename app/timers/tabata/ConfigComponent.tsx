import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import WheelPicker from '@/components/WheelPicker';

interface TabataConfig {
  rounds: number;
  workTime: number;
  restTime: number;
}

interface ConfigComponentProps {
  onStartCountdown: (config: TabataConfig) => void;
  initialRounds?: number;
  initialWorkTime?: number;
  initialRestTime?: number;
}

const ROUNDS_ITEMS = Array.from({ length: 20 }, (_, i) => `${i + 1}`);
const WORK_TIME_ITEMS = ['10s', '15s', '20s', '30s', '45s', '1:00', '1:30', '2:00', '3:00', '4:00', '5:00'];
const REST_TIME_ITEMS = ['5s', '10s', '15s', '20s', '30s', '45s', '1:00', '1:15', '1:30', '2:00'];

const WORK_TIME_VALUES = [10, 15, 20, 30, 45, 60, 75, 90, 120, 180, 240, 300];
const REST_TIME_VALUES = [5, 10, 15, 20, 30, 45, 60, 75, 90, 120];

export default function ConfigComponent({ 
  onStartCountdown, 
  initialRounds = 8, 
  initialWorkTime = 20, 
  initialRestTime = 10 
}: ConfigComponentProps) {
  const [config, setConfig] = useState<TabataConfig>({
    rounds: initialRounds,
    workTime: initialWorkTime,
    restTime: initialRestTime,
  });

  const handleRoundsChange = useCallback((index: number) => {
    setConfig(prev => ({ ...prev, rounds: index + 1 }));
  }, []);

  const handleWorkTimeChange = useCallback((index: number) => {
    setConfig(prev => ({ ...prev, workTime: WORK_TIME_VALUES[index] }));
  }, []);

  const handleRestTimeChange = useCallback((index: number) => {
    setConfig(prev => ({ ...prev, restTime: REST_TIME_VALUES[index] }));
  }, []);

  const handleStartTimer = () => {
    onStartCountdown(config);
  };

  const getWorkTimeIndex = () => {
    return WORK_TIME_VALUES.indexOf(config.workTime);
  };

  const getRestTimeIndex = () => {
    return REST_TIME_VALUES.indexOf(config.restTime);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds === 0 ? `${minutes}:00` : `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
            TABATA
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: 4, opacity: 0.8 }}>
            High Intensity Interval Training
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
            {/* Three selectors in a row */}
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
              {/* Rounds */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{
                  color: '#00E0FF',
                  fontSize: 12,
                  fontWeight: '500',
                  marginBottom: 12,
                  textAlign: 'center',
                  letterSpacing: 2,
                  opacity: 0.8
                }}>
                  ROUNDS
                </Text>

                <View style={{
                  backgroundColor: '#00E0FF10',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#00E0FF40',
                  width: '100%',
                  alignItems: 'center',
                  shadowColor: '#00E0FF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3
                }}>
                  <View style={{ height: 160, width: 80 }}>
                    <WheelPicker
                      items={ROUNDS_ITEMS}
                      selectedIndex={config.rounds - 1}
                      onIndexChange={handleRoundsChange}
                      itemHeight={32}
                      visibleItems={5}
                      width={80}
                    />
                  </View>
                </View>
              </View>

              {/* Work Time */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{
                  color: '#00E0FF',
                  fontSize: 12,
                  fontWeight: '500',
                  marginBottom: 12,
                  textAlign: 'center',
                  letterSpacing: 2,
                  opacity: 0.8
                }}>
                  WORK
                </Text>

                <View style={{
                  backgroundColor: '#00E0FF10',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#00E0FF40',
                  width: '100%',
                  alignItems: 'center',
                  shadowColor: '#00E0FF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3
                }}>
                  <View style={{ height: 160, width: 80 }}>
                    <WheelPicker
                      items={WORK_TIME_ITEMS}
                      selectedIndex={getWorkTimeIndex()}
                      onIndexChange={handleWorkTimeChange}
                      itemHeight={32}
                      visibleItems={5}
                      width={80}
                    />
                  </View>
                </View>
              </View>

              {/* Rest Time */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{
                  color: '#00E0FF',
                  fontSize: 12,
                  fontWeight: '500',
                  marginBottom: 12,
                  textAlign: 'center',
                  letterSpacing: 2,
                  opacity: 0.8
                }}>
                  REST
                </Text>

                <View style={{
                  backgroundColor: '#00E0FF10',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#00E0FF40',
                  width: '100%',
                  alignItems: 'center',
                  shadowColor: '#00E0FF',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3
                }}>
                  <View style={{ height: 160, width: 80 }}>
                    <WheelPicker
                      items={REST_TIME_ITEMS}
                      selectedIndex={getRestTimeIndex()}
                      onIndexChange={handleRestTimeChange}
                      itemHeight={32}
                      visibleItems={5}
                      width={80}
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
                {config.rounds} rounds of {formatTime(config.workTime)} work / {formatTime(config.restTime)} rest
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