import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { PLAN_DETAILS } from '@/lib/services/entitlements';

export function PricingSection() {
  const plans = [PLAN_DETAILS.FREE, PLAN_DETAILS.SILVER, PLAN_DETAILS.GOLD, PLAN_DETAILS.DIAMOND];

  return (
    <section id="plans" className="py-20 sm:py-24 bg-surface border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="label-xs text-brand">Plans</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-heading)]">
            Choose the level of coaching you need.
          </h2>
          <p className="text-ink-secondary leading-relaxed">
            Every plan starts with a free assessment. Paid plans include a 14-day trial, bill monthly and can be cancelled at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map((plan) => {
            const featured = plan.tier === 'GOLD';
            const isFree = plan.tier === 'FREE';
            return (
              <div
                key={plan.tier}
                className={`relative flex flex-col justify-between gap-6 p-6 rounded-2xl border bg-paper ${
                  featured ? 'border-[var(--brand)] shadow-[0_8px_30px_rgba(11,61,46,0.08)]' : 'border-line'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 badge badge-tier-gold">{plan.badge}</span>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-ink">{plan.name}</h3>
                    <p className="text-xs text-ink-muted mt-1 min-h-[32px]">{plan.tagline}</p>
                  </div>
                  <div className="pt-3 border-t border-line">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-extrabold text-ink">
                        {isFree ? 'Free' : `₦${plan.priceNgn.toLocaleString()}`}
                      </span>
                      {!isFree && <span className="text-xs text-ink-muted">/ month</span>}
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">{isFree ? 'No card needed' : '14-day free trial included'}</p>
                  </div>
                  <ul className="space-y-2.5 pt-3 border-t border-line text-sm text-ink-secondary">
                    {plan.bulletPoints.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-brand shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/onboarding"
                  className={`text-sm w-full justify-center py-3 ${featured ? 'btn-brand' : 'btn-secondary'}`}
                >
                  {isFree ? 'Create a free account' : 'Start 14-day trial'} <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
