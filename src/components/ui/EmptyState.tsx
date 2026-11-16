import * as React from 'react';
import { Monogram } from '@/components/brand/Logo';
import { cn } from '@/lib/cn';

/**
 * One sentence that says what will appear here and who causes it, plus at
 * most one action. The monogram sits at 10% opacity.
 */
export function EmptyState({ message, action, className }: { message: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center text-center gap-4 py-12 px-6', className)}>
      <span className="opacity-10" aria-hidden>
        <Monogram size={40} tone="auto" tile={false} />
      </span>
      <p className="t-body-sm max-w-[36ch]">{message}</p>
      {action}
    </div>
  );
}
