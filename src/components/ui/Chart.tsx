'use client';

import * as React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/cn';

interface Point {
  label: string;
  value: number;
}

const axisStyle = { fontSize: 12, fill: 'var(--text-muted)' } as const;

function TipBox({ active, payload, label, unit }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-panel elev-raised px-3 py-2 text-sm">
      <p className="t-caption">{label}</p>
      <p className="tnum font-medium">
        {payload[0].value.toLocaleString()}
        {unit ? ` ${unit}` : ''}
      </p>
    </div>
  );
}

/**
 * The one line style: 2px deep green, green-100 area at 25%, champagne
 * dashed target line, horizontal hairlines only. 300ms fade on first paint.
 */
export function LineChart({ data, unit, target, height = 220, className, domain }: { data: Point[]; unit?: string; target?: number; height?: number; className?: string; domain?: [number | 'auto', number | 'auto'] }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <div className={cn('motion-enter w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} domain={domain ?? ['auto', 'auto']} />
          <Tooltip content={<TipBox unit={unit} />} cursor={{ stroke: 'var(--border-active)', strokeWidth: 1 }} />
          {target !== undefined && <ReferenceLine y={target} stroke="var(--accent)" strokeDasharray="4 4" />}
          <Area type="monotone" dataKey="value" stroke="var(--brand)" strokeWidth={2} fill={`url(#fill-${id})`} dot={false} activeDot={{ r: 4, fill: 'var(--brand)', strokeWidth: 0 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarsChart({ data, unit, target, height = 200, className }: { data: Point[]; unit?: string; target?: number; height?: number; className?: string }) {
  return (
    <div className={cn('motion-enter w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<TipBox unit={unit} />} cursor={{ fill: 'var(--bg-card-hover)' }} />
          {target !== undefined && <ReferenceLine y={target} stroke="var(--accent)" strokeDasharray="4 4" />}
          <Bar dataKey="value" fill="var(--brand)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
