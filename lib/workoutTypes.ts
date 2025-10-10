export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'skill';
  equipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkoutStep {
  id: string;
  type: 'exercise' | 'timer' | 'rest';
  name: string;
  description?: string;
  duration?: number; // en secondes
  timerType?: 'stopwatch' | 'fortime' | 'emom' | 'amrap' | 'tabata';
  timerConfig?: {
    minutes?: number;
    seconds?: number;
    rounds?: number;
    workTime?: number;
    restTime?: number;
  };
  order: number;
}

export interface WorkoutSession {
  id: string;
  name: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // en minutes
  steps: WorkoutStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutExecution {
  id: string;
  sessionId: string;
  startedAt: Date;
  completedAt?: Date;
  currentStepIndex: number;
  isRunning: boolean;
  isPaused: boolean;
  stepStartTime?: Date;
  stepTimes: { [stepId: string]: number }; // temps en secondes pour chaque étape
}
