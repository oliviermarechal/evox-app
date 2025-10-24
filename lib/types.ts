// Types pour les workouts
export interface ExerciseTemplate {
  id: string;
  name: string;
  unit: 'reps' | 'kg' | 'lbs' | 'meters' | 'seconds' | 'minutes' | 'calories';
  availableUnits?: string[]; // Unités alternatives disponibles
  category: 'strength' | 'cardio' | 'gymnastics' | 'olympic' | 'endurance';
  isCustom?: boolean; // Pour les exercices ajoutés par l'utilisateur
}

export interface Exercise {
  id: string;
  templateId: string;
  name: string;
  unit: string;
  volume?: number;
  instructions?: string;
  videoUrl?: string;
}

export interface WorkoutBlock {
  id: string;
  name: string;
  timerType: 'AMRAP' | 'EMOM' | 'ForTime' | 'Tabata';
  exercises: Exercise[];
  sets?: number; // Nombre de sets à effectuer (optionnel, surtout utile pour ForTime)
  timerConfig: {
    duration?: number; // AMRAP
    rounds?: number; // EMOM, Tabata
    intervalDuration?: number; // EMOM
    workTime?: number; // Tabata
    restTime?: number; // Tabata, ForTime (entre les sets)
    targetTime?: number; // ForTime (optionnel)
  };
}

export interface Workout {
  id: string;
  name: string;
  blocks: WorkoutBlock[];
  createdAt: Date;
}

// Mock data pour les exercices avec unités
export const MOCK_EXERCISE_TEMPLATES: ExerciseTemplate[] = [
  // Strength
  { id: '1', name: 'Bench Press', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'strength' },
  { id: '2', name: 'Deadlift', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'strength' },
  { id: '3', name: 'Back Squat', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'strength' },
  { id: '4', name: 'Overhead Press', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'strength' },
  { id: '5', name: 'Front Squat', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'strength' },
  { id: '6', name: 'Romanian Deadlift', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'strength' },
  { id: '7', name: 'Bulgarian Split Squat', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'strength' },
  { id: '8', name: 'Goblet Squat', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'strength' },
  
  // Gymnastics
  { id: '9', name: 'Strict Pull-ups', unit: 'reps', category: 'gymnastics' },
  { id: '10', name: 'HSPU', unit: 'reps', category: 'gymnastics' },
  { id: '11', name: 'Muscle-ups', unit: 'reps', category: 'gymnastics' },
  { id: '12', name: 'C2B Pull-ups', unit: 'reps', category: 'gymnastics' },
  { id: '13', name: 'TTB', unit: 'reps', category: 'gymnastics' },
  { id: '14', name: 'Push-ups', unit: 'reps', category: 'gymnastics' },
  { id: '15', name: 'Dips', unit: 'reps', category: 'gymnastics' },
  { id: '16', name: 'Handstand Walk', unit: 'meters', category: 'gymnastics' },
  { id: '17', name: 'L-sit', unit: 'seconds', category: 'gymnastics' },
  { id: '18', name: 'Plank', unit: 'seconds', category: 'gymnastics' },
  
  // Cardio
  { id: '19', name: 'Burpees', unit: 'reps', category: 'cardio' },
  { id: '20', name: 'Box Jumps', unit: 'reps', category: 'cardio' },
  { id: '21', name: 'Jumping Jacks', unit: 'reps', category: 'cardio' },
  { id: '22', name: 'Mountain Climbers', unit: 'reps', category: 'cardio' },
  { id: '23', name: 'High Knees', unit: 'reps', category: 'cardio' },
  { id: '24', name: 'Butt Kicks', unit: 'reps', category: 'cardio' },
  
  // Endurance
  { id: '25', name: 'Run', unit: 'meters', availableUnits: ['meters', 'calories'], category: 'endurance' },
  { id: '26', name: 'Row', unit: 'meters', availableUnits: ['meters', 'calories'], category: 'endurance' },
  { id: '27', name: 'Bike', unit: 'calories', availableUnits: ['calories', 'meters'], category: 'endurance' },
  { id: '28', name: 'Ski Erg', unit: 'meters', availableUnits: ['meters', 'calories'], category: 'endurance' },
  { id: '29', name: 'Assault Bike', unit: 'calories', availableUnits: ['calories', 'meters'], category: 'endurance' },
  
  // Olympic
  { id: '30', name: 'Snatch', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'olympic' },
  { id: '31', name: 'Clean & Jerk', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'olympic' },
  { id: '32', name: 'Power Clean', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'olympic' },
  { id: '33', name: 'Hang Power Clean', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'olympic' },
  { id: '34', name: 'Thrusters', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'olympic' },
  { id: '35', name: 'Wall Balls', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'olympic' },
  { id: '36', name: 'Kettlebell Swings', unit: 'kg', availableUnits: ['kg', 'lbs'], category: 'olympic' },
  { id: '37', name: 'Double Unders', unit: 'reps', category: 'olympic' },
  { id: '38', name: 'Single Unders', unit: 'reps', category: 'olympic' },
  { id: '39', name: 'Lunges', unit: 'reps', category: 'olympic' },
  { id: '40', name: 'Air Squats', unit: 'reps', category: 'olympic' },
];