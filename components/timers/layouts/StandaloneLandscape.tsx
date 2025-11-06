import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { AddRoundButton } from '@/components/timers/AddRoundButton';
import { LandscapeTimeDisplay } from '@/components/timers/displays/LandscapeTimeDisplay';
import SlideToAction from '@/components/timers/SlideToAction';
import { Header } from '@/components/ui/Header';

interface StandaloneLandscapeProps {
  label: string;
  subtitle?: string;
  timeString: string;
  isPaused: boolean;
  onTogglePause: () => void;
  currentRound?: number;
  totalRounds?: number;
  isRestPhase?: boolean;
  onAddRound?: () => void;
  onFinish: () => void;
  finalScreen?: React.ReactNode;
  onBackPress?: () => void;
}

export default function StandaloneLandscape({
  label,
  subtitle,
  timeString,
  isPaused,
  onTogglePause,
  currentRound = 0,
  totalRounds,
  isRestPhase = false,
  onAddRound,
  onFinish,
  finalScreen,
  onBackPress,
}: StandaloneLandscapeProps) {
  const [showPauseSymbol, setShowPauseSymbol] = React.useState(false);
  const pauseSymbolOpacity = useSharedValue(0);
  const timerOpacity = useSharedValue(1);

  // When pause is activated, show pause symbol for 2 seconds
  useEffect(() => {
    if (isPaused && isRestPhase !== undefined) {
      setShowPauseSymbol(true);
      pauseSymbolOpacity.value = withTiming(1, { duration: 200 });
      timerOpacity.value = withTiming(0, { duration: 200 });
      
      const timer = setTimeout(() => {
        pauseSymbolOpacity.value = withTiming(0, { duration: 300 });
        timerOpacity.value = withTiming(1, { duration: 300 }, () => {
          runOnJS(setShowPauseSymbol)(false);
        });
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // When unpaused, show timer immediately
      setShowPauseSymbol(false);
      timerOpacity.value = 1;
      pauseSymbolOpacity.value = 0;
    }
  }, [isPaused, isRestPhase]);

  const pauseSymbolStyle = useAnimatedStyle(() => ({
    opacity: pauseSymbolOpacity.value,
  }));

  const timerStyle = useAnimatedStyle(() => ({
    opacity: timerOpacity.value,
  }));

  if (finalScreen) {
    return <>{finalScreen}</>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0F0F10',
      }} />
      <Header
        onBackPress={onBackPress}
        title={label}
        subtitle={subtitle}
      />

      <View style={{ 
        flex: 1, 
        flexDirection: 'row',
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        position: 'relative',
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          alignContent: 'flex-start',
          justifyContent: 'flex-start',
          position: 'relative',
        }}>
          <View style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: 200,
          }}>
            <TouchableOpacity
              onPress={onTogglePause}
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Pause symbol that replaces timer - only for Tabata when paused */}
              {showPauseSymbol && isRestPhase !== undefined && (
                <Animated.View
                  style={[
                    {
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: 110,
                      paddingHorizontal: 20,
                    },
                    pauseSymbolStyle,
                  ]}
                >
                  <FontAwesome
                    name="pause"
                    size={120}
                    color="#F5F5DC"
                  />
                </Animated.View>
              )}

              {/* Timer display */}
              <Animated.View style={timerStyle}>
                <LandscapeTimeDisplay 
                  timeString={timeString}
                  isPaused={isPaused}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          <View style={{
            position: 'absolute',
            bottom: 15,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}>
            <SlideToAction
              onSlideComplete={onFinish}
              label="FINISH"
              width={300}
              height={70}
              orientation="horizontal"
            />
          </View>
        </View>

        {(onAddRound || currentRound > 0 || totalRounds) && (
          <>
            <View style={{
              width: 1,
              height: 200,
              backgroundColor: 'rgba(135, 206, 235, 0.08)',
              alignSelf: 'center',
              marginLeft: 15
            }} />

            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 160,
              gap: 20,
            }}>
              {/* Round Counter */}
              {(currentRound > 0 || onAddRound || totalRounds) && (
                <View style={{
                  alignItems: 'center',
                  marginBottom: 32,
                }}>
                  <Text style={{
                    color: 'rgba(135, 206, 235, 0.8)',
                    fontSize: 11,
                    fontWeight: '500',
                    letterSpacing: 1,
                    textAlign: 'center',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}>
                    Round
                  </Text>
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: 58,
                    fontWeight: '600',
                    textAlign: 'center',
                    textShadowColor: 'rgba(245, 245, 220, 0.3)',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 20,
                    letterSpacing: -1,
                    fontFamily: 'monospace',
                    lineHeight: 58,
                  }}>
                    {currentRound || 0}
                  </Text>
                  {totalRounds && (
                    <Text style={{
                      color: 'rgba(135, 206, 235, 0.6)',
                      fontSize: 14,
                      fontWeight: '500',
                      textAlign: 'center',
                      marginTop: 8,
                    }}>
                      {currentRound} / {totalRounds}
                    </Text>
                  )}
                </View>
              )}

              {onAddRound && <AddRoundButton onPress={onAddRound} />}

              {/* Phase Indicator for Tabata */}
              {isRestPhase !== undefined && (
                <View style={{
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                  <Text style={{
                    color: isRestPhase ? 'rgba(255, 165, 0, 0.9)' : 'rgba(135, 206, 235, 0.8)',
                    fontSize: 14,
                    fontWeight: '600',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    textShadowColor: isRestPhase ? 'rgba(255, 165, 0, 0.3)' : 'rgba(135, 206, 235, 0.3)',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                  }}>
                    {isRestPhase ? 'REST' : 'WORK'}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

