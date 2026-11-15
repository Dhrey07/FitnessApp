import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Flame, Beef, CalendarCheck } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { Monogram } from '@/components/brand/Logo';

export function HeroSection() {
  return (
    <section className="bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        <div className="lg:col-span-7 space-y-7">
          <p className="label-xs text-brand">{BRAND.tagline}</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-[var(--text-heading)]">
            Sustainable transformation, built around your life.
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-xl">
            {BRAND.positioning}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
            <Link href="/onboarding" className="btn-brand text-sm px-7 py-3.5 w-full sm:w-auto">
              Start your assessment <ArrowRight size={16} />
            </Link>
            <a href="#coaching" className="btn-secondary text-sm px-6 py-3.5 w-full sm:w-auto">
              See how coaching works
            </a>
          </div>
          <ul className="pt-6 border-t border-line grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {[
              ['Personalised plan', 'Calories, macros and training set from your assessment'],
              ['Weekly check-in', 'Reviewed by your coach, adjusted when needed'],
              ['Familiar foods', 'Nigerian and international meals, no crash diets'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2.5">
                <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink">{t}</p>
                  <p className="text-ink-muted text-xs mt-0.5">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Neutral visual: no stock photography until consented client images exist */}
        <div className="lg:col-span-5">
          <div className="surface p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <Monogram size={44} />
              <span className="label-xs text-ink-muted">Example client plan</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: Flame, label: 'Daily calorie target', value: '2,288 kcal', sub: 'Fat loss, moderate deficit' },
                { icon: Beef, label: 'Protein target', value: '187 g', sub: '2.2 g per kg bodyweight' },
                { icon: CalendarCheck, label: 'Weekly check-in', value: 'Sunday', sub: 'Weight, waist, steps, sleep, hunger' },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-paper border border-line">
                  <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="label-xs text-ink-muted">{label}</p>
                    <p className="font-display font-bold text-lg text-ink leading-tight">{value}</p>
                    <p className="text-xs text-ink-muted">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-muted border-t border-line pt-4">
              Targets are calculated with the Mifflin-St Jeor equation and adjusted by your coach from your weekly check-ins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
