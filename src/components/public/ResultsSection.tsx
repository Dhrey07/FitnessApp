import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/db';
import { PhotoPlaceholder } from '@/components/brand/PhotoPlaceholder';

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
  beforePhotoUrl: string | null;
  afterPhotoUrl: string | null;
}

async function loadStories(): Promise<Story[]> {
  try {
    return await prisma.testimonial.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  } catch {
    return [];
  }
}

function firstNameOnly(name: string) {
  return name.split(' ')[0];
}

export async function ResultsSection() {
  const stories = await loadStories();
  if (stories.length === 0) return null;

  return (
    <section id="results" className="py-20 sm:py-24 bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="label-xs text-brand">Client results</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-heading)]">
            Real people, measured change.
          </h2>
          <p className="text-ink-secondary leading-relaxed">
            Results vary with starting point, consistency and time. Photos are shown only with written client consent.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s) => {
            const delta = Math.round((s.endingWeightKg - s.startingWeightKg) * 10) / 10;
            const showPhotos = s.verifiedClient && !!s.beforePhotoUrl && !!s.afterPhotoUrl;
            return (
              <article key={s.id} className="surface p-6 flex flex-col gap-4">
                {showPhotos ? (
                  <div className="grid grid-cols-2 gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.beforePhotoUrl!} alt={`${firstNameOnly(s.name)} before`} className="aspect-[4/5] w-full object-cover rounded-xl" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.afterPhotoUrl!} alt={`${firstNameOnly(s.name)} after`} className="aspect-[4/5] w-full object-cover rounded-xl" />
                  </div>
                ) : (
                  <PhotoPlaceholder aspect="aspect-[16/9]" />
                )}
                <div className="space-y-1">
                  <p className="font-display font-bold text-ink">{s.goalAchieved}</p>
                  <p className="text-xs text-ink-muted">
                    {firstNameOnly(s.name)}{s.location ? `, ${s.location}` : ''} · {s.durationWeeks} weeks · {delta > 0 ? '+' : ''}{delta} kg
                  </p>
                </div>
                <blockquote className="text-sm text-ink-secondary leading-relaxed border-l-2 border-[var(--accent)] pl-3">
                  “{s.quote.length > 180 ? s.quote.slice(0, 177).trimEnd() + '…' : s.quote}”
                </blockquote>
                {s.verifiedClient && (
                  <p className="text-xs text-brand font-semibold flex items-center gap-1.5 mt-auto">
                    <CheckCircle2 size={14} /> Verified client
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
