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
        <Text style={styles.subtitle}>AMRAP starting in...</Text>
        
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
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#87CEEB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40,
    opacity: 0.8,
  },
  countdownCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#87CEEB',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 40,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#87CEEB',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    flexWrap: 'wrap',
    marginTop: 20,
  },
  skipButton: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  skipButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#F5F5DC',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#F5F5DC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pauseButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
