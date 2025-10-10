import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CountdownComponentProps {
  countdownValue: number;
  isCountdownPaused: boolean;
  onSkipCountdown: () => void;
  onPauseCountdown: () => void;
  onResumeCountdown: () => void;
  onCancelCountdown: () => void;
}

export default function CountdownComponent({
  countdownValue,
  isCountdownPaused,
  onSkipCountdown,
  onPauseCountdown,
  onResumeCountdown,
  onCancelCountdown,
}: CountdownComponentProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>GET READY</Text>
        <Text style={styles.subtitle}>Tabata starting in...</Text>
        
        <View style={styles.countdownCircle}>
          <Text style={styles.countdownText}>{countdownValue}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={onSkipCountdown}>
            <Text style={styles.skipButtonText}>SKIP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pauseButton}
            onPress={isCountdownPaused ? onResumeCountdown : onPauseCountdown}
          >
            <Text style={styles.pauseButtonText}>
              {isCountdownPaused ? 'RESUME' : 'PAUSE'}
            </Text>
          </TouchableOpacity>

          {isCountdownPaused && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancelCountdown}>
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F10',
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
    marginBottom: 48,
  },
  countdownCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#FFD700',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 48,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  controlsContainer: {
    alignItems: 'center',
    gap: 16,
  },
  skipButton: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  skipButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  pauseButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
