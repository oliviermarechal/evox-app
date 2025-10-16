import React from 'react';
import { View, Text } from 'react-native';

export function PortraitTimeDisplay({
  timeString,
  isPaused = false,
  isOnFire = false,
}: {
  timeString: string;
  isPaused?: boolean;
  isOnFire?: boolean;
}) {
  return (
    <View>
      <Text
        style={{
          color: '#F5F5DC', // Toujours blanc cassé comme couleur principale
          fontSize: 54,
          fontWeight: 'bold',
          textAlign: 'center',
          textShadowColor: isPaused ? 'rgba(245, 245, 220, 0.3)' : 'rgba(135, 206, 235, 0.4)', // Ombres subtiles
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: isOnFire ? 50 : 30,
          letterSpacing: 1.5,
          lineHeight: 60,
          minWidth: 300,
          width: 300,
        }}
      >
        {timeString}
      </Text>
    </View>
  );
}
