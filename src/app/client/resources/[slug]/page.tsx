import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { SimpleMarkdown } from '@/components/brand/SimpleMarkdown';
import { prisma } from '@/lib/db';
import { BRAND } from '@/lib/brand';
import { requireClient, shellUserOf } from '@/lib/client/data';
import { cn } from '@/lib/cn';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await prisma.nutritionGuideline.findUnique({ where: { slug } });
  return { title: g ? g.title : 'Guide' };
}

/** Reading-width article; the full guide list sits in the desktop rail. */
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const me = await requireClient();
  const { slug } = await params;
  const [guide, all] = await Promise.all([
    prisma.nutritionGuideline.findUnique({ where: { slug } }),
    prisma.nutritionGuideline.findMany({ where: { active: true }, orderBy: { orderIndex: 'asc' }, select: { slug: true, title: true, orderIndex: true } }),
  ]);
  if (!guide || !guide.active) notFound();

  const i = all.findIndex((g) => g.slug === slug);
  const prev = i > 0 ? all[i - 1] : null;
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null;

  return (
    <ClientAppShell
      user={shellUserOf(me)}
      meta={`Guide ${guide.orderIndex} of ${all.length}`}
      title={guide.title}
      back={
        <Link href="/client/resources" aria-label="All guides" className="focus-ring h-11 w-11 rounded-full flex items-center justify-center text-ink-secondary">
          <ChevronLeft size={22} />
        </Link>
      }
      rail={
        <nav aria-label="All guides">
          <p className="t-ui mb-3">All guides</p>
          <ol className="space-y-1">
            {all.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/client/resources/${g.slug}`}
                  aria-current={g.slug === slug ? 'page' : undefined}
                  className={cn('block py-1.5 text-sm leading-snug hover:text-ink transition-colors', g.slug === slug ? 'text-brand font-medium' : 'text-ink-secondary')}
                >
                  <span className="tnum text-ink-muted mr-2">{String(g.orderIndex).padStart(2, '0')}</span>
                  {g.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      }
    >
      <Link href="/client/resources" className="hidden md:inline-flex items-center gap-1.5 t-body-sm hover:text-ink">
        <ArrowLeft size={14} aria-hidden /> All guides
      </Link>
      <article className="pub-reading">
        <span className="accent-rule mb-6" aria-hidden />
        <SimpleMarkdown source={guide.body} className="!text-base !leading-[1.7]" />
        <p className="t-caption mt-8">{BRAND.coachName} · {BRAND.legalName}</p>
      </article>
      <nav className="hairline pt-6 grid grid-cols-2 gap-4 pub-reading" aria-label="Previous and next guide">
        {prev ? (
          <Link href={`/client/resources/${prev.slug}`} className="focus-ring group block">
            <span className="t-caption inline-flex items-center gap-1"><ArrowLeft size={12} aria-hidden /> Previous</span>
            <span className="t-ui block mt-1 group-hover:text-brand">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/client/resources/${next.slug}`} className="focus-ring group block text-right">
            <span className="t-caption inline-flex items-center gap-1">Next <ArrowRight size={12} aria-hidden /></span>
            <span className="t-ui block mt-1 group-hover:text-brand">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </ClientAppShell>
  );
}
