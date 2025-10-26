import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

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

  const getAvailableUnits = () => {
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

      {/* Volume Input - Native Modal */}
      <View style={{ marginBottom: 8 }}>
        <TouchableOpacity
          onPress={() => setShowVolumeModal(true)}
          style={{
            backgroundColor: 'rgba(135, 206, 235, 0.08)',
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(135, 206, 235, 0.2)',
            padding: 10,
          }}
        >
          <Text style={{
            flex: 1,
            color: volume ? '#F5F5DC' : 'rgba(245, 245, 220, 0.5)',
            fontSize: 13,
            fontWeight: '600',
          }}>
            {volume || `Enter ${exercise.unit}...`}
          </Text>
          <Text style={{
            color: 'rgba(135, 206, 235, 0.7)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontWeight: '600',
          }}>
            {exercise.unit}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Instructions - Native Modal */}
      <View style={{ marginBottom: 6 }}>
        <TouchableOpacity
          onPress={() => setShowInstructionsModal(true)}
          style={{
            backgroundColor: 'rgba(135, 206, 235, 0.06)',
            borderRadius: 8,
            padding: 8,
            borderWidth: 1,
            borderColor: 'rgba(135, 206, 235, 0.15)',
            minHeight: 32,
          }}
        >
          <Text style={{
            color: instructions ? '#F5F5DC' : 'rgba(135, 206, 235, 0.4)',
            fontSize: 11,
          }}>
            {instructions || 'Instructions (optional)...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Video URL - Native Modal */}
      <View>
        <TouchableOpacity
          onPress={() => setShowVideoModal(true)}
          style={{
            backgroundColor: 'rgba(135, 206, 235, 0.06)',
            borderRadius: 8,
            padding: 8,
            borderWidth: 1,
            borderColor: 'rgba(135, 206, 235, 0.15)',
          }}
        >
          <Text style={{
            color: videoUrl ? '#F5F5DC' : 'rgba(135, 206, 235, 0.4)',
            fontSize: 11,
          }}>
            {videoUrl || 'Video link (optional)...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Volume Modal */}
      <Modal
        visible={showVolumeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          handleVolumeChange(volume);
          setShowVolumeModal(false);
        }}
      >
        <TouchableWithoutFeedback onPress={() => {
          handleVolumeChange(volume);
          setShowVolumeModal(false);
        }}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              >
                <View style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.95)',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(135, 206, 235, 0.2)',
                }}>
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 16,
                    textAlign: 'center',
                  }}>
                    Enter {exercise.unit}
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: 'rgba(135, 206, 235, 0.08)',
                      borderRadius: 12,
                      padding: 16,
                      color: '#F5F5DC',
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(135, 206, 235, 0.3)',
                    }}
                    value={volume}
                    onChangeText={setVolume}
                    placeholder={`Enter ${exercise.unit}...`}
                    placeholderTextColor="rgba(245, 245, 220, 0.5)"
                    keyboardType="numeric"
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      handleVolumeChange(volume);
                      setShowVolumeModal(false);
                    }}
                    onBlur={() => {
                      handleVolumeChange(volume);
                      setShowVolumeModal(false);
                    }}
                  />
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Instructions Modal */}
      <Modal
        visible={showInstructionsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          handleInstructionsChange(instructions);
          setShowInstructionsModal(false);
        }}
      >
        <TouchableWithoutFeedback onPress={() => {
          handleInstructionsChange(instructions);
          setShowInstructionsModal(false);
        }}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              >
                <View style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.95)',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(135, 206, 235, 0.2)',
                }}>
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 16,
                    textAlign: 'center',
                  }}>
                    Instructions
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: 'rgba(135, 206, 235, 0.08)',
                      borderRadius: 12,
                      padding: 16,
                      color: '#F5F5DC',
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(135, 206, 235, 0.3)',
                      minHeight: 100,
                      textAlignVertical: 'top',
                    }}
                    value={instructions}
                    onChangeText={setInstructions}
                    placeholder="Enter instructions..."
                    placeholderTextColor="rgba(245, 245, 220, 0.5)"
                    multiline
                    autoFocus
                    returnKeyType="default"
                    onBlur={() => {
                      handleInstructionsChange(instructions);
                      setShowInstructionsModal(false);
                    }}
                  />
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Video URL Modal */}
      <Modal
        visible={showVideoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          handleVideoUrlChange(videoUrl);
          setShowVideoModal(false);
        }}
      >
        <TouchableWithoutFeedback onPress={() => {
          handleVideoUrlChange(videoUrl);
          setShowVideoModal(false);
        }}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              >
                <View style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.95)',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(135, 206, 235, 0.2)',
                }}>
                  <Text style={{
                    color: '#F5F5DC',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 16,
                    textAlign: 'center',
                  }}>
                    Video Link
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: 'rgba(135, 206, 235, 0.08)',
                      borderRadius: 12,
                      padding: 16,
                      color: '#F5F5DC',
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(135, 206, 235, 0.3)',
                    }}
                    value={videoUrl}
                    onChangeText={setVideoUrl}
                    placeholder="Enter video URL..."
                    placeholderTextColor="rgba(245, 245, 220, 0.5)"
                    keyboardType="url"
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      handleVideoUrlChange(videoUrl);
                      setShowVideoModal(false);
                    }}
                    onBlur={() => {
                      handleVideoUrlChange(videoUrl);
                      setShowVideoModal(false);
                    }}
                  />
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
