import React from 'react';
import { Utensils, Scale, Dumbbell, TrendingUp, Heart, ClipboardCheck, Users } from 'lucide-react';

const SERVICES = [
  { icon: Utensils, title: 'Personalised nutrition coaching', text: 'A meal plan with exact quantities, built on foods you already eat.' },
  { icon: Scale, title: 'Fat loss and sustainable weight management', text: 'A moderate deficit you can keep, not a crash diet you abandon.' },
  { icon: Dumbbell, title: 'Muscle building and body recomposition', text: 'Enough protein and progressive training to change shape, not just weight.' },
  { icon: TrendingUp, title: 'Structured training and progressive overload', text: 'Sets, reps, rest, tempo and effort targets that move forward week by week.' },
  { icon: Heart, title: 'Lifestyle improvement and accountability', text: 'Steps, sleep, stress and hunger tracked alongside the scale.' },
  { icon: ClipboardCheck, title: 'Progress tracking and programme adjustments', text: 'Weekly check-ins reviewed by a coach, with changes when the data says so.' },
  { icon: Users, title: 'Practical coaching for real people', text: 'Busy schedules, social events and travel are planned for, not punished.' },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-24 bg-surface border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="label-xs text-brand">What we help with</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-heading)]">
            Nutrition, training and the habits that hold them together.
          </h2>
          <p className="text-ink-secondary text-base leading-relaxed">
            Evidence-informed coaching for adults who want to lose body fat, build muscle or simply feel in control of their health, without giving up the foods and routines that make up normal life.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="p-6 rounded-2xl border border-line bg-paper space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                <Icon size={18} />
              </div>
              <h3 className="font-display font-bold text-base text-ink">{title}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
