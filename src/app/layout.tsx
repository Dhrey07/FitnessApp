import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Inter_Tight } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { BRAND, BRAND_COLORS, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/brand';

// Two families only. Chosen from the /dev/type specimen (see docs/brand-guide.md):
// Bricolage Grotesque for display and headings, Inter Tight for body and UI.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display-src',
  display: 'swap',
  adjustFontFallback: true,
});

const body = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body-src',
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s | ${BRAND.legalName}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: BRAND.legalName,
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: BRAND.shortName,
    statusBarStyle: 'default',
  },
  keywords: [
    'nutrition coaching',
    'fat loss',
    'body recomposition',
    'personal training',
    'online coaching',
    'Nigeria',
  ],
  openGraph: {
    type: 'website',
    siteName: BRAND.legalName,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_COLORS.offwhite },
    { media: '(prefers-color-scheme: dark)', color: BRAND_COLORS.charcoal },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`light scroll-smooth ${display.variable} ${body.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans antialiased min-h-screen selection:bg-[var(--brand-soft)] selection:text-[var(--text-heading)] transition-colors duration-200"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
