import * as React from 'react';
import { cn } from '@/lib/cn';

/** Progress to a target: a 2px bar with the number typeset above. Never a ring. */
export function ProgressBar({ value, max, label, unit, className }: { value: number; max: number; label?: string; unit?: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex items-baseline justify-between">
          <span className="t-body-sm">{label}</span>
          <span className="tnum text-sm">
            <span className="font-semibold text-ink">{value.toLocaleString()}</span>
            <span className="text-ink-muted"> / {max.toLocaleString()}{unit ? ` ${unit}` : ''}</span>
          </span>
        </div>
      )}
      <div className="h-0.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className="h-full bg-brand rounded-full transition-[width] duration-[var(--dur-3)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
