'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { Sheet } from '@/components/ui/Sheet';
import { toast } from '@/components/ui/Toast';
import { PLAN_DETAILS, type PlanTier } from '@/lib/services/entitlements';
import { cn } from '@/lib/cn';

const ORDER: PlanTier[] = ['FREE', 'SILVER', 'GOLD', 'DIAMOND'];
const price = (n: number) => (n === 0 ? 'Free' : `₦${n.toLocaleString()} a month`);

/** Plans as rows with what each adds; switching is confirmed in a sheet. */
export function PlanSwitcher({ current, onTrial }: { current: PlanTier; onTrial: boolean }) {
  const router = useRouter();
  const [choice, setChoice] = useState<PlanTier | null>(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!choice) return;
    setBusy(true);
    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planTier: choice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not change your plan.');
      toast(`You are now on ${PLAN_DETAILS[choice].name}`);
      setChoice(null);
      router.refresh();
    } catch (e) {
      toast.error('Plan not changed', e instanceof Error ? e.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  const target = choice ? PLAN_DETAILS[choice] : null;

  return (
    <>
      <ul className="divide-y divide-[var(--border-subtle)] hairline hairline-b">
        {ORDER.map((tier) => {
          const plan = PLAN_DETAILS[tier];
          const isCurrent = tier === current && !onTrial;
          return (
            <li key={tier} className="py-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="t-ui text-base">{plan.name}</p>
                  {isCurrent && <Pill tone="brand">Current</Pill>}
                  {onTrial && tier === 'GOLD' && <Pill tone="brand">On trial</Pill>}
                </div>
                <p className="t-body-sm tnum mt-1">{price(plan.priceNgn)} · {plan.tagline}</p>
              </div>
              {!isCurrent && (
                <Button size="sm" variant={tier === 'GOLD' ? 'primary' : 'secondary'} onClick={() => setChoice(tier)} className="justify-self-start md:justify-self-end">
                  {tier === 'FREE' ? 'Move to Starter' : `Choose ${plan.name}`}
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      <Sheet
        open={Boolean(choice)}
        onOpenChange={(o) => !o && setChoice(null)}
        title={target ? `Switch to ${target.name}?` : ''}
        description={target ? price(target.priceNgn) : undefined}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setChoice(null)}>Cancel</Button>
            <Button full loading={busy} onClick={confirm}>Switch plan</Button>
          </div>
        }
      >
        {target && (
          <ul className="space-y-3">
            {target.bulletPoints.map((b) => (
              <li key={b} className={cn('flex gap-3 t-body-sm text-ink')}>
                <Check size={16} className="text-brand shrink-0 mt-0.5" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        )}
      </Sheet>
    </>
  );
}
