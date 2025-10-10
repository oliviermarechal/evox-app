import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

interface WheelPickerProps {
  items: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  itemHeight?: number;
  visibleItems?: number;
  width?: number;
  textStyle?: object;
  selectedTextStyle?: object;
}

// Styles par défaut (style EMOM)
const DEFAULT_TEXT_STYLE = {
  color: '#FFFFFF60',
  fontSize: 20,
};

const DEFAULT_SELECTED_STYLE = {
  color: '#FFFFFF',
  fontSize: 24,
  fontWeight: 'bold' as const,
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
    if (distance === 1) return 0.6;
    if (distance === 2) return 0.3;
    return 0.1;
  };

  const getItemScale = (index: number) => {
    const adjustedIndex = index - paddingItems;
    const distance = Math.abs(adjustedIndex - selectedIndex);
    
    if (distance === 0) return 1;
    if (distance === 1) return 0.9;
    return 0.8;
  };

  return (
    <View style={{ height: containerHeight, width, position: 'relative' }}>
      {/* Selection indicator */}
      <View
        style={{
          position: 'absolute',
          top: Math.floor(visibleItems / 2) * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#87CEEB40',
          backgroundColor: '#87CEEB10',
          zIndex: 1,
          pointerEvents: 'none'
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
                  {item}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}