'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * 2 to 4 options with a sliding indicator, done with a CSS transition so no
 * animation library ships. Full width on mobile. A radiogroup for keyboard
 * users; arrow keys move the selection.
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
  const track = React.useRef<HTMLDivElement>(null);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [box, setBox] = React.useState<{ x: number; w: number } | null>(null);
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  const measure = React.useCallback(() => {
    const el = refs.current[index];
    if (el) setBox({ x: el.offsetLeft, w: el.offsetWidth });
  }, [index]);

  useIsoLayoutEffect(measure, [measure, options.length]);
  React.useEffect(() => {
    if (!track.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    // Buttons can change width without the track changing (flex-1 on phones, auto on desktop).
    refs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [measure]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const j = (next + options.length) % options.length;
    onChange(options[j].value);
    refs.current[j]?.focus();
  };

  return (
    <div ref={track} role="radiogroup" aria-label={label} className={cn('relative inline-flex w-full md:w-auto p-1 rounded-full bg-[var(--bg-card-hover)]', className)}>
      {box && (
        <span
          aria-hidden
          className="absolute top-1 bottom-1 left-0 rounded-full bg-brand-strong transition-[transform,width] duration-[var(--dur-2)] ease-[var(--ease-enter)] motion-reduce:transition-none"
          style={{ width: box.w, transform: `translateX(${box.x}px)` }}
        />
      )}
      {options.map((o, i) => {
        const active = i === index;
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
              'focus-ring relative z-10 flex-1 md:flex-none rounded-full font-medium transition-colors duration-[var(--dur-1)] whitespace-nowrap',
              size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
              active ? 'text-brand-on-strong' : 'text-ink-secondary hover:text-ink',
              // Before the indicator is measured (first paint), the active option paints its own fill.
              active && !box && 'bg-brand-strong'
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
