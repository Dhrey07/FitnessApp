import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import type { ResolvedPhoto } from '@/lib/photos';

/**
 * Renders a resolved photo slot with next/image. Pass the result of
 * resolvePhoto() from a server component. `ratio` crops to the slot's
 * intended aspect; `priority` for the hero only.
 */
export function Photo({
  photo,
  alt,
  ratio,
  sizes = '100vw',
  priority,
  className,
  radius = 'lg',
  duotone = 0,
}: {
  photo: ResolvedPhoto;
  alt: string;
  ratio?: '4/5' | '16/9' | '1/1' | '3/2';
  sizes?: string;
  priority?: boolean;
  className?: string;
  radius?: 'none' | 'md' | 'lg';
  /** Green overlay opacity 0 to 0.3, hero only, for headline contrast. */
  duotone?: number;
}) {
  const r = radius === 'none' ? '' : radius === 'md' ? 'rounded-[var(--radius-md)]' : 'rounded-[var(--radius-lg)]';
  return (
    <div className={cn('relative overflow-hidden bg-[var(--brand-green-900)]', r, className)} style={ratio ? { aspectRatio: ratio.replace('/', ' / ') } : undefined}>
      <Image
        src={photo.src}
        alt={photo.placeholder ? '' : alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        unoptimized={photo.placeholder}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {duotone > 0 && <div aria-hidden className="absolute inset-0 bg-[var(--brand-green-900)]" style={{ opacity: Math.min(0.3, duotone) }} />}
    </div>
  );
}
