import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, WorkoutBlock, Exercise } from './types';

const STORAGE_KEYS = {
  WORKOUTS: 'workouts',
  EXERCISE_TEMPLATES: 'exercise_templates',
  SETTINGS: 'app_settings',
} as const;

export interface StorageData {
  workouts: Workout[];
  exerciseTemplates: any[];
  settings: any;
}

export class WorkoutStorage {
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static async saveWorkouts(workouts: Workout[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch (error) {
      console.error('Error saving workouts:', error);
      throw new Error('Failed to save workouts');
    }
  }

  /**
   * Charger tous les workouts
   */
  static async loadWorkouts(): Promise<Workout[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
      if (!data) return [];
      
      const workouts = JSON.parse(data);
      // Convertir les dates string en objets Date
      return workouts.map((workout: any) => ({
        ...workout,
        createdAt: new Date(workout.createdAt)
      }));
    } catch (error) {
      console.error('Error loading workouts:', error);
      return [];
    }
  }

  /**
   * Créer un nouveau workout avec ID unique
   */
  static async createWorkout(workoutData: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> {
    try {
      const workouts = await this.loadWorkouts();
      
      const newWorkout: Workout = {
        ...workoutData,
        id: this.generateId(),
        createdAt: new Date(),
      };

      workouts.push(newWorkout);
      await this.saveWorkouts(workouts);
      
      return newWorkout;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw new Error('Failed to create workout');
    }
  }

  /**
   * Mettre à jour un workout existant
   */
  static async updateWorkout(workoutId: string, updates: Partial<Omit<Workout, 'id' | 'createdAt'>>): Promise<Workout | null> {
    try {
      const workouts = await this.loadWorkouts();
      const index = workouts.findIndex(w => w.id === workoutId);
      
      if (index === -1) {
        throw new Error('Workout not found');
      }

      workouts[index] = {
        ...workouts[index],
        ...updates,
        id: workoutId, // Garder l'ID original
        createdAt: workouts[index].createdAt, // Garder la date de création
      };

      await this.saveWorkouts(workouts);
      return workouts[index];
    } catch (error) {
      console.error('Error updating workout:', error);
      throw new Error('Failed to update workout');
    }
  }

  /**
   * Supprimer un workout par ID
   */
  static async deleteWorkout(workoutId: string): Promise<boolean> {
    try {
      const workouts = await this.loadWorkouts();
      const filteredWorkouts = workouts.filter(w => w.id !== workoutId);
      
      if (filteredWorkouts.length === workouts.length) {
        throw new Error('Workout not found');
      }

      await this.saveWorkouts(filteredWorkouts);
      return true;
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  }

  /**
   * Récupérer un workout par ID
   */
  static async getWorkoutById(workoutId: string): Promise<Workout | null> {
    try {
      const workouts = await this.loadWorkouts();
      const workout = workouts.find(w => w.id === workoutId);
      if (!workout) return null;
      
      // S'assurer que la date est un objet Date
      return {
        ...workout,
        createdAt: new Date(workout.createdAt)
      };
    } catch (error) {
      console.error('Error getting workout:', error);
      return null;
    }
  }

  // === BLOCKS ===

  /**
   * Ajouter un bloc à un workout
   */
  static async addBlockToWorkout(workoutId: string, block: Omit<WorkoutBlock, 'id'>): Promise<WorkoutBlock | null> {
    try {
      const workouts = await this.loadWorkouts();
      const workoutIndex = workouts.findIndex(w => w.id === workoutId);
      
      if (workoutIndex === -1) {
        throw new Error('Workout not found');
      }

      const newBlock: WorkoutBlock = {
        ...block,
        id: this.generateId(),
      };

      workouts[workoutIndex].blocks.push(newBlock);
      await this.saveWorkouts(workouts);
      
      return newBlock;
    } catch (error) {
      console.error('Error adding block:', error);
      throw new Error('Failed to add block');
    }
  }

  /**
   * Mettre à jour un bloc dans un workout
   */
  static async updateBlockInWorkout(workoutId: string, blockId: string, updates: Partial<Omit<WorkoutBlock, 'id'>>): Promise<WorkoutBlock | null> {
    try {
      const workouts = await this.loadWorkouts();
      const workoutIndex = workouts.findIndex(w => w.id === workoutId);
      
      if (workoutIndex === -1) {
        throw new Error('Workout not found');
      }

      const blockIndex = workouts[workoutIndex].blocks.findIndex(b => b.id === blockId);
      if (blockIndex === -1) {
        throw new Error('Block not found');
      }

      workouts[workoutIndex].blocks[blockIndex] = {
        ...workouts[workoutIndex].blocks[blockIndex],
        ...updates,
        id: blockId, // Garder l'ID original
      };

      await this.saveWorkouts(workouts);
      return workouts[workoutIndex].blocks[blockIndex];
    } catch (error) {
      console.error('Error updating block:', error);
      throw new Error('Failed to update block');
    }
  }

  /**
   * Supprimer un bloc d'un workout
   */
  static async deleteBlockFromWorkout(workoutId: string, blockId: string): Promise<boolean> {
    try {
      const workouts = await this.loadWorkouts();
      const workoutIndex = workouts.findIndex(w => w.id === workoutId);
      
      if (workoutIndex === -1) {
        throw new Error('Workout not found');
      }

      const initialLength = workouts[workoutIndex].blocks.length;
      workouts[workoutIndex].blocks = workouts[workoutIndex].blocks.filter(b => b.id !== blockId);
      
      if (workouts[workoutIndex].blocks.length === initialLength) {
        throw new Error('Block not found');
      }

      await this.saveWorkouts(workouts);
      return true;
    } catch (error) {
      console.error('Error deleting block:', error);
      throw new Error('Failed to delete block');
    }
  }

  // === UTILITAIRES ===

  /**
   * Vider tous les workouts (pour les tests)
   */
  static async clearAllWorkouts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.WORKOUTS);
    } catch (error) {
      console.error('Error clearing workouts:', error);
      throw new Error('Failed to clear workouts');
    }
  }

  /**
   * Obtenir les statistiques des workouts
   */
  static async getWorkoutStats(): Promise<{
    totalWorkouts: number;
    totalBlocks: number;
    totalExercises: number;
  }> {
    try {
      const workouts = await this.loadWorkouts();
      
      const totalWorkouts = workouts.length;
      const totalBlocks = workouts.reduce((sum, w) => sum + w.blocks.length, 0);
      const totalExercises = workouts.reduce((sum, w) => 
        sum + w.blocks.reduce((blockSum, b) => blockSum + b.exercises.length, 0), 0
      );

      return {
        totalWorkouts,
        totalBlocks,
        totalExercises,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { totalWorkouts: 0, totalBlocks: 0, totalExercises: 0 };
    }
  }

  /**
   * Rechercher des workouts par nom
   */
  static async searchWorkouts(query: string): Promise<Workout[]> {
    try {
      const workouts = await this.loadWorkouts();
      const lowercaseQuery = query.toLowerCase();
      
      return workouts.filter(workout => 
        workout.name.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching workouts:', error);
      return [];
    }
  }
}

// Export des types pour faciliter l'usage
export type { Workout, WorkoutBlock, Exercise };
