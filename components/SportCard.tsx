import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface SportCardProps {
  title: string;
  subtitle: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  onPress: () => void;
}

export default function SportCard({ title, subtitle, iconName, onPress }: SportCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        backgroundColor: '#000000',
        borderRadius: 16,
        padding: 20,
        width: '45%',
        borderWidth: 1,
        borderColor: '#87CEEB30',
        alignItems: 'center',
        shadowColor: '#87CEEB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4
      }}
    >
      <View style={{ backgroundColor: '#87CEEB20', padding: 16, borderRadius: 50, marginBottom: 12 }}>
        <FontAwesome name={iconName} size={32} color="#87CEEB" />
      </View>
      <Text style={{ color: '#87CEEB', fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
      <Text style={{ color: '#FFD700', fontSize: 12, marginTop: 4 }}>{subtitle}</Text>
    </TouchableOpacity>
  );
}