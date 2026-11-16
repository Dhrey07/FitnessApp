'use client';

import * as React from 'react';
import { Camera, Search, Type } from 'lucide-react';
import { Sheet } from './Sheet';
import { Segmented } from './Segmented';
import { cn } from '@/lib/cn';

export type ComposerMode = 'photo' | 'describe' | 'search';

/**
 * The meal-logging sheet. Segmented Photo / Describe / Search; choosing
 * Photo opens the camera immediately through a capture input. The slots
 * render the mode's body and the footer carries the one primary action.
 */
export function Composer({
  open,
  onOpenChange,
  mode,
  onModeChange,
  onPhoto,
  describe,
  search,
  photo,
  footer,
  title = 'Log a meal',
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: ComposerMode;
  onModeChange: (m: ComposerMode) => void;
  onPhoto?: (file: File) => void;
  describe: React.ReactNode;
  search: React.ReactNode;
  /** Shown under the camera control once a photo has been taken. */
  photo?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);

  const change = (m: ComposerMode) => {
    onModeChange(m);
    if (m === 'photo') window.setTimeout(() => fileRef.current?.click(), 0);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={title} footer={footer}>
      <div className="space-y-5">
        <Segmented
          label="How to log"
          value={mode}
          onChange={change}
          options={[
            { value: 'photo', label: <span className="inline-flex items-center gap-1.5"><Camera size={14} aria-hidden /> Photo</span> },
            { value: 'describe', label: <span className="inline-flex items-center gap-1.5"><Type size={14} aria-hidden /> Describe</span> },
            { value: 'search', label: <span className="inline-flex items-center gap-1.5"><Search size={14} aria-hidden /> Search</span> },
          ]}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          aria-label="Take a photo of your meal"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f && onPhoto) onPhoto(f);
          }}
        />
        <div className={cn('motion-enter')} key={mode}>
          {mode === 'photo' && (
            <div className="space-y-4">
              <button type="button" onClick={() => fileRef.current?.click()} className="focus-ring w-full h-40 rounded-[var(--radius-md)] surface-inset flex flex-col items-center justify-center gap-2 text-ink-secondary">
                <Camera size={28} aria-hidden />
                <span className="text-sm font-medium">Open camera</span>
              </button>
              {photo}
            </div>
          )}
          {mode === 'describe' && describe}
          {mode === 'search' && search}
        </div>
      </div>
    </Sheet>
  );
}
