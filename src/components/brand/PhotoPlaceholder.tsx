import React from 'react';
import { Monogram } from './Logo';

interface PhotoPlaceholderProps {
  label?: string;
  className?: string;
  /** Aspect ratio class, e.g. "aspect-[4/5]". */
  aspect?: string;
}

/**
 * Neutral stand-in for photography until approved, consented client images exist.
 * Off-white surface with a faint monogram; never a stock photo.
 */
export function PhotoPlaceholder({ label = 'Photo pending client consent', className = '', aspect = 'aspect-[4/5]' }: PhotoPlaceholderProps) {
  return (
    <div
      className={`${aspect} w-full rounded-2xl border border-line bg-paper flex flex-col items-center justify-center gap-3 text-center ${className}`}
      role="img"
      aria-label={label}
    >
      <Monogram size={40} tone="green" tile={false} className="opacity-20" />
      <span className="label-xs text-ink-muted px-4">{label}</span>
    </div>
  );
}
