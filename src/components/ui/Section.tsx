import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * A titled block separated by a hairline, never a card. Title left,
 * optional action right. Inside the app shell there are no overlines.
 */
export function Section({
  title,
  description,
  action,
  className,
  children,
  first = false,
  id,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  /** Suppresses the hairline for the first section on a page. */
  first?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cn(!first && 'hairline pt-6', 'space-y-4', className)}>
      {(title || action) && (
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            {title && <h2 className="t-h3">{title}</h2>}
            {description && <p className="t-body-sm mt-1">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/** Page-level header: large title, one-line description, primary action. */
export function PageHeader({
  title,
  description,
  action,
  meta,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Small line above the title, e.g. the date. Sentence case, not an overline. */
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {meta && <p className="t-body-sm mb-1">{meta}</p>}
        <h1 className="t-h1 truncate">{title}</h1>
        {description && <p className="t-body-sm mt-2 max-w-[60ch]">{description}</p>}
      </div>
      {action && <div className="hidden md:block shrink-0">{action}</div>}
    </header>
  );
}
