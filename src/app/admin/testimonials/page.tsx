import type { Metadata } from 'next';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/Section';
import { prisma } from '@/lib/db';
import { requireCoach } from '@/lib/coach/data';
import { AddTestimonial } from './AddTestimonial';

export const metadata: Metadata = { title: 'Testimonials' };
export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  await requireCoach();
  const stories = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <AdminAppShell title="Testimonials" subtitle="Client stories shown on the public results section. Photos appear only with written consent." action={<AddTestimonial />}>
      {stories.length === 0 ? (
        <EmptyState message="No stories yet. Add one when a client agrees to share their result." action={<AddTestimonial />} />
      ) : (
        <Section first>
          <ListRows>
            {stories.map((s) => {
              const delta = Math.round((s.endingWeightKg - s.startingWeightKg) * 10) / 10;
              return (
                <ListRow
                  key={s.id}
                  title={`${s.name} · ${delta > 0 ? '+' : '−'}${Math.abs(delta)} kg in ${s.durationWeeks} weeks`}
                  subtitle={`${s.goalAchieved}${s.location ? ` · ${s.location}` : ''} · “${s.quote}”`}
                  trailing={
                    <span className="flex items-center gap-1.5">
                      {s.featured && <Pill tone="brand">On site</Pill>}
                      {s.consentGiven ? <Pill tone="approved">Photo consent</Pill> : <Pill>No photos</Pill>}
                    </span>
                  }
                />
              );
            })}
          </ListRows>
        </Section>
      )}
    </AdminAppShell>
  );
}
