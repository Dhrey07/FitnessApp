import React from 'react';
import Link from 'next/link';
import { BRAND, BRAND_COLORS } from '@/lib/brand';

/**
 * ERICONET logo system.
 *
 * - `monogram`   : the E mark alone (tile with green background in `auto` tone)
 * - `horizontal` : monogram left, two-line wordmark right (headers, sidebars)
 * - `primary`    : stacked monogram, wordmark and tagline (covers, auth pages)
 *
 * Tone `auto` follows the current theme via CSS variables. `green`, `black`
 * and `white` are fixed single-colour versions for use on known backgrounds.
 */

export type LogoVariant = 'monogram' | 'horizontal' | 'primary';
export type LogoTone = 'auto' | 'green' | 'black' | 'white';

const FIXED: Record<Exclude<LogoTone, 'auto'>, string> = {
  green: BRAND_COLORS.green900,
  black: BRAND_COLORS.charcoal,
  white: BRAND_COLORS.white,
};

/** The E glyph: a detached spine plus three bars, on a 64×64 artboard. */
function EGlyph({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      <rect x="14" y="14" width="8" height="36" rx="2" />
      <rect x="26" y="14" width="24" height="8" rx="2" />
      <rect x="26" y="28" width="16" height="8" rx="2" />
      <rect x="26" y="42" width="24" height="8" rx="2" />
    </g>
  );
}

interface MonogramProps {
  size?: number;
  tone?: LogoTone;
  /** Render on a rounded green tile (default for `auto`). */
  tile?: boolean;
  className?: string;
}

export function Monogram({ size = 32, tone = 'auto', tile, className }: MonogramProps) {
  const useTile = tile ?? tone === 'auto';
  const glyphFill = useTile
    ? tone === 'white'
      ? BRAND_COLORS.green900
      : BRAND_COLORS.offwhite
    : tone === 'auto'
      ? 'var(--brand)'
      : FIXED[tone];
  const tileFill = tone === 'white' ? BRAND_COLORS.white : tone === 'black' ? BRAND_COLORS.charcoal : BRAND_COLORS.green900;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {useTile && <rect width="64" height="64" rx="14" fill={tileFill} />}
      <EGlyph fill={glyphFill} />
    </svg>
  );
}

interface LogoProps {
  variant?: LogoVariant;
  tone?: LogoTone;
  /** Monogram size in px; the wordmark scales from it. */
  size?: number;
  /** Wrap in a link. Pass `null` for no link. */
  href?: string | null;
  /** Show the tagline (always shown for `primary`). */
  showTagline?: boolean;
  /** Hide the wordmark below the `sm` breakpoint (tight headers). */
  responsive?: boolean;
  className?: string;
}

export function Logo({
  variant = 'horizontal',
  tone = 'auto',
  size = 32,
  href = '/',
  showTagline = false,
  responsive = false,
  className = '',
}: LogoProps) {
  const fixed = tone === 'auto' ? undefined : FIXED[tone];
  const headingStyle = fixed ? { color: fixed } : { color: 'var(--text-heading)' };
  const subStyle = fixed ? { color: fixed, opacity: 0.85 } : { color: 'var(--brand)' };
  const taglineStyle = fixed ? { color: fixed, opacity: 0.75 } : { color: 'var(--text-muted)' };

  const line1Size = Math.round(size * 0.5);
  const line2Size = Math.max(10, Math.round(size * 0.27));

  let content: React.ReactNode;

  if (variant === 'monogram') {
    content = <Monogram size={size} tone={tone} />;
  } else if (variant === 'horizontal') {
    content = (
      <span className="inline-flex items-center gap-2.5 min-w-0">
        <Monogram size={size} tone={tone} />
        <span className={`flex flex-col leading-none min-w-0 ${responsive ? 'hidden sm:flex' : ''}`}>
          <span
            className="font-display font-extrabold tracking-[0.04em] truncate"
            style={{ ...headingStyle, fontSize: line1Size }}
          >
            {BRAND.wordmark.line1}
          </span>
          <span
            className="font-display font-semibold tracking-[0.28em] uppercase truncate mt-1"
            style={{ ...subStyle, fontSize: line2Size }}
          >
            {BRAND.wordmark.line2}
          </span>
          {showTagline && (
            <span className="text-xs mt-1 truncate" style={taglineStyle}>
              {BRAND.tagline}
            </span>
          )}
        </span>
      </span>
    );
  } else {
    content = (
      <span className="inline-flex flex-col items-center text-center gap-3">
        <Monogram size={size * 1.75} tone={tone} />
        <span className="flex flex-col items-center leading-none">
          <span
            className="font-display font-extrabold tracking-[0.06em]"
            style={{ ...headingStyle, fontSize: Math.round(size * 0.9) }}
          >
            {BRAND.wordmark.line1}
          </span>
          <span
            className="font-display font-semibold tracking-[0.32em] uppercase mt-1.5"
            style={{ ...subStyle, fontSize: Math.max(11, Math.round(size * 0.34)) }}
          >
            {BRAND.wordmark.line2}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="block h-px w-10"
          style={{ backgroundColor: fixed ?? 'var(--accent)' }}
        />
        <span className="text-sm" style={taglineStyle}>
          {BRAND.tagline}
        </span>
      </span>
    );
  }

  const label = `${BRAND.legalName} home`;

  if (href === null) {
    return (
      <span className={`inline-flex items-center ${className}`} aria-label={BRAND.legalName}>
        {content}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label} className={`inline-flex items-center shrink-0 ${className}`}>
      {content}
    </Link>
  );
}
