import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

interface WorkoutNameModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export default function WorkoutNameModal({ visible, onClose, onConfirm }: WorkoutNameModalProps) {
  const [workoutName, setWorkoutName] = useState('');

  const getDefaultName = () => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[today.getMonth()];
    const day = today.getDate();
    return `Workout ${month} ${day}`;
  };

  const handleConfirm = () => {
    const name = workoutName.trim() || getDefaultName();
    onConfirm(name);
    setWorkoutName('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(135, 206, 235, 0.1)',
          }}>
            <Text style={{
              color: '#F5F5DC',
              fontSize: 18,
              fontWeight: 'bold',
              letterSpacing: 1,
            }}>
              New Workout
            </Text>
            
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: 'rgba(135, 206, 235, 0.1)',
                borderRadius: 20,
                padding: 8,
                borderWidth: 1,
                borderColor: 'rgba(135, 206, 235, 0.3)',
              }}
            >
              <FontAwesome name="times" size={16} color="#87CEEB" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={{ flex: 1, padding: 24 }}>
            <Text style={{
              color: '#F5F5DC',
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              What's your workout name?
            </Text>
            
            <Text style={{
              color: 'rgba(135, 206, 235, 0.7)',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 32,
              lineHeight: 22,
            }}>
              Choose a name that motivates you
            </Text>

            <TextInput
              style={{
                backgroundColor: 'rgba(135, 206, 235, 0.08)',
                borderRadius: 16,
                padding: 20,
                color: '#F5F5DC',
                fontSize: 18,
                fontWeight: '600',
                borderWidth: 1,
                borderColor: 'rgba(135, 206, 235, 0.3)',
                textAlign: 'center',
                marginBottom: 24,
              }}
              value={workoutName}
              onChangeText={setWorkoutName}
              placeholder={getDefaultName()}
              placeholderTextColor="rgba(135, 206, 235, 0.5)"
              autoFocus
              returnKeyType="done"
            />

            <Text style={{
              color: 'rgba(135, 206, 235, 0.6)',
              fontSize: 12,
              textAlign: 'center',
              marginBottom: 40,
            }}>
              Leave empty to use: {getDefaultName()}
            </Text>

            {/* Actions */}
            <View style={{ 
              flexDirection: 'row', 
              gap: 16,
              marginTop: 'auto',
            }}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  flex: 1,
                  backgroundColor: '#121212',
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 24,
                  borderWidth: 1.5,
                  borderColor: 'rgba(245, 245, 220, 0.3)',
                  alignItems: 'center',
                  marginRight: 8,
                }}
              >
                <Text style={{ 
                  color: '#F5F5DC', 
                  fontSize: 16, 
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}>
                  CANCEL
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  backgroundColor: '#121212',
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 24,
                  borderWidth: 1.5,
                  borderColor: '#87CEEB',
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                  elevation: 8,
                  alignItems: 'center',
                  marginLeft: 8,
                }}
              >
                <Text style={{ 
                  color: '#F5F5DC', 
                  fontSize: 16, 
                  fontWeight: 'bold',
                  letterSpacing: 2,
                }}>
                  CREATE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
