import React from 'react';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { resolvePhoto } from '@/lib/photos';

const SAMPLE = [
  { ex: 'Barbell back squat', scheme: '4 × 6–8', rest: '150 s', tempo: '3-1-1', effort: 'RPE 8' },
  { ex: 'Romanian deadlift', scheme: '3 × 8–10', rest: '120 s', tempo: '3-0-1', effort: 'RIR 2' },
  { ex: 'Walking lunge', scheme: '3 × 10 per leg', rest: '90 s', tempo: '2-0-1', effort: 'RIR 2' },
  { ex: 'Seated leg curl', scheme: '3 × 12–15', rest: '60 s', tempo: '2-1-1', effort: 'RIR 1' },
];

/**
 * The page's one ink section. Programme day typeset in off-white with the
 * monogram texture; tempo and RPE explained in one line each; movement photo.
 */
export function TrainingSection() {
  const movement = resolvePhoto('movement');

  return (
    <section id="training" className="pub-section bg-[var(--brand-green-900)] text-[var(--brand-offwhite)] monogram-texture">
      <div className="pub-container space-y-12 md:space-y-16 relative z-10">
        <div className="pub-reading">
          <p className="t-overline text-[var(--brand-green-300)]">Training</p>
          <h2 className="t-display mt-3 text-[var(--brand-offwhite)]">Structured training that moves forward with you.</h2>
          <p className="t-body mt-5 text-[rgba(246,244,239,0.8)]">
            Home or gym, three to five days a week. Each session lists sets, reps, rest, tempo and an effort target, with one line on when to add load.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between pb-3 border-b border-[rgba(246,244,239,0.18)]">
              <h3 className="t-h3 text-[var(--brand-offwhite)]">Day 2 · Lower body</h3>
              <span className="text-xs text-[rgba(246,244,239,0.6)]">Example programme</span>
            </div>
            <ol className="divide-y divide-[rgba(246,244,239,0.12)]">
              {SAMPLE.map((r, i) => (
                <li key={r.ex} className="grid grid-cols-[2ch_1fr_auto] gap-4 py-4 items-baseline">
                  <span className="text-xs tnum text-[rgba(246,244,239,0.65)]">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-base font-medium">{r.ex}</p>
                    <p className="text-sm text-[rgba(246,244,239,0.65)] tnum">{r.tempo} tempo · rest {r.rest}</p>
                  </div>
                  <div className="text-right tnum">
                    <p className="text-base font-medium">{r.scheme}</p>
                    <p className="text-sm text-[rgba(246,244,239,0.65)]">{r.effort}</p>
                  </div>
                </li>
              ))}
            </ol>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="font-medium">Tempo 3-1-1</dt>
                <dd className="text-[rgba(246,244,239,0.65)]">Three seconds down, one second pause, one second up.</dd>
              </div>
              <div>
                <dt className="font-medium">RPE 8, RIR 2</dt>
                <dd className="text-[rgba(246,244,239,0.65)]">Stop with about two good reps left in the tank.</dd>
              </div>
            </dl>
            <p className="mt-6 text-sm text-[rgba(246,244,239,0.8)]">Progression: add 2.5 kg to the squat when every set reaches 8 reps at RPE 8 or lower.</p>
            <div className="mt-8">
              <Button href="/onboarding" className="!bg-[var(--brand-offwhite)] !text-[var(--brand-green-900)] hover:!bg-white">Start your assessment</Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Photo photo={movement} alt="A goblet squat in a home setup" ratio="4/5" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
