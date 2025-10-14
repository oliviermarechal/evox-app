import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FireEffect from '@/components/FireEffect';
import SlideToAction from '@/components/SlideToAction';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface LandscapeTimerProps {
  config: AMRAPConfig;
  onResetTimer: () => void;
}

export default function LandscapeTimer({ config, onResetTimer }: LandscapeTimerProps) {
  const [totalMilliseconds, setTotalMilliseconds] = useState(config.minutes * 60 * 1000 + config.seconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [isOnFire, setIsOnFire] = useState(false);
  const [timerPosition, setTimerPosition] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);

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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onResetTimer();
  };

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

  if (finalTime) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          {/* Final Time Display - Optimized for distance */}
          <View style={{
            backgroundColor: '#1A1A1A',
            padding: 48,
            borderRadius: 20,
            alignItems: 'center',
            borderWidth: 4,
            borderColor: '#FFD700',
            shadowColor: '#FFD700',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
            minWidth: 400,
          }}>
            <Text style={{
              color: '#FFD700',
              fontSize: 28,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              AMRAP COMPLETED!
            </Text>
            <Text style={{
              color: '#FFD700',
              fontSize: 48,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {finalTime}
            </Text>
            <Text style={{
              color: '#FFFFFF',
              fontSize: 18,
              textAlign: 'center',
              marginTop: 16,
              opacity: 0.8
            }}>
              Round {currentRound} completed
            </Text>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#FF4500',
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 12,
              marginTop: 32,
            }}
            onPress={resetTimer}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>RESET</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#87CEEB15',
        backgroundColor: '#0F0F10',
      }}>
        <Text style={{
          color: '#87CEEB',
          fontSize: 20,
          fontWeight: 'bold',
          letterSpacing: 1.5,
          marginBottom: 2,
        }}>
          AMRAP TIMER
        </Text>
        <Text style={{
          color: '#FFFFFF',
          fontSize: 11,
          opacity: 0.8,
          letterSpacing: 0.5,
        }}>
          Round {currentRound} • {isPaused ? 'PAUSED' : isRunning ? 'RUNNING' : 'READY'}
        </Text>
      </View>

      {/* Layout audacieux - Timer DOMINANT au centre, contrôles discrets sur les côtés */}
      <View style={{ 
        flex: 1, 
        flexDirection: 'row', 
        paddingHorizontal: 16, 
        paddingVertical: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        
        <View style={{ 
          flex: 0.45,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 50,
        }}>
          
          <View style={{
            backgroundColor: '#1A1A1A',
            padding: 20,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#87CEEB40',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 15 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 15,
            alignItems: 'center',
            width: '100%',
            maxWidth: 280,
          }}>
            
            {/* Section Rounds */}
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{
                color: '#87CEEB',
                fontSize: 14,
                fontWeight: 'bold',
                letterSpacing: 1,
                marginBottom: 6,
              }}>
                AMRAP ROUND
              </Text>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 12,
                textAlign: 'center',
              }}>
                Round {currentRound}
              </Text>
              
              {/* Bouton Round + */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#87CEEB',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                  width: '100%',
                }}
                onPress={() => setCurrentRound(prev => prev + 1)}
              >
                <Text style={{ 
                  color: '#000000', 
                  fontWeight: 'bold', 
                  fontSize: 12, 
                  textAlign: 'center',
                  letterSpacing: 0.5,
                }}>
                  +1 ROUND
                </Text>
              </TouchableOpacity>
            </View>

            {/* Séparateur élégant */}
            <View style={{
              width: '60%',
              height: 1,
              backgroundColor: '#87CEEB30',
              marginBottom: 16,
            }} />

            {/* Section Pause */}
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: isPaused ? '#F5F5DC' : '#87CEEB',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  shadowColor: isPaused ? '#F5F5DC' : '#87CEEB',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                  width: '100%',
                }}
                onPress={isPaused ? startTimer : pauseTimer}
              >
                <Text style={{ 
                  color: isPaused ? '#000000' : '#FFFFFF', 
                  fontWeight: 'bold', 
                  fontSize: 12, 
                  textAlign: 'center',
                  letterSpacing: 0.5,
                }}>
                  {isPaused ? 'RESUME' : 'PAUSE'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Séparateur élégant */}
            <View style={{
              width: '60%',
              height: 1,
              backgroundColor: '#87CEEB30',
              marginBottom: 16,
            }} />

            {/* Section SlideToAction */}
            <View style={{ width: '100%', alignItems: 'center' }}>
              <SlideToAction
                label="SLIDE TO STOP"
                onSlideComplete={resetTimer}
                width={240}
              />
            </View>
          </View>
        </View>

        <View style={{ 
          flex: 0.4, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <View 
            style={{
              width: 280,
              height: 280,
              borderRadius: 140,
              borderWidth: 8,
              borderColor: isOnFire ? '#FF4500' : (isPaused ? '#F5F5DC' : '#87CEEB'),
              backgroundColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: isOnFire ? '#FF4500' : (isPaused ? '#F5F5DC' : '#87CEEB'),
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: isOnFire ? 1.0 : 0.9,
              shadowRadius: isOnFire ? 50 : 40,
              elevation: isOnFire ? 50 : 35,
            }}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              setTimerPosition({ x, y, width, height });
            }}
          >
            <FireEffect isVisible={isOnFire} size={280} timerPosition={timerPosition} />
            
            <Text style={{
              color: isPaused ? '#F5F5DC' : '#87CEEB',
              fontSize: 52,
              fontWeight: 'bold',
              textAlign: 'center',
              textShadowColor: isPaused ? '#F5F5DC' : '#87CEEB',
              textShadowOffset: { width: 0, height: 6 },
              textShadowRadius: 12,
              letterSpacing: 2,
            }}>
              {formatTime(totalMilliseconds)}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
