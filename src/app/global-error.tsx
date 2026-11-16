'use client';

import { useEffect } from 'react';

/**
 * Replaces the root layout when it fails, so it brings its own document
 * and inline styles (global CSS and fonts are not available here).
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#F6F4EF', color: '#161A18', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        <title>Something went wrong | ERICONET Fitness &amp; Wellness</title>
        <main style={{ padding: 24, maxWidth: 480 }}>
          <h1 style={{ fontSize: 28, lineHeight: 1.1, margin: '0 0 12px', letterSpacing: '-0.02em' }}>This page did not load.</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, margin: '0 0 24px', color: '#474D4A' }}>Something went wrong on our side. Your logs and check-ins are safe.</p>
          <button onClick={() => retry()} style={{ height: 48, padding: '0 20px', borderRadius: 999, border: 0, background: '#0B3D2E', color: '#F6F4EF', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
