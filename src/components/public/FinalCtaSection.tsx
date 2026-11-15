import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND } from '@/lib/brand';

export function FinalCtaSection() {
  return (
    <section className="py-20 sm:py-24 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-6">
        <p className="label-xs text-brand">{BRAND.tagline}</p>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-heading)]">
          Start with a five-minute assessment.
        </h2>
        <p className="text-ink-secondary leading-relaxed max-w-xl mx-auto">
          You will get your calorie and protein targets straight away. If you choose a coaching plan, the first 14 days are free and you can cancel at any time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/onboarding" className="btn-brand text-sm px-8 py-3.5 w-full sm:w-auto">
            Start your assessment <ArrowRight size={16} />
          </Link>
          <a href="#plans" className="btn-secondary text-sm px-7 py-3.5 w-full sm:w-auto">
            Compare plans
          </a>
        </div>
      </div>
    </section>
  );
}
