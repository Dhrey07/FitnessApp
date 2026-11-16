import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-paper text-ink flex flex-col">
      <header className="pub-container h-16 md:h-20 flex items-center">
        <Logo variant="horizontal" size={30} href="/" />
      </header>
      <section className="pub-container flex-1 flex flex-col justify-center py-16 relative z-10">
        <p className="t-overline">404</p>
        <h1 className="t-poster mt-4 max-w-[12ch]">This page is not here.</h1>
        <p className="t-body text-ink-secondary mt-6 max-w-[44ch]">The link may be old, or the page has moved. Start again from the home page, or sign in to get back to your plan.</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/" size="lg">Go to the home page</Button>
          <Link href="/login" className="t-ui text-ink hover:text-brand transition-colors">Sign in</Link>
        </div>
      </section>
    </main>
  );
}
