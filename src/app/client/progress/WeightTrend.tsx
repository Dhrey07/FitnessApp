'use client';

import React, { useMemo, useState } from 'react';
import { LineChart, Segmented, EmptyState } from '@/components/ui';

export interface TrendPoint {
  date: string;
  weightKg: number;
}

/**
 * Signature moment: the weight trend as the page's hero, with the
 * champagne target line and a 4 / 8 / 12 week range.
 */
export function WeightTrend({ points, target }: { points: TrendPoint[]; target: number | null }) {
  const [range, setRange] = useState<'4' | '8' | '12'>('12');

  const data = useMemo(() => {
    const cutoff = Date.now() - Number(range) * 7 * 86400000;
    return points
      .filter((p) => new Date(p.date).getTime() >= cutoff)
      .map((p) => ({ label: new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), value: p.weightKg }));
  }, [points, range]);

  const values = data.map((d) => d.value).concat(target != null ? [target] : []);
  const min = values.length ? Math.floor(Math.min(...values) - 1) : 0;
  const max = values.length ? Math.ceil(Math.max(...values) + 1) : 1;

  return (
    <section aria-label="Weight trend" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="t-h3">Weight</h2>
          <p className="t-body-sm mt-1">{target != null ? `Target ${target} kg, shown as the dashed line` : 'From your weekly check-ins'}</p>
        </div>
        <Segmented label="Range" size="sm" value={range} onChange={setRange} options={[{ value: '4', label: '4 wk' }, { value: '8', label: '8 wk' }, { value: '12', label: '12 wk' }]} className="w-auto md:w-auto" />
      </div>
      {data.length < 2 ? (
        <EmptyState message="Your trend line appears after two check-ins in this range." className="py-10" />
      ) : (
        <div className="-mx-2 md:mx-0">
          <LineChart data={data} unit="kg" target={target ?? undefined} height={260} domain={[min, max]} />
        </div>
      )}
    </section>
  );
}
