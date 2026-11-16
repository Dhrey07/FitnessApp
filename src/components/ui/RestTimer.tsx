'use client';

import * as React from 'react';
import { Button } from './Button';
import { cn } from '@/lib/cn';
import { haptic } from '@/lib/haptics';

/**
 * Takes over the bottom bar during a rest: countdown at stat size, a
 * full-width 2px line draining left to right, +30s and Skip.
 */
export function RestTimer({
  seconds,
  running,
  onDone,
  onSkip,
  onExtend,
  className,
}: {
  seconds: number;
  running: boolean;
  onDone: () => void;
  onSkip: () => void;
  onExtend?: (by: number) => void;
  className?: string;
}) {
  const [remaining, setRemaining] = React.useState(seconds);
  const endAt = React.useRef<number>(0);

  React.useEffect(() => {
    setRemaining(seconds);
    endAt.current = Date.now() + seconds * 1000;
  }, [seconds]);

  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        window.clearInterval(id);
        haptic(30);
        onDone();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running, onDone]);

  const pct = seconds > 0 ? (remaining / seconds) * 100 : 0;
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div className={cn('fixed inset-x-0 bottom-0 z-40 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] safe-pb', className)} role="timer" aria-live="off">
      <div className="h-0.5 w-full bg-[var(--border-subtle)]">
        <div className="h-full bg-brand transition-[width] duration-200 ease-linear" style={{ width: `${pct}%` }} />
      </div>
      <div className="mx-auto max-w-[960px] px-4 py-3 flex items-center gap-4">
        <div className="min-w-0">
          <p className="t-caption">Rest</p>
          <p className="t-stat tnum">
            {mm}:{ss}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {onExtend && (
            <Button variant="secondary" size="sm" onClick={() => { onExtend(30); endAt.current += 30_000; setRemaining((r) => r + 30); }}>
              +30s
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onSkip}>
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
