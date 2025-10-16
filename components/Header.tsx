import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface HeaderProps {
  onBackPress: () => void;
  title: string;
  subtitle?: string;
}

export function Header({ onBackPress, title, subtitle }: HeaderProps) {
  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 24, 
      paddingVertical: 16,
    }}>
      <TouchableOpacity 
        onPress={onBackPress}
        style={{
          padding: 12,
          margin: -12,
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <FontAwesome name="arrow-left" size={24} color="#87CEEB" />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ 
          color: '#F5F5DC', 
          fontSize: 24, 
          fontWeight: 'bold', 
          letterSpacing: 2 
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ 
            color: 'rgba(135, 206, 235, 0.6)', 
            fontSize: 14, 
            marginTop: 4, 
            opacity: 0.8 
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={{ width: 24 }} />
    </View>
  );
}
