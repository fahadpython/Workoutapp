
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Triceps' | 'Biceps' | 'Abs' | 'Warmup';

export interface PacerPhase {
  action: string; // Display text: "Lower", "Press", "Pull"
  duration: number; // Seconds
  voiceCue: string; // TTS text
  breathing: 'Inhale' | 'Exhale' | 'Hold';
  startColor?: string; // Optional color override
}

export interface PacerConfig {
  phases: PacerPhase[];
  startDelay: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g., "8-10"
  restSeconds: number;
  cues: string; // The "Trainer Cues"
  muscleFocus: string; // Display text like "Upper Chest"
  targetGroup: MuscleGroup; // For analytics aggregation
  feeling: string; // "How it should feel"
  isWarmup?: boolean;
  pacer: PacerConfig; // New bio-mechanic pacer
}

export interface WorkoutDay {
  id: string;
  name: string; // e.g., "Push (Chest/Shoulders/Tri)"
  focus: string;
  exercises: Exercise[];
}

export interface SetLog {
  weight: number;
  reps: number;
  completed: boolean;
  timestamp: number;
  isDropSet?: boolean; // New: Tracks intensity techniques
}

export interface ActiveTimer {
  startTime: number;
  duration: number; // Total duration in seconds
  endTime: number; // Timestamp when it ends
  exerciseId: string;
}

export interface SessionData {
  workoutId: string;
  startTime: number;
  // exerciseId -> array of completed sets
  completedExercises: Record<string, SetLog[]>; 
  // We no longer strictly enforce index, but we track the 'viewed' exercise
  activeExerciseId: string | null; 
  activeTimer: ActiveTimer | null;
  isFinished: boolean;
}

export interface UserStats {
  bodyWeight: number;
  waterIntake: number; // in ml
  creatineTaken: boolean; // Daily toggle state
  creatineHistory: string[]; // Array of ISO dates (YYYY-MM-DD) for historical tracking
  lastUpdated: string; // ISO date string YYYY-MM-DD
}

export interface HistoryLog {
  date: string; // ISO date
  weight: number;
  reps: number;
  setNumber: number;
}

export interface ExerciseHistory {
  logs: HistoryLog[];
  lastSession?: {
    date: string;
    topSet: { weight: number; reps: number };
  };
}

export interface DashboardStats {
  weeklyVolume: Record<MuscleGroup, number>; // Sets per muscle this week
  missedMuscles: MuscleGroup[];
  personalRecords: Record<string, { weight: number; exerciseName: string; date: string }>;
  bestLift: { weight: number; exerciseName: string } | null;
}

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
