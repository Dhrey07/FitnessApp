import React from 'react';
import { prisma } from '@/lib/db';
import { Photo } from '@/components/ui/Photo';
import { resolvePhoto, type PhotoSlot } from '@/lib/photos';

interface Story {
  id: string;
  name: string;
  location: string | null;
  goalAchieved: string;
  startingWeightKg: number;
  endingWeightKg: number;
  durationWeeks: number;
  quote: string;
  verifiedClient: boolean;
  consentGiven: boolean;
  beforePhotoUrl: string | null;
  afterPhotoUrl: string | null;
}

async function loadStories(): Promise<Story[]> {
  try {
    return await prisma.testimonial.findMany({ where: { featured: true }, orderBy: { createdAt: 'desc' }, take: 3 });
  } catch {
    return [];
  }
}

const firstName = (n: string) => n.split(' ')[0];
const city = (l: string | null) => (l ? l.split(',')[0].trim() : null);

/**
 * Three client stories. Mobile: horizontal snap scroll, cards at 85vw.
 * Desktop: three up. Photo pairs only with written consent; otherwise the
 * art-directed placeholder. Consent is stated once in the intro.
 */
export async function ResultsSection() {
  const stories = await loadStories();
  if (stories.length === 0) return null;

  return (
    <section id="results" className="pub-section bg-surface">
      <div className="pub-container space-y-10 md:space-y-14">
        <div className="md:flex md:items-end md:justify-between gap-8">
          <div className="pub-reading">
            <p className="t-overline">Results</p>
            <h2 className="t-display mt-3">Real people, measured change.</h2>
          </div>
          <p className="t-body-sm max-w-[36ch] mt-4 md:mt-0">Results vary with starting point, consistency and time. Photographs appear only with written consent.</p>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hidden">
          {stories.map((s, i) => {
            const delta = Math.round((s.endingWeightKg - s.startingWeightKg) * 10) / 10;
            const showPhotos = s.verifiedClient && s.consentGiven && !!s.beforePhotoUrl && !!s.afterPhotoUrl;
            const n = Math.min(i + 1, 3);
            const before = resolvePhoto(`result-${n}-before` as PhotoSlot);
            const after = resolvePhoto(`result-${n}-after` as PhotoSlot);
            return (
              <article key={s.id} className="snap-start shrink-0 w-[85vw] md:w-auto space-y-5">
                <div className="grid grid-cols-2 gap-2">
                  {showPhotos ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.beforePhotoUrl!} alt={`${firstName(s.name)} at the start`} className="aspect-[4/5] w-full object-cover rounded-[var(--radius-md)]" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.afterPhotoUrl!} alt={`${firstName(s.name)} after ${s.durationWeeks} weeks`} className="aspect-[4/5] w-full object-cover rounded-[var(--radius-md)]" />
                    </>
                  ) : (
                    <>
                      <Photo photo={before} alt="" ratio="4/5" radius="md" sizes="(min-width: 768px) 20vw, 42vw" />
                      <Photo photo={after} alt="" ratio="4/5" radius="md" sizes="(min-width: 768px) 20vw, 42vw" />
                    </>
                  )}
                </div>
                <div>
                  <p className="flex items-baseline gap-1.5">
                    <span className="t-stat-hero text-[44px] md:text-[52px]">{delta > 0 ? '+' : '−'}{Math.abs(delta)}</span>
                    <span className="text-ink-muted font-medium text-base">kg</span>
                  </p>
                  <p className="t-ui mt-2">{s.goalAchieved}</p>
                  <p className="t-caption mt-1">
                    {firstName(s.name)}{city(s.location) ? `, ${city(s.location)}` : ''} · {s.durationWeeks} weeks
                  </p>
                </div>
                <blockquote className="t-body-sm line-clamp-2 max-w-[40ch]">“{s.quote}”</blockquote>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
