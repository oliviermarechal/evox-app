import React from 'react';
import { View, Text } from 'react-native';

export function LandscapeTimeDisplay({
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
          color: '#F5F5DC',
          fontSize: 120,
          fontVariant: ['tabular-nums'],
          fontWeight: '300',
          textAlign: 'center',
          textShadowColor: isPaused ? 'rgba(245, 245, 220, 0.3)' : 'rgba(135, 206, 235, 0.4)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: isOnFire ? 50 : 30,
          letterSpacing: 2,
          lineHeight: 124,
          fontFamily: 'monospace',
          includeFontPadding: false,
          textAlignVertical: 'center',
          padding: 20,
          width: '100%',
        }}
      >
        {timeString}
      </Text>
    </View>
  );
}