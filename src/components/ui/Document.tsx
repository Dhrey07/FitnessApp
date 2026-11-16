import * as React from 'react';
import { Logo } from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';
import { cn } from '@/lib/cn';

/**
 * Paper panel with ruled rows. Used on screen for meal plans, programmes
 * and progress reports so what the client sees matches what prints.
 */
export function Document({
  title,
  subtitle,
  meta,
  children,
  footer,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned small lines, e.g. client name and date. */
  meta?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={cn('bg-white text-[#161A18] rounded-[var(--radius-md)] elev-raised overflow-hidden', className)}>
      <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
        <div className="min-w-0">
          <Logo variant="horizontal" tone="green" size={24} />
          <h3 className="mt-4 font-display font-semibold text-xl leading-tight tracking-[-0.01em]">{title}</h3>
          {subtitle && <p className="text-sm text-[#474D4A] mt-1">{subtitle}</p>}
        </div>
        {meta && <div className="text-right text-xs text-[#6B7370] shrink-0 leading-relaxed">{meta}</div>}
      </header>
      <span className="accent-rule ml-6" aria-hidden />
      <div className="px-6 py-4">{children}</div>
      <footer className="px-6 py-3 border-t border-[#E6E4DE] text-xs text-[#6B7370] flex items-center justify-between gap-4">
        <span>Prepared by {BRAND.coachName} · {BRAND.legalName}</span>
        {footer}
      </footer>
    </article>
  );
}

/** A ruled row inside a Document. */
export function DocumentRow({ label, children, value, className }: { label?: React.ReactNode; children?: React.ReactNode; value?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-baseline py-2.5 border-b border-[#EFEDE7] last:border-b-0 text-sm', className)}>
      <div className="min-w-0">
        {label && <span className="text-[#6B7370] text-xs block">{label}</span>}
        {children}
      </div>
      {value !== undefined && <span className="tnum text-right font-medium">{value}</span>}
    </div>
  );
}
