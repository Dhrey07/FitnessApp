import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';
import { whatsappLink } from '@/lib/whatsapp';

export function PublicFooter() {
  const year = new Date().getFullYear();
  const ig = BRAND.contact.instagram.replace(/^@/, '');
  const contact = [
    BRAND.contact.email && { label: BRAND.contact.email, href: `mailto:${BRAND.contact.email}` },
    BRAND.contact.whatsapp && { label: 'WhatsApp', href: whatsappLink(BRAND.contact.whatsapp) ?? '' },
    ig && { label: `@${ig}`, href: `https://instagram.com/${ig}` },
  ].filter((c): c is { label: string; href: string } => Boolean(c && c.href));

  return (
    <footer className="bg-[var(--brand-charcoal)] text-[var(--brand-offwhite)]">
      <div className="pub-container py-14 md:py-20 space-y-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <Logo variant="horizontal" tone="white" size={32} showTagline />
            <p className="text-sm leading-relaxed text-[rgba(246,244,239,0.7)] max-w-[40ch]">{BRAND.positioning}</p>
          </div>
          <nav className="md:col-span-3 text-sm" aria-label="Footer">
            <ul className="space-y-2.5 text-[rgba(246,244,239,0.8)]">
              {[
                ['#coaching', 'How coaching works'],
                ['#nutrition', 'Nutrition'],
                ['#training', 'Training'],
                ['#results', 'Results'],
                ['#coach', 'Your coach'],
                ['#plans', 'Plans'],
                ['#faq', 'Questions'],
              ].map(([href, label]) => (
                <li key={href}><a href={href} className="hover:text-[var(--brand-offwhite)] transition-colors">{label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4 text-sm space-y-6">
            <ul className="space-y-2.5 text-[rgba(246,244,239,0.8)]">
              <li><Link href="/login" className="hover:text-[var(--brand-offwhite)] transition-colors">Sign in</Link></li>
              <li><Link href="/onboarding" className="hover:text-[var(--brand-offwhite)] transition-colors">Start your assessment</Link></li>
            </ul>
            {contact.length > 0 && (
              <ul className="space-y-2.5 text-[rgba(246,244,239,0.8)]">
                {contact.map((c) => (
                  <li key={c.label}><a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="hover:text-[var(--brand-offwhite)] transition-colors">{c.label}</a></li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="pt-8 border-t border-[rgba(246,244,239,0.12)] space-y-3 text-xs text-[rgba(246,244,239,0.6)] leading-relaxed">
          <p className="max-w-[90ch]">
            {BRAND.legalName} provides education, habit coaching and fitness coaching. Calorie and macronutrient targets are estimates, not medical advice. Speak to your doctor before starting a vigorous exercise programme or a calorie deficit, especially if you are pregnant, breastfeeding or managing a medical condition.
          </p>
          <p>© {year} {BRAND.legalName}</p>
        </div>
      </div>
    </footer>
  );
}
