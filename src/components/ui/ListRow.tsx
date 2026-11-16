import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ListRowProps {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Value, pill or custom node on the right. */
  trailing?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** Shows a chevron. Defaults to true when href or onClick is set. */
  chevron?: boolean;
  className?: string;
  /** Adds hairline between rows when used inside <ListRows>. */
  divided?: boolean;
}

/**
 * 56px row with leading, title/subtitle and trailing slots. Renders as a
 * link, button or plain row depending on props. Groups of rows use
 * <ListRows> for hairlines.
 */
export function ListRow({ leading, title, subtitle, trailing, href, onClick, chevron, className }: ListRowProps) {
  const interactive = Boolean(href || onClick);
  const showChevron = chevron ?? interactive;
  const inner = (
    <>
      {leading && <div className="shrink-0 flex items-center">{leading}</div>}
      <div className="min-w-0 flex-1">
        <p className="t-ui truncate">{title}</p>
        {subtitle && <p className="t-caption truncate mt-0.5">{subtitle}</p>}
      </div>
      {trailing && <div className="shrink-0 flex items-center tnum text-ink-secondary text-sm">{trailing}</div>}
      {showChevron && <ChevronRight size={16} className="shrink-0 text-ink-muted" aria-hidden />}
    </>
  );
  const classes = cn(
    'flex items-center gap-3 min-h-14 w-full text-left py-3',
    interactive && 'focus-ring -mx-2 px-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-card-hover)] transition-colors duration-[var(--dur-1)]',
    className
  );
  if (href) return <Link href={href} className={classes}>{inner}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className={classes}>{inner}</button>;
  return <div className={classes}>{inner}</div>;
}

/** Wraps rows with hairlines between them. */
export function ListRows({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('divide-y divide-[var(--border-subtle)]', className)}>{children}</div>;
}
