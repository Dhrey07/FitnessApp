import React from 'react';
import Link from 'next/link';
import { Dumbbell, PlayCircle, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export function FitnessSection() {
  const sampleExercises = [
    { name: 'Barbell Incline Bench Press', sets: '4 Sets', reps: '8-10 Reps', rest: '90s Rest', muscle: 'Upper Chest' },
    { name: 'Dumbbell Seated Shoulder Press', sets: '3 Sets', reps: '10-12 Reps', rest: '60s Rest', muscle: 'Deltoids' },
    { name: 'Cable Chest Flyes', sets: '3 Sets', reps: '12-15 Reps', rest: '60s Rest', muscle: 'Chest Contraction' },
    { name: 'Triceps Rope Pushdowns', sets: '4 Sets', reps: '12-15 Reps', rest: '45s Rest', muscle: 'Triceps' },
  ];

  return (
    <section id="fitness" className="py-20 sm:py-28 border-b border-white/10 bg-[#0a0e18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <span className="label-xs text-sky-400">Section 02 • Fitness Police</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              THIS IS WHERE YOU TRAIN. <br />
              <span className="text-slate-400">Intelligent, Progressive Workouts.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether you train with dumbbells in your living room or a full barbell rack at the gym, Fitness Police delivers structured daily training routines tailored to your experience level.
            </p>
          </div>

          <Link href="/onboarding" className="btn-brand text-xs self-start md:self-auto py-3 px-6 shrink-0">
            Start 14-Day Free Trial <ArrowRight size={14} />
          </Link>
        </div>

        {/* Feature Grid & Interactive Workout Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Feature Pillars */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="surface p-6 space-y-2 border-l-4 border-l-sky-500">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Dumbbell size={16} className="text-sky-400" /> Personalised Workout Plans
              </h3>
              <p className="text-xs text-slate-300">
                Custom 3, 4, or 5-day training splits generated for your exact goal: Fat Loss, Muscle Gain, or Recomposition. Seamless beginner-to-advanced progression.
              </p>
            </div>

            <div className="surface p-6 space-y-2 border-l-4 border-l-blue-500">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Clock size={16} className="text-blue-400" /> Home & Gym Equipment Flexibility
              </h3>
              <p className="text-xs text-slate-300">
                No gym membership? No problem. Switch between Home Bodyweight/Dumbbell setups and Commercial Gym setups with one tap.
              </p>
            </div>

            <div className="surface p-6 space-y-2 border-l-4 border-l-cyan-500">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <PlayCircle size={16} className="text-cyan-400" /> Interactive Set, Rep & Weight Logger
              </h3>
              <p className="text-xs text-slate-300">
                Log completed sets, weights used in kg, rep counts, and rest timers in real time. Your coach reviews your progressive overload history.
              </p>
            </div>

          </div>

          {/* Right Live Interactive Routine Preview */}
          <div className="lg:col-span-6">
            <div className="surface p-6 sm:p-8 space-y-6 border border-sky-500/30 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">Sample Routine Preview</span>
                  <h3 className="text-lg font-black text-white uppercase mt-0.5">Day 1 • Upper Body Push</h3>
                </div>
                <span className="badge badge-trial">14-Day Free Trial</span>
              </div>

              {/* Exercises List */}
              <div className="space-y-2.5">
                {sampleExercises.map((ex, i) => (
                  <div key={i} className="p-3.5 bg-slate-900/90 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-white">{ex.name}</p>
                      <p className="text-[10px] text-slate-400">{ex.muscle} • {ex.rest}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sky-400 font-bold text-xs">{ex.sets}</span>
                      <p className="text-[10px] text-slate-400">{ex.reps}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">All routines include form cues, tempo & sets logger.</span>
                <span className="text-sky-400 font-bold flex items-center gap-1">
                  <ShieldCheck size={14} /> Coach Checked
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
