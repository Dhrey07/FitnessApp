import React from 'react';
import { Photo } from '@/components/ui/Photo';
import { resolvePhoto } from '@/lib/photos';
import { COACH } from '@/content/coach';

/** Portrait, name, two paragraphs in reading width, three plain credentials. */
export function CoachSection() {
  const portrait = resolvePhoto('coach');
  return (
    <section id="coach" className="pub-section bg-paper">
      <div className="pub-container grid gap-10 md:grid-cols-12 md:gap-12 items-start">
        <div className="md:col-span-5 lg:col-span-4">
          <Photo photo={portrait} alt={`${COACH.name}, head coach`} ratio="4/5" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
        <div className="md:col-span-7 lg:col-span-7 lg:col-start-6">
          <p className="t-overline">Your coach</p>
          <h2 className="t-display mt-3">{COACH.name}</h2>
          <p className="t-body-sm mt-2">{COACH.role}</p>
          <span className="accent-rule mt-6" aria-hidden />
          <div className="pub-reading mt-6 space-y-4">
            {COACH.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="t-body text-ink-secondary">{p}</p>
            ))}
          </div>
          <ul className="mt-8 divide-y divide-[var(--border-subtle)] hairline hairline-b max-w-[48ch]">
            {COACH.credentials.map((c) => (
              <li key={c} className="py-3 t-ui">{c}</li>
            ))}
          </ul>
          <p className="t-body-sm mt-6">{COACH.where}</p>
        </div>
      </div>
    </section>
  );
}
