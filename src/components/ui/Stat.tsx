import * as React from 'react';
import { cn } from '@/lib/cn';
import { Sparkline } from './Sparkline';

function Delta({ value, unit, goodWhen = 'down', context }: { value: number; unit?: string; goodWhen?: 'up' | 'down' | 'none'; context?: string }) {
  if (!Number.isFinite(value) || value === 0) return context ? <p className="t-body-sm">{context}</p> : null;
  const up = value > 0;
  const good = goodWhen === 'none' ? null : goodWhen === 'up' ? up : !up;
  const colour = good === null ? 'text-ink-secondary' : good ? 'text-status-approved' : 'text-status-pending';
  const word = up ? 'up' : 'down';
  return (
    <p className={cn('t-body-sm tnum', colour)}>
      {word} {Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 1 })}
      {unit ? ` ${unit}` : ''}
      {context ? <span className="text-ink-secondary"> {context}</span> : null}
    </p>
  );
}

/**
 * The one hero number on a screen. Number at stat-hero size, unit at 40%,
 * a plain-language delta line and an optional sparkline.
 */
export function HeroStat({
  label,
  value,
  unit,
  delta,
  deltaUnit,
  goodWhen = 'down',
  context,
  series,
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaUnit?: string;
  goodWhen?: 'up' | 'down' | 'none';
  /** e.g. "since last Sunday" */
  context?: string;
  series?: number[];
  className?: string;
}) {
  return (
    <div className={cn('flex items-end justify-between gap-6', className)}>
      <div className="min-w-0">
        <p className="t-body-sm">{label}</p>
        <p className="flex items-baseline gap-2 mt-1">
          <span className="t-stat-hero">{typeof value === 'number' ? value.toLocaleString() : value}</span>
          {unit && <span className="text-ink-muted font-medium text-[0.4em] leading-none" style={{ fontSize: 'max(16px, 0.4em)' }}>{unit}</span>}
        </p>
        {delta !== undefined ? <div className="mt-2"><Delta value={delta} unit={deltaUnit ?? unit} goodWhen={goodWhen} context={context} /></div> : context ? <p className="t-body-sm mt-2">{context}</p> : null}
      </div>
      {series && series.length > 1 && <Sparkline data={series} width={96} height={28} className="shrink-0 mb-1" />}
    </div>
  );
}

/** Secondary number. */
export function Stat({ label, value, unit, series, className }: { label: string; value: string | number; unit?: string; series?: number[]; className?: string }) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="flex items-baseline gap-1">
        <span className="t-stat">{typeof value === 'number' ? value.toLocaleString() : value}</span>
        {unit && <span className="text-ink-muted text-sm font-medium">{unit}</span>}
      </p>
      <div className="flex items-center justify-between gap-2 mt-1">
        <p className="t-caption">{label}</p>
        {series && series.length > 1 && <Sparkline data={series} width={48} height={16} />}
      </div>
    </div>
  );
}

/**
 * 3 to 4 stats with hairlines between. Horizontal snap scroll on mobile,
 * a row on desktop. No boxes.
 */
export function StatRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex overflow-x-auto scrollbar-hidden snap-x snap-mandatory scroll-px-4 -mx-4 px-4 md:mx-0 md:px-0 md:scroll-px-0 md:overflow-visible divide-x divide-[var(--border-subtle)]', className)}>
      {React.Children.map(children, (child) => (
        <div className="snap-start shrink-0 min-w-[30%] flex-1 md:min-w-0 px-4 first:pl-0 last:pr-0">{child}</div>
      ))}
    </div>
  );
}
