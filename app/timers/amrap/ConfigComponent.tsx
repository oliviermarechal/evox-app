import React, { useState, useCallback } from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import PortraitConfig from './portrait/PortraitConfig';
import LandscapeConfig from './landscape/LandscapeConfig';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface ConfigComponentProps {
  onStartCountdown: (config: AMRAPConfig) => void;
  initialMinutes?: number;
  initialSeconds?: number;
}

const generateTimeIntervals = () => {
  const intervals = [];
  
  for (let seconds = 15; seconds <= 45; seconds += 15) {
    intervals.push(`0:${seconds.toString().padStart(2, '0')}`);
  }
  
  for (let minutes = 1; minutes <= 19; minutes++) {
    for (let seconds = 0; seconds < 60; seconds += 15) {
      intervals.push(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  }
  
  intervals.push('20:00');
  
  return intervals;
};

const TIME_INTERVALS = generateTimeIntervals();

export default function ConfigComponent({ onStartCountdown, initialMinutes = 0, initialSeconds = 0 }: ConfigComponentProps) {
  const { isLandscape } = useOrientation();
  // Find initial index based on initial time, default to 10:00 if no initial values
  const getInitialIndex = useCallback(() => {
    // If no initial values provided, default to 10:00
    if (initialMinutes === 0 && initialSeconds === 0) {
      return TIME_INTERVALS.findIndex(interval => interval === '10:00');
    }
    
    const totalSeconds = initialMinutes * 60 + initialSeconds;
    const targetInterval = Math.ceil(totalSeconds / 15) * 15; // Round up to nearest 15 seconds
    
    if (targetInterval < 15) return 0; // 0:15
    if (targetInterval > 1200) return TIME_INTERVALS.length - 1; // 20:00
    
    const minutes = Math.floor(targetInterval / 60);
    const seconds = targetInterval % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    return TIME_INTERVALS.findIndex(interval => interval === timeString);
  }, [initialMinutes, initialSeconds]);

  const [selectedIndex, setSelectedIndex] = useState(getInitialIndex());

  const handleTimeChange = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleStartTimer = () => {
    const selectedTime = TIME_INTERVALS[selectedIndex];
    const [minutes, seconds] = selectedTime.split(':').map(Number);
    onStartCountdown({ minutes, seconds });
  };

  // Props communes pour les deux templates
  const commonProps = {
    onStartCountdown: handleStartTimer,
    selectedIndex,
    onTimeChange: handleTimeChange,
    timeIntervals: TIME_INTERVALS,
    initialMinutes,
    initialSeconds
  };

  // Orchestration des templates
  if (isLandscape) {
    return <LandscapeConfig {...commonProps} />;
  } else {
    return <PortraitConfig {...commonProps} />;
  }
}