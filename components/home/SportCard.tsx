import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useOrientation } from '@/hooks/useOrientation';

interface SportCardProps {
  title: string;
  subtitle: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  onPress: () => void;
}

export default function SportCard({ title, subtitle, iconName, onPress }: SportCardProps) {
  const { isLandscape } = useOrientation();
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        backgroundColor: '#000000',
        borderRadius: 16,
        padding: isLandscape ? 12 : 16,
        width: isLandscape ? '18%' : '45%',
        height: isLandscape ? 120 : undefined,
        minWidth: isLandscape ? 100 : 140,
        maxWidth: isLandscape ? 140 : 200,
        borderWidth: 1.5,
        borderColor: 'rgba(135, 206, 235, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#87CEEB',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 6,
        position: 'relative',
      }}
    >
      {/* Gradient overlay subtil */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
        backgroundColor: 'rgba(135, 206, 235, 0.03)',
      }} />
      
      {/* Icon Container Premium */}
      <View style={{ 
        backgroundColor: 'rgba(135, 206, 235, 0.1)', 
        padding: isLandscape ? 12 : 16, 
        borderRadius: isLandscape ? 30 : 40, 
        marginBottom: isLandscape ? 8 : 12,
        borderWidth: 1,
        borderColor: 'rgba(135, 206, 235, 0.2)',
        shadowColor: '#87CEEB',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
      }}>
        <FontAwesome name={iconName} size={isLandscape ? 20 : 24} color="#87CEEB" />
      </View>
      
      {/* Title Premium */}
      <Text style={{ 
        color: '#F5F5DC', 
        fontWeight: '700', 
        fontSize: isLandscape ? 12 : 16,
        textAlign: 'center',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(245, 245, 220, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        marginBottom: 2
      }}>
        {title}
      </Text>
      
      {/* Subtitle Premium */}
      <Text style={{ 
        color: 'rgba(135, 206, 235, 0.8)', 
        fontSize: isLandscape ? 8 : 10, 
        textAlign: 'center',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(135, 206, 235, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        lineHeight: 12
      }}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}