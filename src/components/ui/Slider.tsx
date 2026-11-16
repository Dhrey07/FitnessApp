'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

/** Percentages only. The value is typeset above the thumb. */
export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 5,
  unit = '%',
  help,
  className,
}: {
  label: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  help?: React.ReactNode;
  className?: string;
}) {
  const id = React.useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="t-ui">{label}</label>
        <span className="t-stat text-[20px]">{value}<span className="text-ink-muted text-sm font-medium ml-0.5">{unit}</span></span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="v2-range w-full"
        style={{ ['--pct' as string]: `${pct}%` }}
      />
      {help && <p className="t-caption">{help}</p>}
      <style jsx global>{`
        .v2-range { -webkit-appearance: none; appearance: none; height: 44px; background: transparent; }
        .v2-range::-webkit-slider-runnable-track { height: 4px; border-radius: 999px; background: linear-gradient(to right, var(--brand) var(--pct), var(--border-subtle) var(--pct)); }
        .v2-range::-moz-range-track { height: 4px; border-radius: 999px; background: var(--border-subtle); }
        .v2-range::-moz-range-progress { height: 4px; border-radius: 999px; background: var(--brand); }
        .v2-range::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; margin-top: -10px; border-radius: 999px; background: var(--bg-surface); border: 2px solid var(--brand); box-shadow: var(--shadow-raised); }
        .v2-range::-moz-range-thumb { width: 24px; height: 24px; border-radius: 999px; background: var(--bg-surface); border: 2px solid var(--brand); }
        .v2-range:focus-visible { outline: none; }
        .v2-range:focus-visible::-webkit-slider-thumb { outline: 2px solid var(--brand); outline-offset: 2px; }
      `}</style>
    </div>
  );
}
