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
    <View style={{ 
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text
        style={{
          color: '#F5F5DC',
          fontSize: 56, // Réduit pour que le shadow ne soit pas coupé
          fontWeight: 'bold',
          textAlign: 'center',
          textShadowColor: isPaused ? 'rgba(245, 245, 220, 0.3)' : 'rgba(135, 206, 235, 0.4)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 25, // Réduit pour éviter le dépassement
          letterSpacing: 1.5,
          lineHeight: 62, // Ajusté proportionnellement
          includeFontPadding: false,
          paddingHorizontal: 20,
          paddingVertical: 30, // Padding pour le shadow
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
