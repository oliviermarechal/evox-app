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

export default function ConfigComponent({
  onStartCountdown,
  initialRounds = 8,
  initialWorkTime = 20,
  initialRestTime = 10,
}: ConfigComponentProps) {
  const { isLandscape } = useOrientation();
  const [rounds, setRounds] = useState(initialRounds);
  const [workTime, setWorkTime] = useState(initialWorkTime);
  const [restTime, setRestTime] = useState(initialRestTime);

  const handleStartCountdown = () => {
    onStartCountdown({
      rounds,
      workTime,
      restTime,
    });
  };

  const config = {
    rounds,
    workTime,
    restTime,
  };

  return isLandscape ? (
    <LandscapeConfig
      config={config}
      onRoundsChange={setRounds}
      onWorkTimeChange={setWorkTime}
      onRestTimeChange={setRestTime}
      onStartCountdown={handleStartCountdown}
    />
  ) : (
    <PortraitConfig
      config={config}
      onRoundsChange={setRounds}
      onWorkTimeChange={setWorkTime}
      onRestTimeChange={setRestTime}
      onStartCountdown={handleStartCountdown}
    />
  );
}