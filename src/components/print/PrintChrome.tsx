'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Printer, X } from 'lucide-react';

/** Screen-only toolbar; hidden when printing. */
export function PrintToolbar({ title }: { title: string }) {
  return (
    <div className="print-toolbar sticky top-0 z-20 bg-[var(--brand-charcoal)] text-[var(--brand-offwhite)] px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
      <span className="truncate">{title}</span>
      <div className="flex items-center gap-2 shrink-0">
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand-green-700)] px-3 py-1.5 text-xs font-semibold">
          <Printer size={14} /> Print or save as PDF
        </button>
        <button type="button" onClick={() => window.close()} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs" aria-label="Close">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/** ?autoprint=1 opens the print dialog once fonts are ready. */
export function AutoPrint() {
  const params = useSearchParams();
  useEffect(() => {
    if (params.get('autoprint') !== '1') return;
    const run = () => setTimeout(() => window.print(), 300);
    if ('fonts' in document) (document as any).fonts.ready.then(run); else run();
  }, [params]);
  return null;
}
