import React from 'react';
import { UserCheck, Sliders, Activity, Scale, Compass, CheckCircle2 } from 'lucide-react';

export function PersonalisationSection() {
  const factors = [
    { title: 'Biological Profile', desc: 'Age, biological sex, height, body weight, and waist circumference.' },
    { title: 'Metabolic TDEE Baseline', desc: 'Mifflin-St Jeor BMR calibrated against daily activity multipliers (1.2x to 1.9x).' },
    { title: 'Primary Goal Direction', desc: 'Fat loss deficit (-500 kcal), recomposition maintenance, or muscle gain surplus (+300 kcal).' },
    { title: 'Training Background', desc: 'Beginner, intermediate, or advanced lifting experience and injury considerations.' },
    { title: 'Equipment & Environment', desc: 'Home dumbbells, bodyweight resistance bands, or full commercial barbell gyms.' },
    { title: 'Dietary Lifestyle', desc: 'Omnivore, Pescatarian, Halal, Nigerian staples, allergies, and typical meal frequency.' },
  ];

  return (
    <section id="personalisation" className="py-20 sm:py-28 border-b border-white/10 bg-[#0a0e18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="label-xs text-sky-400">Section 04 • Precision Personalisation</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            DESIGNED FOR YOUR BODY. <br />
            <span className="text-slate-400">Not A Random Template.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every calorie target, protein ratio, workout split, and recovery schedule is computed specifically for your biological metrics and lifestyle constraints.
          </p>
        </div>

        {/* 6 Personalisation Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factors.map((f, i) => (
            <div key={i} className="surface p-6 space-y-2.5 surface-hover">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center">
                  0{i + 1}
                </div>
                <h3 className="text-sm font-bold text-white uppercase">{f.title}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Formula Transparency Box */}
        <div className="surface p-6 sm:p-8 bg-slate-900 border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Transparent Scientific Engine</span>
              <h3 className="text-base font-bold text-white mt-0.5">The Mifflin-St Jeor Metabolic Standard</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">No fake precision or secret black boxes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
              <p className="font-bold text-white">1. Basal Metabolic Rate (BMR)</p>
              <p className="text-[11px] text-slate-400 font-mono">10×W(kg) + 6.25×H(cm) - 5×Age ± Sex</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
              <p className="font-bold text-white">2. Total Daily Energy Expenditure (TDEE)</p>
              <p className="text-[11px] text-slate-400 font-mono">BMR × Activity Multiplier (1.20 - 1.90)</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
              <p className="font-bold text-white">3. Protein Allocation</p>
              <p className="text-[11px] text-slate-400 font-mono">1.8g - 2.2g per kg bodyweight</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
