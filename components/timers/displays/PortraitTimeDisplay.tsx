import React from 'react';
import { View, Text } from 'react-native';

export function PortraitTimeDisplay({
  timeString,
  isPaused = false,
}: {
  timeString: string;
  isPaused?: boolean;
}) {
  return (
    <View>
      <Text
        style={{
          color: '#F5F5DC',
          fontSize: 54,
          fontWeight: 'bold',
          textAlign: 'center',
          textShadowColor: isPaused ? 'rgba(245, 245, 220, 0.3)' : 'rgba(135, 206, 235, 0.4)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 30,
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
