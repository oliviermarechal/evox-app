import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, DimensionValue } from 'react-native';
import * as Haptics from 'expo-haptics';

interface WheelPickerItem {
  value: string | number;
  label: string;
}

interface WheelPickerProps {
  items: string[] | WheelPickerItem[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  itemHeight?: number;
  visibleItems?: number;
  width?: DimensionValue;
  textStyle?: object;
  selectedTextStyle?: object;
}

const DEFAULT_TEXT_STYLE = {
  color: 'rgba(135, 206, 235, 0.6)',
  fontSize: 18,
  fontWeight: '400' as const,
  fontFamily: 'monospace',
  letterSpacing: 1,
};

const DEFAULT_SELECTED_STYLE = {
  color: '#F5F5DC',
  fontSize: 28,
  fontWeight: '300' as const,
  fontFamily: 'monospace',
  letterSpacing: 2,
  textShadowColor: 'rgba(135, 206, 235, 0.4)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 15,
};

export default function WheelPicker({
  items,
  selectedIndex,
  onIndexChange,
  itemHeight = 40,
  visibleItems = 5,
  width = 100,
  textStyle = DEFAULT_TEXT_STYLE,
  selectedTextStyle = DEFAULT_SELECTED_STYLE
}: WheelPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastSelectedIndex = useRef(selectedIndex);
  const isUpdatingFromProps = useRef(false);
  
  const containerHeight = itemHeight * visibleItems;
  const paddingItems = Math.floor(visibleItems / 2);
  
  // Helper function to get display text
  const getItemText = (item: string | WheelPickerItem) => {
    return typeof item === 'string' ? item : item.label;
  };
  
  // Add padding items at the beginning and end
  const paddedItems = [
    ...Array(paddingItems).fill(''),
    ...items,
    ...Array(paddingItems).fill('')
  ];

  useEffect(() => {
    if (!isScrolling && scrollViewRef.current && !isUpdatingFromProps.current) {
      isUpdatingFromProps.current = true;
      scrollViewRef.current.scrollTo({
        y: selectedIndex * itemHeight,
        animated: true
      });
      lastSelectedIndex.current = selectedIndex;
      setTimeout(() => {
        isUpdatingFromProps.current = false;
      }, 100);
    }
  }, [selectedIndex, itemHeight, isScrolling]);

  const handleScroll = (event: any) => {
    if (!isScrolling || isUpdatingFromProps.current) return; // Only update during active scrolling
    
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    
    if (index >= 0 && index < items.length && index !== lastSelectedIndex.current) {
      lastSelectedIndex.current = index;
      // Vibration légère à chaque changement d'item
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onIndexChange(index);
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    
    // Snap to the nearest item
    if (index >= 0 && index < items.length && index !== lastSelectedIndex.current) {
      lastSelectedIndex.current = index;
      onIndexChange(index);
    }
    
    // Use a small delay to ensure smooth snap
    setTimeout(() => {
      if (scrollViewRef.current && !isUpdatingFromProps.current) {
        isUpdatingFromProps.current = true;
        scrollViewRef.current.scrollTo({
          y: index * itemHeight,
          animated: true
        });
        setTimeout(() => {
          isUpdatingFromProps.current = false;
        }, 100);
      }
    }, 10);
    
    setIsScrolling(false);
  };

  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = () => {
    // Don't set isScrolling to false here, let momentum handle it
  };

  const getItemOpacity = (index: number) => {
    const adjustedIndex = index - paddingItems;
    const distance = Math.abs(adjustedIndex - selectedIndex);
    
    if (distance === 0) return 1;
    if (distance === 1) return 0.7;
    if (distance === 2) return 0.4;
    return 0.2;
  };

  const getItemScale = (index: number) => {
    const adjustedIndex = index - paddingItems;
    const distance = Math.abs(adjustedIndex - selectedIndex);
    
    if (distance === 0) return 1;
    if (distance === 1) return 0.88;
    return 0.75;
  };

  return (
    <View style={{ height: containerHeight, width, position: 'relative' }}>
      {/* Selection indicator - Design ultra premium */}
      <View
        style={{
          position: 'absolute',
          top: Math.floor(visibleItems / 2) * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
          borderTopWidth: 1.5,
          borderBottomWidth: 1.5,
          borderColor: 'rgba(135, 206, 235, 0.4)',
          backgroundColor: 'rgba(135, 206, 235, 0.08)',
          zIndex: 1,
          pointerEvents: 'none',
          borderRadius: 12,
          marginHorizontal: 12,
          shadowColor: '#87CEEB',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 4
        }}
      />
      
      {/* Gradient overlay pour effet premium */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: 'none',
          borderRadius: 12,
          marginHorizontal: 12,
          backgroundColor: 'transparent',
          shadowColor: '#87CEEB',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 30,
          elevation: 1
        }}
      />
      
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        decelerationRate={0.98}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: 0 }}
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={false}
        scrollsToTop={false}
        removeClippedSubviews={false}
      >
        {paddedItems.map((item, index) => {
          const adjustedIndex = index - paddingItems;
          const isSelected = adjustedIndex === selectedIndex;
          const isEmpty = item === '';
          
          return (
            <View
              key={index}
              style={{
                height: itemHeight,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isEmpty ? 0 : getItemOpacity(index),
                transform: [{ scale: isEmpty ? 1 : getItemScale(index) }]
              }}
            >
              {!isEmpty && (
                <Text
                  style={{
                    ...textStyle,
                    ...(isSelected ? selectedTextStyle : {})
                  }}
                >
                  {getItemText(item)}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}