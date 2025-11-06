import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Linking, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Exercise } from '@/lib/types';

interface ExerciseDetailModalProps {
  visible: boolean;
  exercise: Exercise | null;
  onClose: () => void;
}

export default function ExerciseDetailModal({
  visible,
  exercise,
  onClose,
}: ExerciseDetailModalProps) {
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const handleOpenVideo = async () => {
    if (!exercise?.videoUrl) return;
    
    const url = exercise.videoUrl.startsWith('http') 
      ? exercise.videoUrl 
      : `https://${exercise.videoUrl}`;
    
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  if (!exercise || !visible) return null;

  const hasDetails = exercise.instructions || exercise.videoUrl;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right', 'portrait-upside-down']}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isLandscape ? 40 : 20,
      }}>
        <View style={{
          backgroundColor: '#1A1A1A',
          borderRadius: 20,
          width: '100%',
          maxWidth: isLandscape ? 700 : 500,
          maxHeight: isLandscape ? '90%' : '80%',
          borderWidth: 1.5,
          borderColor: 'rgba(135, 206, 235, 0.3)',
          shadowColor: '#87CEEB',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isLandscape ? 16 : 20,
            paddingBottom: isLandscape ? 12 : 16,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(135, 206, 235, 0.2)',
          }}>
            <Text style={{
              color: '#F5F5DC',
              fontSize: isLandscape ? 18 : 20,
              fontWeight: '600',
              flex: 1,
            }}>
              {exercise.name}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: isLandscape ? 32 : 36,
                height: isLandscape ? 32 : 36,
                borderRadius: isLandscape ? 16 : 18,
                backgroundColor: 'rgba(135, 206, 235, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(135, 206, 235, 0.3)',
              }}
            >
              <FontAwesome name="times" size={isLandscape ? 16 : 18} color="#87CEEB" />
            </TouchableOpacity>
          </View>

          {/* Content - Layout adapté pour landscape */}
          {isLandscape ? (
            <View style={{
              flexDirection: 'row',
              padding: 16,
              gap: 16,
            }}>
              {/* Colonne gauche - Instructions */}
              {exercise.instructions && (
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: 'rgba(135, 206, 235, 0.8)',
                    fontSize: 11,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginBottom: 8,
                  }}>
                    Instructions
                  </Text>
                  <ScrollView
                    style={{ maxHeight: height * 0.5 }}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={{
                      color: '#F5F5DC',
                      fontSize: 13,
                      lineHeight: 20,
                    }}>
                      {exercise.instructions}
                    </Text>
                  </ScrollView>
                </View>
              )}

              {/* Colonne droite - Volume et Video */}
              <View style={{ flex: 1, gap: 16 }}>
                {exercise.volume && (
                  <View>
                    <Text style={{
                      color: 'rgba(135, 206, 235, 0.8)',
                      fontSize: 11,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      marginBottom: 6,
                    }}>
                      Volume
                    </Text>
                    <Text style={{
                      color: '#F5F5DC',
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                      {exercise.volume} {exercise.unit}
                    </Text>
                  </View>
                )}

                {exercise.videoUrl && (
                  <View>
                    <Text style={{
                      color: 'rgba(135, 206, 235, 0.8)',
                      fontSize: 11,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      marginBottom: 8,
                    }}>
                      Video Tutorial
                    </Text>
                    <TouchableOpacity
                      onPress={handleOpenVideo}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(135, 206, 235, 0.1)',
                        borderRadius: 10,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(135, 206, 235, 0.3)',
                      }}
                    >
                      <FontAwesome 
                        name="youtube-play" 
                        size={20} 
                        color="#FF0000" 
                        style={{ marginRight: 10 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          color: '#F5F5DC',
                          fontSize: 13,
                          fontWeight: '500',
                          marginBottom: 2,
                        }}>
                          Watch Video
                        </Text>
                        <Text style={{
                          color: 'rgba(135, 206, 235, 0.7)',
                          fontSize: 11,
                        }} numberOfLines={1}>
                          {exercise.videoUrl}
                        </Text>
                      </View>
                      <FontAwesome name="external-link" size={14} color="rgba(135, 206, 235, 0.6)" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <ScrollView
              style={{ maxHeight: 400 }}
              contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
              showsVerticalScrollIndicator={false}
            >
            {exercise.volume && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.8)',
                  fontSize: 12,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 8,
                }}>
                  Volume
                </Text>
                <Text style={{
                  color: '#F5F5DC',
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                  {exercise.volume} {exercise.unit}
                </Text>
              </View>
            )}

            {exercise.instructions && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.8)',
                  fontSize: 12,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 12,
                }}>
                  Instructions
                </Text>
                <Text style={{
                  color: '#F5F5DC',
                  fontSize: 15,
                  lineHeight: 24,
                }}>
                  {exercise.instructions}
                </Text>
              </View>
            )}

            {exercise.videoUrl && (
              <View>
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.8)',
                  fontSize: 12,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 12,
                }}>
                  Video Tutorial
                </Text>
                <TouchableOpacity
                  onPress={handleOpenVideo}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(135, 206, 235, 0.1)',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: 'rgba(135, 206, 235, 0.3)',
                  }}
                >
                  <FontAwesome 
                    name="youtube-play" 
                    size={24} 
                    color="#FF0000" 
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      color: '#F5F5DC',
                      fontSize: 15,
                      fontWeight: '500',
                      marginBottom: 4,
                    }}>
                      Watch Video
                    </Text>
                    <Text style={{
                      color: 'rgba(135, 206, 235, 0.7)',
                      fontSize: 12,
                    }} numberOfLines={1}>
                      {exercise.videoUrl}
                    </Text>
                  </View>
                  <FontAwesome name="external-link" size={16} color="rgba(135, 206, 235, 0.6)" />
                </TouchableOpacity>
              </View>
            )}

              {!hasDetails && (
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 40,
                }}>
                  <Text style={{
                    color: 'rgba(135, 206, 235, 0.5)',
                    fontSize: 14,
                    fontStyle: 'italic',
                  }}>
                    No additional details available
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

