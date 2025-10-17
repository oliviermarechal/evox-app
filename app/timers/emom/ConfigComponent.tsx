import React, { useState, useCallback } from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import PortraitConfig from './portrait/PortraitConfig';
import LandscapeConfig from './landscape/LandscapeConfig';

interface EMOMConfig {
  rounds: number;
  duration: number;
}

interface ConfigComponentProps {
  onStartCountdown: (config: EMOMConfig) => void;
  initialRounds?: number;
  initialDuration?: number;
}

const generateTimeIntervals = () => {
  const intervals = [];
  
  intervals.push({ value: 10, label: '10s' });
  intervals.push({ value: 20, label: '20s' });
  intervals.push({ value: 30, label: '30s' });
  intervals.push({ value: 40, label: '40s' });
  intervals.push({ value: 45, label: '45s' });
  intervals.push({ value: 60, label: '1 min' });
  
  for (let seconds = 75; seconds <= 900; seconds += 15) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (remainingSeconds === 0) {
      intervals.push({ value: seconds, label: `${minutes} min` });
    } else {
      intervals.push({ value: seconds, label: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` });
    }
  }
  
  return intervals;
};

const TIME_INTERVALS = generateTimeIntervals();

const generateRoundIntervals = () => {
  const intervals = [];
  for (let i = 1; i <= 50; i++) {
    intervals.push({
      value: i,
      label: `${i}`,
    });
  }
  return intervals;
};

const ROUND_INTERVALS = generateRoundIntervals();

const getInitialTimeIndex = (initialDuration?: number) => {
  if (!initialDuration) return 4;
  const index = TIME_INTERVALS.findIndex(interval => interval.value === initialDuration);
  return index >= 0 ? index : 4;
};

const getInitialRoundIndex = (initialRounds?: number) => {
  if (!initialRounds) return 9;
  const index = ROUND_INTERVALS.findIndex(interval => interval.value === initialRounds);
  return index >= 0 ? index : 9;
};

export default function ConfigComponent({ 
  onStartCountdown, 
  initialRounds = 10,
  initialDuration = 5 
}: ConfigComponentProps) {
  const { isLandscape } = useOrientation();
  
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(getInitialTimeIndex(initialDuration));
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(getInitialRoundIndex(initialRounds));

  const handleStartWorkout = useCallback(() => {
    const config: EMOMConfig = {
      rounds: ROUND_INTERVALS[selectedRoundIndex].value as number,
      duration: TIME_INTERVALS[selectedTimeIndex].value as number, // seconds
    };
    onStartCountdown(config);
  }, [selectedTimeIndex, selectedRoundIndex, onStartCountdown]);

  const config = {
    rounds: ROUND_INTERVALS[selectedRoundIndex].value as number,
    duration: TIME_INTERVALS[selectedTimeIndex].value as number,
  };

  if (isLandscape) {
    return (
      <LandscapeConfig
        selectedTimeIndex={selectedTimeIndex}
        selectedRoundIndex={selectedRoundIndex}
        onTimeIndexChange={setSelectedTimeIndex}
        onRoundIndexChange={setSelectedRoundIndex}
        onStartWorkout={handleStartWorkout}
        config={config}
        timeIntervals={TIME_INTERVALS}
        roundIntervals={ROUND_INTERVALS}
      />
    );
  }

  return (
    <PortraitConfig
      selectedTimeIndex={selectedTimeIndex}
      selectedRoundIndex={selectedRoundIndex}
      onTimeIndexChange={setSelectedTimeIndex}
      onRoundIndexChange={setSelectedRoundIndex}
      onStartWorkout={handleStartWorkout}
      config={config}
      timeIntervals={TIME_INTERVALS}
      roundIntervals={ROUND_INTERVALS}
    />
  );
}