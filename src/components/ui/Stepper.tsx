'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { haptic } from '@/lib/haptics';

/**
 * Large −/+ control for kg, reps and sets. 52px targets, long-press
 * accelerates, haptic tick where the device supports it.
 */
export function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 999,
  unit,
  precision = 0,
  className,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  precision?: number;
  className?: string;
}) {
  const timer = React.useRef<number | null>(null);
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Round to the step's own precision (2.5 -> 1 decimal) so steps never drift.
  const stepDecimals = (String(step).split('.')[1] ?? '').length;
  const decimals = Math.max(precision, stepDecimals);
  const clamp = (v: number) => Math.min(max, Math.max(min, Number(v.toFixed(decimals))));
  const bump = (dir: 1 | -1) => {
    const next = clamp(valueRef.current + dir * step);
    if (next !== valueRef.current) {
      haptic();
      onChange(next);
    }
  };

  const start = (dir: 1 | -1) => {
    bump(dir);
    let delay = 400;
    const tick = () => {
      bump(dir);
      delay = Math.max(60, delay * 0.8);
      timer.current = window.setTimeout(tick, delay);
    };
    timer.current = window.setTimeout(tick, delay);
  };
  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  React.useEffect(() => stop, []);

  const btn = 'focus-ring h-[52px] w-[52px] shrink-0 rounded-full border border-[var(--border-input)] bg-[var(--bg-input)] text-ink flex items-center justify-center active:bg-brand-soft transition-colors duration-[var(--dur-1)] select-none touch-none';

  return (
    <div className={cn('space-y-2', className)}>
      <p className="t-caption text-center">{label}</p>
      <div className="flex items-center gap-2">
        <button type="button" aria-label={`Decrease ${label}`} className={btn} onPointerDown={() => start(-1)} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bump(-1); } }}>
          <Minus size={20} />
        </button>
        <output className="flex-1 text-center t-stat text-[28px]" aria-live="polite">
          {value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals })}
          {unit && <span className="text-ink-muted text-sm font-medium ml-1">{unit}</span>}
        </output>
        <button type="button" aria-label={`Increase ${label}`} className={btn} onPointerDown={() => start(1)} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bump(1); } }}>
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
