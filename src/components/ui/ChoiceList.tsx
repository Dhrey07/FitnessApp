'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface Choice<T extends string> {
  value: T;
  title: string;
  description?: string;
}

/**
 * Single-choice list as rows with hairlines, not cards. Selected row gets
 * the brand tint and a check. Arrow keys move between options.
 */
export function ChoiceList<T extends string>({
  label,
  value,
  onChange,
  options,
  columns = 1,
  className,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Choice<T>[];
  /** 2 lays options out in two columns from 768px. */
  columns?: 1 | 2;
  className?: string;
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const j = (next + options.length) % options.length;
    onChange(options[j].value);
    refs.current[j]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className={cn('grid gap-2', columns === 2 && 'md:grid-cols-2', className)}>
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              'focus-ring w-full text-left flex items-start gap-3 px-4 py-3.5 min-h-14 rounded-[var(--radius-sm)] border transition-colors duration-[var(--dur-1)]',
              active ? 'border-line-active bg-brand-soft' : 'border-[var(--border-input)] bg-[var(--bg-input)] hover:border-line-active'
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="t-ui block">{o.title}</span>
              {o.description && <span className="t-caption block mt-0.5">{o.description}</span>}
            </span>
            <span
              aria-hidden
              className={cn(
                'mt-0.5 h-5 w-5 shrink-0 rounded-full border flex items-center justify-center transition-colors',
                active ? 'bg-brand-strong border-transparent text-brand-on-strong' : 'border-[var(--border-input)]'
              )}
            >
              {active && <Check size={12} strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
