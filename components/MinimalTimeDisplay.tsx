import React from 'react';
import { View, Text } from 'react-native';

export function MinimalTimeDisplay({
  timeString,
  isPaused = false,
}: {
  timeString: string;
  isPaused?: boolean;
}) {
  return (
    <View
      style={{
        width: 500,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderRadius: 0,
        borderWidth: 0,
      }}
    >
      <Text
        style={{
          color: isPaused ? '#F5F5DC' : '#87CEEB',
          fontSize: 84,
          fontVariant: ['tabular-nums'],
          fontWeight: '900',
          textAlign: 'center',
          textShadowColor: isPaused ? 'rgba(245, 245, 220, 0.3)' : 'rgba(135, 206, 235, 0.3)',
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 8,
          letterSpacing: 2,
          lineHeight: 88,
          fontFamily: 'monospace',
          width: '100%',
          includeFontPadding: false,
          textAlignVertical: 'center',
          paddingVertical: 10,
        }}
      >
        {timeString}
      </Text>
    </View>
  );
}
