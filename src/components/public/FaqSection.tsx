import React from 'react';
import { BRAND } from '@/lib/brand';

const FAQ = [
  {
    q: 'Who is this coaching for?',
    a: 'Adults who want to lose body fat, manage their weight sustainably, build muscle or recompose their body, and who want structure and accountability that fits a busy life. It is not a quick fix or a crash diet.',
  },
  {
    q: 'I am outside Nigeria. Can I still join?',
    a: `Yes. ${BRAND.legalName} coaches clients in Nigeria and internationally. Check-ins and feedback are online, and meal plans use foods available where you live.`,
  },
  {
    q: 'Will I have to give up rice, yam, plantain or swallow?',
    a: 'No. Plans are built around the foods you already eat. The difference is clear quantities, a protein target and sensible swaps, not a new cuisine.',
  },
  {
    q: 'How do weekly check-ins work?',
    a: 'Once a week you submit weight, waist, average steps, sessions completed, nutrition adherence, hunger, energy, sleep, stress, challenges and wins. Your coach reviews it, writes feedback and adjusts targets only when needed.',
  },
  {
    q: 'How long until I see results?',
    a: 'Most clients see measurable change in waist and weekly average weight within three to four weeks. Visible body recomposition usually takes twelve weeks or more. Programmes are planned in 12-week blocks.',
  },
  {
    q: 'How do I cancel?',
    a: 'Paid plans bill monthly and can be cancelled from your account at any time. Your nutrition log and progress history remain available on the free Starter plan.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 sm:py-24 bg-paper border-b border-line">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="space-y-3">
          <p className="label-xs text-brand">Questions</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-heading)]">
            Common questions.
          </h2>
        </div>
        <div className="divide-y divide-[var(--border-subtle)] border-y border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-ink text-base">
                {f.q}
                <span className="ml-4 text-ink-muted group-open:rotate-45 transition-transform text-xl leading-none" aria-hidden="true">+</span>
              </summary>
              <p className="text-sm text-ink-secondary leading-relaxed mt-3 max-w-2xl">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
