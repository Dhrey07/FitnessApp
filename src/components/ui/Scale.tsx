'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

const DEFAULT_WORDS = ['Very low', 'Low', 'Moderate', 'High', 'Very high'];

/**
 * 1 to 5 selector with word anchors at both ends and the selected word
 * shown. 44px cells. Never bare numbered radios.
 */
export function Scale({
  label,
  value,
  onChange,
  words = DEFAULT_WORDS,
  help,
  className,
}: {
  label: React.ReactNode;
  value: number | null;
  onChange: (v: number) => void;
  /** Five words, lowest to highest. */
  words?: string[];
  help?: React.ReactNode;
  className?: string;
}) {
  const id = React.useId();
  return (
    <fieldset className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <legend className="t-ui">{label}</legend>
        <span className="t-body-sm tnum" aria-live="polite">{value ? words[value - 1] : ' '}</span>
      </div>
      <div role="radiogroup" aria-labelledby={id} className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${n}, ${words[n - 1]}`}
              onClick={() => onChange(n)}
              className={cn(
                'focus-ring h-11 rounded-[var(--radius-sm)] border text-sm font-semibold tnum transition-colors duration-[var(--dur-1)]',
                active ? 'bg-brand-strong text-brand-on-strong border-transparent' : 'bg-[var(--bg-input)] border-[var(--border-input)] text-ink-secondary hover:border-line-active'
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between t-caption">
        <span>{words[0]}</span>
        <span>{words[4]}</span>
      </div>
      {help && <p className="t-caption">{help}</p>}
    </fieldset>
  );
}
