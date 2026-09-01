import React from 'react';
import { Target, TrendingDown, Zap, HeartPulse, CheckCircle2 } from 'lucide-react';

export function TransformationSection() {
  return (
    <section id="transformation" className="py-20 sm:py-28 border-b border-white/10 bg-[#080b11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="label-xs text-sky-400">Section 01 • The Transformation</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            Real Physical Change. <br />
            <span className="text-slate-400">Not Just Another Fitness App.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Most programs hand you generic templates and leave you to fail. We combine rigorous energy balance science, cultural nutrition flexibility, and weekly human coach oversight to build permanent body recomposition.
          </p>
        </div>

        {/* 3 Outcome Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="surface p-7 space-y-4 surface-hover">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold">
              <TrendingDown size={24} />
            </div>
            <h3 className="text-lg font-bold text-white uppercase">Body Recomposition & Fat Loss</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Targeted fat loss while preserving or building lean muscle. Mifflin-St Jeor energy calculations calibrated to your exact body metrics, waist measurements, and metabolic rate.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-white/10">
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-sky-400" /> Preserves lean metabolic muscle</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-sky-400" /> Scientific calorie deficits without starvation</li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="surface p-7 space-y-4 surface-hover">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              <HeartPulse size={24} />
            </div>
            <h3 className="text-lg font-bold text-white uppercase">Sustainable Habit Integration</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No crash diets or unsustainable restrictions. Learn how Nigerian and international staples fit into your daily macronutrient targets through flexible portion adjustments.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-white/10">
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Eat your favorite foods with portion mastery</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Long-term consistency over extreme short fixes</li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="surface p-7 space-y-4 surface-hover">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-white uppercase">Strength & Energy Vitality</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Progressive overload training tailored to home or gym equipment. Build functional stamina, core posture, and explosive physical confidence week over week.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-white/10">
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-400" /> Structured 3 to 5-day training splits</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-amber-400" /> Noticeable strength gains in under 3 weeks</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
