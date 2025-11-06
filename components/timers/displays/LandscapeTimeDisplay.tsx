import React from 'react';
import { View, Text } from 'react-native';

export function LandscapeTimeDisplay({
  timeString,
  isPaused = false,
  fontSize = 120,
}: {
  timeString: string;
  isPaused?: boolean;
  fontSize?: number;
}) {
  return (
    <View style={{ 
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text
        style={{
          color: '#F5F5DC',
          fontSize: fontSize,
          fontVariant: ['tabular-nums'],
          fontWeight: '300',
          textAlign: 'center',
          textShadowColor: isPaused ? 'rgba(245, 245, 220, 0.3)' : 'rgba(135, 206, 235, 0.4)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 30,
          letterSpacing: 2,
          lineHeight: fontSize + 4,
          fontFamily: 'monospace',
          includeFontPadding: false,
          textAlignVertical: 'center',
          paddingBottom: 110,
          paddingTop: 10,
          paddingHorizontal: 20,
        }}
        adjustsFontSizeToFit
        numberOfLines={1}
        minimumFontScale={0.7}
      >
        {timeString}
      </Text>
    </View>
  );
}