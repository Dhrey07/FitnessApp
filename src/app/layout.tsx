import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'Fitness Police | Premium Coaching, Nutrition & Training Transformation',
  description: 'Your stronger self starts here. Personalized nutrition with Food Police (100% Free), smarter training with Fitness Police (14-day free trial), and real human accountability.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark scroll-smooth">
      <body
        suppressHydrationWarning
        className="font-sans antialiased min-h-screen selection:bg-sky-400 selection:text-slate-950 transition-colors duration-200"
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
