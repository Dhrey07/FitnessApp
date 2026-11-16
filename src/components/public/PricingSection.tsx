'use client';

import React, { useState } from 'react';
import { Check, Minus } from 'lucide-react';
import { PLAN_DETAILS, type FeatureKey, type PlanTier } from '@/lib/services/entitlements';
import { Button, Segmented } from '@/components/ui';
import { cn } from '@/lib/cn';

const PLANS = [PLAN_DETAILS.FREE, PLAN_DETAILS.SILVER, PLAN_DETAILS.GOLD, PLAN_DETAILS.DIAMOND];
const HIGHLIGHT: PlanTier = 'GOLD';

const ROWS: { key: FeatureKey; label: string; note?: string }[] = [
  { key: 'nutrition_log', label: 'Meal logging with coach check' },
  { key: 'weekly_checkin', label: 'Weekly check-in with written feedback' },
  { key: 'personalised_nutrition', label: 'Personalised meal plan on familiar foods' },
  { key: 'personalised_training', label: 'Personalised training programme, home or gym' },
  { key: 'whatsapp_accountability', label: 'WhatsApp accountability with your coach' },
  { key: 'coaching_calls', label: 'Fortnightly one-to-one calls' },
  { key: 'one_on_one_coaching', label: 'Priority same-day feedback' },
  { key: 'progress_reports', label: 'Monthly branded progress report' },
];

const price = (n: number) => (n === 0 ? 'Free' : `₦${n.toLocaleString()}`);

/**
 * Desktop: a comparison table, plans as columns, the Signature column framed
 * by a champagne hairline. Mobile: a segmented control switching plan
 * detail. Price typeset as a stat. "Starter is free" stated once.
 */
export function PricingSection() {
  const [tier, setTier] = useState<PlanTier>(HIGHLIGHT);
  const active = PLAN_DETAILS[tier];

  return (
    <section id="plans" className="pub-section bg-surface">
      <div className="pub-container space-y-12 md:space-y-16">
        <div className="pub-reading">
          <p className="t-overline">Plans</p>
          <h2 className="t-display mt-3">Choose the level of coaching you need.</h2>
          <p className="t-body text-ink-secondary mt-5">Starter is free. Paid plans include a 14-day trial, bill monthly in Naira, and can be cancelled at any time.</p>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-6">
          <Segmented
            label="Plan"
            value={tier}
            onChange={setTier}
            size="sm"
            options={PLANS.map((p) => ({ value: p.tier, label: p.tier === 'DIAMOND' ? 'Private' : p.name }))}
          />
          <div className="motion-enter" key={tier}>
            <p className="flex items-baseline gap-2">
              <span className="t-stat-hero">{price(active.priceNgn)}</span>
              {active.priceNgn > 0 && <span className="text-ink-muted font-medium">per month</span>}
            </p>
            <p className="t-body-sm mt-2">{active.tagline}</p>
            <ul className="mt-6 divide-y divide-[var(--border-subtle)] hairline hairline-b">
              {ROWS.map((r) => {
                const has = active.features.includes(r.key);
                return (
                  <li key={r.key} className={cn('flex items-center gap-3 py-3 text-sm', has ? 'text-ink' : 'text-ink-muted')}>
                    {has ? <Check size={16} className="text-brand shrink-0" aria-label="Included" /> : <Minus size={16} className="shrink-0" aria-label="Not included" />}
                    {r.label}
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <Button href="/onboarding" full size="lg">{active.priceNgn === 0 ? 'Create a free account' : `Start ${active.name} trial`}</Button>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th scope="col" className="text-left align-bottom pb-6 pr-6 w-[32%]">
                  <span className="sr-only">Feature</span>
                </th>
                {PLANS.map((p) => {
                  const hl = p.tier === HIGHLIGHT;
                  return (
                    <th key={p.tier} scope="col" className={cn('text-left align-bottom pb-6 px-5 font-normal', hl && 'border-x border-t border-[var(--accent)] rounded-t-[var(--radius-md)] pt-5')}>
                      {p.badge ? <p className="t-caption mb-2">{p.badge}</p> : <p className="t-caption mb-2">&nbsp;</p>}
                      <p className="t-h3">{p.name}</p>
                      <p className="flex items-baseline gap-1.5 mt-3">
                        <span className="t-stat">{price(p.priceNgn)}</span>
                        {p.priceNgn > 0 && <span className="text-ink-muted text-xs whitespace-nowrap">/ month</span>}
                      </p>
                      <p className="t-caption mt-2 min-h-[2.8em]">{p.tagline}</p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r.key}>
                  <th scope="row" className="text-left font-normal py-3.5 pr-6 border-t border-[var(--border-subtle)] text-ink">
                    {r.label}
                  </th>
                  {PLANS.map((p) => {
                    const has = p.features.includes(r.key);
                    const hl = p.tier === HIGHLIGHT;
                    return (
                      <td key={p.tier} className={cn('py-3.5 px-5 border-t border-[var(--border-subtle)]', hl && 'border-x border-[var(--accent)]', i === 0 && hl && 'border-t-[var(--border-subtle)]')}>
                        {has ? <Check size={18} className="text-brand" aria-label="Included" /> : <Minus size={18} className="text-ink-muted" aria-label="Not included" />}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="pt-6" />
                {PLANS.map((p) => {
                  const hl = p.tier === HIGHLIGHT;
                  return (
                    <td key={p.tier} className={cn('pt-6 px-5 pb-5 align-top', hl && 'border-x border-b border-[var(--accent)] rounded-b-[var(--radius-md)]')}>
                      <Button href="/onboarding" full size="sm" variant={hl ? 'primary' : 'secondary'}>
                        {p.priceNgn === 0 ? 'Create account' : 'Start trial'}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
