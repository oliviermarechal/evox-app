import React from 'react';
import { WorkoutBlock } from '@/lib/types';
import { getTimerConfigForBlock } from '@/utils/workoutUtils';
import AMRAPTimer from '@/app/timers/amrap/TimerComponent';
import EMOMTimer from '@/app/timers/emom/TimerComponent';
import ForTimeTimer from '@/app/timers/fortime/TimerComponent';
import FreeTimer from '@/app/timers/free/TimerComponent';
import TabataTimer from '@/app/timers/tabata/TimerComponent';

interface TimerRendererProps {
  block: WorkoutBlock;
  isLandscape: boolean;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
}

export default function TimerRenderer({
  block,
  isLandscape,
  onResetTimer,
  skipFinalScreen = false,
}: TimerRendererProps) {
  const commonProps = {
    onResetTimer,
    skipFinalScreen,
  };

  const config = getTimerConfigForBlock(block);

  switch (block.timerType) {
    case 'AMRAP':
      if (config && 'minutes' in config) {
        return <AMRAPTimer config={config} {...commonProps} />;
      }
      return null;

    case 'EMOM':
      if (config && 'rounds' in config && 'duration' in config) {
        return <EMOMTimer config={config} {...commonProps} />;
      }
      return null;

    case 'ForTime':
      if (!config) {
        // Free timer mode
        return <FreeTimer {...commonProps} />;
      }
      if ('minutes' in config) {
        return <ForTimeTimer config={config} {...commonProps} />;
      }
      return null;

    case 'Tabata':
      if (config && 'rounds' in config && 'workTime' in config) {
        return <TabataTimer config={config} isLandscape={isLandscape} {...commonProps} />;
      }
      return null;

    default:
      return null;
  }
}

