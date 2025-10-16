import React from 'react';
import { useOrientation } from '@/hooks/useOrientation';
import PortraitTimer from './portrait/PortraitTimer';
import LandscapeTimer from './landscape/LandscapeTimer';

interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

interface TimerComponentProps {
  config: AMRAPConfig;
  onResetTimer: () => void;
}

export default function TimerComponent({ config, onResetTimer }: TimerComponentProps) {
  const { isLandscape } = useOrientation();
  const commonProps = {
    config,
    onResetTimer
  };

  if (isLandscape) {
    return <LandscapeTimer {...commonProps} />;
  } else {
    return <PortraitTimer {...commonProps} />;
  }
}
