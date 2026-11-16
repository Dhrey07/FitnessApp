import * as React from 'react';
import { cn } from '@/lib/cn';

/** Placeholder block that matches the final layout's size exactly. */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn('animate-pulse rounded-[var(--radius-sm)] bg-[var(--bg-card-hover)]', className)} style={style} />;
}

/** Skeleton for a ListRow. */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 min-h-14 py-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-3.5 w-12" />
    </div>
  );
}
