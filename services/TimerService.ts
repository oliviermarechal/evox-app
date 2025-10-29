export interface TimerConfig {
  duration: number; // en secondes
  onTick?: (remainingTime: number) => void;
  onComplete?: () => void;
}

export interface TimerState {
  remainingTime: number; // en secondes
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
  isCompleted: boolean;
}

export class CountdownTimerService {
  private config: TimerConfig;
  private state: TimerState;
  private listeners: Set<(state: TimerState) => void> = new Set();
  
  // Timestamps pour la synchronisation (en millisecondes)
  private startTime: number = 0;
  private pauseTime: number = 0;
  private totalPausedDuration: number = 0;
  private targetEndTime: number = 0;
  
  // Références pour les timers
  private intervalId: any = null;
  
  constructor(config: TimerConfig) {
    this.config = config;
    this.state = {
      remainingTime: config.duration,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
    };
  }
  
  private updateRemainingTime() {
    const now = Date.now();
    const remainingMs = Math.max(0, this.targetEndTime - now);
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    
    this.state.remainingTime = remainingSeconds;
    
    if (remainingMs <= 0 && this.state.isRunning) {
      this.complete();
    }
  }
  
  private startInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      this.updateRemainingTime();
      this.notifyListeners();
      
      if (this.config.onTick) {
        this.config.onTick(this.state.remainingTime);
      }
    }, 1000); // Mise à jour toutes les secondes
  }
  
  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }
  
  private complete() {
    this.state.isRunning = false;
    this.state.isCompleted = true;
    this.state.remainingTime = 0;
    
    this.stopInterval();
    
    if (this.config.onComplete) {
      this.config.onComplete();
    }
    
    this.notifyListeners();
  }
  
  public start() {
    if (this.state.isCompleted) {
      return;
    }
    
    if (!this.state.hasStarted) {
      this.startTime = Date.now();
      this.targetEndTime = this.startTime + (this.config.duration * 1000);
      this.state.hasStarted = true;
    } else if (this.state.isPaused) {
      // Just add to total paused duration - no need to adjust targetEndTime
      const pauseDuration = Date.now() - this.pauseTime;
      this.totalPausedDuration += pauseDuration;
    }
    
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.pauseTime = 0;
    
    this.startInterval();
    this.notifyListeners();
  }
  
  public pause() {
    if (!this.state.isRunning) {
      return;
    }
    
    this.state.isRunning = false;
    this.state.isPaused = true;
    this.pauseTime = Date.now();
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public reset() {
    this.state = {
      remainingTime: this.config.duration,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
    };
    
    this.startTime = 0;
    this.pauseTime = 0;
    this.totalPausedDuration = 0;
    this.targetEndTime = 0;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public getState(): TimerState {
    return { ...this.state };
  }
  
  public subscribe(listener: (state: TimerState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  public destroy() {
    this.stopInterval();
    this.listeners.clear();
  }
}

export interface TabataConfig {
  rounds: number;
  workTime: number; // en secondes
  restTime: number; // en secondes
}

export interface TabataTimerState {
  remainingTime: number; // en secondes
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
  isCompleted: boolean;
  currentRound: number;
  isWorkPhase: boolean;
}

export class TabataTimerService {
  private config: TabataConfig;
  private state: TabataTimerState;
  private listeners: Set<(state: TabataTimerState) => void> = new Set();
  
  // Timestamps pour la synchronisation (en millisecondes)
  private startTime: number = 0;
  private pauseTime: number = 0;
  private totalPausedDuration: number = 0;
  private phaseStartTime: number = 0;
  private phaseDuration: number = 0;
  
  // Références pour les timers
  private intervalId: any = null;
  
  constructor(config: TabataConfig) {
    this.config = config;
    this.state = {
      remainingTime: config.workTime,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
      currentRound: 1,
      isWorkPhase: true,
    };
    
    this.phaseDuration = config.workTime * 1000;
  }
  
  private updateRemainingTime() {
    const now = Date.now();
    const elapsedInPhase = now - this.phaseStartTime - this.totalPausedDuration;
    const remainingMs = Math.max(0, this.phaseDuration - elapsedInPhase);
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    
    this.state.remainingTime = remainingSeconds;
    
    if (remainingMs <= 0 && this.state.isRunning) {
      this.handlePhaseComplete();
    }
  }
  
  private handlePhaseComplete() {
    const now = Date.now();
    
    if (this.state.isWorkPhase) {
      // Work phase completed, switch to rest
      this.state.isWorkPhase = false;
      this.state.remainingTime = this.config.restTime;
      this.phaseDuration = this.config.restTime * 1000;
      this.phaseStartTime = now;
      this.totalPausedDuration = 0;
    } else {
      // Rest phase completed, switch to next round or finish
      const nextRound = this.state.currentRound + 1;
      
      if (nextRound > this.config.rounds) {
        // All rounds completed
        this.complete();
        return; // Exit early to avoid double notification
      } else {
        // Start next round (work phase)
        this.state.currentRound = nextRound;
        this.state.isWorkPhase = true;
        this.state.remainingTime = this.config.workTime;
        this.phaseDuration = this.config.workTime * 1000;
        this.phaseStartTime = now;
        this.totalPausedDuration = 0;
      }
    }
    
    this.notifyListeners();
  }
  
  private startInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      this.updateRemainingTime();
      this.notifyListeners();
    }, 1000); // Mise à jour toutes les secondes
  }
  
  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }
  
  private complete() {
    this.state.isRunning = false;
    this.state.isCompleted = true;
    this.state.remainingTime = 0;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public start() {
    if (this.state.isCompleted) {
      return;
    }
    
    if (!this.state.hasStarted) {
      this.startTime = Date.now();
      this.phaseStartTime = this.startTime;
      this.state.hasStarted = true;
    } else if (this.state.isPaused) {
      // Just add to total paused duration - no need to adjust phaseStartTime
      const pauseDuration = Date.now() - this.pauseTime;
      this.totalPausedDuration += pauseDuration;
    }
    
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.pauseTime = 0;
    
    this.startInterval();
    this.notifyListeners();
  }
  
  public pause() {
    if (!this.state.isRunning) {
      return;
    }
    
    this.state.isRunning = false;
    this.state.isPaused = true;
    this.pauseTime = Date.now();
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public reset() {
    this.state = {
      remainingTime: this.config.workTime,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
      currentRound: 1,
      isWorkPhase: true,
    };
    
    this.startTime = 0;
    this.pauseTime = 0;
    this.totalPausedDuration = 0;
    this.phaseStartTime = 0;
    this.phaseDuration = this.config.workTime * 1000;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public getState(): TabataTimerState {
    return { ...this.state };
  }
  
  public getInternalState() {
    return {
      startTime: this.startTime,
      totalPausedDuration: this.totalPausedDuration,
      hasStarted: this.state.hasStarted,
      phaseStartTime: this.phaseStartTime,
      phaseDuration: this.phaseDuration,
    };
  }
  
  public subscribe(listener: (state: TabataTimerState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  public destroy() {
    this.stopInterval();
    this.listeners.clear();
  }
}

export class IncrementTimerService {
  private config: { onTick?: (elapsedTime: number) => void };
  private state: {
    elapsedTime: number; // en secondes
    isRunning: boolean;
    isPaused: boolean;
    hasStarted: boolean;
  };
  private listeners: Set<(state: any) => void> = new Set();
  
  // Timestamps pour la synchronisation (en millisecondes)
  private startTime: number = 0;
  private pauseTime: number = 0;
  private totalPausedDuration: number = 0;
  
  // Références pour les timers
  private intervalId: any = null;
  
  constructor(config: { onTick?: (elapsedTime: number) => void }) {
    this.config = config;
    this.state = {
      elapsedTime: 0,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
    };
  }
  
  private updateElapsedTime() {
    if (!this.state.isRunning) return;
    
    const now = Date.now();
    const elapsedMs = now - this.startTime - this.totalPausedDuration;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    
    this.state.elapsedTime = Math.max(0, elapsedSeconds);
    
    if (this.config.onTick) {
      this.config.onTick(this.state.elapsedTime);
    }
    
    this.notifyListeners();
  }
  
  private startInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      this.updateElapsedTime();
    }, 1000); // Mise à jour toutes les secondes
  }
  
  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }
  
  public start() {
    if (!this.state.hasStarted) {
      this.startTime = Date.now();
      this.state.hasStarted = true;
    } else if (this.state.isPaused) {
      const pauseDuration = Date.now() - this.pauseTime;
      this.totalPausedDuration += pauseDuration;
    }
    
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.pauseTime = 0;
    
    this.startInterval();
    this.notifyListeners();
  }
  
  public pause() {
    if (!this.state.isRunning) {
      return;
    }
    
    this.state.isRunning = false;
    this.state.isPaused = true;
    this.pauseTime = Date.now();
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public reset() {
    this.state = {
      elapsedTime: 0,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
    };
    
    this.startTime = 0;
    this.pauseTime = 0;
    this.totalPausedDuration = 0;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public getState() {
    return { ...this.state };
  }
  
  public getInternalState() {
    return {
      startTime: this.startTime,
      totalPausedDuration: this.totalPausedDuration,
      hasStarted: this.state.hasStarted,
    };
  }
  
  public subscribe(listener: (state: any) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  public destroy() {
    this.stopInterval();
    this.listeners.clear();
  }
}

export interface EMOMConfig {
  rounds: number;
  duration: number; // en secondes
}

export interface EMOMTimerState {
  remainingTime: number; // en secondes
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
  isCompleted: boolean;
  currentRound: number;
}

export class EMOMTimerService {
  private config: EMOMConfig;
  private state: EMOMTimerState;
  private listeners: Set<(state: EMOMTimerState) => void> = new Set();
  
  // Timestamps pour la synchronisation (en millisecondes)
  private startTime: number = 0; // début total de l'EMOM
  private pauseTime: number = 0;
  private totalPausedDuration: number = 0;
  private totalDurationMs: number = 0; // rounds * duration (ms)
  private roundDurationMs: number = 0;
  
  // Références pour les timers
  private intervalId: any = null;
  
  constructor(config: EMOMConfig) {
    this.config = config;
    this.state = {
      remainingTime: config.rounds * config.duration,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
      currentRound: 1,
    };
    this.roundDurationMs = config.duration * 1000;
    this.totalDurationMs = config.rounds * this.roundDurationMs;
  }
  
  private updateRemainingTime() {
    const now = Date.now();
    const elapsedTotalMs = Math.max(0, now - this.startTime - this.totalPausedDuration);
    const remainingMs = Math.max(0, this.totalDurationMs - elapsedTotalMs);
    const remainingSeconds = Math.ceil(remainingMs / 1000);

    // Mettre à jour le temps restant total
    this.state.remainingTime = remainingSeconds;

    // Calculer le round courant à partir de l'écoulé
    const roundsElapsed = Math.floor(elapsedTotalMs / this.roundDurationMs);
    const currentRound = Math.min(this.config.rounds, roundsElapsed + 1);
    this.state.currentRound = currentRound;

    if (remainingMs <= 0 && this.state.isRunning) {
      this.complete();
    }
  }
  
  private startInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      this.updateRemainingTime();
      this.notifyListeners();
    }, 1000); // Mise à jour toutes les secondes
  }
  
  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }
  
  private complete() {
    this.state.isRunning = false;
    this.state.isCompleted = true;
    this.state.remainingTime = 0;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public start() {
    if (this.state.isCompleted) {
      return;
    }
    
    if (!this.state.hasStarted) {
      this.startTime = Date.now();
      this.state.hasStarted = true;
    } else if (this.state.isPaused) {
      // Juste ajouter la durée de pause au total
      const pauseDuration = Date.now() - this.pauseTime;
      this.totalPausedDuration += pauseDuration;
    }
    
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.pauseTime = 0;
    
    this.startInterval();
    this.notifyListeners();
  }
  
  public pause() {
    if (!this.state.isRunning) {
      return;
    }
    
    this.state.isRunning = false;
    this.state.isPaused = true;
    this.pauseTime = Date.now();
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public reset() {
    this.state = {
      remainingTime: this.config.rounds * this.config.duration,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
      currentRound: 1,
    };
    
    this.startTime = 0;
    this.pauseTime = 0;
    this.totalPausedDuration = 0;
    this.roundDurationMs = this.config.duration * 1000;
    this.totalDurationMs = this.config.rounds * this.roundDurationMs;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public getState(): EMOMTimerState {
    return { ...this.state };
  }
  
  public getInternalState() {
    return {
      startTime: this.startTime,
      totalPausedDuration: this.totalPausedDuration,
      hasStarted: this.state.hasStarted,
      roundDurationMs: this.roundDurationMs,
      totalDurationMs: this.totalDurationMs,
      rounds: this.config.rounds,
    };
  }
  
  public subscribe(listener: (state: EMOMTimerState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  public destroy() {
    this.stopInterval();
    this.listeners.clear();
  }
}

export interface AMRAPConfig {
  minutes: number;
  seconds: number;
}

export interface AMRAPTimerState {
  remainingTime: number; // en secondes
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
  isCompleted: boolean;
  currentRound: number;
}

export class AMRAPTimerService {
  private config: AMRAPConfig;
  private state: AMRAPTimerState;
  private listeners: Set<(state: AMRAPTimerState) => void> = new Set();
  
  // Timestamps pour la synchronisation (en millisecondes)
  private startTime: number = 0;
  private pauseTime: number = 0;
  private totalPausedDuration: number = 0;
  private targetEndTime: number = 0;
  
  // Références pour les timers
  private intervalId: any = null;
  
  constructor(config: AMRAPConfig) {
    this.config = config;
    const totalDuration = config.minutes * 60 + config.seconds;
    this.state = {
      remainingTime: totalDuration,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
      currentRound: 1,
    };
  }
  
  private updateRemainingTime() {
    const now = Date.now();
    const remainingMs = Math.max(0, this.targetEndTime - now);
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    
    this.state.remainingTime = remainingSeconds;
    
    if (remainingMs <= 0 && this.state.isRunning) {
      this.complete();
    }
  }
  
  private startInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      this.updateRemainingTime();
      this.notifyListeners();
    }, 1000); // Mise à jour toutes les secondes
  }
  
  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }
  
  private complete() {
    this.state.isRunning = false;
    this.state.isCompleted = true;
    this.state.remainingTime = 0;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public start() {
    if (this.state.isCompleted) {
      return;
    }
    
    if (!this.state.hasStarted) {
      this.startTime = Date.now();
      const totalDuration = this.config.minutes * 60 + this.config.seconds;
      this.targetEndTime = this.startTime + (totalDuration * 1000);
      this.state.hasStarted = true;
    } else if (this.state.isPaused) {
      const pauseDuration = Date.now() - this.pauseTime;
      this.totalPausedDuration += pauseDuration;
      this.targetEndTime += pauseDuration;
    }
    
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.pauseTime = 0;
    
    this.startInterval();
    this.notifyListeners();
  }
  
  public pause() {
    if (!this.state.isRunning) {
      return;
    }
    
    this.state.isRunning = false;
    this.state.isPaused = true;
    this.pauseTime = Date.now();
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public reset() {
    const totalDuration = this.config.minutes * 60 + this.config.seconds;
    this.state = {
      remainingTime: totalDuration,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
      currentRound: 1,
    };
    
    this.startTime = 0;
    this.pauseTime = 0;
    this.totalPausedDuration = 0;
    this.targetEndTime = 0;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public incrementRound() {
    this.state.currentRound += 1;
    this.notifyListeners();
  }
  
  public getState(): AMRAPTimerState {
    return { ...this.state };
  }
  
  public getInternalState() {
    return {
      startTime: this.startTime,
      totalPausedDuration: this.totalPausedDuration,
      hasStarted: this.state.hasStarted,
      targetEndTime: this.targetEndTime,
    };
  }
  
  public subscribe(listener: (state: AMRAPTimerState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  public destroy() {
    this.stopInterval();
    this.listeners.clear();
  }
}

export interface ForTimeConfig {
  minutes: number;
  seconds: number;
}

export interface ForTimeTimerState {
  remainingTime: number; // en secondes
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
  isCompleted: boolean;
  currentRound: number;
}

export class ForTimeTimerService {
  private config: ForTimeConfig;
  private state: ForTimeTimerState;
  private listeners: Set<(state: ForTimeTimerState) => void> = new Set();
  
  // Timestamps pour la synchronisation (en millisecondes)
  private startTime: number = 0;
  private pauseTime: number = 0;
  private totalPausedDuration: number = 0;
  private targetEndTime: number = 0;
  
  // Références pour les timers
  private intervalId: any = null;
  
  constructor(config: ForTimeConfig) {
    this.config = config;
    const totalDuration = config.minutes * 60 + config.seconds;
    this.state = {
      remainingTime: totalDuration,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
      currentRound: 0,
    };
  }
  
  private updateRemainingTime() {
    const now = Date.now();
    const remainingMs = Math.max(0, this.targetEndTime - now);
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    
    this.state.remainingTime = remainingSeconds;
    
    if (remainingMs <= 0 && this.state.isRunning) {
      this.complete();
    }
  }
  
  private startInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      this.updateRemainingTime();
      this.notifyListeners();
    }, 1000); // Mise à jour toutes les secondes
  }
  
  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }
  
  private complete() {
    this.state.isRunning = false;
    this.state.isCompleted = true;
    this.state.remainingTime = 0;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public start() {
    if (this.state.isCompleted) {
      return;
    }
    
    if (!this.state.hasStarted) {
      this.startTime = Date.now();
      const totalDuration = this.config.minutes * 60 + this.config.seconds;
      this.targetEndTime = this.startTime + (totalDuration * 1000);
      this.state.hasStarted = true;
    } else if (this.state.isPaused) {
      const pauseDuration = Date.now() - this.pauseTime;
      this.totalPausedDuration += pauseDuration;
      this.targetEndTime += pauseDuration;
    }
    
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.pauseTime = 0;
    
    this.startInterval();
    this.notifyListeners();
  }
  
  public pause() {
    if (!this.state.isRunning) {
      return;
    }
    
    this.state.isRunning = false;
    this.state.isPaused = true;
    this.pauseTime = Date.now();
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public reset() {
    const totalDuration = this.config.minutes * 60 + this.config.seconds;
    this.state = {
      remainingTime: totalDuration,
      isRunning: false,
      isPaused: false,
      hasStarted: false,
      isCompleted: false,
      currentRound: 0,
    };
    
    this.startTime = 0;
    this.pauseTime = 0;
    this.totalPausedDuration = 0;
    this.targetEndTime = 0;
    
    this.stopInterval();
    this.notifyListeners();
  }
  
  public incrementRound() {
    this.state.currentRound += 1;
    this.notifyListeners();
  }
  
  public getState(): ForTimeTimerState {
    return { ...this.state };
  }
  
  public getInternalState() {
    return {
      startTime: this.startTime,
      totalPausedDuration: this.totalPausedDuration,
      hasStarted: this.state.hasStarted,
      targetEndTime: this.targetEndTime,
    };
  }
  
  public subscribe(listener: (state: ForTimeTimerState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  public destroy() {
    this.stopInterval();
    this.listeners.clear();
  }
}