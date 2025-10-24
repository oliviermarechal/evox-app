import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Exercise, ExerciseTemplate } from '@/lib/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onRemove: () => void;
}

export default function ExerciseCard({ exercise, onUpdate, onRemove }: ExerciseCardProps) {
  const [volume, setVolume] = useState(exercise.volume?.toString() || '');
  const [instructions, setInstructions] = useState(exercise.instructions || '');
  const [videoUrl, setVideoUrl] = useState(exercise.videoUrl || '');
  const [selectedUnit, setSelectedUnit] = useState(exercise.unit);

  const handleVolumeChange = (text: string) => {
    setVolume(text);
    const numValue = parseFloat(text);
    onUpdate({
      ...exercise,
      volume: isNaN(numValue) ? undefined : numValue,
    });
  };

  const handleInstructionsChange = (text: string) => {
    setInstructions(text);
    onUpdate({
      ...exercise,
      instructions: text.trim() || undefined,
    });
  };

  const handleVideoUrlChange = (text: string) => {
    setVideoUrl(text);
    onUpdate({
      ...exercise,
      videoUrl: text.trim() || undefined,
    });
  };

  const handleUnitChange = (newUnit: string) => {
    setSelectedUnit(newUnit);
    onUpdate({
      ...exercise,
      unit: newUnit,
    });
  };

  // Récupérer les unités alternatives depuis le template (si disponible)
  const getAvailableUnits = () => {
    // Pour l'instant, on retourne les unités communes selon le type d'exercice
    const commonUnits = {
      'kg': ['kg', 'lbs'],
      'lbs': ['lbs', 'kg'],
      'meters': ['meters', 'calories'],
      'calories': ['calories', 'meters'],
      'reps': ['reps'],
      'seconds': ['seconds', 'minutes'],
      'minutes': ['minutes', 'seconds'],
    };
    
    return commonUnits[exercise.unit as keyof typeof commonUnits] || [exercise.unit];
  };

  return (
    <View style={{
      backgroundColor: 'rgba(18, 18, 18, 0.8)',
      borderRadius: 16,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'rgba(135, 206, 235, 0.2)',
      shadowColor: '#87CEEB',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    }}>
      {/* Header - Compact */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            color: '#F5F5DC',
            fontSize: 15,
            fontWeight: 'bold',
            marginBottom: 2,
          }}>
            {exercise.name}
          </Text>
          <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
            {getAvailableUnits().map((unit) => (
              <TouchableOpacity
                key={unit}
                onPress={() => handleUnitChange(unit)}
                style={{
                  backgroundColor: selectedUnit === unit ? '#87CEEB' : 'rgba(135, 206, 235, 0.1)',
                  borderRadius: 6,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderWidth: 1,
                  borderColor: selectedUnit === unit ? '#87CEEB' : 'rgba(135, 206, 235, 0.3)',
                }}
              >
                <Text style={{
                  color: selectedUnit === unit ? '#0F0F10' : 'rgba(135, 206, 235, 0.8)',
                  fontSize: 8,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  {unit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity
          onPress={onRemove}
          style={{
            backgroundColor: 'rgba(255, 107, 107, 0.15)',
            borderRadius: 12,
            padding: 6,
            borderWidth: 1,
            borderColor: 'rgba(255, 107, 107, 0.3)',
          }}
        >
          <FontAwesome name="trash" size={10} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Volume Input - Compact */}
      <View style={{ marginBottom: 8 }}>
        <View style={{
          backgroundColor: 'rgba(135, 206, 235, 0.08)',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'rgba(135, 206, 235, 0.2)',
        }}>
          <TextInput
            style={{
              flex: 1,
              padding: 10,
              color: '#F5F5DC',
              fontSize: 13,
              fontWeight: '600',
            }}
            value={volume}
            onChangeText={handleVolumeChange}
            placeholder={`Enter ${exercise.unit}...`}
            placeholderTextColor="rgba(245, 245, 220, 0.5)"
            keyboardType="numeric"
            returnKeyType="done"
          />
          <Text style={{
            color: 'rgba(135, 206, 235, 0.7)',
            fontSize: 10,
            paddingRight: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontWeight: '600',
          }}>
            {exercise.unit}
          </Text>
        </View>
      </View>

      {/* Instructions - Ultra Compact */}
      <View style={{ marginBottom: 6 }}>
        <TextInput
          style={{
            backgroundColor: 'rgba(135, 206, 235, 0.06)',
            borderRadius: 8,
            padding: 8,
            color: '#F5F5DC',
            fontSize: 11,
            borderWidth: 1,
            borderColor: 'rgba(135, 206, 235, 0.15)',
            minHeight: 32,
            textAlignVertical: 'top',
          }}
          value={instructions}
          onChangeText={handleInstructionsChange}
          placeholder="Instructions (optional)..."
          placeholderTextColor="rgba(135, 206, 235, 0.4)"
          multiline
          returnKeyType="done"
        />
      </View>

      {/* Video URL - Ultra Compact */}
      <View>
        <TextInput
          style={{
            backgroundColor: 'rgba(135, 206, 235, 0.06)',
            borderRadius: 8,
            padding: 8,
            color: '#F5F5DC',
            fontSize: 11,
            borderWidth: 1,
            borderColor: 'rgba(135, 206, 235, 0.15)',
          }}
          value={videoUrl}
          onChangeText={handleVideoUrlChange}
          placeholder="Video link (optional)..."
          placeholderTextColor="rgba(135, 206, 235, 0.4)"
          keyboardType="url"
          returnKeyType="done"
        />
      </View>
    </View>
  );
}
