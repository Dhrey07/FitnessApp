import React from 'react';
import { TrendingUp, Scale, Camera, Flame, Award, Calendar, CheckCircle2 } from 'lucide-react';

export function TrackingSection() {
  return (
    <section id="tracking" className="py-20 sm:py-28 border-b border-white/10 bg-[#080b11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="label-xs text-sky-400">Section 05 • Transformation Tracking</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            AM I ACTUALLY IMPROVING? <br />
            <span className="text-slate-400">Real Metrics You Can See & Measure.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The scale only tells 20% of the story. Track body measurements, waist changes, training strength volume, weekly progress photos, and nutritional compliance streaks in one cohesive timeline.
          </p>
        </div>

        {/* Tracking Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Scale size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Weight & Waist Circumference</h3>
            <p className="text-xs text-slate-300">
              Log your body mass and waistline. Automated smoothing algorithms identify true fat loss trends while ignoring transient water fluctuations.
            </p>
          </div>

          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Camera size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Weekly Progress Photos</h3>
            <p className="text-xs text-slate-300">
              Side-by-side photo comparisons across week 1, week 4, week 8, and week 12 to witness undeniable postural and muscle definition changes.
            </p>
          </div>

          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Flame size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Macro & Calorie Adherence</h3>
            <p className="text-xs text-slate-300">
              Daily target dials showing your protein, carbohydrate, and fat intake adherence with streak tracking for sustained momentum.
            </p>
          </div>

          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Progressive Overload Volume</h3>
            <p className="text-xs text-slate-300">
              Track how your lifting weights and rep counts increase over time across key compound and isolation movements.
            </p>
          </div>

          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Calendar size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Weekly Check-In Reports</h3>
            <p className="text-xs text-slate-300">
              Submit energy levels, sleep quality, and lifestyle challenges every Sunday to receive targeted coach adjustments.
            </p>
          </div>

          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Award size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Transformation Timeline</h3>
            <p className="text-xs text-slate-300">
              A permanent, chronological record of your fitness journey from day one to your final goal weight and physique.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
