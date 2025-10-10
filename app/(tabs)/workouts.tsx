import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import WorkoutSessions from '@/components/workout/WorkoutSessions';
import WorkoutBuilder from '@/components/workout/WorkoutBuilder';
import { WorkoutSession } from '@/lib/workoutTypes';

export default function WorkoutsScreen() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingSession, setEditingSession] = useState<WorkoutSession | null>(null);

  const handleSaveSession = (session: WorkoutSession) => {
    if (editingSession) {
      // Update existing session
      setSessions(sessions.map(s => s.id === session.id ? session : s));
      setEditingSession(null);
    } else {
      // Add new session
      setSessions([...sessions, session]);
    }
    setShowBuilder(false);
  };

  const handleEditSession = (session: WorkoutSession) => {
    setEditingSession(session);
    setShowBuilder(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  const handleStartSession = (session: WorkoutSession) => {
    // Navigate to session execution
    router.push(`/workout-execution?sessionId=${session.id}` as any);
  };

  const handleCreateNew = () => {
    setEditingSession(null);
    setShowBuilder(true);
  };

  const handleCancelBuilder = () => {
    setShowBuilder(false);
    setEditingSession(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 24, 
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#87CEEB20'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="list" size={24} color="#FFD700" style={{ marginRight: 12 }} />
          <Text style={{ color: '#FFD700', fontSize: 24, fontWeight: 'bold', letterSpacing: 1 }}>
            WORKOUTS
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={handleCreateNew}
          style={{
            backgroundColor: '#87CEEB',
            borderRadius: 12,
            padding: 12,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FontAwesome name="plus" size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <WorkoutSessions
        sessions={sessions}
        onStartSession={handleStartSession}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        onCreateNew={handleCreateNew}
      />

      {/* Builder Modal */}
      <Modal
        visible={showBuilder}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F10' }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingHorizontal: 24, 
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#87CEEB20'
          }}>
            <Text style={{ color: '#FFD700', fontSize: 20, fontWeight: 'bold' }}>
              {editingSession ? 'Edit Session' : 'Create Session'}
            </Text>
            <TouchableOpacity
              onPress={handleCancelBuilder}
              style={{
                backgroundColor: '#000000',
                borderRadius: 8,
                padding: 8,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FontAwesome name="times" size={16} color="#87CEEB" />
            </TouchableOpacity>
          </View>
          
          <WorkoutBuilder
            onSaveSession={handleSaveSession}
            onCancel={handleCancelBuilder}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}