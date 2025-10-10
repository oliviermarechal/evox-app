import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface SlideToActionProps {
  label?: string;
  onSlideComplete: () => void;
  width?: number;
}

export default function SlideToAction({
  label = "SLIDE TO START",
  onSlideComplete,
  width = 300,
}: SlideToActionProps) {
  const knobX = useSharedValue(0);
  const containerWidth = width;
  const knobSize = 60;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      knobX.value = Math.max(0, Math.min(event.translationX, containerWidth - knobSize));
    })
    .onEnd(() => {
      const threshold = containerWidth - knobSize * 1.1;
      if (knobX.value >= threshold) {
        runOnJS(onSlideComplete)();
        knobX.value = withTiming(containerWidth - knobSize, { duration: 200 });
      } else {
        knobX.value = withTiming(0, { duration: 200 });
      }
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knobX.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: knobX.value + 35,
  }));

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Animated.View style={[styles.progress, progressStyle]} />
      <Text style={styles.label}>{label}</Text>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0F0F10",
    overflow: "hidden",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FF450030",
  },
  label: {
    position: "absolute",
    alignSelf: "center",
    color: "#FF4500",
    fontWeight: "600",
    letterSpacing: 1.5,
    fontSize: 12,
  },
  progress: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#FF4500",
    borderRadius: 25,
  },
  knob: {
    position: "absolute",
    left: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4500",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    borderWidth: 2,
    borderColor: "#FF4500",
  },
  knobText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
