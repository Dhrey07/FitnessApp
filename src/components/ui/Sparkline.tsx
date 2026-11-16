import * as React from 'react';
import { cn } from '@/lib/cn';

/** Tiny inline trend line. Pure SVG, no library. */
export function Sparkline({ data, width = 48, height = 16, className, stroke = 'var(--brand)' }: { data: number[]; width?: number; height?: number; className?: string; stroke?: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 1.5;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn('overflow-visible', className)} aria-hidden>
      <polyline points={points.join(' ')} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
