import React from 'react';
import { WorkoutBlock } from '@/lib/types';
import { getTimerConfigForBlock } from '@/utils/workoutUtils';
import AMRAPTimer from '@/app/timers/amrap/TimerComponent';
import EMOMTimer from '@/app/timers/emom/TimerComponent';
import ForTimeTimer from '@/app/timers/fortime/TimerComponent';
import FreeTimer from '@/app/timers/free/TimerComponent';
import TabataTimer from '@/app/timers/tabata/TimerComponent';
import WorkoutAMRAPTimer from './WorkoutAMRAPTimer';
import WorkoutEMOMTimer from './WorkoutEMOMTimer';
import WorkoutForTimeTimer from './WorkoutForTimeTimer';
import WorkoutTabataTimer from './WorkoutTabataTimer';
import WorkoutFreeTimer from './WorkoutFreeTimer';

interface TimerRendererProps {
  block: WorkoutBlock;
  isLandscape: boolean;
  onResetTimer: () => void;
  skipFinalScreen?: boolean;
  isWorkout?: boolean;
  blockIndex?: number;
}

export default function TimerRenderer({
  block,
  isLandscape,
  onResetTimer,
  skipFinalScreen = false,
  isWorkout = false,
  blockIndex = 0,
}: TimerRendererProps) {
  const config = getTimerConfigForBlock(block);

  // Router vers workout ou standalone
  if (isWorkout) {
    switch (block.timerType) {
      case 'AMRAP':
        if (config && 'minutes' in config && 'seconds' in config) {
          return (
            <WorkoutAMRAPTimer 
              config={config as { minutes: number; seconds: number }} 
              block={block}
              blockIndex={blockIndex}
              onResetTimer={onResetTimer}
              skipFinalScreen={skipFinalScreen}
            />
          );
        }
        return null;

      case 'EMOM':
        if (config && 'rounds' in config && 'duration' in config) {
          return (
            <WorkoutEMOMTimer 
              config={config as { rounds: number; duration: number }} 
              block={block}
              blockIndex={blockIndex}
              onResetTimer={onResetTimer}
              skipFinalScreen={skipFinalScreen}
            />
          );
        }
        return null;

      case 'ForTime':
        if (!config) {
          return (
            <WorkoutFreeTimer 
              block={block}
              blockIndex={blockIndex}
              onResetTimer={onResetTimer}
              skipFinalScreen={skipFinalScreen}
            />
          );
        }
        if ('minutes' in config && 'seconds' in config) {
          return (
            <WorkoutForTimeTimer 
              config={config as { minutes: number; seconds: number }} 
              block={block}
              blockIndex={blockIndex}
              onResetTimer={onResetTimer}
              skipFinalScreen={skipFinalScreen}
            />
          );
        }
        return null;

      case 'Tabata':
        if (config && 'rounds' in config && 'workTime' in config && 'restTime' in config) {
          return (
            <WorkoutTabataTimer 
              config={config as { rounds: number; workTime: number; restTime: number }} 
              block={block}
              blockIndex={blockIndex}
              isLandscape={isLandscape}
              onResetTimer={onResetTimer}
              skipFinalScreen={skipFinalScreen}
            />
          );
        }
        return null;

      default:
        return null;
    }
  } else {
    // Standalone (existant)
    const commonProps = {
      onResetTimer,
      skipFinalScreen,
    };

    switch (block.timerType) {
      case 'AMRAP':
        if (config && 'minutes' in config && 'seconds' in config) {
          return <AMRAPTimer config={config as { minutes: number; seconds: number }} {...commonProps} />;
        }
        return null;

      case 'EMOM':
        if (config && 'rounds' in config && 'duration' in config) {
          return <EMOMTimer config={config as { rounds: number; duration: number }} {...commonProps} />;
        }
        return null;

      case 'ForTime':
        if (!config) {
          return <FreeTimer {...commonProps} />;
        }
        if ('minutes' in config && 'seconds' in config) {
          return <ForTimeTimer config={config as { minutes: number; seconds: number }} {...commonProps} />;
        }
        return null;

      case 'Tabata':
        if (config && 'rounds' in config && 'workTime' in config && 'restTime' in config) {
          return <TabataTimer config={config as { rounds: number; workTime: number; restTime: number }} isLandscape={isLandscape} {...commonProps} />;
        }
        return null;

      default:
        return null;
    }
  }
}

