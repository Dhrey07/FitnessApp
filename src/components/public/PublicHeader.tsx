'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Logo } from '@/components/brand/Logo';

const NAV = [
  { href: '#coaching', label: 'Coaching' },
  { href: '#nutrition', label: 'Nutrition' },
  { href: '#training', label: 'Training' },
  { href: '#results', label: 'Results' },
  { href: '#plans', label: 'Plans' },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <Logo variant="horizontal" size={36} responsive />

        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-ink-secondary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-brand transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle variant="icon" />
          <Link href="/login" className="text-sm font-semibold text-ink-muted hover:text-ink px-3 py-2 transition-colors">
            Sign in
          </Link>
          <Link href="/onboarding" className="btn-brand text-sm">
            Start your assessment <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <span className="sm:hidden"><ThemeToggle variant="icon" /></span>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl surface text-ink-muted hover:text-ink"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden max-w-6xl mx-auto mt-3 pt-3 border-t border-line space-y-1 text-sm font-semibold animate-fade-in">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-ink-secondary hover:bg-brand-soft hover:text-ink"
            >
              {n.label}
            </a>
          ))}
          <div className="pt-3 border-t border-line flex flex-col gap-2">
            <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm w-full justify-center py-2.5">
              Sign in
            </Link>
            <Link href="/onboarding" onClick={() => setOpen(false)} className="btn-brand text-sm w-full justify-center py-2.5">
              Start your assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
