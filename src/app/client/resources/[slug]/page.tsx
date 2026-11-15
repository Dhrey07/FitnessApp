import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { SimpleMarkdown } from '@/components/brand/SimpleMarkdown';
import { prisma } from '@/lib/db';
import { BRAND } from '@/lib/brand';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await prisma.nutritionGuideline.findUnique({ where: { slug } });
  return { title: g ? g.title : 'Guide' };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await prisma.nutritionGuideline.findUnique({ where: { slug } });
  if (!guide || !guide.active) notFound();

  const [prev, next] = await Promise.all([
    prisma.nutritionGuideline.findFirst({ where: { active: true, orderIndex: { lt: guide.orderIndex } }, orderBy: { orderIndex: 'desc' } }),
    prisma.nutritionGuideline.findFirst({ where: { active: true, orderIndex: { gt: guide.orderIndex } }, orderBy: { orderIndex: 'asc' } }),
  ]);

  return (
    <ClientAppShell title={guide.title} subtitle={`Guide ${guide.orderIndex} · ${BRAND.legalName}`}>
      <Link href="/client/resources" className="text-xs text-brand hover:underline inline-flex items-center gap-1.5 font-semibold">
        <ArrowLeft size={14} /> All guides
      </Link>
      <article className="surface p-6 sm:p-8 max-w-3xl w-full">
        <SimpleMarkdown source={guide.body} />
      </article>
      <nav className="flex items-center justify-between gap-3 max-w-3xl w-full text-sm" aria-label="Guide navigation">
        {prev ? <Link href={`/client/resources/${prev.slug}`} className="btn-secondary text-xs"><ArrowLeft size={13} /> {prev.title}</Link> : <span />}
        {next ? <Link href={`/client/resources/${next.slug}`} className="btn-secondary text-xs">{next.title} <ArrowRight size={13} /></Link> : <span />}
      </nav>
    </ClientAppShell>
  );
}
