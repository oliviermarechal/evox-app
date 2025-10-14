import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FireEffect from '@/components/FireEffect';
import SlideToAction from '@/components/SlideToAction';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface PortraitTimerProps {
  config: AMRAPConfig;
  onResetTimer: () => void;
}

export default function PortraitTimer({ config, onResetTimer }: PortraitTimerProps) {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20 }}>
        
        {/* Header compact */}
        <View style={{
          paddingHorizontal: 24,
          paddingVertical: 8,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#87CEEB15',
          backgroundColor: '#0F0F10',
        }}>
          <Text style={{
            color: '#87CEEB',
            fontSize: 18,
            fontWeight: 'bold',
            letterSpacing: 1.2,
            marginBottom: 2,
          }}>
            AMRAP TIMER
          </Text>
          <Text style={{
            color: '#FFFFFF',
            fontSize: 10,
            opacity: 0.8,
            letterSpacing: 0.5,
          }}>
            Round {currentRound}
          </Text>
        </View>
        
        {/* Timer Circle - Plus imposant et centré */}
        <View 
          style={{
            width: 300,
            height: 300,
            borderRadius: 150,
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
          {/* Effet de flamme SVG */}
          <FireEffect isVisible={isOnFire} size={300} timerPosition={timerPosition} />
          
          <Text style={{
            color: isPaused ? '#F5F5DC' : '#87CEEB',
            fontSize: 48,
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

        {/* Container de contrôles - Repositionné en bas avec boutons plus épais */}
        <View style={{
          backgroundColor: '#1A1A1A',
          padding: 20,
          borderRadius: 18,
          borderWidth: 2,
          borderColor: '#87CEEB40',
          shadowColor: '#87CEEB',
          shadowOffset: { width: 0, height: 15 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 15,
          alignItems: 'center',
          width: '100%',
          maxWidth: 320,
        }}>
          
          {/* Section Rounds - Affichage compact */}
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{
              color: '#87CEEB',
              fontSize: 13,
              fontWeight: 'bold',
              letterSpacing: 0.8,
              marginBottom: 6,
            }}>
              AMRAP ROUND
            </Text>
            <Text style={{
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Round {currentRound}
            </Text>
            
            {/* Boutons rectangulaires élégants sur une ligne */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
            }}>
              {/* Bouton Round + - Rectangulaire élégant */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#87CEEB',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 80,
                  borderWidth: 1,
                  borderColor: '#87CEEB60',
                }}
                onPress={() => setCurrentRound(prev => prev + 1)}
              >
                <Text style={{ 
                  color: '#000000', 
                  fontWeight: 'bold', 
                  fontSize: 16,
                  letterSpacing: 0.5,
                }}>
                  +1
                </Text>
              </TouchableOpacity>

              {/* Bouton Pause/Resume - Rectangulaire élégant */}
              <TouchableOpacity
                style={{
                  backgroundColor: isPaused ? '#F5F5DC' : '#87CEEB',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  shadowColor: isPaused ? '#F5F5DC' : '#87CEEB',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 80,
                  borderWidth: 1,
                  borderColor: isPaused ? '#F5F5DC60' : '#87CEEB60',
                }}
                onPress={isPaused ? startTimer : pauseTimer}
              >
                <Text style={{ 
                  color: isPaused ? '#000000' : '#FFFFFF', 
                  fontWeight: 'bold', 
                  fontSize: 16,
                  letterSpacing: 0.5,
                }}>
                  {isPaused ? '▶' : '||'}
                </Text>
              </TouchableOpacity>
            </View>
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
              width={280}
            />
          </View>
        </View>

        {/* Final Time Display - Style unifié */}
        {finalTime && (
          <View style={{
            backgroundColor: '#1A1A1A',
            padding: 24,
            borderRadius: 20,
            alignItems: 'center',
            borderWidth: 3,
            borderColor: '#FFD700',
            shadowColor: '#FFD700',
            shadowOffset: { width: 0, height: 15 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 15,
            width: '100%',
            maxWidth: 320,
          }}>
            <Text style={{
              color: '#FFD700',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 8,
              letterSpacing: 1,
            }}>
              AMRAP COMPLETED!
            </Text>
            <Text style={{
              color: '#FFD700',
              fontSize: 32,
              fontWeight: 'bold',
              textShadowColor: '#FFD700',
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 8,
            }}>
              {finalTime}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
