import React from 'react';
import { FileDown } from 'lucide-react';

/** Opens a print route in a new tab; the print layout triggers the browser's Save as PDF dialog. */
export function DownloadPdfButton({ href, label = 'Download PDF', className = '' }: { href: string; label?: string; className?: string }) {
  const url = href.includes('?') ? `${href}&autoprint=1` : `${href}?autoprint=1`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`btn-secondary text-xs py-1.5 px-3 ${className}`}>
      <FileDown size={13} /> {label}
    </a>
  );
}
