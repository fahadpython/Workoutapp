
import { WorkoutDay, Exercise, PacerConfig } from './types';

// --- PACER TEMPLATES ---

const PACER_PUSH: PacerConfig = {
  startDelay: 3,
  phases: [
    { action: 'LOWER', duration: 3, voiceCue: 'Control Down', breathing: 'Inhale' },
    { action: 'STRETCH', duration: 1, voiceCue: 'Stretch', breathing: 'Hold' },
    { action: 'PRESS', duration: 1, voiceCue: 'Explode Up', breathing: 'Exhale' }
  ]
};

const PACER_PULL: PacerConfig = {
  startDelay: 3,
  phases: [
    { action: 'PULL', duration: 1, voiceCue: 'Pull Hard', breathing: 'Exhale' },
    { action: 'SQUEEZE', duration: 1, voiceCue: 'Squeeze', breathing: 'Hold' },
    { action: 'RELEASE', duration: 3, voiceCue: 'Slow Release', breathing: 'Inhale' }
  ]
};

const PACER_ISO_HOLD: PacerConfig = {
  startDelay: 3,
  phases: [
    { action: 'CONTRACT', duration: 1, voiceCue: 'Contract', breathing: 'Exhale' },
    { action: 'HOLD', duration: 2, voiceCue: 'Hold it', breathing: 'Hold' },
    { action: 'RETURN', duration: 2, voiceCue: 'Control', breathing: 'Inhale' }
  ]
};

const PACER_FAST: PacerConfig = {
  startDelay: 2,
  phases: [
    { action: 'GO', duration: 1, voiceCue: 'Rep', breathing: 'Exhale' },
    { action: 'RESET', duration: 1, voiceCue: '', breathing: 'Inhale' }
  ]
};

const PACER_STOPWATCH: PacerConfig = {
  startDelay: 0,
  phases: [] // Special case for stopwatch logic
};

// --- DATA ---
// MET Estimates: Warmup=3, Iso=3.5-4, Compound=6, Legs=8, Cardio=8+

const WARMUP_EXERCISES: Exercise[] = [
  { id: 'wu_1', name: 'Arm Circles', type: 'weighted', sets: 1, reps: '20 fwd/back', restSeconds: 0, cues: 'Big circles to loosen up shoulders.', muscleFocus: 'Shoulders', targetGroup: 'Warmup', feeling: 'Warmth in shoulder joints', isWarmup: true, pacer: PACER_FAST, metValue: 3.0, muscleSplit: { 'Shoulders': 100 }, motionType: 'raise' },
  { id: 'wu_2', name: 'Band Pull-Aparts', type: 'weighted', sets: 2, reps: '15', restSeconds: 30, cues: 'Squeeze shoulder blades together. Do not shrug.', muscleFocus: 'Rear Delts', targetGroup: 'Warmup', feeling: 'Burn in upper back', isWarmup: true, pacer: PACER_ISO_HOLD, metValue: 3.0, muscleSplit: { 'Rear Delts': 70, 'Mid Back': 30 }, motionType: 'fly' },
  { id: 'wu_3', name: 'Cat-Cow Stretch', type: 'weighted', sets: 1, reps: '10', restSeconds: 0, cues: 'Move spine through full range of motion.', muscleFocus: 'Spine', targetGroup: 'Warmup', feeling: 'Loosening of the back', isWarmup: true, pacer: PACER_FAST, metValue: 2.5, muscleSplit: { 'Spine': 100 }, motionType: 'hold' },
  { id: 'wu_4', name: 'Bodyweight RDLs', type: 'weighted', sets: 1, reps: '15', restSeconds: 0, cues: 'Hinge hip back. Wake up hamstrings.', muscleFocus: 'Hamstrings', targetGroup: 'Warmup', feeling: 'Stretch in back of legs', isWarmup: true, pacer: PACER_FAST, metValue: 3.0, muscleSplit: { 'Hamstrings': 80, 'Glutes': 20 }, motionType: 'hinge' },
  { id: 'wu_5', name: 'Wrist Rotations', type: 'weighted', sets: 1, reps: '30 sec', restSeconds: 0, cues: 'Roll wrists in both directions.', muscleFocus: 'Wrists', targetGroup: 'Warmup', feeling: 'Lubricated joints', isWarmup: true, pacer: PACER_FAST, metValue: 2.0, muscleSplit: { 'Forearms': 100 }, motionType: 'curl' },
];

export const PUSH_DAY: WorkoutDay = {
  id: 'push',
  name: 'PUSH: Chest, Shoulders, Triceps',
  focus: 'Upper Chest & Side Delts (The "V" Look)',
  exercises: [
    ...WARMUP_EXERCISES,
    { id: 'p_1', name: 'Incline Dumbbell Press', type: 'weighted', sets: 3, reps: '8-10', restSeconds: 180, cues: 'Set bench to 15-30°. Pause for 1 sec at bottom. Do not lock out at top.', muscleFocus: 'Upper Chest', targetGroup: 'Chest', feeling: 'Deep stretch across upper pecs at bottom.', pacer: PACER_PUSH, metValue: 6.0, muscleSplit: { 'Upper Chest': 60, 'Front Delts': 25, 'Triceps': 15 }, motionType: 'press' },
    { id: 'p_2', name: 'Flat Dumbbell Press', type: 'weighted', sets: 3, reps: '10-12', restSeconds: 120, cues: 'Tuck elbows slightly (arrow shape). Stop weights 1 inch before touching at top.', muscleFocus: 'Mid Chest', targetGroup: 'Chest', feeling: 'Constant tension, no resting at top.', pacer: PACER_PUSH, metValue: 6.0, muscleSplit: { 'Mid Chest': 70, 'Front Delts': 15, 'Triceps': 15 }, motionType: 'press' },
    { id: 'p_3', name: 'Cable Lateral Raises', type: 'weighted', sets: 4, reps: '12-15', restSeconds: 120, cues: 'Set cable at wrist height. Lean away. Drag weight out to walls.', muscleFocus: 'Side Delts', targetGroup: 'Shoulders', feeling: 'Deep burn on the side cap of shoulder.', pacer: PACER_ISO_HOLD, metValue: 4.0, muscleSplit: { 'Side Delts': 90, 'Traps': 10 }, motionType: 'raise' },
    { id: 'p_4', name: 'Overhead Tricep Ext.', type: 'weighted', sets: 4, reps: '10-12', restSeconds: 120, cues: 'Elbows pointing up/forward. Feel deep stretch behind head.', muscleFocus: 'Long Head Triceps', targetGroup: 'Triceps', feeling: 'Tearing sensation (good kind) in tricep.', pacer: { ...PACER_PUSH, phases: [{ action: 'LOWER', duration: 3, voiceCue: 'Deep Stretch', breathing: 'Inhale' }, { action: 'EXTEND', duration: 1, voiceCue: 'Drive', breathing: 'Exhale' }] }, metValue: 4.0, muscleSplit: { 'Long Head Triceps': 90, 'Core': 10 }, motionType: 'press' },
    { id: 'p_5', name: 'Chest Fly (Partials)', type: 'weighted', sets: 3, reps: '15+', restSeconds: 90, cues: 'Hack: Only do bottom half. Stretch deep, pull halfway up, return.', muscleFocus: 'Chest Stretch', targetGroup: 'Chest', feeling: 'Intense stretch overload.', pacer: { ...PACER_PUSH, phases: [{ action: 'OPEN', duration: 3, voiceCue: 'Open Wide', breathing: 'Inhale' }, { action: 'HALF UP', duration: 1, voiceCue: 'Half Way', breathing: 'Exhale' }] }, metValue: 4.5, muscleSplit: { 'Chest (Stretch)': 90, 'Front Delts': 10 }, motionType: 'fly' },
  ]
};

export const PULL_DAY: WorkoutDay = {
  id: 'pull',
  name: 'PULL: Back, Rear Delts, Biceps',
  focus: 'Wide Lats & Thickness',
  exercises: [
    ...WARMUP_EXERCISES,
    { id: 'pl_1', name: 'Lat Pulldowns', type: 'weighted', sets: 3, reps: '10-12', restSeconds: 180, cues: 'Thumbless grip. Shoulders rise to ears at top. Drive elbows to pockets.', muscleFocus: 'Lats', targetGroup: 'Back', feeling: 'Wings opening up.', pacer: PACER_PULL, metValue: 6.0, muscleSplit: { 'Lats': 60, 'Biceps': 20, 'Rear Delts': 10, 'Forearms': 10 }, motionType: 'pull' },
    { id: 'pl_2', name: 'Chest-Supported Row', type: 'weighted', sets: 3, reps: '10-12', restSeconds: 120, cues: 'Use machine or incline bench. Squeeze blades together hard at top.', muscleFocus: 'Upper Back', targetGroup: 'Back', feeling: 'Pinching a pencil between shoulder blades.', pacer: PACER_PULL, metValue: 6.0, muscleSplit: { 'Mid Back': 50, 'Lats': 30, 'Biceps': 10, 'Rear Delts': 10 }, motionType: 'pull' },
    { id: 'pl_3', name: 'Face Pulls', type: 'weighted', sets: 4, reps: '15-20', restSeconds: 120, cues: 'Pull rope to forehead. Pull it apart. Essential for 3D look.', muscleFocus: 'Rear Delts', targetGroup: 'Shoulders', feeling: 'Burn in back of shoulders.', pacer: PACER_ISO_HOLD, metValue: 4.5, muscleSplit: { 'Rear Delts': 60, 'Rotator Cuff': 30, 'Traps': 10 }, motionType: 'pull' },
    { id: 'pl_4', name: 'Incline DB Curls', type: 'weighted', sets: 4, reps: '10-12', restSeconds: 120, cues: 'Sit back. Let arms hang. Keep elbows behind ribs. No swinging.', muscleFocus: 'Biceps (Long Head)', targetGroup: 'Biceps', feeling: 'Stretch in bicep near shoulder.', pacer: { ...PACER_PULL, phases: [{ action: 'CURL', duration: 1, voiceCue: 'Curl Up', breathing: 'Exhale' }, { action: 'LOWER', duration: 3, voiceCue: 'Slow Down', breathing: 'Inhale' }] }, metValue: 4.0, muscleSplit: { 'Biceps (Long Head)': 100 }, motionType: 'curl' },
    { id: 'pl_5', name: 'Hammer Curls', type: 'weighted', sets: 3, reps: '10-12', restSeconds: 90, cues: 'Curl towards opposite chest. Squeeze dumbbell hard.', muscleFocus: 'Brachialis/Forearm', targetGroup: 'Biceps', feeling: 'Thick muscle on side of arm working.', pacer: PACER_PULL, metValue: 4.0, muscleSplit: { 'Brachialis': 60, 'Biceps': 30, 'Forearms': 10 }, motionType: 'curl' },
  ]
};

export const LEGS_DAY: WorkoutDay = {
  id: 'legs',
  name: 'LEGS (Knee-Safe) + ABS',
  focus: 'Hamstrings, Glutes, Calves & Core',
  exercises: [
    ...WARMUP_EXERCISES,
    { id: 'l_1', name: 'Romanian Deadlift (RDL)', type: 'weighted', sets: 4, reps: '10-12', restSeconds: 180, cues: 'Knees soft but locked. Push hips back to close door. Stop when hips stop.', muscleFocus: 'Hamstrings/Glutes', targetGroup: 'Legs', feeling: 'Intense stretch in hamstrings. No lower back pain.', pacer: { ...PACER_PUSH, phases: [{ action: 'HINGE', duration: 3, voiceCue: 'Hips Back', breathing: 'Inhale' }, { action: 'DRIVE', duration: 1, voiceCue: 'Hips Forward', breathing: 'Exhale' }] }, metValue: 8.0, muscleSplit: { 'Hamstrings': 60, 'Glutes': 30, 'Erectors': 10 }, motionType: 'hinge' },
    { id: 'l_2', name: 'Glute Bridge', type: 'weighted', sets: 4, reps: '12-15', restSeconds: 120, cues: 'Drive hips up. Squeeze butt for 2 sec at top. Do not arch back.', muscleFocus: 'Glutes', targetGroup: 'Legs', feeling: 'Butt cramping (good kind).', pacer: PACER_ISO_HOLD, metValue: 6.5, muscleSplit: { 'Glutes': 80, 'Hamstrings': 20 }, motionType: 'hinge' },
    { id: 'l_3', name: 'Seated Calf Raise', type: 'weighted', sets: 4, reps: '15-20', restSeconds: 90, cues: 'Pause at the bottom stretch for 2 seconds every rep.', muscleFocus: 'Calves', targetGroup: 'Legs', feeling: 'Fire in lower legs.', pacer: { ...PACER_ISO_HOLD, phases: [{ action: 'RAISE', duration: 1, voiceCue: 'Up', breathing: 'Exhale' }, { action: 'HOLD', duration: 1, voiceCue: 'Hold', breathing: 'Hold' }, { action: 'LOWER', duration: 2, voiceCue: 'Down', breathing: 'Inhale' }, { action: 'STRETCH', duration: 2, voiceCue: 'Stretch', breathing: 'Hold' }] }, metValue: 4.0, muscleSplit: { 'Calves': 100 }, motionType: 'raise' },
    { id: 'l_4', name: 'Dead Bugs', type: 'weighted', sets: 3, reps: '15', restSeconds: 60, cues: 'Lower opposite arm/leg slowly. Keep lower back glued to floor.', muscleFocus: 'Deep Core', targetGroup: 'Abs', feeling: 'Abs shaking.', pacer: PACER_PUSH, metValue: 3.5, muscleSplit: { 'Deep Core': 60, 'Abs': 40 }, motionType: 'hold' },
    { id: 'l_5', name: 'Plank', type: 'weighted', sets: 3, reps: 'Fail', restSeconds: 60, cues: 'Squeeze glutes and abs hard. Do not let hips sag.', muscleFocus: 'Core Stability', targetGroup: 'Abs', feeling: 'Whole body tension.', pacer: { ...PACER_ISO_HOLD, startDelay: 0, phases: [{ action: 'HOLD', duration: 10, voiceCue: 'Hold Strong', breathing: 'Hold' }] }, metValue: 4.0, muscleSplit: { 'Abs': 60, 'Glutes': 20, 'Shoulders': 20 }, motionType: 'hold' },
  ]
};

export const WORKOUT_SCHEDULE: Record<number, WorkoutDay | null> = {
  0: null, // Sunday: Rest
  1: PUSH_DAY, // Monday
  2: PULL_DAY, // Tuesday
  3: LEGS_DAY, // Wednesday
  4: PUSH_DAY, // Thursday
  5: PULL_DAY, // Friday
  6: LEGS_DAY, // Saturday
};

export const ALL_WORKOUTS = [PUSH_DAY, PULL_DAY, LEGS_DAY];

export const TIPS = {
  TESTING_PHASE: "Testing Phase: Find a weight where you fail within the rep range. If too easy, increase weight.",
  BEATING_PHASE: "Beating Phase: Beat last week's number! Add reps (e.g., 9 -> 10) OR small weight (e.g., +2.5kg).",
};

export const DEFAULT_PACER_STOPWATCH = PACER_STOPWATCH;
