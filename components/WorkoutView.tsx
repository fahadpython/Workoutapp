
import React from 'react';
import { WorkoutDay, SessionData } from '../types';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react';

interface Props {
  plan: WorkoutDay;
  session: SessionData;
  onSelectExercise: (id: string) => void;
  onFinishWorkout: () => void;
}

const WorkoutView: React.FC<Props> = ({ plan, session, onSelectExercise, onFinishWorkout }) => {
  const isAllComplete = plan.exercises.every(ex => {
    const logs = session.completedExercises[ex.id] || [];
    return logs.length >= ex.sets;
  });

  return (
    <div className="flex flex-col h-full animate-in fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
        <p className="text-sm text-gym-accent">{plan.focus}</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-24 no-scrollbar">
        {plan.exercises.map((exercise, index) => {
          const logs = session.completedExercises[exercise.id] || [];
          const isComplete = logs.length >= exercise.sets;
          const isStarted = logs.length > 0 && !isComplete;

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
                  <p className="text-xs text-gray-400">
                    {logs.length}/{exercise.sets} Sets • {exercise.reps} Reps
                  </p>
                </div>
              </div>
              
              <div className="text-gray-500 group-hover:text-white transition-colors">
                 {isComplete ? <CheckCircle className="text-gym-success" size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 pb-8 safe-pb">
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
