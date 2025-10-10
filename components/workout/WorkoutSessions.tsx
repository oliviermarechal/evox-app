import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { WorkoutSession } from '@/lib/workoutTypes';

interface WorkoutSessionsProps {
  sessions: WorkoutSession[];
  onStartSession: (session: WorkoutSession) => void;
  onEditSession: (session: WorkoutSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onCreateNew: () => void;
}

export default function WorkoutSessions({
  sessions,
  onStartSession,
  onEditSession,
  onDeleteSession,
  onCreateNew
}: WorkoutSessionsProps) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this workout session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteSession(sessionId)
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#87CEEB';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      <View style={{ padding: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: '#FFD700', fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Workout Sessions
          </Text>
          <Text style={{ color: '#87CEEB', fontSize: 16, textAlign: 'center' }}>
            Build and manage your training sessions
          </Text>
        </View>

        {/* Create New Button */}
        <TouchableOpacity
          onPress={onCreateNew}
          style={{
            backgroundColor: '#FFD700',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#FFD700',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6
          }}
        >
          <FontAwesome name="plus" size={20} color="#000000" style={{ marginRight: 12 }} />
          <Text style={{ color: '#000000', fontSize: 18, fontWeight: 'bold' }}>
            CREATE NEW SESSION
          </Text>
        </TouchableOpacity>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <View style={{
            backgroundColor: '#000000',
            borderRadius: 16,
            padding: 32,
            borderWidth: 2,
            borderColor: '#87CEEB40',
            alignItems: 'center'
          }}>
            <FontAwesome name="list" size={48} color="#87CEEB" style={{ marginBottom: 16 }} />
            <Text style={{ color: '#F4F4F4', fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              No Sessions Yet
            </Text>
            <Text style={{ color: '#F4F4F470', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
              Create your first workout session to get started with structured training
            </Text>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {sessions.map((session) => (
              <View
                key={session.id}
                style={{
                  backgroundColor: '#000000',
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 2,
                  borderColor: selectedSession === session.id ? '#FFD700' : '#87CEEB40',
                  shadowColor: selectedSession === session.id ? '#FFD700' : '#87CEEB',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: selectedSession === session.id ? 0.3 : 0.1,
                  shadowRadius: 8,
                  elevation: selectedSession === session.id ? 6 : 2
                }}
              >
                {/* Session Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#FFD700', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
                      {session.name}
                    </Text>
                    {session.description && (
                      <Text style={{ color: '#F4F4F470', fontSize: 14, marginBottom: 8 }}>
                        {session.description}
                      </Text>
                    )}
                  </View>
                  
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => setSelectedSession(selectedSession === session.id ? null : session.id)}
                      style={{
                        backgroundColor: selectedSession === session.id ? '#87CEEB' : '#87CEEB20',
                        borderRadius: 8,
                        padding: 8
                      }}
                    >
                      <FontAwesome 
                        name={selectedSession === session.id ? 'chevron-up' : 'chevron-down'} 
                        size={16} 
                        color={selectedSession === session.id ? '#000000' : '#87CEEB'} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Session Info */}
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome name="clock-o" size={14} color="#87CEEB" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#87CEEB', fontSize: 14, fontWeight: 'bold' }}>
                      {formatDuration(session.estimatedDuration)}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: getDifficultyColor(session.difficulty),
                      marginRight: 6
                    }} />
                    <Text style={{ color: '#F4F4F4', fontSize: 14, textTransform: 'capitalize' }}>
                      {session.difficulty}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome name="list" size={14} color="#87CEEB" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#87CEEB', fontSize: 14, fontWeight: 'bold' }}>
                      {session.steps.length} steps
                    </Text>
                  </View>
                </View>

                {/* Expanded Details */}
                {selectedSession === session.id && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: '#87CEEB', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                      Workout Steps:
                    </Text>
                    <View style={{ gap: 8 }}>
                      {session.steps.map((step, index) => (
                        <View
                          key={step.id}
                          style={{
                            backgroundColor: step.type === 'timer' ? '#FFD70020' : step.type === 'rest' ? '#F4F4F420' : '#87CEEB20',
                            borderRadius: 8,
                            padding: 12,
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          <Text style={{ 
                            color: step.type === 'timer' ? '#FFD700' : step.type === 'rest' ? '#F4F4F4' : '#87CEEB',
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginRight: 12,
                            minWidth: 20
                          }}>
                            {index + 1}.
                          </Text>
                          <View style={{ flex: 1 }}>
                            <Text style={{ 
                              color: step.type === 'timer' ? '#FFD700' : step.type === 'rest' ? '#F4F4F4' : '#87CEEB',
                              fontSize: 14,
                              fontWeight: 'bold'
                            }}>
                              {step.name}
                            </Text>
                            {step.description && (
                              <Text style={{ color: '#F4F4F470', fontSize: 12, marginTop: 2 }}>
                                {step.description}
                              </Text>
                            )}
                          </View>
                          {step.type === 'timer' && step.timerConfig && (
                            <Text style={{ color: '#FFD700', fontSize: 12, fontWeight: 'bold' }}>
                              {step.timerConfig.minutes || 0}:{(step.timerConfig.seconds || 0).toString().padStart(2, '0')}
                            </Text>
                          )}
                          {step.type === 'rest' && step.duration && (
                            <Text style={{ color: '#F4F4F4', fontSize: 12, fontWeight: 'bold' }}>
                              {Math.floor(step.duration / 60)}:{(step.duration % 60).toString().padStart(2, '0')}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Actions */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => onStartSession(session)}
                    style={{
                      flex: 1,
                      backgroundColor: '#FFD700',
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center'
                    }}
                  >
                    <FontAwesome name="play" size={16} color="#000000" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#000000', fontSize: 16, fontWeight: 'bold' }}>
                      START
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => onEditSession(session)}
                    style={{
                      backgroundColor: '#87CEEB',
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      minWidth: 60
                    }}
                  >
                    <FontAwesome name="edit" size={16} color="#000000" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleDeleteSession(session.id)}
                    style={{
                      backgroundColor: '#FF6B6B',
                      borderRadius: 12,
                      padding: 12,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      minWidth: 60
                    }}
                  >
                    <FontAwesome name="trash" size={16} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
