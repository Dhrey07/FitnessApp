'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * iOS-style large title. On mobile the 32px title sits in the flow and a
 * 48px bar at the top crossfades the title in once it scrolls away. On
 * desktop it is simply the page's H1 row.
 */
export function LargeTitle({
  title,
  description,
  meta,
  action,
  back,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small line above the title (the date). Sentence case. */
  meta?: React.ReactNode;
  /** One trailing action, shown in the bar on mobile and beside the title on desktop. */
  action?: React.ReactNode;
  /** Leading back control for sub-screens. */
  back?: React.ReactNode;
  className?: string;
}) {
  const sentinel = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCollapsed(!entry.isIntersecting), { rootMargin: '-48px 0px 0px 0px', threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div>
      {/* Mobile bar */}
      <div className="md:hidden sticky top-0 z-30 h-12 -mx-4 px-2 mb-2 flex items-center gap-1 bg-[var(--bg-header)] backdrop-blur-md transition-shadow duration-[var(--dur-2)]" style={{ boxShadow: collapsed ? '0 1px 0 var(--border-subtle)' : 'none' }}>
        <div className="w-11 shrink-0 flex items-center justify-center">{back}</div>
        <p className={cn('flex-1 text-center text-[15px] font-semibold text-ink truncate transition-opacity duration-[var(--dur-2)]', collapsed ? 'opacity-100' : 'opacity-0')} aria-hidden={!collapsed}>
          {title}
        </p>
        <div className="w-11 shrink-0 flex items-center justify-center">{action}</div>
      </div>
      <div ref={sentinel} aria-hidden className="h-px -mt-px" />
      <header className={cn('flex items-end justify-between gap-4 pt-2 md:pt-0', className)}>
        <div className="min-w-0">
          {meta && <p className="t-body-sm mb-1">{meta}</p>}
          <h1 className="t-h1">{title}</h1>
          {description && <p className="t-body-sm mt-2 max-w-[60ch]">{description}</p>}
        </div>
        {action && <div className="hidden md:flex shrink-0 items-center gap-2">{action}</div>}
      </header>
    </div>
  );
}
