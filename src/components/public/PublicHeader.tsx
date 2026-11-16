'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '#coaching', label: 'Coaching' },
  { href: '#nutrition', label: 'Nutrition' },
  { href: '#training', label: 'Training' },
  { href: '#results', label: 'Results' },
  { href: '#plans', label: 'Plans' },
];

/**
 * Transparent over the hero, off-white with a hairline after 40px of
 * scroll. On mobile the hero photograph runs under the bar, so the logo and
 * menu button are off-white until the page scrolls.
 */
export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const onPhoto = !scrolled && !open;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-[var(--dur-2)]',
          scrolled ? 'bg-[var(--bg-header)] backdrop-blur-md shadow-[0_1px_0_var(--border-subtle)]' : 'bg-transparent'
        )}
      >
        <div className="pub-container h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Mobile: white logo over the photo until scrolled */}
          <span className={cn('md:hidden', onPhoto ? 'block' : 'hidden')}>
            <Logo variant="horizontal" tone="white" size={30} />
          </span>
          <span className={cn('md:hidden', onPhoto ? 'hidden' : 'block')}>
            <Logo variant="horizontal" size={30} />
          </span>
          <span className="hidden md:block">
            <Logo variant="horizontal" size={32} />
          </span>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Site">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-ink-secondary hover:text-ink transition-colors duration-[var(--dur-1)]">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle variant="icon" />
            <Button href="/login" variant="ghost" size="sm">Sign in</Button>
            <Button href="/onboarding" size="sm">Start your assessment</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className={cn('md:hidden focus-ring h-11 w-11 -mr-2 rounded-full flex items-center justify-center transition-colors', onPhoto ? 'text-[var(--brand-offwhite)]' : 'text-ink')}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={cn('md:hidden fixed inset-0 z-[60] bg-paper flex flex-col transition-opacity duration-[var(--dur-2)]', open ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        // inert keeps the closed menu's links out of the tab order.
        inert={!open}
      >
        <div className="pub-container h-16 flex items-center justify-between">
          <Logo variant="horizontal" size={30} />
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="focus-ring h-11 w-11 -mr-2 rounded-full flex items-center justify-center text-ink">
            <X size={24} />
          </button>
        </div>
        <nav className="pub-container flex-1 flex flex-col justify-center gap-2" aria-label="Site">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={cn('t-h1 text-[32px] py-2 text-ink motion-enter', open && 'motion-enter')}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {n.label}
            </a>
          ))}
          <div className="flex items-center justify-between pt-6">
            <Link href="/login" onClick={() => setOpen(false)} className="t-ui text-ink-secondary">Sign in</Link>
            <ThemeToggle variant="buttons" />
          </div>
        </nav>
        <div className="pub-container pb-6 safe-pb">
          <Button href="/onboarding" size="lg" full onClick={() => setOpen(false)}>Start your assessment</Button>
        </div>
      </div>
    </>
  );
}
