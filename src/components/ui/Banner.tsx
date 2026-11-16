import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Inset tone only. For trial state and coach notes. Title optional, one
 * line of text, at most one action.
 */
export function Banner({ title, children, action, className }: { title?: React.ReactNode; children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('surface-inset flex items-center gap-4 px-4 py-3', className)}>
      <div className="min-w-0 flex-1">
        {title && <p className="t-ui">{title}</p>}
        <p className="t-body-sm">{children}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** A quoted coach note with attribution. */
export function Quote({ children, by, when, className }: { children: React.ReactNode; by: string; when?: string; className?: string }) {
  return (
    <figure className={cn('surface-inset px-5 py-4', className)}>
      <blockquote className="t-body text-ink">{children}</blockquote>
      <figcaption className="t-caption mt-2">
        {by}
        {when ? ` · ${when}` : ''}
      </figcaption>
    </figure>
  );
}
