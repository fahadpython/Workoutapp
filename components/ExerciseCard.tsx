
import React, { useState, useEffect, useRef } from 'react';
import { Exercise, SetLog, ExerciseHistory, PacerPhase } from '../types';
import { getExerciseHistory } from '../services/storageService';
import { Info, CheckCircle, ChevronDown, ChevronUp, Dumbbell, ArrowLeft, History, Mic, Square, Layers, Wind } from 'lucide-react';

interface Props {
  exercise: Exercise;
  completedSets: SetLog[];
  onLogSet: (weight: number, reps: number, isDropSet: boolean) => void;
  onBack: () => void;
}

const ExerciseCard: React.FC<Props> = ({ 
  exercise, 
  completedSets, 
  onLogSet,
  onBack
}) => {
  const [history, setHistory] = useState<ExerciseHistory | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [isDropSet, setIsDropSet] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // --- PACER ENGINE STATE ---
  const [isPacing, setIsPacing] = useState(false);
  const [pacerRepCount, setPacerRepCount] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [pacerStatus, setPacerStatus] = useState<'IDLE' | 'COUNTDOWN' | 'ACTIVE'>('IDLE');
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const pacerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const hist = getExerciseHistory(exercise.id);
    setHistory(hist);
    
    if (hist && hist.lastSession && completedSets.length === 0) {
      setWeight(hist.lastSession.topSet.weight.toString());
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => stopPacer();
  }, [exercise.id, completedSets.length]);

  // --- TTS ENGINE ---
  const speak = (text: string, rate: number = 1.2, pitch: number = 1) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // Interrupt previous
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate; 
    utterance.pitch = pitch;
    const voices = synthRef.current.getVoices();
    // Try to get a decent English voice
    const preferred = voices.find(v => v.lang.includes('en') && v.name.includes('Google')) || voices[0];
    if (preferred) utterance.voice = preferred;
    synthRef.current.speak(utterance);
  };

  // --- PACER LOGIC ---
  const startPacer = () => {
    setIsPacing(true);
    setPacerStatus('COUNTDOWN');
    setPacerRepCount(0);
    setCurrentPhaseIndex(0);
    
    let countdown = exercise.pacer.startDelay;
    speak(`Starting in ${countdown}`);

    pacerTimerRef.current = setInterval(() => {
       countdown--;
       if (countdown > 0) {
           speak(countdown.toString());
       } else if (countdown === 0) {
           setPacerStatus('ACTIVE');
           runPhase(0);
       }
    }, 1000);
  };

  const stopPacer = () => {
    setIsPacing(false);
    setPacerStatus('IDLE');
    if (pacerTimerRef.current) clearInterval(pacerTimerRef.current);
    synthRef.current?.cancel();
  };

  const runPhase = (phaseIdx: number) => {
      // Clear previous timer
      if (pacerTimerRef.current) clearInterval(pacerTimerRef.current);

      const phases = exercise.pacer.phases;
      const currentPhase = phases[phaseIdx];
      
      setCurrentPhaseIndex(phaseIdx);
      setPhaseTimeLeft(currentPhase.duration);

      // Voice Cues
      if (currentPhase.voiceCue) {
          // If it's the start of a rep (Phase 0), speak the Rep Number too if > 0
          if (phaseIdx === 0 && pacerRepCount > 0) {
              speak(`${pacerRepCount + 1}. ${currentPhase.voiceCue}`, 1.3);
          } else {
              speak(currentPhase.voiceCue);
          }
      }

      // Start Countdown for this phase
      let timeLeft = currentPhase.duration * 10; // Use 100ms intervals for smooth UI
      
      pacerTimerRef.current = setInterval(() => {
          timeLeft--;
          // Update UI timer (approx)
          if (timeLeft % 10 === 0) setPhaseTimeLeft(timeLeft / 10);

          if (timeLeft <= 0) {
              // Phase Complete
              const nextPhaseIdx = phaseIdx + 1;
              
              if (nextPhaseIdx < phases.length) {
                  runPhase(nextPhaseIdx);
              } else {
                  // Rep Complete
                  setPacerRepCount(prev => prev + 1);
                  runPhase(0); // Loop back to start
              }
          }
      }, 100);
  };

  const handleFinishSet = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (isNaN(w) || isNaN(r)) return;
    
    onLogSet(w, r, isDropSet);
    
    if (isPacing) stopPacer();
    // Reset drop set toggle for safety, or keep it if user wants to do multiple
    setIsDropSet(false); 
  };

  const getPhaseColor = (phase: PacerPhase) => {
      switch (phase.breathing) {
          case 'Exhale': return 'text-gym-success'; // Push/Power
          case 'Inhale': return 'text-blue-400'; // Control
          default: return 'text-yellow-400'; // Hold
      }
  };

  const activePhase = exercise.pacer.phases[currentPhaseIndex];

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 relative">
      {/* Top Navigation */}
      <div className="flex items-center gap-4 mb-4 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white leading-tight pr-2">{exercise.name}</h2>
          <p className="text-sm text-gym-accent font-medium">{exercise.muscleFocus}</p>
        </div>
      </div>

      {/* --- ACTIVE PACER OVERLAY --- */}
      {isPacing && (
        <div className="absolute inset-0 z-50 bg-gym-900 flex flex-col items-center justify-center p-6 animate-in zoom-in-95">
           
           {pacerStatus === 'COUNTDOWN' && (
               <div className="text-center">
                   <p className="text-2xl text-gray-400 mb-4">Get Ready</p>
                   <div className="text-8xl font-black text-white animate-pulse">...</div>
               </div>
           )}

           {pacerStatus === 'ACTIVE' && (
               <>
                <div className="mb-6 text-center w-full">
                    <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-2">Repetition</p>
                    <h1 className="text-9xl font-black text-white mb-2 font-mono leading-none">{pacerRepCount + 1}</h1>
                </div>

                {/* Visual Circle Pulse */}
                <div className={`w-64 h-64 rounded-full border-8 flex flex-col items-center justify-center relative mb-8 transition-all duration-300
                    ${activePhase.breathing === 'Exhale' ? 'border-gym-success bg-gym-success/10 scale-110' : 
                      activePhase.breathing === 'Inhale' ? 'border-blue-500 bg-blue-500/10 scale-90' : 
                      'border-yellow-500 bg-yellow-500/10 scale-100'
                    }
                `}>
                    <p className={`text-4xl font-black uppercase italic tracking-tighter ${getPhaseColor(activePhase)}`}>
                        {activePhase.action}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <Wind size={20} className={getPhaseColor(activePhase)} />
                        <span className="text-xl font-bold text-white">{activePhase.breathing}</span>
                    </div>
                </div>

                <div className="w-full bg-gym-800 rounded-full h-4 mb-8 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-100 ease-linear ${activePhase.breathing === 'Exhale' ? 'bg-gym-success' : 'bg-blue-500'}`}
                        style={{ width: `${(phaseTimeLeft / activePhase.duration) * 100}%` }}
                    ></div>
                </div>
               </>
           )}

           <button 
             onClick={stopPacer}
             className="bg-red-500/20 text-red-500 border border-red-500/50 px-8 py-4 rounded-full font-bold flex items-center gap-2"
           >
             <Square size={20} fill="currentColor" /> Stop Set
           </button>
        </div>
      )}

      {/* --- INFO / CUES --- */}
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="mb-4 flex items-center justify-between bg-gym-800/50 p-3 rounded-lg border border-gym-700 text-sm text-gray-300"
      >
        <span className="flex items-center gap-2"><Info size={16}/> Trainer Cues</span>
        {showInfo ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
      </button>
      
      {showInfo && (
        <div className="mb-4 p-3 bg-gym-800/30 rounded-lg text-sm text-gray-300 border border-gym-700/50 animate-in fade-in slide-in-from-top-2">
           <p className="mb-2"><strong className="text-white">Form:</strong> {exercise.cues}</p>
           <p className="mb-2"><strong className="text-white">Feeling:</strong> {exercise.feeling}</p>
           <div className="mt-3 pt-3 border-t border-gray-700">
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Tempo Strategy:</p>
               <div className="flex gap-2 text-xs">
                   {exercise.pacer.phases.map((p, i) => (
                       <span key={i} className="px-2 py-1 bg-gym-900 rounded border border-gym-700">
                           {p.duration}s {p.action}
                       </span>
                   ))}
               </div>
           </div>
        </div>
      )}

      {/* --- MAIN INPUT CARD --- */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-20 no-scrollbar">
          
          {/* Active Set Card */}
          {!isPacing && completedSets.length < exercise.sets && (
              <div className="bg-gym-800 p-5 rounded-2xl border border-gym-700 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Dumbbell size={100} />
                  </div>

                  <div className="flex justify-between items-end mb-6 relative z-10">
                      <div>
                          <span className="text-gym-accent font-bold tracking-wider text-xs uppercase">Current Set</span>
                          <h3 className="text-3xl font-bold text-white">Set {completedSets.length + 1}</h3>
                      </div>
                      <div className="text-right">
                          <p className="text-xs text-gray-400">Target</p>
                          <p className="text-xl font-bold text-white">{exercise.reps} Reps</p>
                      </div>
                  </div>

                  {/* Weight/Rep Inputs */}
                  <div className="flex gap-4 mb-6 relative z-10">
                    <div className="w-1/2">
                        <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Weight (kg)</label>
                        <input 
                            type="number" 
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            placeholder={history?.lastSession ? `${history.lastSession.topSet.weight}` : '-'}
                            className="w-full bg-gym-900 border border-gym-600 rounded-xl p-4 text-2xl text-white text-center font-bold focus:border-gym-accent focus:outline-none"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Reps</label>
                        <input 
                            type="number" 
                            value={reps}
                            onChange={e => setReps(e.target.value)}
                            placeholder={pacerRepCount > 0 ? pacerRepCount.toString() : "-"}
                            className="w-full bg-gym-900 border border-gym-600 rounded-xl p-4 text-2xl text-white text-center font-bold focus:border-gym-accent focus:outline-none"
                        />
                    </div>
                  </div>

                  {/* Drop Set Toggle */}
                  <div className="mb-6 flex items-center gap-3 relative z-10">
                      <button 
                        onClick={() => setIsDropSet(!isDropSet)}
                        className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 text-sm font-bold transition-all ${isDropSet ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-gym-900 border-gym-600 text-gray-400'}`}
                      >
                          <Layers size={18} />
                          {isDropSet ? 'Drop Set Active (No Rest)' : 'Normal Set'}
                      </button>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 relative z-10">
                      <button 
                        onClick={startPacer}
                        className="py-4 bg-gym-700 hover:bg-gym-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                          <Mic size={20} /> Pacer
                      </button>
                      <button 
                        onClick={handleFinishSet}
                        disabled={!weight || !reps}
                        className="py-4 bg-gym-accent hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                      >
                          Log Set
                      </button>
                  </div>
              </div>
          )}

          {/* Completed Sets History for this session */}
          <div className="space-y-2">
            {completedSets.map((set, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gym-800/50 rounded-xl border border-gym-700/50">
                 <div className="flex items-center gap-3">
                     <span className="w-8 h-8 rounded-full bg-gym-900 flex items-center justify-center text-xs font-bold text-gray-500">
                         {idx + 1}
                     </span>
                     <div className="flex flex-col">
                         <span className="text-white font-bold">{set.weight}kg × {set.reps}</span>
                         {set.isDropSet && <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Drop Set</span>}
                     </div>
                 </div>
                 <CheckCircle size={18} className="text-gym-success" />
              </div>
            ))}
          </div>

          {completedSets.length >= exercise.sets && (
              <div className="p-6 bg-gym-success/10 border border-gym-success/30 rounded-2xl text-center animate-in zoom-in">
                 <h3 className="text-xl font-bold text-gym-success mb-2">Exercise Complete!</h3>
                 <p className="text-gray-400 text-sm mb-4">Great work. Move to the next one.</p>
                 <button onClick={onBack} className="bg-gym-success text-white px-6 py-2 rounded-lg font-bold">
                     Back to Workout
                 </button>
              </div>
          )}
      </div>

       {/* History Modal */}
       {showHistoryModal && history && (
        <div className="absolute inset-0 z-50 bg-gym-900/95 backdrop-blur-sm p-6 flex flex-col animate-in fade-in">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-white">Log History</h3>
             <button onClick={() => setShowHistoryModal(false)} className="text-gray-400">Close</button>
           </div>
           <div className="overflow-y-auto flex-1 space-y-4">
             {history.logs.map((log, i) => (
               <div key={i} className="flex justify-between items-center p-3 bg-gym-800 rounded border border-gym-700">
                 <span className="text-sm text-gray-400">{log.date}</span>
                 <span className="font-mono text-white font-bold">{log.weight}kg × {log.reps}</span>
               </div>
             ))}
           </div>
        </div>
      )}

       {/* Top Right History Button */}
       {history && (
         <button 
           onClick={() => setShowHistoryModal(true)} 
           className="absolute top-4 right-0 p-2 text-gray-400 hover:text-white z-20 bg-gym-900/50 rounded-full"
         >
           <History size={20} />
         </button>
       )}
    </div>
  );
};

export default ExerciseCard;
