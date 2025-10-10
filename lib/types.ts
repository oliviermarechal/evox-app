// Types pour l'app EVOX (mode local pour l'instant)

export interface Workout {
  id: string;
  title: string;
  type: 'AMRAP' | 'EMOM' | 'For Time' | 'Tabata' | 'Rounds';
  description: string;
  video_url?: string;
  duration?: number; // en minutes
  rounds?: number;
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  workout_id: string;
  score: string;
  time_taken?: number; // en secondes
  notes?: string;
  completed_at: string;
}

export interface PR {
  id: string;
  exercise: string;
  value: number;
  unit: 'lbs' | 'kg' | 'time' | 'reps';
  date: string;
  notes?: string;
}

export interface Timer {
  type: 'countdown' | 'stopwatch' | 'emom' | 'tabata';
  duration: number;
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number;
}