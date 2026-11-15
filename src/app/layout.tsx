import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { BRAND, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/brand';

// Two families only: Manrope for display, Inter for body (both SIL OFL).
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s | ${BRAND.legalName}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: BRAND.legalName,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`light scroll-smooth ${manrope.variable} ${inter.variable}`}
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
