import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { AddRoundButton } from '@/components/timers/AddRoundButton';
import { LandscapeTimeDisplay } from '@/components/timers/displays/LandscapeTimeDisplay';
import SlideToAction from '@/components/timers/SlideToAction';
import { Header } from '@/components/ui/Header';
import WorkoutExerciseDrawer from '@/components/workout/execution/WorkoutExerciseDrawer';
import { Exercise } from '@/lib/types';

interface WorkoutLandscapeProps {
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
  exercises: Exercise[];
  finalScreen?: React.ReactNode;
}

export default function WorkoutLandscape({
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
  exercises,
  finalScreen,
}: WorkoutLandscapeProps) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const drawerWidth = 180;
  const drawerWidthAnimated = useSharedValue(drawerWidth);
  const drawerOpacity = useSharedValue(1);

  const [showPauseSymbol, setShowPauseSymbol] = React.useState(false);
  const pauseSymbolOpacity = useSharedValue(0);
  const timerOpacity = useSharedValue(1);

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

  const handleDrawerToggle = (isOpen: boolean) => {
    setDrawerOpen(isOpen);
    const targetWidth = isOpen ? drawerWidth : 0;
    const targetOpacity = isOpen ? 1 : 0;
    
    drawerWidthAnimated.value = withTiming(targetWidth, {
      duration: 200,
    });
    drawerOpacity.value = withTiming(targetOpacity, {
      duration: 200,
    });
  };

  const drawerStyle = useAnimatedStyle(() => ({
    width: drawerWidthAnimated.value,
    opacity: drawerOpacity.value,
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
        title={label}
        subtitle={subtitle}
      />

      <View style={{ 
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <Animated.View style={[
          {
            overflow: 'hidden',
          },
          drawerStyle,
        ]}>
          <WorkoutExerciseDrawer exercises={exercises} onToggle={handleDrawerToggle} />
        </Animated.View>

        {!drawerOpen && (
          <TouchableOpacity
            onPress={() => handleDrawerToggle(true)}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              marginTop: -30,
              width: 40,
              height: 60,
              backgroundColor: 'rgba(135, 206, 235, 0.15)',
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
              borderRightWidth: 1,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: 'rgba(135, 206, 235, 0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 11,
            }}
          >
            <FontAwesome name="chevron-right" size={16} color="#87CEEB" />
          </TouchableOpacity>
        )}

        <View style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
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
                    size={drawerOpen ? 130 : 150}
                    color="#F5F5DC"
                  />
                </Animated.View>
              )}

              {/* Timer display */}
              <Animated.View style={timerStyle}>
                <LandscapeTimeDisplay 
                  timeString={timeString}
                  isPaused={isPaused}
                  fontSize={drawerOpen ? 130 : 150}
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
            paddingHorizontal: 40,
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

        {/* Colonne droite : Rounds + Actions */}
        {currentRound > 0 && (
          <>
            {/* Séparateur */}
            <View style={{
              width: 1,
              backgroundColor: 'rgba(135, 206, 235, 0.08)',
              marginLeft: 12,
              marginRight: 12,
              alignSelf: 'stretch',
            }} />

            <View style={{
              width: 120,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              minWidth: 120,
              flexShrink: 0,
            }}>
              <View style={{
                alignItems: 'center',
              }}>
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.8)',
                  fontSize: 10,
                  fontWeight: '500',
                  letterSpacing: 1,
                  textAlign: 'center',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                }}>
                  Round
                </Text>
                <Text style={{
                  color: '#F5F5DC',
                  fontSize: 42,
                  fontWeight: '600',
                  textAlign: 'center',
                  textShadowColor: 'rgba(245, 245, 220, 0.3)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 15,
                  letterSpacing: -1,
                  fontFamily: 'monospace',
                  lineHeight: 42,
                }}>
                  {currentRound}
                </Text>
                {totalRounds && (
                  <Text style={{
                    color: 'rgba(135, 206, 235, 0.6)',
                    fontSize: 11,
                    fontWeight: '500',
                    textAlign: 'center',
                    marginTop: 4,
                  }}>
                    {currentRound} / {totalRounds}
                  </Text>
                )}
              </View>

              {onAddRound && <AddRoundButton onPress={onAddRound} />}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

