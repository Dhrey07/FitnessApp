import React from 'react';
import { BRAND } from '@/lib/brand';
import { Document, DocumentRow } from '@/components/ui/Document';

const STEPS = [
  { title: 'Assessment', text: 'Five minutes on goal, measurements, training setup and the foods you eat.' },
  { title: 'Your plan', text: 'Calorie and protein targets, a day-by-day meal plan, a programme for your equipment.' },
  { title: 'Weekly check-in', text: 'Weight, waist, steps, sessions, hunger, sleep, and how the week really went.' },
  { title: 'Adjust', text: 'Your coach reads it, writes back, and changes targets only when the trend says so.' },
];

/**
 * One horizontal rail on desktop (four nodes), a vertical rail on mobile.
 * The coach's weekly feedback sits beside it as a Document.
 */
export function HowItWorksSection() {
  return (
    <section id="coaching" className="pub-section bg-paper">
      <div className="pub-container space-y-12 md:space-y-16">
        <div className="pub-reading">
          <p className="t-overline">How coaching works</p>
          <h2 className="t-display mt-3">A simple weekly rhythm, with a real coach reading the numbers.</h2>
          <p className="t-body text-ink-secondary mt-5">Software calculates. A human decides. Every check-in is read by {BRAND.coachName} and every adjustment is explained in plain words.</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 items-start">
          {/* Rail */}
          <ol className="lg:col-span-7 relative grid gap-8 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="hidden md:block absolute left-0 right-0 top-[7px] h-px bg-[var(--border-subtle)]" />
            <span aria-hidden className="md:hidden absolute top-0 bottom-0 left-[7px] w-px bg-[var(--border-subtle)]" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative pl-8 md:pl-0 md:pt-8">
                <span aria-hidden className="absolute left-0 top-0 md:top-0 h-[15px] w-[15px] rounded-full border-2 border-[var(--brand)] bg-paper" />
                <p className="t-caption tnum">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="t-h3 mt-1">{s.title}</h3>
                <p className="t-body-sm mt-2 max-w-[28ch]">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="lg:col-span-5">
            <Document title="Weekly feedback" subtitle="Week 4 of 12" meta={<>Chidi Okonkwo<br />Sunday</>}>
              <DocumentRow label="Weight" value="85.0 kg · down 0.6" />
              <DocumentRow label="Waist" value="88 cm · down 1" />
              <DocumentRow label="Training" value="4 of 4 sessions" />
              <DocumentRow label="From your coach">
                <p className="text-sm leading-relaxed mt-1">Strength is holding on your main lifts. Hunger was a 4 on two evenings, so we move 15 g of carbohydrate from lunch to dinner. Steps stay at 8,500. No other changes this week.</p>
              </DocumentRow>
            </Document>
          </div>
        </div>
      </div>
    </section>
  );
}
