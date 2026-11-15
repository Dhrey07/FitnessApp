import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { prisma } from '@/lib/db';
import { BRAND } from '@/lib/brand';

export const dynamic = 'force-dynamic';

function excerpt(md: string, n = 140) {
  const plain = md.replace(/\*\*/g, '').replace(/\n+/g, ' ').trim();
  return plain.length > n ? plain.slice(0, n - 1).trimEnd() + '…' : plain;
}

export default async function GuidesPage() {
  const guides = await prisma.nutritionGuideline.findMany({ where: { active: true }, orderBy: { orderIndex: 'asc' } });

  return (
    <ClientAppShell title="Guides" subtitle={`Practical nutrition guidelines from ${BRAND.coachName}. They are also included with your meal plan.`}>
      {guides.length === 0 && <div className="surface p-6 text-sm text-ink-muted">Guides will appear here once published.</div>}
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {guides.map((g) => (
          <li key={g.id}>
            <Link href={`/client/resources/${g.slug}`} className="surface surface-hover p-5 flex gap-4 h-full">
              <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand font-bold text-sm flex items-center justify-center shrink-0">{g.orderIndex}</span>
              <span className="min-w-0 flex-1">
                <span className="font-display font-bold text-ink block">{g.title}</span>
                <span className="text-xs text-ink-secondary block mt-1 leading-relaxed">{excerpt(g.body)}</span>
                <span className="text-xs text-brand font-semibold inline-flex items-center gap-1 mt-2">Read <ArrowRight size={12} /></span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="text-xs text-ink-muted flex items-center gap-1.5"><BookOpen size={13} /> Evidence-informed, written for everyday life. Ask at your check-in if anything is unclear.</p>
    </ClientAppShell>
  );
}
