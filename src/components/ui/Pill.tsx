import * as React from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'brand' | 'pending' | 'approved' | 'modified' | 'rejected';

const tones: Record<Tone, string> = {
  neutral: 'bg-[var(--bg-card-hover)] text-ink-secondary',
  brand: 'bg-brand-soft text-brand',
  pending: 'bg-[color-mix(in_srgb,var(--status-pending)_14%,transparent)] text-status-pending',
  approved: 'bg-[color-mix(in_srgb,var(--status-approved)_14%,transparent)] text-status-approved',
  modified: 'bg-[color-mix(in_srgb,var(--status-modified)_14%,transparent)] text-status-modified',
  rejected: 'bg-[color-mix(in_srgb,var(--status-rejected)_14%,transparent)] text-status-rejected',
};

/**
 * Status only. One per row. Never holds a number on its own; numbers are
 * typeset beside it.
 */
export function Pill({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium whitespace-nowrap', tones[tone], className)}>
      {children}
    </span>
  );
}
