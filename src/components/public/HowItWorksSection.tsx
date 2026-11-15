import React from 'react';
import { ClipboardList, FileText, CalendarCheck, SlidersHorizontal, MessageSquare } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const STEPS = [
  { icon: ClipboardList, title: 'Assessment', text: 'Age, height, weight, waist, activity, goal, training setup and food preferences. About five minutes.' },
  { icon: FileText, title: 'Your plan', text: 'Calorie and macro targets, a day-by-day meal plan and a training programme matched to your equipment and schedule.' },
  { icon: CalendarCheck, title: 'Weekly check-in', text: 'Weight, waist, steps, sessions completed, nutrition adherence, hunger, energy, sleep, stress, challenges and wins.' },
  { icon: SlidersHorizontal, title: 'Adjust', text: 'Your coach reviews the week, writes feedback and changes targets or training only when the data calls for it.' },
];

export function HowItWorksSection() {
  return (
    <section id="coaching" className="py-20 sm:py-24 bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-10">
          <div className="max-w-xl space-y-3">
            <p className="label-xs text-brand">How coaching works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-heading)]">
              A simple weekly rhythm, with a real coach reading the numbers.
            </h2>
            <p className="text-ink-secondary leading-relaxed">
              Software calculates. A human decides. Every check-in is read by {BRAND.coachName}, and every adjustment is explained in plain words.
            </p>
          </div>
          <ol className="space-y-5">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-brand-strong text-[var(--brand-on-strong)] flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  {i < STEPS.length - 1 && <div className="w-px flex-1 bg-[var(--border-subtle)] mt-2" />}
                </div>
                <div className="pb-2">
                  <p className="label-xs text-ink-muted">Step {i + 1}</p>
                  <h3 className="font-display font-bold text-lg text-ink">{title}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed mt-1">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="lg:col-span-5 surface p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-soft text-brand font-bold flex items-center justify-center">
              {BRAND.coachName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-ink">{BRAND.coachName}</p>
              <p className="text-xs text-ink-muted">Head coach, {BRAND.legalName}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-paper border border-line text-sm text-ink-secondary leading-relaxed">
            <p className="label-xs text-ink-muted mb-2 flex items-center gap-1.5"><MessageSquare size={12} /> Example weekly feedback</p>
            <p>
              Weight down 0.6 kg and waist down 1 cm, with strength holding on your main lifts. Hunger was a 4 on two evenings, so we move 15 g of carbohydrate from lunch to dinner. Steps stay at 8,500. No other changes this week.
            </p>
          </div>
          <ul className="text-sm text-ink-secondary space-y-2">
            <li>Written feedback every week on Essential and above.</li>
            <li>WhatsApp accountability on Signature and Private Coaching.</li>
            <li>Clients in Nigeria and internationally.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
