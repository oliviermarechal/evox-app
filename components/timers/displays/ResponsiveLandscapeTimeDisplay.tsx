import React, { useState } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';

interface ResponsiveLandscapeTimeDisplayProps {
  timeString: string;
  isPaused?: boolean;
}

export function ResponsiveLandscapeTimeDisplay({
  timeString,
  isPaused = false,
}: ResponsiveLandscapeTimeDisplayProps) {
  const [fontSize, setFontSize] = useState(140);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    
    const targetWidth = width * 0.50;
    const charCount = timeString.length;
    const estimatedFontSize = Math.floor((targetWidth / charCount) / 0.6);
    const clampedSize = Math.max(80, Math.min(140, estimatedFontSize));
    setFontSize(clampedSize);
  };

  return (
    <View 
      onLayout={handleLayout}
      style={{ 
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
          padding: 40,
        }}
        adjustsFontSizeToFit
        numberOfLines={1}
        minimumFontScale={0.5}
      >
        {timeString}
      </Text>
    </View>
  );
}

