import React from 'react';

const METRICS = [
  ['Weight', 'Weekly, same day and conditions'],
  ['Waist', 'At the navel, relaxed'],
  ['Average daily steps', 'From your phone or watch'],
  ['Training sessions', 'Completed vs planned'],
  ['Nutrition adherence', 'Honest percentage for the week'],
  ['Hunger', '1 to 5'],
  ['Energy', '1 to 5'],
  ['Sleep', '1 to 5'],
  ['Stress', '1 to 5'],
  ['Strength', 'Main lifts and how they felt'],
  ['Challenges and wins', 'In your own words'],
  ['What you need help with', 'Your coach answers in the review'],
];

export function ProgressSection() {
  return (
    <section id="progress" className="py-20 sm:py-24 bg-surface border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="label-xs text-brand">Progress you can measure</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-heading)]">
            The scale is one number. The check-in looks at twelve.
          </h2>
          <p className="text-ink-secondary leading-relaxed">
            Day-to-day weight moves with water, salt, sleep and the menstrual cycle. Weekly averages and waist, together with how you slept, how hungry you were and how training felt, show what is really happening. Progress reports summarise it all, with a coach assessment and the next adjustments.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {METRICS.map(([k, v]) => (
            <div key={k} className="p-4 rounded-xl border border-line bg-paper">
              <p className="font-semibold text-ink text-sm">{k}</p>
              <p className="text-xs text-ink-muted mt-1">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
