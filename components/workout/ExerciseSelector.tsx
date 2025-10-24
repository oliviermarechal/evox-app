import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ExerciseTemplate, MOCK_EXERCISE_TEMPLATES } from '@/lib/types';

interface ExerciseSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (template: ExerciseTemplate) => void;
}

export default function ExerciseSelector({ visible, onClose, onSelect }: ExerciseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState('');
  const [customExerciseUnit, setCustomExerciseUnit] = useState('reps');

  const categories = [
    { key: 'strength', name: 'Strength', icon: 'bolt', color: '#F44336' },
    { key: 'gymnastics', name: 'Gymnastics', icon: 'user', color: '#FF9800' },
    { key: 'cardio', name: 'Cardio', icon: 'heart', color: '#4CAF50' },
    { key: 'endurance', name: 'Endurance', icon: 'road', color: '#2196F3' },
    { key: 'olympic', name: 'Olympic', icon: 'trophy', color: '#9C27B0' },
  ];

  const availableUnits = [
    { value: 'reps', label: 'Reps' },
    { value: 'kg', label: 'Kg' },
    { value: 'lbs', label: 'Lbs' },
    { value: 'meters', label: 'Meters' },
    { value: 'calories', label: 'Calories' },
    { value: 'seconds', label: 'Seconds' },
    { value: 'minutes', label: 'Minutes' },
  ];

  const filteredExercises = useMemo(() => {
    let filtered = MOCK_EXERCISE_TEMPLATES;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(ex => ex.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleSelect = (template: ExerciseTemplate) => {
    onSelect(template);
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const handleCreateCustom = () => {
    if (customExerciseName.trim()) {
      const customTemplate: ExerciseTemplate = {
        id: `custom_${Date.now()}`,
        name: customExerciseName.trim(),
        unit: customExerciseUnit as any,
        category: 'cardio', // Default category
        isCustom: true,
      };
      onSelect(customTemplate);
      setCustomExerciseName('');
      setCustomExerciseUnit('reps');
      setShowCustomForm(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setShowCustomForm(false);
    setCustomExerciseName('');
    setCustomExerciseUnit('reps');
    onClose();
  };

  const renderExercise = ({ item }: { item: ExerciseTemplate }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      style={{
        backgroundColor: 'rgba(135, 206, 235, 0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(135, 206, 235, 0.2)',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{
          color: '#F5F5DC',
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 4,
        }}>
          {item.name}
        </Text>
        <Text style={{
          color: 'rgba(135, 206, 235, 0.7)',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}>
          {item.unit}
        </Text>
      </View>
      
      <FontAwesome name="plus" size={16} color="#87CEEB" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#0F0F10' }}>
        {/* Header */}
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
            Select Exercise
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => setShowCustomForm(!showCustomForm)}
              style={{
                backgroundColor: 'rgba(135, 206, 235, 0.1)',
                borderRadius: 20,
                padding: 8,
                borderWidth: 1,
                borderColor: 'rgba(135, 206, 235, 0.3)',
              }}
            >
              <FontAwesome name="plus" size={16} color="#87CEEB" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleClose}
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
        </View>

        {/* Custom Exercise CTA */}
        <View style={{ padding: 24, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setShowCustomForm(!showCustomForm)}
            style={{
              backgroundColor: 'rgba(18, 18, 18, 0.8)',
              borderRadius: 16,
              padding: 20,
              borderWidth: 1.5,
              borderColor: '#87CEEB',
              shadowColor: '#87CEEB',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                backgroundColor: '#87CEEB',
                borderRadius: 20,
                padding: 8,
                marginRight: 12,
              }}>
                <FontAwesome name="plus" size={16} color="#0F0F10" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: '#F5F5DC',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 4,
                }}>
                  Create Custom Exercise
                </Text>
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.7)',
                  fontSize: 12,
                }}>
                  Add your own exercise with custom name and unit
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={14} color="rgba(135, 206, 235, 0.6)" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          <View style={{
            backgroundColor: 'rgba(135, 206, 235, 0.08)',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: 'rgba(135, 206, 235, 0.3)',
          }}>
            <FontAwesome name="search" size={16} color="rgba(135, 206, 235, 0.6)" />
            <TextInput
              style={{
                flex: 1,
                padding: 16,
                color: '#F5F5DC',
                fontSize: 16,
              }}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search exercises..."
              placeholderTextColor="rgba(135, 206, 235, 0.5)"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times" size={16} color="rgba(135, 206, 235, 0.6)" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter */}
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                style={{
                  backgroundColor: selectedCategory === null ? '#87CEEB' : 'rgba(135, 206, 235, 0.1)',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: selectedCategory === null ? '#87CEEB' : 'rgba(135, 206, 235, 0.3)',
                }}
              >
                <Text style={{
                  color: selectedCategory === null ? '#0F0F10' : '#F5F5DC',
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                  ALL
                </Text>
              </TouchableOpacity>
              
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  onPress={() => setSelectedCategory(category.key)}
                  style={{
                    backgroundColor: selectedCategory === category.key ? '#87CEEB' : 'rgba(135, 206, 235, 0.1)',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: selectedCategory === category.key ? '#87CEEB' : 'rgba(135, 206, 235, 0.3)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <FontAwesome 
                    name={category.icon as any} 
                    size={12} 
                    color={selectedCategory === category.key ? '#0F0F10' : category.color} 
                  />
                  <Text style={{
                    color: selectedCategory === category.key ? '#0F0F10' : '#F5F5DC',
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Custom Exercise Form */}
        {showCustomForm && (
          <View style={{
            backgroundColor: 'rgba(18, 18, 18, 0.8)',
            margin: 24,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: 'rgba(135, 206, 235, 0.2)',
            shadowColor: '#87CEEB',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
          }}>
            <Text style={{
              color: '#F5F5DC',
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Create Custom Exercise
            </Text>
            
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.8)',
                fontSize: 14,
                marginBottom: 8,
              }}>
                Exercise Name
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
                value={customExerciseName}
                onChangeText={setCustomExerciseName}
                placeholder="Enter exercise name..."
                placeholderTextColor="rgba(135, 206, 235, 0.5)"
                autoFocus
              />
            </View>
            
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.8)',
                fontSize: 14,
                marginBottom: 8,
              }}>
                Unit
              </Text>
              <View style={{
                backgroundColor: 'rgba(135, 206, 235, 0.08)',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(135, 206, 235, 0.3)',
                padding: 4,
              }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 8, padding: 4 }}>
                    {availableUnits.map((unit) => (
                      <TouchableOpacity
                        key={unit.value}
                        onPress={() => setCustomExerciseUnit(unit.value)}
                        style={{
                          backgroundColor: customExerciseUnit === unit.value ? '#87CEEB' : 'transparent',
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderWidth: 1,
                          borderColor: customExerciseUnit === unit.value ? '#87CEEB' : 'rgba(135, 206, 235, 0.3)',
                        }}
                      >
                        <Text style={{
                          color: customExerciseUnit === unit.value ? '#0F0F10' : 'rgba(135, 206, 235, 0.8)',
                          fontSize: 12,
                          fontWeight: '500',
                        }}>
                          {unit.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowCustomForm(false)}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(135, 206, 235, 0.1)',
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(135, 206, 235, 0.3)',
                }}
              >
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.8)',
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  CANCEL
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleCreateCustom}
                disabled={!customExerciseName.trim()}
                style={{
                  flex: 1,
                  backgroundColor: customExerciseName.trim() ? '#87CEEB' : 'rgba(135, 206, 235, 0.3)',
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: customExerciseName.trim() ? '#87CEEB' : 'rgba(135, 206, 235, 0.3)',
                }}
              >
                <Text style={{
                  color: customExerciseName.trim() ? '#0F0F10' : 'rgba(135, 206, 235, 0.5)',
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  CREATE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Exercise List */}
        <FlatList
          data={filteredExercises}
          renderItem={renderExercise}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            filteredExercises.length > 0 && !searchQuery && !selectedCategory ? (
              <View style={{
                backgroundColor: 'rgba(135, 206, 235, 0.05)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: 'rgba(135, 206, 235, 0.2)',
              }}>
                <Text style={{
                  color: 'rgba(135, 206, 235, 0.8)',
                  fontSize: 12,
                  textAlign: 'center',
                  marginBottom: 8,
                }}>
                  💡 Can't find what you're looking for?
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCustomForm(true)}
                  style={{
                    backgroundColor: 'rgba(135, 206, 235, 0.1)',
                    borderRadius: 8,
                    padding: 8,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(135, 206, 235, 0.3)',
                  }}
                >
                  <Text style={{
                    color: '#87CEEB',
                    fontSize: 11,
                    fontWeight: '600',
                  }}>
                    Create Custom Exercise
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={{
              alignItems: 'center',
              paddingVertical: 40,
            }}>
              <FontAwesome name="search" size={32} color="rgba(135, 206, 235, 0.3)" />
              <Text style={{
                color: 'rgba(135, 206, 235, 0.6)',
                fontSize: 16,
                marginTop: 12,
                textAlign: 'center',
              }}>
                No exercises found
              </Text>
              <Text style={{
                color: 'rgba(135, 206, 235, 0.4)',
                fontSize: 14,
                textAlign: 'center',
                marginTop: 4,
                marginBottom: 24,
              }}>
                Try a different search term or create your own
              </Text>
              
              <TouchableOpacity
                onPress={() => setShowCustomForm(true)}
                style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.8)',
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1.5,
                  borderColor: '#87CEEB',
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                  minWidth: 200,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{
                    backgroundColor: '#87CEEB',
                    borderRadius: 16,
                    padding: 6,
                    marginRight: 10,
                  }}>
                    <FontAwesome name="plus" size={14} color="#0F0F10" />
                  </View>
                  <View>
                    <Text style={{
                      color: '#F5F5DC',
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginBottom: 2,
                    }}>
                      Create Custom Exercise
                    </Text>
                    <Text style={{
                      color: 'rgba(135, 206, 235, 0.7)',
                      fontSize: 10,
                    }}>
                      Add your own exercise
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </Modal>
  );
}
