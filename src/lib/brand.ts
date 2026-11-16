/**
 * ERICONET FITNESS & WELLNESS — single source of truth for brand strings.
 *
 * Import from here instead of hardcoding names, taglines or the coach's
 * display name in components. See docs/brand-guide.md for the full system.
 */

export const BRAND = {
  /** Full legal/brand name, as it appears in the primary logo. */
  name: 'ERICONET FITNESS & WELLNESS',
  /** Short name for tight spaces (collapsed sidebars, tab titles). */
  shortName: 'ERICONET',
  /** Title-case name for prose and legal lines. */
  legalName: 'ERICONET Fitness & Wellness',
  /** Two-line wordmark used by the Logo component. */
  wordmark: { line1: 'ERICONET', line2: 'FITNESS & WELLNESS' },
  tagline: 'Nutrition. Training. Transformation.',
  positioning:
    'Personalised fitness, nutrition and lifestyle coaching focused on sustainable physical transformation through structured nutrition, training, accountability and measurable progress.',
  /** Display name for the head coach in UI copy. Seed data may keep the real name. */
  coachName: 'Coach Eric',
  contact: {
    email: process.env.NEXT_PUBLIC_BRAND_EMAIL ?? '',
    whatsapp: process.env.NEXT_PUBLIC_BRAND_WHATSAPP ?? '',
    instagram: process.env.NEXT_PUBLIC_BRAND_INSTAGRAM ?? '',
  },
  /** Used for metadataBase and absolute OG URLs. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;

/** Brand palette. Keep in sync with the CSS tokens in src/app/globals.css. */
export const BRAND_COLORS = {
  green900: '#0B3D2E',
  green700: '#145A43',
  green100: '#E3EFE9',
  charcoal: '#161A18',
  charcoal800: '#1F2422',
  offwhite: '#F6F4EF',
  white: '#FFFFFF',
  champagne: '#C9A86A',
  stone500: '#6B7370',
} as const;

export const SITE_TITLE = `${BRAND.legalName} | ${BRAND.tagline}`;
export const SITE_DESCRIPTION = BRAND.positioning;
