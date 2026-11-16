'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

interface Point {
  label: string;
  value: number;
}

/**
 * Charts drawn as plain SVG: no chart library ships to the client.
 * One style: 2px deep green line over a flat 12% fill, champagne dashed
 * target, horizontal hairlines only, 12px axis text, a dot and value on
 * hover or touch.
 */

const PAD = { top: 12, right: 8, bottom: 24, left: 40 };

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function niceTicks(min: number, max: number, count = 4) {
  if (min === max) return [min];
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

function fmt(v: number) {
  return Math.abs(v) >= 1000 ? `${Math.round(v / 100) / 10}k` : String(Math.round(v * 10) / 10);
}

function Frame({
  data,
  height,
  domain,
  target,
  unit,
  className,
  children,
  points = false,
}: {
  /** Lines span edge to edge; bars sit in the centre of their column. */
  points?: boolean;
  data: Point[];
  height: number;
  domain: [number, number];
  target?: number;
  unit?: string;
  className?: string;
  children: (g: { x: (i: number) => number; y: (v: number) => number; w: number; band: number }) => React.ReactNode;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const [lo, hi] = domain;
  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = height - PAD.top - PAD.bottom;
  const band = data.length > 0 ? innerW / data.length : 0;
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;
  const x = (i: number) => (points ? PAD.left + (data.length > 1 ? step * i : innerW / 2) : PAD.left + band * i + band / 2);
  const y = (v: number) => PAD.top + innerH - ((v - lo) / (hi - lo || 1)) * innerH;
  const ticks = niceTicks(lo, hi);
  const every = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor(innerW / 64))));

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - PAD.left;
    const i = points ? Math.round(px / (step || 1)) : Math.floor(px / (band || 1));
    setHover(i >= 0 && i < data.length ? i : null);
  };

  const h = hover != null ? data[hover] : null;

  return (
    <div ref={ref} className={cn('relative w-full motion-enter', className)} style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={`${data.length} values${unit ? ` in ${unit}` : ''}, from ${data[0]?.label} to ${data[data.length - 1]?.label}`} onPointerMove={onMove} onPointerLeave={() => setHover(null)} className="touch-pan-y">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--border-subtle)" />
              <text x={PAD.left - 8} y={y(t)} dy="0.35em" textAnchor="end" fontSize={12} fill="var(--text-muted)" className="tnum">{fmt(t)}</text>
            </g>
          ))}
          {data.map((d, i) => (i % every === 0 || i === data.length - 1 ? <text key={i} x={x(i)} y={height - 6} textAnchor={points && i === 0 ? 'start' : points && i === data.length - 1 ? 'end' : 'middle'} fontSize={12} fill="var(--text-muted)">{d.label}</text> : null))}
          {target !== undefined && target >= lo && target <= hi && (
            <line x1={PAD.left} x2={width - PAD.right} y1={y(target)} y2={y(target)} stroke="var(--accent)" strokeDasharray="4 4" />
          )}
          {children({ x, y, w: width, band })}
          {hover != null && <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--border-active)" />}
        </svg>
      )}
      {h && hover != null && (
        <div className="pointer-events-none absolute top-0 surface-panel elev-raised px-3 py-2 text-sm" style={{ left: Math.min(Math.max(0, x(hover) - 50), Math.max(0, width - 110)) }}>
          <p className="t-caption">{h.label}</p>
          <p className="tnum font-medium">{h.value.toLocaleString()}{unit ? ` ${unit}` : ''}</p>
        </div>
      )}
    </div>
  );
}

function autoDomain(data: Point[], target?: number, domain?: [number | 'auto', number | 'auto'], zero = false): [number, number] {
  const vals = data.map((d) => d.value).concat(target !== undefined ? [target] : []);
  const mn = vals.length ? Math.min(...vals) : 0;
  const mx = vals.length ? Math.max(...vals) : 1;
  const pad = (mx - mn) * 0.1 || 1;
  const lo = domain && domain[0] !== 'auto' ? domain[0] : zero ? 0 : mn - pad;
  const hi = domain && domain[1] !== 'auto' ? domain[1] : mx + pad;
  return [lo, hi];
}

export function LineChart({ data, unit, target, height = 220, className, domain }: { data: Point[]; unit?: string; target?: number; height?: number; className?: string; domain?: [number | 'auto', number | 'auto'] }) {
  const d = autoDomain(data, target, domain);
  return (
    <Frame data={data} height={height} domain={d} target={target} unit={unit} className={className} points>
      {({ x, y }) => {
        if (data.length === 0) return null;
        const line = data.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
        const area = `${line} L${x(data.length - 1).toFixed(1)},${y(d[0]).toFixed(1)} L${x(0).toFixed(1)},${y(d[0]).toFixed(1)} Z`;
        return (
          <>
            <path d={area} fill="var(--brand)" fillOpacity={0.12} />
            <path d={line} fill="none" stroke="var(--brand)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          </>
        );
      }}
    </Frame>
  );
}

export function BarsChart({ data, unit, target, height = 200, className }: { data: Point[]; unit?: string; target?: number; height?: number; className?: string }) {
  const d = autoDomain(data, target, undefined, true);
  return (
    <Frame data={data} height={height} domain={d} target={target} unit={unit} className={className}>
      {({ x, y, band }) => (
        <>
          {data.map((p, i) => {
            const bw = Math.max(4, band * 0.6);
            const top = y(p.value);
            return <rect key={i} x={x(i) - bw / 2} y={top} width={bw} height={Math.max(0, y(d[0]) - top)} rx={4} fill="var(--brand)" />;
          })}
        </>
      )}
    </Frame>
  );
}
