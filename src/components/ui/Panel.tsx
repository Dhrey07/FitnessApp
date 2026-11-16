import * as React from 'react';
import { cn } from '@/lib/cn';

type Tone = 'white' | 'inset' | 'ink';

/**
 * The only card. A Panel exists to group or elevate; lists use rows and
 * sections use whitespace. `raised` adds the single soft shadow and never a
 * border at the same time.
 */
export function Panel({
  tone = 'white',
  raised = false,
  texture = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: {
  tone?: Tone;
  raised?: boolean;
  /** Adds the off-corner monogram texture (one per screen). */
  texture?: boolean;
  as?: 'div' | 'section' | 'article' | 'aside';
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      {...rest}
      className={cn(
        tone === 'white' && 'surface-panel',
        tone === 'inset' && 'surface-inset',
        tone === 'ink' && 'surface-ink',
        raised && 'elev-raised',
        texture && 'monogram-texture',
        'p-5 md:p-6',
        className
      )}
    >
      {children}
    </Tag>
  );
}
