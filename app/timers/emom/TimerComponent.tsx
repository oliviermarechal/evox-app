import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FireEffect from '@/components/FireEffect';
import SlideToAction from '@/components/SlideToAction';

interface EMOMConfig {
  rounds: number;
  duration: number;
}

interface TimerComponentProps {
  config: EMOMConfig;
  isLandscape: boolean;
  onResetTimer: () => void;
}

export default function TimerComponent({ config, isLandscape, onResetTimer }: TimerComponentProps) {
  const [totalMilliseconds, setTotalMilliseconds] = useState(config.duration * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [isOnFire, setIsOnFire] = useState(false);
  const [timerPosition, setTimerPosition] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);


  // Slider logic supprimé - utilise maintenant SlideToAction

  const intervalRef = useRef<any>(null);

  // Format time helper avec millisecondes
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Timer complete logic
  const handleTimerComplete = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setCurrentRound(prevRound => {
      const nextRound = prevRound + 1;
      
      if (nextRound <= config.rounds) {
        // Continue to next round
        setTotalMilliseconds(config.duration * 1000);
        
        setTimeout(() => {
          intervalRef.current = setInterval(() => {
            setTotalMilliseconds(prevMs => {
              const newMs = prevMs - 10;
              if (newMs <= 0) {
                handleTimerComplete();
                return 0;
              }
              return newMs;
            });
          }, 10);
        }, 100);
        
        return nextRound;
      } else {
        // EMOM completed
        setIsRunning(false);
        setIsPaused(false);
        setFinalTime(formatTime(config.duration * config.rounds * 1000));
        setIsOnFire(true);
        return prevRound;
      }
    });
  }, [config.rounds, config.duration]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setFinalTime(null);
    
    intervalRef.current = setInterval(() => {
      setTotalMilliseconds(prevMs => {
        const newMs = prevMs - 10;
        if (newMs <= 0) {
          handleTimerComplete();
          return 0;
        }
        return newMs;
      });
    }, 10);
  }, [handleTimerComplete]);

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      setTotalMilliseconds(prevMs => {
        const newMs = prevMs - 10;
        if (newMs <= 0) {
          handleTimerComplete();
          return 0;
        }
        return newMs;
      });
    }, 10);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setFinalTime(null);
    setCurrentRound(1);
    setTotalMilliseconds(config.duration * 1000);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onResetTimer();
  };


  // Slider logic supprimé - utilise maintenant SlideToAction

  // Auto-start timer when component mounts
  useEffect(() => {
    // Démarrer automatiquement le timer après un court délai
    const timer = setTimeout(() => {
      startTimer();
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [startTimer]);

  // Arrêter l'effet de flamme après 3 secondes
  useEffect(() => {
    if (isOnFire) {
      const stopFire = setTimeout(() => {
        setIsOnFire(false);
      }, 3000);

      return () => {
        clearTimeout(stopFire);
      };
    }
  }, [isOnFire]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
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
              textShadowColor: isPaused ? '#87CEEB' : '#FFD700',
              textShadowOffset: { width: 0, height: 3 },
              textShadowRadius: 10
            }}>
              {formatTime(totalMilliseconds)}
            </Text>
          </View>

          {/* Round Info */}
          <Text style={{
            color: '#87CEEB',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20
          }}>
            Round {currentRound} / {config.rounds}
          </Text>

          {/* Control Buttons */}
          <View style={{ flexDirection: 'row', gap: 20, marginBottom: 32 }}>
            {!isRunning && !isPaused && !finalTime && (
              <TouchableOpacity
                onPress={startTimer}
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
                  elevation: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: '#000000',
                  fontSize: 18,
                  fontWeight: 'bold',
                  letterSpacing: 1
                }}>
                  START
                </Text>
              </TouchableOpacity>
            )}

            {isRunning && (
              <TouchableOpacity
                onPress={pauseTimer}
                style={{
                  backgroundColor: '#87CEEB',
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  borderRadius: 25,
                  borderWidth: 3,
                  borderColor: '#87CEEB',
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 15,
                  elevation: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: '#000000',
                  fontSize: 18,
                  fontWeight: 'bold',
                  letterSpacing: 1
                }}>
                  PAUSE
                </Text>
              </TouchableOpacity>
            )}

            {isPaused && (
              <TouchableOpacity
                onPress={resumeTimer}
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
                  elevation: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: '#000000',
                  fontSize: 18,
                  fontWeight: 'bold',
                  letterSpacing: 1
                }}>
                  RESUME
                </Text>
              </TouchableOpacity>
            )}

            {(isRunning || isPaused) && (
              <TouchableOpacity
                onPress={resetTimer}
                style={{
                  backgroundColor: '#000000',
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: '#87CEEB',
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: '#87CEEB',
                  fontSize: 16,
                  fontWeight: 'bold',
                  letterSpacing: 1
                }}>
                  RESET
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Slider to Stop */}
          {(isRunning || isPaused) && (
            <View style={{ alignItems: 'center' }}>
              <SlideToAction
                label="SLIDE TO STOP"
                onSlideComplete={resetTimer}
                width={280}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Mode portrait - Interface complète
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
        <TouchableOpacity onPress={onResetTimer}>
          <FontAwesome name="arrow-left" size={24} color="#87CEEB" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#FFD700', fontSize: 24, fontWeight: 'bold', letterSpacing: 2 }}>
            EMOM
          </Text>
          <Text style={{ color: '#87CEEB', fontSize: 14, marginTop: 4 }}>
            Round {currentRound} / {config.rounds}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' }}>
        {/* Timer Display with Circle */}
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Text style={{
            color: '#87CEEB',
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 24,
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
              textShadowColor: isPaused ? '#87CEEB' : '#FFD700',
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 12
            }}>
              {formatTime(totalMilliseconds)}
            </Text>
          </View>
        </View>

        {/* EMOM Status Card */}
        <View style={{ marginBottom: 20 }}>
          <View style={{
            backgroundColor: '#000000',
            borderRadius: 16,
            padding: 20,
            borderWidth: 2,
            borderColor: '#87CEEB40',
            marginBottom: 16
          }}>
            <Text style={{
              color: '#87CEEB',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 8
            }}>
              EMOM ROUND
            </Text>
            <Text style={{
              color: '#F4F4F4',
              fontSize: 16,
              textAlign: 'center'
            }}>
              Round {currentRound} of {config.rounds}
            </Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center', marginBottom: 20 }}>
          {!isRunning && !isPaused && !finalTime && (
            <TouchableOpacity
              onPress={startTimer}
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
                elevation: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{
                color: '#000000',
                fontSize: 18,
                fontWeight: 'bold',
                letterSpacing: 1
              }}>
                START
              </Text>
            </TouchableOpacity>
          )}

          {isRunning && (
            <TouchableOpacity
              onPress={pauseTimer}
              style={{
                backgroundColor: '#87CEEB',
                paddingVertical: 16,
                paddingHorizontal: 32,
                borderRadius: 25,
                borderWidth: 3,
                borderColor: '#87CEEB',
                shadowColor: '#87CEEB',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 15,
                elevation: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{
                color: '#000000',
                fontSize: 18,
                fontWeight: 'bold',
                letterSpacing: 1
              }}>
                PAUSE
              </Text>
            </TouchableOpacity>
          )}

          {isPaused && (
            <TouchableOpacity
              onPress={resumeTimer}
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
                elevation: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{
                color: '#000000',
                fontSize: 18,
                fontWeight: 'bold',
                letterSpacing: 1
              }}>
                RESUME
              </Text>
            </TouchableOpacity>
          )}

          {(isRunning || isPaused) && (
            <TouchableOpacity
              onPress={resetTimer}
              style={{
                backgroundColor: '#000000',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#87CEEB',
                shadowColor: '#87CEEB',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{
                color: '#87CEEB',
                fontSize: 16,
                fontWeight: 'bold',
                letterSpacing: 1
              }}>
                RESET
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Slider to Stop */}
        {(isRunning || isPaused) && (
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <SlideToAction
              label="SLIDE TO STOP"
              onSlideComplete={resetTimer}
              width={280}
            />
          </View>
        )}

        {/* Final Time Display */}
        {finalTime && (
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{
              color: '#87CEEB',
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 8
            }}>
              WORKOUT COMPLETED!
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
    </SafeAreaView>
  );
}