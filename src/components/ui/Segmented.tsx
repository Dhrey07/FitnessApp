'use client';

import * as React from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { cn } from '@/lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

/**
 * 2 to 4 options with a sliding indicator. Full width on mobile.
 * Rendered as a radiogroup for keyboard users.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
  size = 'md',
}: {
  value: T;
  onChange: (v: T) => void;
  options: SegmentedOption<T>[];
  label: string;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const id = React.useId();
  return (
    <LayoutGroup id={id}>
      <div role="radiogroup" aria-label={label} className={cn('inline-flex w-full md:w-auto p-1 rounded-full bg-[var(--bg-card-hover)]', className)}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn(
                'focus-ring relative flex-1 md:flex-none rounded-full font-medium transition-colors duration-[var(--dur-1)] whitespace-nowrap',
                size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
                active ? 'text-brand-on-strong' : 'text-ink-secondary hover:text-ink'
              )}
            >
              {active && (
                <motion.span
                  layoutId={`seg-${id}`}
                  className="absolute inset-0 rounded-full bg-brand-strong"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative z-10">{o.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
