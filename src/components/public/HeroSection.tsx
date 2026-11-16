import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { resolvePhoto } from '@/lib/photos';

/**
 * Poster headline beside the photograph (never over it, so the headline
 * keeps full contrast). The monogram texture lives in the training section. Mobile: 4:5 photo with the headline set
 * over its lower half. Desktop: headline and photo share the row, bottoms aligned.
 */
export function HeroSection() {
  const mobile = resolvePhoto('hero-mobile');
  const desktop = resolvePhoto('hero-desktop');

  return (
    <section className="relative bg-paper overflow-hidden">
      {/* Mobile */}
      <div className="md:hidden relative">
        <Photo photo={mobile} alt="A client mid-session in natural light" ratio="4/5" radius="none" priority sizes="100vw" duotone={0.3} className="min-h-[560px]" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8">
          <h1 className="t-poster text-[var(--brand-offwhite)]" style={{ fontSize: 'clamp(44px, 12vw, 56px)', color: 'var(--brand-offwhite)' }}>
            Sustainable transformation, built around your life.
          </h1>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block pub-container pt-28 lg:pt-32">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="col-span-6 relative z-10 pb-2">
            <h1 className="t-poster" style={{ fontSize: 'clamp(48px, 5vw, 88px)' }}>
              Sustainable transformation, built around your life.
            </h1>
          </div>
          <div className="col-span-6">
            <Photo photo={desktop} alt="A client mid-session in natural light" ratio="4/5" priority sizes="50vw" className="max-h-[640px] w-full" />
          </div>
        </div>
      </div>

      {/* Sentence, action, text link */}
      <div className="pub-container py-8 md:py-10">
        <div className="md:grid md:grid-cols-12 md:items-start">
          <div className="md:col-span-5 space-y-6">
            <p className="t-body text-ink-secondary max-w-[44ch]">
              Personalised nutrition, training and weekly coaching for adults who want the result to last.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button href="/onboarding" size="lg">Start your assessment</Button>
              <Link href="#coaching" className="t-ui inline-flex items-center gap-1.5 text-ink hover:text-brand transition-colors">
                See how coaching works <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Numbers strip */}
      <div className="pub-container">
        <dl className="hairline hairline-b grid grid-cols-3 divide-x divide-[var(--border-subtle)]">
          {[
            ['12', 'weeks', 'per programme block'],
            ['1', 'coach', 'reading every check-in'],
            ['7', 'days', 'between adjustments'],
          ].map(([n, u, l]) => (
            <div key={l} className="py-6 md:py-8 px-4 first:pl-0 last:pr-0">
              <dt className="sr-only">{l}</dt>
              <dd>
                <p className="flex items-baseline gap-1.5">
                  <span className="t-stat md:text-[36px]">{n}</span>
                  <span className="text-sm text-ink-muted font-medium">{u}</span>
                </p>
                <p className="t-caption mt-1">{l}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
