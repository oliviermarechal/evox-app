import React, { useEffect } from "react";
import { View, Dimensions } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface FireEffectProps {
  isVisible: boolean;
  size?: number;
  timerPosition?: { x: number; y: number; width: number; height: number };
}

export default function FireEffect({ isVisible, size = 280, timerPosition }: FireEffectProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const shockwave1 = useSharedValue(0);
  const shockwave2 = useSharedValue(0);
  const shockwave3 = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      // Pulse agressif du cercle du timer
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(0.95, { duration: 100, easing: Easing.in(Easing.quad) }),
          withTiming(1.1, { duration: 120, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) })
        ),
        3, // 3 répétitions
        false
      );

      // 3 ondes de choc séquentielles
      shockwave1.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
      
      setTimeout(() => {
        shockwave2.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
      }, 200);
      
      setTimeout(() => {
        shockwave3.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
      }, 400);
    } else {
      // Reset
      shockwave1.value = 0;
      shockwave2.value = 0;
      shockwave3.value = 0;
      pulse.value = 0;
    }
  }, [isVisible]);

  // Calculer la position du centre du timer (avec offset pour le conteneur étendu)
  const timerCenterX = timerPosition 
    ? timerPosition.x + timerPosition.width / 2 + 100 // +100 pour l'offset du conteneur
    : screenWidth / 2 + 100;
  const timerCenterY = timerPosition 
    ? timerPosition.y + timerPosition.height / 2 + 100 // +100 pour l'offset du conteneur
    : screenHeight / 2 + 100;
  
  const timerRadius = size / 2 - 6; // Rayon du timer (account for border)
  
  // Calculer la distance maximale entre le centre du timer et tous les coins de l'écran
  const distToTopLeft = Math.sqrt(timerCenterX * timerCenterX + timerCenterY * timerCenterY);
  const distToTopRight = Math.sqrt((screenWidth - timerCenterX) * (screenWidth - timerCenterX) + timerCenterY * timerCenterY);
  const distToBottomLeft = Math.sqrt(timerCenterX * timerCenterX + (screenHeight - timerCenterY) * (screenHeight - timerCenterY));
  const distToBottomRight = Math.sqrt((screenWidth - timerCenterX) * (screenWidth - timerCenterX) + (screenHeight - timerCenterY) * (screenHeight - timerCenterY));
  
  // Le rayon maximum nécessaire pour couvrir tout l'écran depuis le centre du timer
  // Utiliser un rayon très grand pour s'assurer qu'il n'y a pas de bandes
  const maxRadius = Math.max(screenWidth, screenHeight) * 1.5;

  // Props pour le pulse du timer
  const pulseProps = useAnimatedProps(() => ({
    r: timerRadius * (1 + interpolate(pulse.value, [0, 1], [0, 0.15])),
    opacity: interpolate(pulse.value, [0, 1], [1, 0.7]),
  }));

  // Props pour les ondes de choc - elles s'étendent maintenant sur tout l'écran
  const shockwave1Props = useAnimatedProps(() => ({
    r: timerRadius + interpolate(shockwave1.value, [0, 1], [0, maxRadius]),
    opacity: interpolate(shockwave1.value, [0, 1], [0.6, 0]),
  }));

  const shockwave2Props = useAnimatedProps(() => ({
    r: timerRadius + interpolate(shockwave2.value, [0, 1], [0, maxRadius]),
    opacity: interpolate(shockwave2.value, [0, 1], [0.6, 0]),
  }));

  const shockwave3Props = useAnimatedProps(() => ({
    r: timerRadius + interpolate(shockwave3.value, [0, 1], [0, maxRadius]),
    opacity: interpolate(shockwave3.value, [0, 1], [0.6, 0]),
  }));

  if (!isVisible) return null;

  return (
    <View style={{ 
      position: "absolute", 
      top: -100,
      left: -100,
      right: -100,
      bottom: -100,
      width: screenWidth + 200, 
      height: screenHeight + 200, 
      zIndex: 9999, // Au-dessus de tout
      pointerEvents: 'none' // N'interfère pas avec les interactions
    }}>
      <Svg width={screenWidth + 200} height={screenHeight + 200}>
        <Defs>
          <RadialGradient id="shockwaveGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FF4500" stopOpacity="0.8" />
            <Stop offset="30%" stopColor="#FF6B00" stopOpacity="0.6" />
            <Stop offset="60%" stopColor="#FF8C00" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Pulse du timer */}
        <AnimatedCircle
          cx={timerCenterX}
          cy={timerCenterY}
          fill="none"
          stroke="#FF4500"
          strokeWidth="3"
          animatedProps={pulseProps}
        />

        {/* Première onde de choc */}
        <AnimatedCircle
          cx={timerCenterX}
          cy={timerCenterY}
          fill="url(#shockwaveGradient)"
          animatedProps={shockwave1Props}
        />

        {/* Deuxième onde de choc */}
        <AnimatedCircle
          cx={timerCenterX}
          cy={timerCenterY}
          fill="url(#shockwaveGradient)"
          animatedProps={shockwave2Props}
        />

        {/* Troisième onde de choc */}
        <AnimatedCircle
          cx={timerCenterX}
          cy={timerCenterY}
          fill="url(#shockwaveGradient)"
          animatedProps={shockwave3Props}
        />
      </Svg>
    </View>
  );
}
