'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Measures whether a family renders equal-width digits with tabular-nums on.
 * Shows the width of "1111" vs "0000"; equal means tabular figures work.
 */
export function TnumProbe({ family, label }: { family: string; label: string }) {
  const ones = useRef<HTMLSpanElement>(null);
  const zeros = useRef<HTMLSpanElement>(null);
  const [result, setResult] = useState<string>('measuring…');

  useEffect(() => {
    const run = () => {
      const a = ones.current?.getBoundingClientRect().width ?? 0;
      const b = zeros.current?.getBoundingClientRect().width ?? 0;
      const diff = Math.abs(a - b);
      setResult(`${label} tnum: ${diff < 0.5 ? 'yes' : `no (Δ ${diff.toFixed(1)}px)`}`);
    };
    if (document.fonts?.ready) document.fonts.ready.then(run); else run();
  }, [family, label]);

  return (
    <span className="text-xs text-ink-muted" style={{ fontFamily: 'var(--sp-inter)' }}>
      {result}
      <span aria-hidden className="absolute opacity-0 pointer-events-none" style={{ fontFamily: family, fontVariantNumeric: 'tabular-nums', fontSize: 40 }}>
        <span ref={ones}>1111</span>
        <span ref={zeros}>0000</span>
      </span>
    </span>
  );
}
