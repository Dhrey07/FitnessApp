import React from 'react';
import { Logo } from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';

interface SheetProps {
  children: React.ReactNode;
  /** Client name (and anything else) shown bottom-left. */
  footerLeft?: React.ReactNode;
  /** Document title shown in the header, right of the logo. */
  docTitle?: string;
  className?: string;
}

/** One A4 sheet: horizontal logo and tagline in the header, prepared-by line in the footer, E monogram watermark. */
export function PrintSheet({ children, footerLeft, docTitle, className = '' }: SheetProps) {
  return (
    <section className={`print-sheet ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/watermark.svg" alt="" className="print-watermark" aria-hidden="true" />
      <header className="print-header flex items-center justify-between gap-4 pb-3 border-b border-[var(--brand-champagne)]">
        <Logo variant="horizontal" tone="green" size={30} href={null} />
        <div className="text-right">
          {docTitle && <p className="font-display font-semibold text-[var(--brand-charcoal)] text-sm">{docTitle}</p>}
          <p className="text-xs text-[var(--brand-stone-500)]">{BRAND.tagline}</p>
        </div>
      </header>
      <div className="print-body pt-5 text-[11pt] leading-relaxed text-[var(--brand-charcoal)]">{children}</div>
      <footer className="print-footer pt-3 mt-6 border-t border-line flex items-center justify-between gap-4 text-[8.5pt] text-[var(--brand-stone-500)]">
        <span>{footerLeft}</span>
        <span>Prepared by {BRAND.coachName} · {BRAND.legalName}</span>
      </footer>
    </section>
  );
}

export function PrintCover({ kicker, title, subtitle, rows, footerLeft }: { kicker: string; title: string; subtitle?: string; rows: [string, React.ReactNode][]; footerLeft?: React.ReactNode }) {
  return (
    <PrintSheet footerLeft={footerLeft}>
      <div className="flex flex-col justify-center h-full gap-8 py-10">
        <div className="space-y-3">
          <p className="t-overline !text-[var(--brand-green-900)]">{kicker}</p>
          <h1 className="font-display text-[28pt] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--brand-charcoal)]">{title}</h1>
          {subtitle && <p className="text-[12pt] text-[var(--brand-stone-500)]">{subtitle}</p>}
          <div className="h-px w-16 bg-[var(--brand-champagne)]" />
        </div>
        <table className="w-full text-[11pt]">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} className="border-b border-line">
                <th scope="row" className="py-2.5 pr-6 text-left font-semibold text-[var(--brand-stone-500)] w-[38%]">{k}</th>
                <td className="py-2.5 font-semibold text-[var(--brand-charcoal)]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrintSheet>
  );
}

export function PrintClosing({ clientName }: { clientName: string }) {
  const contact = [BRAND.contact.email, BRAND.contact.whatsapp && `WhatsApp ${BRAND.contact.whatsapp}`, BRAND.contact.instagram && `Instagram @${BRAND.contact.instagram.replace(/^@/, '')}`].filter(Boolean);
  return (
    <PrintSheet footerLeft={clientName}>
      <div className="space-y-6 pt-4">
        <h2 className="text-[16pt] font-bold">Questions, swaps and check-ins</h2>
        <p>Ask about any food, quantity or swap at your weekly check-in, or sooner if your plan includes WhatsApp support. The plan is a starting point; it is adjusted from your weekly trend, not from one day.</p>
        {contact.length > 0 && (
          <ul className="text-[10.5pt] space-y-1">{contact.map((c) => <li key={c}>{c}</li>)}</ul>
        )}
        <div className="pt-6 border-t border-line text-[9pt] text-[var(--brand-stone-500)] leading-relaxed">
          <p><strong>Medical and nutritional disclaimer.</strong> This document provides education, habit coaching and fitness coaching. Calorie and macronutrient targets and meal suggestions are estimates based on the Mifflin-St Jeor equation and are not medical advice, diagnosis or clinical dietary treatment. Speak to your doctor before starting a vigorous exercise programme or a calorie deficit, especially if you are pregnant, breastfeeding, or managing a medical condition. Prepared for {clientName}; not for redistribution.</p>
        </div>
      </div>
    </PrintSheet>
  );
}
