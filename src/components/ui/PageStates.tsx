'use client';

import * as React from 'react';
import { Monogram } from '@/components/brand/Logo';
import { Button } from './Button';
import { Skeleton, SkeletonRow } from './Skeleton';

/**
 * Error state shown by route error boundaries. One sentence, a retry, and
 * a way home. Error details stay in the console, never on screen.
 */
export function ErrorState({ retry, homeHref = '/', homeLabel = 'Go to the home page' }: { retry: () => void; homeHref?: string; homeLabel?: string }) {
  return (
    <div className="flex flex-col items-start gap-6 py-16 max-w-[44ch] motion-enter" role="alert">
      <span className="opacity-20" aria-hidden>
        <Monogram size={44} tile={false} />
      </span>
      <div className="space-y-2">
        <h1 className="t-h2">This page did not load.</h1>
        <p className="t-body text-ink-secondary">Something went wrong on our side. Your logs and check-ins are safe. Try again, and if it keeps happening, let your coach know.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={retry}>Try again</Button>
        <Button href={homeHref} variant="secondary">{homeLabel}</Button>
      </div>
    </div>
  );
}

/** Skeleton that matches an app page: large title, a hero number, rows. */
export function PageSkeleton() {
  return (
    <div className="space-y-8 pt-2" aria-busy="true" aria-label="Loading">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64 max-w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-14 w-40" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="hairline pt-2">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}
