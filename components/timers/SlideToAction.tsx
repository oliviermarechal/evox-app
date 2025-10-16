import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';

interface SlideToActionProps {
  label?: string;
  onSlideComplete: () => void;
  width?: number;
  height?: number;
  orientation?: 'horizontal' | 'vertical';
}

export default function SlideToAction({
  label = "SLIDE TO START",
  onSlideComplete,
  width = 300,
  height = 50,
  orientation = 'horizontal',
}: SlideToActionProps) {
  const knobX = useSharedValue(0);
  const knobY = useSharedValue(0);
  const containerWidth = width;
  const containerHeight = height;
  const knobSize = orientation === 'horizontal' ? 60 : 50;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (orientation === 'horizontal') {
        knobX.value = Math.max(0, Math.min(event.translationX, containerWidth - knobSize));
      } else {
        knobY.value = Math.max(0, Math.min(event.translationY, containerHeight - knobSize));
      }
    })
    .onEnd(() => {
      if (orientation === 'horizontal') {
        const threshold = containerWidth - knobSize * 1.1;
        if (knobX.value >= threshold) {
          runOnJS(onSlideComplete)();
          knobX.value = withTiming(containerWidth - knobSize, { duration: 200 });
        } else {
          knobX.value = withTiming(0, { duration: 200 });
        }
      } else {
        const threshold = containerHeight - knobSize * 1.1;
        if (knobY.value >= threshold) {
          runOnJS(onSlideComplete)();
          knobY.value = withTiming(containerHeight - knobSize, { duration: 200 });
        } else {
          knobY.value = withTiming(0, { duration: 200 });
        }
      }
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: orientation === 'horizontal' 
      ? [{ translateX: knobX.value }]
      : [{ translateY: knobY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    ...(orientation === 'horizontal' 
      ? { 
          width: knobX.value + 5 + (knobSize  / 2),
          height: containerHeight,
          left: -1,
          top: -1
        }
      : { 
          height: knobY.value + 5 + (knobSize  / 2),
          width: containerWidth,
          left: 0,
          top: 0
        }
    ),
  }));


  const textColorStyle = useAnimatedStyle(() => {
    const progress = orientation === 'horizontal' 
      ? knobX.value / (containerWidth - knobSize)
      : knobY.value / (containerHeight - knobSize);
    
    // Transition fluide de couleur comme iOS
    const fillThreshold = 0.4;
    const isFilled = progress > fillThreshold;
    const transitionProgress = Math.min((progress - fillThreshold) / (1 - fillThreshold), 1);
    
    return {
      color: isFilled ? '#0F0F10' : 'rgba(135, 206, 235, 0.9)',
      textShadowColor: isFilled 
        ? 'rgba(15, 15, 16, 0.3)' 
        : 'rgba(135, 206, 235, 0.3)',
      textShadowRadius: isFilled ? 1 : 2,
      fontWeight: isFilled ? '800' : '700',
    };
  });


  return (
    <View style={[
      styles.container, 
      { 
        width: containerWidth,
        height: containerHeight,
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
      }
    ]}>
      <Animated.View style={[styles.progress, progressStyle]} />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[
          styles.knob, 
          knobStyle,
          orientation === 'vertical' ? styles.knobVertical : {}
        ]}>
          <LinearGradient
            colors={['#1A1A1A', '#0F0F10']}
            style={styles.knobGradient}
          />
        </Animated.View>
      </GestureDetector>
      <Animated.Text style={[
        orientation === 'vertical' ? styles.labelVertical : styles.label,
        textColorStyle
      ]}>
        {label}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    backgroundColor: "rgba(15, 15, 16, 0.8)",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(135, 206, 235, 0.3)",
    shadowColor: "#87CEEB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    position: "absolute",
    alignSelf: "center",
    color: "rgba(135, 206, 235, 0.9)",
    fontWeight: "700",
    letterSpacing: 1.2,
    fontSize: 11,
    textShadowColor: "rgba(135, 206, 235, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  labelVertical: {
    position: "absolute",
    alignSelf: "center",
    color: "rgba(135, 206, 235, 0.9)",
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 10,
    textShadowColor: "rgba(135, 206, 235, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    transform: [{ rotate: '90deg' }],
  },
  progress: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "rgba(135, 206, 235, 0.8)",
    borderRadius: 25,
    shadowColor: "#87CEEB",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  knob: {
    position: "absolute",
    left: 0,
    width: 51,
    height: 51,
    borderRadius: 26,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#87CEEB",
    shadowOpacity: 0.8,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
    borderWidth: 2,
    borderColor: "#87CEEB",
  },
  knobVertical: {
    top: 0,
    left: "50%",
    marginLeft: -25,
  },
  knobGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#87CEEB',
  },
  knobText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
