import { ImageResponse } from 'next/og';
import { BRAND_COLORS } from '@/lib/brand';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Apple touch icon: the E monogram tile, rendered from the same geometry as public/brand/e-monogram-tile.svg.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BRAND_COLORS.green900,
          borderRadius: 40,
        }}
      >
        <svg viewBox="0 0 64 64" width="180" height="180" fill={BRAND_COLORS.offwhite}>
          <rect x="14" y="14" width="8" height="36" rx="2" />
          <rect x="26" y="14" width="24" height="8" rx="2" />
          <rect x="26" y="28" width="16" height="8" rx="2" />
          <rect x="26" y="42" width="24" height="8" rx="2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
