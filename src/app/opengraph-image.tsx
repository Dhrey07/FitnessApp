import { ImageResponse } from 'next/og';
import { BRAND, BRAND_COLORS } from '@/lib/brand';

export const alt = `${BRAND.legalName} — ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Social card: horizontal logo on off-white, tagline beneath, champagne rule.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '96px 112px',
          background: BRAND_COLORS.offwhite,
          color: BRAND_COLORS.charcoal,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: 28,
              background: BRAND_COLORS.green900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 64 64" width="128" height="128" fill={BRAND_COLORS.offwhite}>
              <rect x="14" y="14" width="8" height="36" rx="2" />
              <rect x="26" y="14" width="24" height="8" rx="2" />
              <rect x="26" y="28" width="16" height="8" rx="2" />
              <rect x="26" y="42" width="24" height="8" rx="2" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: 4, lineHeight: 1 }}>
              {BRAND.wordmark.line1}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: 10,
                marginTop: 14,
                color: BRAND_COLORS.green900,
              }}
            >
              {BRAND.wordmark.line2}
            </div>
          </div>
        </div>
        <div style={{ width: 96, height: 3, background: BRAND_COLORS.champagne, marginTop: 56 }} />
        <div style={{ fontSize: 40, fontWeight: 500, marginTop: 32, color: BRAND_COLORS.charcoal }}>
          {BRAND.tagline}
        </div>
        <div style={{ fontSize: 24, marginTop: 20, color: BRAND_COLORS.stone500, maxWidth: 900 }}>
          Personalised nutrition and training coaching with weekly check-ins and measurable progress.
        </div>
      </div>
    ),
    { ...size }
  );
}
