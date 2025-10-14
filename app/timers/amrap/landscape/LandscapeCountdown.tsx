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

export default function LandscapeCountdown({
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
        {/* Layout horizontal pour le paysage */}
        <View style={styles.horizontalLayout}>
          {/* Côté gauche - Titres et boutons */}
          <View style={styles.leftSide}>
            <Text style={styles.title}>GET READY</Text>
            <Text style={styles.subtitle}>AMRAP starting in...</Text>
            
            {/* Boutons d'action */}
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

          {/* Côté droit - Cercle de décompte */}
          <View style={styles.rightSide}>
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownText}>{countdownValue}</Text>
            </View>
          </View>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  horizontalLayout: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
  },
  rightSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#87CEEB',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  countdownCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 12,
    borderColor: '#87CEEB',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 20,
  },
  countdownText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#87CEEB',
  },
  controlsContainer: {
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 180,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  skipButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pauseButton: {
    backgroundColor: '#F5F5DC',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 180,
    shadowColor: '#F5F5DC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  pauseButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 180,
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
