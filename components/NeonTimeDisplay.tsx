import React from 'react';
import { View, Text } from 'react-native';

export function NeonTimeDisplay({
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
        backgroundColor: '#0A0A0A',
        borderRadius: 16,
        borderWidth: 3,
        borderColor: isPaused ? '#FF6B6B' : '#00FFFF',
        // Effet neon intense
        shadowColor: isPaused ? '#FF6B6B' : '#00FFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 20,
      }}
    >
      <Text
        style={{
          color: isPaused ? '#FF6B6B' : '#00FFFF',
          fontSize: 84,
          fontVariant: ['tabular-nums'],
          fontWeight: '900',
          textAlign: 'center',
          textShadowColor: isPaused ? '#FF6B6B' : '#00FFFF',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 20,
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
