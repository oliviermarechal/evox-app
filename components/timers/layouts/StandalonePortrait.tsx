import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddRoundButton } from '@/components/timers/AddRoundButton';
import { PortraitTimeDisplay } from '@/components/timers/displays/PortraitTimeDisplay';
import SlideToAction from '@/components/timers/SlideToAction';
import { Header } from '@/components/ui/Header';

interface StandalonePortraitProps {
  label: string;
  subtitle?: string;
  timeString: string;
  isPaused: boolean;
  onTogglePause: () => void;
  currentRound?: number;
  onAddRound?: () => void;
  onFinish: () => void;
  finalScreen?: React.ReactNode;
  onBackPress?: () => void;
}

export default function StandalonePortrait({
  label,
  subtitle,
  timeString,
  isPaused,
  onTogglePause,
  currentRound = 0,
  onAddRound,
  onFinish,
  finalScreen,
  onBackPress,
}: StandalonePortraitProps) {
  // Afficher l'écran de fin si fourni
  if (finalScreen) {
    return <>{finalScreen}</>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Background avec gradient subtil */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0F0F10',
      }}>
        {/* Gradient overlay subtil */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(135, 206, 235, 0.02)',
        }} />
      </View>
      {/* Header générique */}
      <Header
        onBackPress={onBackPress}
        title={label}
        subtitle={subtitle}
      />

      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        paddingHorizontal: 24,
        zIndex: 10,
      }}>
        {/* Zone timer : 60% de la hauteur disponible, centré verticalement */}
        <View style={{ 
          flex: 0.6, 
          width: '100%',
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 200,
          paddingVertical: 40, // Espace pour le shadow qui dépasse
        }}>
          <TouchableOpacity
            onPress={onTogglePause}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: 350,
              aspectRatio: 1,
              borderRadius: 9999,
              borderWidth: 1.5,
              borderColor: 'rgba(135, 206, 235, 0.6)',
              backgroundColor: '#000000',
              shadowColor: '#87CEEB',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <PortraitTimeDisplay 
              timeString={timeString}
              isPaused={isPaused}
            />
          </TouchableOpacity>
        </View>

        {/* Zone rounds : 20% de la hauteur disponible, seulement si currentRound > 0 */}
        {currentRound > 0 && (
          <View style={{ 
            flex: 0.2,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 80,
          }}>
            <View style={{
              alignItems: 'center',
              marginBottom: 12,
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
                fontSize: 32,
                fontWeight: '600',
                textAlign: 'center',
                textShadowColor: 'rgba(245, 245, 220, 0.3)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 20,
                letterSpacing: -1,
                fontFamily: 'monospace',
                lineHeight: 32,
              }}>
                {currentRound}
              </Text>
            </View>
            {onAddRound && <AddRoundButton onPress={onAddRound} />}
          </View>
        )}

        {/* Zone SlideToAction : 20% de la hauteur disponible, toujours visible */}
        <View style={{
          flex: currentRound > 0 ? 0.2 : 0.4,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 20,
          minHeight: 70,
        }}>
          <SlideToAction
            onSlideComplete={onFinish}
            label="FINISH"
            width={280}
            height={50}
            orientation="horizontal"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

