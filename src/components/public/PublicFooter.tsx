import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';

export function PublicFooter() {
  const year = new Date().getFullYear();
  const contact = [
    BRAND.contact.email && { label: 'Email', value: BRAND.contact.email, href: `mailto:${BRAND.contact.email}` },
    BRAND.contact.whatsapp && { label: 'WhatsApp', value: BRAND.contact.whatsapp, href: `https://wa.me/${BRAND.contact.whatsapp.replace(/\D/g, '')}` },
    BRAND.contact.instagram && { label: 'Instagram', value: `@${BRAND.contact.instagram.replace(/^@/, '')}`, href: `https://instagram.com/${BRAND.contact.instagram.replace(/^@/, '')}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <footer className="bg-[var(--brand-charcoal)] text-[var(--brand-offwhite)] py-14 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-2 max-w-sm">
            <Logo variant="horizontal" tone="white" size={36} showTagline />
            <p className="text-sm leading-relaxed opacity-80">{BRAND.positioning}</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="label-xs text-[var(--brand-champagne)]">Explore</p>
            <ul className="space-y-2 opacity-85">
              <li><a href="#coaching" className="hover:opacity-100 hover:underline">How coaching works</a></li>
              <li><a href="#nutrition" className="hover:opacity-100 hover:underline">Nutrition</a></li>
              <li><a href="#training" className="hover:opacity-100 hover:underline">Training</a></li>
              <li><a href="#results" className="hover:opacity-100 hover:underline">Client results</a></li>
              <li><a href="#plans" className="hover:opacity-100 hover:underline">Plans</a></li>
              <li><a href="#faq" className="hover:opacity-100 hover:underline">Questions</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <p className="label-xs text-[var(--brand-champagne)]">Account</p>
            <ul className="space-y-2 opacity-85">
              <li><Link href="/login" className="hover:opacity-100 hover:underline">Sign in</Link></li>
              <li><Link href="/onboarding" className="hover:opacity-100 hover:underline">Start your assessment</Link></li>
              <li><Link href="/login?role=coach" className="hover:opacity-100 hover:underline">Coach sign in</Link></li>
            </ul>
            {contact.length > 0 && (
              <>
                <p className="label-xs text-[var(--brand-champagne)] pt-3">Contact</p>
                <ul className="space-y-2 opacity-85">
                  {contact.map((c) => (
                    <li key={c.label}><a href={c.href} className="hover:opacity-100 hover:underline">{c.value}</a></li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 space-y-3 text-xs opacity-70 leading-relaxed">
          <p>
            <strong>Medical and nutritional disclaimer.</strong> {BRAND.legalName} provides education, habit coaching and fitness coaching. Calorie targets, macronutrient targets and meal suggestions are estimates based on the Mifflin-St Jeor equation and are not medical advice, diagnosis or clinical dietary treatment. Speak to your doctor before starting a vigorous exercise programme or a calorie deficit, especially if you are pregnant, breastfeeding, or managing a medical condition.
          </p>
          <p>© {year} {BRAND.legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
