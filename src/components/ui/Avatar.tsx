import * as React from 'react';
import { cn } from '@/lib/cn';

const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base', xl: 'h-20 w-20 text-xl' };

export function Avatar({ name, src, size = 'md', className }: { name: string; src?: string | null; size?: keyof typeof sizes; className?: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand font-semibold overflow-hidden', sizes[size], className)}
      aria-hidden={src ? undefined : true}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials || '?'
      )}
    </span>
  );
}
