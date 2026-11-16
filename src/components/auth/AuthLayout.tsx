import * as React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Photo } from '@/components/ui/Photo';
import { resolvePhoto, type PhotoSlot } from '@/lib/photos';
import { BRAND } from '@/lib/brand';

/**
 * Split layout for sign-in. Desktop: photograph left 45%, a 400px form
 * column right, no card. Mobile: logo bar, then the form full width.
 */
export function AuthLayout({ photo = 'login', caption, children }: { photo?: PhotoSlot; caption?: React.ReactNode; children: React.ReactNode }) {
  const image = resolvePhoto(photo);
  return (
    <div className="min-h-dvh bg-paper text-ink md:grid md:grid-cols-[45%_1fr]">
      <aside className="hidden md:block relative p-4 lg:p-6">
        <div className="sticky top-6 h-[calc(100dvh-48px)]">
          <Photo photo={image} alt="" sizes="45vw" priority className="h-full w-full" />
          <div className="absolute left-6 top-6">
            <Logo variant="horizontal" tone="white" size={30} href="/" />
          </div>
          {caption && <div className="absolute left-6 right-6 bottom-6 text-[var(--brand-offwhite)]">{caption}</div>}
        </div>
      </aside>

      <div className="flex flex-col min-h-dvh">
        <header className="flex items-center justify-between px-4 md:px-10 h-16 md:h-20">
          <span className="md:hidden">
            <Logo variant="horizontal" size={28} href="/" />
          </span>
          <span className="hidden md:block" />
          <div className="flex items-center gap-1">
            <ThemeToggle variant="icon" />
            <Link href="/" className="focus-ring h-10 px-3 rounded-full inline-flex items-center t-ui text-ink-secondary hover:text-ink">
              Home
            </Link>
          </div>
        </header>
        <main className="flex-1 flex flex-col px-4 md:px-10">
          <div className="w-full max-w-[400px] mx-auto md:my-auto flex-1 md:flex-none flex flex-col">{children}</div>
        </main>
        <footer className="px-4 md:px-10 py-6 t-caption text-center md:text-left">© {new Date().getFullYear()} {BRAND.legalName}</footer>
      </div>
    </div>
  );
}
