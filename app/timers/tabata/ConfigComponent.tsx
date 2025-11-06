import React, { useState } from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import PortraitConfig from './portrait/PortraitConfig';
import LandscapeConfig from './landscape/LandscapeConfig';

interface TabataConfig {
  rounds: number;
  workTime: number;
  restTime: number;
}

interface ConfigComponentProps {
  onStartCountdown: (config: TabataConfig) => void;
  initialRounds?: number;
  initialWorkTime?: number;
  initialRestTime?: number;
}

// Generate rounded/probable time intervals for Tabata (10s to 10min)
const generateTabataTimeIntervals = () => {
  const intervals = [];
  
  // Seconds: 10, 15, 20, 30, 45
  intervals.push({ value: 10, label: '10s' });
  intervals.push({ value: 15, label: '15s' });
  intervals.push({ value: 20, label: '20s' });
  intervals.push({ value: 30, label: '30s' });
  intervals.push({ value: 45, label: '45s' });
  
  // Minutes: 1, 1:30, 2, 2:30, 3, 3:30, 4, 4:30, 5, 5:30, 6, 6:30, 7, 7:30, 8, 8:30, 9, 9:30, 10
  intervals.push({ value: 60, label: '1 min' });
  intervals.push({ value: 90, label: '1:30' });
  intervals.push({ value: 120, label: '2 min' });
  intervals.push({ value: 150, label: '2:30' });
  intervals.push({ value: 180, label: '3 min' });
  intervals.push({ value: 210, label: '3:30' });
  intervals.push({ value: 240, label: '4 min' });
  intervals.push({ value: 270, label: '4:30' });
  intervals.push({ value: 300, label: '5 min' });
  intervals.push({ value: 330, label: '5:30' });
  intervals.push({ value: 360, label: '6 min' });
  intervals.push({ value: 390, label: '6:30' });
  intervals.push({ value: 420, label: '7 min' });
  intervals.push({ value: 450, label: '7:30' });
  intervals.push({ value: 480, label: '8 min' });
  intervals.push({ value: 510, label: '8:30' });
  intervals.push({ value: 540, label: '9 min' });
  intervals.push({ value: 570, label: '9:30' });
  intervals.push({ value: 600, label: '10 min' });
  
  return intervals;
};

const TABATA_TIME_INTERVALS = generateTabataTimeIntervals();

const getInitialTimeIndex = (initialTime?: number, defaultSeconds: number = 60) => {
  if (!initialTime) {
    const defaultIndex = TABATA_TIME_INTERVALS.findIndex(interval => interval.value === defaultSeconds);
    return defaultIndex >= 0 ? defaultIndex : 5; // Default to 1 min (index 5)
  }
  const index = TABATA_TIME_INTERVALS.findIndex(interval => interval.value === initialTime);
  return index >= 0 ? index : 5; // Default to 1 min if not found
};

export default function ConfigComponent({
  onStartCountdown,
  initialRounds = 8,
  initialWorkTime = 60,
  initialRestTime = 60,
}: ConfigComponentProps) {
  const { isLandscape } = useOrientation();
  const [rounds, setRounds] = useState(initialRounds);
  const [workTimeIndex, setWorkTimeIndex] = useState(getInitialTimeIndex(initialWorkTime, 60));
  const [restTimeIndex, setRestTimeIndex] = useState(getInitialTimeIndex(initialRestTime, 60));
  
  const workTime = TABATA_TIME_INTERVALS[workTimeIndex].value;
  const restTime = TABATA_TIME_INTERVALS[restTimeIndex].value;

  const handleStartCountdown = () => {
    onStartCountdown({
      rounds,
      workTime: TABATA_TIME_INTERVALS[workTimeIndex].value,
      restTime: TABATA_TIME_INTERVALS[restTimeIndex].value,
    });
  };

  const config = {
    rounds,
    workTime: TABATA_TIME_INTERVALS[workTimeIndex].value,
    restTime: TABATA_TIME_INTERVALS[restTimeIndex].value,
  };

  return isLandscape ? (
    <LandscapeConfig
      config={config}
      onRoundsChange={setRounds}
      workTimeIndex={workTimeIndex}
      restTimeIndex={restTimeIndex}
      onWorkTimeIndexChange={setWorkTimeIndex}
      onRestTimeIndexChange={setRestTimeIndex}
      timeIntervals={TABATA_TIME_INTERVALS}
      onStartCountdown={handleStartCountdown}
    />
  ) : (
    <PortraitConfig
      config={config}
      onRoundsChange={setRounds}
      workTimeIndex={workTimeIndex}
      restTimeIndex={restTimeIndex}
      onWorkTimeIndexChange={setWorkTimeIndex}
      onRestTimeIndexChange={setRestTimeIndex}
      timeIntervals={TABATA_TIME_INTERVALS}
      onStartCountdown={handleStartCountdown}
    />
  );
}