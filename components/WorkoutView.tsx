
import React, { useState } from 'react';
import { WorkoutDay, SessionData, ExerciseType, MuscleGroup, Exercise } from '../types';
import { CheckCircle, Circle, ChevronRight, Layers, PlusCircle, Footprints, Dumbbell } from 'lucide-react';
import { DEFAULT_PACER_STOPWATCH } from '../constants';

interface Props {
  plan: WorkoutDay;
  session: SessionData;
  onSelectExercise: (id: string) => void;
  onFinishWorkout: () => void;
  onAddCustomExercise: (ex: Exercise) => void;
}

const WorkoutView: React.FC<Props> = ({ plan, session, onSelectExercise, onFinishWorkout, onAddCustomExercise }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState<ExerciseType>('weighted');
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('Other');
  const [customCues, setCustomCues] = useState('');

  // Merge plan exercises with custom ones for this session
  const displayExercises = [...plan.exercises, ...(session.customExercises || [])];

  const isAllComplete = displayExercises.every(ex => {
    const logs = session.completedExercises[ex.id] || [];
    return logs.length >= ex.sets;
  });

  const handleCreateExercise = () => {
      if (!customName) return;
      
      const newEx: Exercise = {
          id: `custom_${Date.now()}`,
          name: customName,
          type: customType,
          sets: 3,
          reps: customType === 'cardio' ? '10 mins' : '10',
          restSeconds: 60,
          cues: customCues || 'Custom Exercise',
          muscleFocus: customMuscle,
          targetGroup: customMuscle,
          feeling: 'N/A',
          metValue: customType === 'cardio' ? 8 : 4,
          pacer: customType === 'cardio' ? DEFAULT_PACER_STOPWATCH : { startDelay: 3, phases: [] }
      };
      
      onAddCustomExercise(newEx);
      setIsAdding(false);
      setCustomName('');
      setCustomCues('');
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
        <p className="text-sm text-gym-accent">{plan.focus}</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-32 no-scrollbar">
        {displayExercises.map((exercise, index) => {
          const logs = session.completedExercises[exercise.id] || [];
          const isComplete = logs.length >= exercise.sets;
          const isStarted = logs.length > 0 && !isComplete;
          const hasMonster = logs.some(l => l.isMonsterSet);
          const isCardio = exercise.type === 'cardio';

          return (
            <button
              key={exercise.id}
              onClick={() => onSelectExercise(exercise.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group
                ${isComplete 
                  ? 'bg-gym-800/40 border-gym-700 opacity-60' 
                  : isStarted 
                    ? 'bg-gym-800 border-gym-accent/50 shadow-sm' 
                    : 'bg-gym-800 border-gym-700 hover:border-gym-600'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className="text-gray-500 font-mono text-sm w-4">{index + 1}</div>
                <div>
                  <h3 className={`font-bold ${isComplete ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {exercise.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {isCardio && <Footprints size={12} className="text-blue-400"/>}
                    <p className="text-xs text-gray-400">
                        {logs.length}/{exercise.sets} Sets • {exercise.reps} {isCardio ? '' : 'Reps'}
                    </p>
                    {hasMonster && <span className="text-[10px] px-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center gap-0.5"><Layers size={8}/> Monster</span>}
                  </div>
                </div>
              </div>
              
              <div className="text-gray-500 group-hover:text-white transition-colors">
                 {isComplete ? <CheckCircle className="text-gym-success" size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>
          );
        })}

        {/* --- ADD CUSTOM EXERCISE SECTION --- */}
        <div className="pt-4 border-t border-gym-700 mt-4">
           {!isAdding ? (
               <button 
                 onClick={() => setIsAdding(true)}
                 className="w-full py-3 bg-gym-800 border border-gym-700 border-dashed rounded-xl text-gray-400 hover:text-white hover:border-gym-500 flex items-center justify-center gap-2 text-sm font-bold"
               >
                 <PlusCircle size={18} /> Add Custom Exercise
               </button>
           ) : (
               <div className="bg-gym-800 p-4 rounded-xl border border-gym-700 animate-in slide-in-from-bottom-2">
                   <h4 className="text-white font-bold mb-3 text-sm">Create New Exercise</h4>
                   <input 
                     type="text" 
                     placeholder="Exercise Name (e.g. Boxing)" 
                     className="w-full bg-gym-900 border border-gym-600 rounded-lg p-3 text-white text-sm mb-3 focus:border-gym-accent focus:outline-none"
                     value={customName}
                     onChange={e => setCustomName(e.target.value)}
                   />
                   <div className="flex gap-2 mb-3">
                       <button 
                         onClick={() => setCustomType('weighted')}
                         className={`flex-1 py-2 rounded text-xs font-bold border flex items-center justify-center gap-2 ${customType === 'weighted' ? 'bg-gym-accent border-blue-400 text-white' : 'bg-gym-900 border-gym-700 text-gray-400'}`}
                       >
                           <Dumbbell size={14} /> Lifting
                       </button>
                       <button 
                         onClick={() => setCustomType('cardio')}
                         className={`flex-1 py-2 rounded text-xs font-bold border flex items-center justify-center gap-2 ${customType === 'cardio' ? 'bg-gym-accent border-blue-400 text-white' : 'bg-gym-900 border-gym-700 text-gray-400'}`}
                       >
                           <Footprints size={14} /> Cardio
                       </button>
                   </div>
                   
                   <textarea
                     placeholder="Tips / Form Cues (Optional)"
                     className="w-full bg-gym-900 border border-gym-600 rounded-lg p-3 text-white text-sm mb-3 focus:border-gym-accent focus:outline-none min-h-[60px]"
                     value={customCues}
                     onChange={e => setCustomCues(e.target.value)}
                   />

                   <div className="flex gap-2">
                       <button onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-gym-700 text-gray-300 rounded-lg text-xs font-bold">Cancel</button>
                       <button onClick={handleCreateExercise} className="flex-1 py-2 bg-gym-success text-white rounded-lg text-xs font-bold">Add to List</button>
                   </div>
               </div>
           )}
        </div>
      </div>

      <div className="mt-auto pt-4 pb-8 safe-pb z-20 bg-gym-900 border-t border-gym-800">
        <button
          onClick={onFinishWorkout}
          className={`w-full py-4 font-bold rounded-lg uppercase tracking-wider shadow-lg transition-all
            ${isAllComplete 
              ? 'bg-gym-success hover:bg-green-600 text-white' 
              : 'bg-gym-700 text-gray-400 hover:bg-gym-600 hover:text-white'
            }`}
        >
          {isAllComplete ? 'Finish Workout' : 'End Workout Early'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutView;
