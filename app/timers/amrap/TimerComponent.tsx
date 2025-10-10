import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FireEffect from '@/components/FireEffect';
import SlideToAction from '@/components/SlideToAction';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface TimerComponentProps {
  config: AMRAPConfig;
  isLandscape: boolean;
  onResetTimer: () => void;
}

export default function TimerComponent({ config, isLandscape, onResetTimer }: TimerComponentProps) {
  const [totalMilliseconds, setTotalMilliseconds] = useState(config.minutes * 60 * 1000 + config.seconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [isOnFire, setIsOnFire] = useState(false);
  const [timerPosition, setTimerPosition] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);

  // Slider logic supprimé - utilise maintenant SlideToAction

  const intervalRef = useRef<any>(null);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!isRunning && !isPaused) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTotalMilliseconds(prev => {
          if (prev <= 10) {
            // Timer finished
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setFinalTime(formatTime(config.minutes * 60 * 1000 + config.seconds * 1000));
            setIsOnFire(true);
            return 0;
          }
          return prev - 10;
        });
      }, 10);
    } else if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTotalMilliseconds(prev => {
          if (prev <= 10) {
            // Timer finished
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setFinalTime(formatTime(config.minutes * 60 * 1000 + config.seconds * 1000));
            setIsOnFire(true);
            return 0;
          }
          return prev - 10;
        });
      }, 10);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTotalMilliseconds(config.minutes * 60 * 1000 + config.seconds * 1000);
    setCurrentRound(1);
    setFinalTime(null);
    setIsOnFire(false);
    // Slider logic supprimé
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onResetTimer();
  };

  // Slider logic supprimé - utilise maintenant SlideToAction

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-start timer
  useEffect(() => {
    const timer = setTimeout(() => {
      startTimer();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLandscape && (isRunning || isPaused) && !finalTime) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          {/* Effet de flamme SVG */}
          <FireEffect isVisible={isOnFire} size={200} timerPosition={timerPosition} />
          
          <View 
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 8,
              borderColor: isOnFire ? '#FF4500' : (isPaused ? '#87CEEB' : '#FFD700'),
              backgroundColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: isOnFire ? '#FF4500' : (isPaused ? '#87CEEB' : '#FFD700'),
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isOnFire ? 0.9 : 0.6,
              shadowRadius: isOnFire ? 30 : 20,
              elevation: isOnFire ? 25 : 15,
              marginBottom: 32
            }}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              setTimerPosition({ x, y, width, height });
            }}
          >
            <Text style={{
              color: isPaused ? '#87CEEB' : '#FFD700',
              fontSize: 32,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              {formatTime(totalMilliseconds)}
            </Text>
          </View>

          {/* AMRAP Round Status */}
          <View style={{
            backgroundColor: '#1A1A1A',
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#87CEEB',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
            marginBottom: 32,
          }}>
            <Text style={{
              color: '#87CEEB',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 4,
            }}>
              AMRAP ROUND
            </Text>
            <Text style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              Round {currentRound}
            </Text>
          </View>

          {/* Control Buttons */}
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: isPaused ? '#FFD700' : '#87CEEB',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
              }}
              onPress={isPaused ? startTimer : pauseTimer}
            >
              <Text style={{ color: '#000000', fontWeight: 'bold' }}>
                {isPaused ? 'RESUME' : 'PAUSE'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#FF4500',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
              }}
              onPress={resetTimer}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>RESET</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{
            color: '#87CEEB',
            fontSize: 18,
            fontWeight: 'bold',
            letterSpacing: 1,
            marginBottom: 16
          }}>
            AMRAP
          </Text>
          
          <Text style={{
            color: '#FFFFFF',
            fontSize: 16,
            marginBottom: 32,
            textAlign: 'center',
            letterSpacing: 1
          }}>
            TIME REMAINING
          </Text>
          
          {/* Effet de flamme SVG */}
          <FireEffect isVisible={isOnFire} size={280} timerPosition={timerPosition} />
          
          {/* Timer Circle */}
          <View 
            style={{
              width: 280,
              height: 280,
              borderRadius: 140,
              borderWidth: 12,
              borderColor: isOnFire ? '#FF4500' : (isPaused ? '#87CEEB' : '#FFD700'),
              backgroundColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: isOnFire ? '#FF4500' : (isPaused ? '#87CEEB' : '#FFD700'),
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: isOnFire ? 0.9 : 0.6,
              shadowRadius: isOnFire ? 35 : 25,
              elevation: isOnFire ? 30 : 20,
              marginBottom: 16
            }}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              setTimerPosition({ x, y, width, height });
            }}
          >
            <Text style={{
              color: isPaused ? '#87CEEB' : '#FFD700',
              fontSize: 40,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              {formatTime(totalMilliseconds)}
            </Text>
          </View>

          {/* AMRAP Round Status */}
          <View style={{
            backgroundColor: '#1A1A1A',
            padding: 20,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#87CEEB',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
            marginBottom: 16,
            width: 280,
          }}>
            <Text style={{
              color: '#87CEEB',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              AMRAP ROUND
            </Text>
            <Text style={{
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              Round {currentRound}
            </Text>
          </View>

          {/* Slider */}
          <View style={{ marginBottom: 32, alignItems: 'center' }}>
            <SlideToAction
              label="SLIDE TO STOP"
              onSlideComplete={resetTimer}
              width={280}
            />
          </View>

          {/* Control Buttons */}
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
            <TouchableOpacity
              style={{
                backgroundColor: isPaused ? '#FFD700' : '#87CEEB',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
              }}
              onPress={isPaused ? startTimer : pauseTimer}
            >
              <Text style={{ color: '#000000', fontWeight: 'bold' }}>
                {isPaused ? 'RESUME' : 'PAUSE'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#FF4500',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
              }}
              onPress={resetTimer}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>RESET</Text>
            </TouchableOpacity>
          </View>

          {/* Final Time Display */}
          {finalTime && (
            <View style={{
              backgroundColor: '#1A1A1A',
              padding: 24,
              borderRadius: 12,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#FFD700',
              shadowColor: '#FFD700',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <Text style={{
                color: '#FFD700',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 8
              }}>
                AMRAP COMPLETED!
              </Text>
              <Text style={{
                color: '#FFD700',
                fontSize: 32,
                fontWeight: 'bold'
              }}>
                {finalTime}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
