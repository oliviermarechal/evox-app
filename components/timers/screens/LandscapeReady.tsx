import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface LandscapeReadyProps {
  title: string;
  subtitle: string;
  configDisplay?: React.ReactNode;
  onStartCountdown: () => void;
  onBack: () => void;
  onSkipCountdown: () => void;
  countdownValue?: number;
  isCountdown?: boolean;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

export default function LandscapeReady({ 
  title, 
  subtitle, 
  configDisplay,
  onStartCountdown, 
  onBack, 
  onSkipCountdown, 
  countdownValue, 
  isCountdown, 
  isPaused, 
  onTogglePause 
}: LandscapeReadyProps) {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const borderColor = useSharedValue(0); // 0 = blue, 1 = orange, 2 = red

  // Animation styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pulseScale.value },
      { translateX: translateX.value }
    ],
    opacity: opacity.value,
  }));

  const borderAnimatedStyle = useAnimatedStyle(() => {
    const colors = ['#87CEEB', '#87CEEB', '#F5F5DC']; // Bleu gris, Bleu gris, Blanc cassé
    const colorIndex = Math.floor(borderColor.value);
    const nextColorIndex = (colorIndex + 1) % colors.length;
    const progress = borderColor.value - colorIndex;
    
    // Interpolation fluide entre les couleurs
    const currentColor = colors[colorIndex];
    const nextColor = colors[nextColorIndex];
    
    return {
      borderColor: currentColor,
      shadowColor: currentColor,
    };
  });

  // Animation when countdown starts
  React.useEffect(() => {
    if (isCountdown) {
      // Animation d'entrée sophistiquée - vif et précis
      scale.value = withSequence(
        withTiming(1.12, { duration: 120 }),
        withTiming(1, { duration: 80 })
      );
      opacity.value = withTiming(1, { duration: 150 });
      
      // Pulse sophistiqué - rythme précis et élégant
      pulseScale.value = withSequence(
        withTiming(1.03, { duration: 400 }),
        withTiming(1, { duration: 400 }),
        withTiming(1.03, { duration: 400 }),
        withTiming(1, { duration: 400 })
      );
      
      // Transition de couleur sophistiquée - dégradé fluide
      borderColor.value = withTiming(2, { duration: 10000 }); // 10 secondes pour le dégradé complet
    }
  }, [isCountdown]);

  // Animation à chaque seconde du countdown
  React.useEffect(() => {
    if (isCountdown && countdownValue !== undefined) {
      // Pulse sophistiqué à chaque seconde - vif et précis
      pulseScale.value = withSequence(
        withTiming(1.06, { duration: 180 }),
        withTiming(1, { duration: 120 })
      );
      
      // Flash de couleur sophistiqué - alternance élégante
      borderColor.value = withSequence(
        withTiming(2, { duration: 250 }), // Flash blanc cassé
        withTiming(0, { duration: 150 })  // Retour bleu gris
      );
    }
  }, [countdownValue]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header minimaliste - comme le concurrent */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
      }}>
        <TouchableOpacity onPress={onBack}>
          <FontAwesome name="arrow-left" size={24} color="#87CEEB" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: 'rgba(135, 206, 235, 0.8)', fontSize: 24, fontWeight: 'bold', letterSpacing: 2 }}>
            {title}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Layout centré pour countdown, horizontal pour ready */}
      {isCountdown ? (
        /* Countdown centré avec animation */
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 40,
          paddingTop: 40, // ✅ Réduit l'espace du haut
          paddingBottom: 40, // ✅ Plus d'espace en bas pour équilibrer
        }}>
          <TouchableOpacity
            onPress={onTogglePause}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Animated.View style={[{
              width: 300,
              height: 300,
              borderRadius: 150,
              borderWidth: 1.5,
              backgroundColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 12,
            }, animatedStyle, borderAnimatedStyle]}>
              {isPaused ? (
                <FontAwesome name="play" size={70} color="#F5F5DC" />
              ) : (
                <Text style={{
                  color: '#F5F5DC',
                  fontSize: 120,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textShadowColor: 'rgba(135, 206, 235, 0.4)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 30,
                }}>
                  {countdownValue}
                </Text>
              )}
            </Animated.View>
          </TouchableOpacity>
          
          {/* Bouton Skip en bas à droite */}
          <TouchableOpacity 
            onPress={onSkipCountdown}
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: '#121212',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#87CEEB',
              shadowColor: '#87CEEB',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text style={{ 
              color: '#F5F5DC', 
              fontSize: 14, 
              fontWeight: '600',
              letterSpacing: 0.5,
            }}>
              SKIP
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Ready avec timer en haut */
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 40 
        }}>
          
          {/* Timer circulaire géant */}
          <TouchableOpacity
            onPress={onStartCountdown}
            style={{
              width: 250,
              height: 250,
              borderRadius: 125,
              borderWidth: 1.5,
              borderColor: 'rgba(135, 206, 235, 0.6)',
              backgroundColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#87CEEB',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 25,
              elevation: 12,
            }}
          >
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FontAwesome name="play" size={60} color="#F5F5DC" />
            </View>
          </TouchableOpacity>

          {/* Temps configuré (seulement si configDisplay) */}
          {configDisplay && (
            <Text style={{
              color: '#F5F5DC',
              fontSize: 24,
              fontWeight: 'bold',
              marginTop: 24,
              textAlign: 'center',
              letterSpacing: 1,
              textShadowColor: 'rgba(135, 206, 235, 0.3)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 15,
            }}>
              {configDisplay}
            </Text>
          )}

          {/* Ready */}
          <Text style={{
            color: 'rgba(135, 206, 235, 0.8)',
            fontSize: 16,
            marginTop: 12,
            textAlign: 'center',
            opacity: 0.9,
            letterSpacing: 0.5,
          }}>
            Ready
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
