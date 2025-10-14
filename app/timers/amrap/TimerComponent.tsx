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
  // Props communes pour les deux templates
  const commonProps = {
    config,
    onResetTimer
  };

  // Orchestration des templates
  if (isLandscape) {
    return <LandscapeTimer {...commonProps} />;
  } else {
    return <PortraitTimer {...commonProps} />;
  }
}
