import type { Metadata } from 'next';
import Link from 'next/link';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { EmptyState } from '@/components/ui';
import { prisma } from '@/lib/db';
import { BRAND } from '@/lib/brand';
import { requireClient, shellUserOf } from '@/lib/client/data';

export const metadata: Metadata = { title: 'Guides' };
export const dynamic = 'force-dynamic';

function excerpt(md: string, n = 150) {
  const plain = md.replace(/\*\*/g, '').replace(/^##\s+/gm, '').replace(/^- /gm, '').replace(/\n+/g, ' ').trim();
  return plain.length > n ? plain.slice(0, n - 1).trimEnd() + '…' : plain;
}

/** An editorial index: numbered, titled, one line of context each. */
export default async function GuidesPage() {
  const me = await requireClient();
  const guides = await prisma.nutritionGuideline.findMany({ where: { active: true }, orderBy: { orderIndex: 'asc' } });

  return (
    <ClientAppShell user={shellUserOf(me)} title="Guides" subtitle={`Practical nutrition guidance from ${BRAND.coachName}. The same guides come with your meal plan.`}>
      {guides.length === 0 ? (
        <EmptyState message="Guides appear here once your coach publishes them." />
      ) : (
        <ol className="hairline divide-y divide-[var(--border-subtle)]">
          {guides.map((g) => (
            <li key={g.id}>
              <Link href={`/client/resources/${g.slug}`} className="focus-ring group grid grid-cols-[3ch_1fr] gap-4 py-5 -mx-2 px-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-card-hover)] transition-colors duration-[var(--dur-1)]">
                <span className="t-stat text-[20px] text-ink-muted tnum">{String(g.orderIndex).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="t-h3 block group-hover:text-brand transition-colors">{g.title}</span>
                  <span className="t-body-sm block mt-1 max-w-[60ch]">{excerpt(g.body)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </ClientAppShell>
  );
}
