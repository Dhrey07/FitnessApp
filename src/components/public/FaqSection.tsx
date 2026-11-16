import React from 'react';
import { Plus } from 'lucide-react';
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

/** Accordion in reading width. Native details, no cards. */
export function FaqSection() {
  return (
    <section id="faq" className="pub-section bg-paper">
      <div className="pub-container">
        <div className="pub-reading mx-auto md:mx-0 space-y-10">
          <div>
            <p className="t-overline">Questions</p>
            <h2 className="t-display mt-3">Common questions.</h2>
          </div>
          <div className="hairline">
            {FAQ.map((f) => (
              <details key={f.q} className="faq group hairline-b">
                <summary className="focus-ring flex items-center justify-between gap-6 cursor-pointer py-5 t-ui text-base">
                  {f.q}
                  <Plus size={18} className="faq-plus shrink-0 text-ink-muted" aria-hidden />
                </summary>
                <p className="t-body-sm pb-5 max-w-[60ch]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
