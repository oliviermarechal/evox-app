import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useOrientation } from '@/hooks/useOrientation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';
import TimerComponent from './TimerComponent';

export default function FreeTimerScreen() {
  // Allow all orientations for timer screens
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  
  const [showTimer, setIsShowTimer] = useState(false);
  const { isLandscape } = useOrientation();

  useFocusEffect(
    React.useCallback(() => {
      // Reset timer when screen is focused
      setIsShowTimer(false);
    }, [])
  );

  const handleStartTimer = () => {
    setIsShowTimer(true);
  };

  if (showTimer) {
    return <TimerComponent isLandscape={isLandscape} onResetTimer={() => setIsShowTimer(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec flèche de retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#87CEEB" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>FREE TIMER</Text>
          <Text style={styles.headerSubtitle}>Stopwatch</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>FREE TIMER</Text>
        <Text style={styles.subtitle}>Stopwatch</Text>
        <Text style={styles.description}>
          Start your stopwatch and track your time without any limits.
        </Text>
        
        <TouchableOpacity style={styles.startButton} onPress={handleStartTimer}>
          <Text style={styles.startButtonText}>START TIMER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F10',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF80',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
