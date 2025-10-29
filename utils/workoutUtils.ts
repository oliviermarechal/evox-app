import { WorkoutBlock } from '@/lib/types';

/**
 * Convertit la configuration d'un bloc en format timer config pour le countdown screen
 */
export function getTimerConfig(block: WorkoutBlock): { minutes: number; seconds: number } | undefined {
  switch (block.timerType) {
    case 'AMRAP':
      const duration = block.timerConfig.duration!;
      return {
        minutes: Math.floor(duration / 60),
        seconds: duration % 60,
      };
    case 'EMOM':
      const intervalDuration = block.timerConfig.intervalDuration!;
      return {
        minutes: Math.floor(intervalDuration / 60),
        seconds: intervalDuration % 60,
      };
    case 'ForTime':
      if (block.timerConfig.targetTime) {
        const targetTime = block.timerConfig.targetTime;
        return {
          minutes: Math.floor(targetTime / 60),
          seconds: targetTime % 60,
        };
      }
      return undefined; // Free timer, pas de config
    case 'Tabata':
      const workTime = block.timerConfig.workTime!;
      return {
        minutes: Math.floor(workTime / 60),
        seconds: workTime % 60,
      };
    default:
      return undefined;
  }
}

/**
 * Génère un résumé textuel d'un bloc pour l'affichage
 */
export function getBlockSummary(block: WorkoutBlock): { timerInfo: string } {
  let timerInfo = '';
  switch (block.timerType) {
    case 'AMRAP':
      const amrapMinutes = Math.floor(block.timerConfig.duration! / 60);
      timerInfo = `${amrapMinutes}min • As Many Rounds As Possible`;
      break;
    case 'EMOM':
      timerInfo = `${block.timerConfig.rounds} rounds × ${block.timerConfig.intervalDuration}s • Every Minute On the Minute`;
      break;
    case 'ForTime':
      const setsText = block.sets ? `${block.sets} sets` : 'Unlimited sets';
      const restText = (block.sets && block.sets > 0 && block.timerConfig.restTime) ? ` • ${block.timerConfig.restTime}s rest` : '';
      const targetText = block.timerConfig.targetTime ? ` • Target: ${block.timerConfig.targetTime}s` : '';
      timerInfo = `${setsText}${restText}${targetText} • As fast as possible`;
      break;
    case 'Tabata':
      timerInfo = `${block.timerConfig.rounds} rounds × ${block.timerConfig.workTime}s/${block.timerConfig.restTime}s • High Intensity Interval`;
      break;
  }

  return { timerInfo };
}

/**
 * Convertit un bloc en configuration timer pour les différents types
 */
export function getTimerConfigForBlock(block: WorkoutBlock) {
  switch (block.timerType) {
    case 'AMRAP':
      const duration = block.timerConfig.duration!;
      return {
        minutes: Math.floor(duration / 60),
        seconds: duration % 60,
      };
    case 'EMOM':
      return {
        rounds: block.timerConfig.rounds!,
        duration: block.timerConfig.intervalDuration!,
      };
    case 'ForTime':
      if (!block.timerConfig.targetTime) {
        return null; // Free timer
      }
      const targetTime = block.timerConfig.targetTime;
      return {
        minutes: Math.floor(targetTime / 60),
        seconds: targetTime % 60,
      };
    case 'Tabata':
      return {
        rounds: block.timerConfig.rounds!,
        workTime: block.timerConfig.workTime!,
        restTime: block.timerConfig.restTime!,
      };
    default:
      return null;
  }
}

