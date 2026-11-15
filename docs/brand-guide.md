# ERICONET FITNESS & WELLNESS — Brand Guide

**Tagline:** Nutrition. Training. Transformation.

The identity should read as professional, trustworthy, modern, disciplined, human and results-focused. Credible enough for a serious coaching business, approachable enough that a client feels they are working with a real coach who understands everyday life.

Code references: tokens in `src/app/globals.css`, strings in `src/lib/brand.ts`, logo in `src/components/brand/Logo.tsx`, files in `public/brand/`.

---

## 1. Logo system

**Concept.** A geometric E monogram: a detached vertical spine and three horizontal bars of equal weight, the middle bar shortened. No gym imagery, no swooshes, single colour, legible at 16 px.

| File | Use |
|---|---|
| `e-monogram.svg` / `-black` / `-white` | Standalone mark on a known background |
| `e-monogram-tile.svg` | Mark on a deep-green rounded tile: app icon, favicon, avatars |
| `logo-horizontal.svg` / `-black` / `-white` | Headers, sidebars, email signatures, document headers |
| `logo-primary.svg` / `-black` / `-white` | Stacked lock-up with tagline: covers, social profile, merchandise |
| `watermark.svg` | Monogram at 6% opacity for PDFs and formal client documents |
| `favicon.svg` | Browser tab (also `src/app/icon.svg`) |

All SVGs have transparent backgrounds except the tile. Generated PNGs: Apple touch icon via `src/app/apple-icon.tsx`, social card via `src/app/opengraph-image.tsx`.

**Rules**
- Clear space around the lock-up equals the height of the monogram's spine.
- Minimum size: monogram 16 px digital / 6 mm print; horizontal lock-up 120 px / 30 mm wide.
- Use the white version on deep green or charcoal. Use the green or black version on off-white or white.
- Never stretch, rotate, outline, add shadows or gradients, or place the mark inside another shape.
- The watermark never sits behind body text smaller than 11 pt and never exceeds 8% opacity.

**In code:** `<Logo variant="horizontal" size={32} />` (header), `<Logo variant="primary" />` (covers), `<Monogram size={24} />` (compact). Tone `auto` follows the theme; use `green`, `black` or `white` on fixed backgrounds.

---

## 2. Colour

Deep green carries trust and discipline; charcoal and off-white carry the premium, calm feel; champagne is a restrained accent.

| Token | Role | HEX | RGB | CMYK (approx.) |
|---|---|---|---|---|
| Deep Green 900 | Primary: buttons, active states, headings accent | `#0B3D2E` | 11, 61, 46 | 82 / 0 / 25 / 76 |
| Green 700 | Hover and secondary green | `#145A43` | 20, 90, 67 | 78 / 0 / 26 / 65 |
| Green 300 | Dark-mode accent text only (tint of the primary) | `#8FCDB0` | 143, 205, 176 | 30 / 0 / 14 / 20 |
| Green 100 | Subtle tint backgrounds, badges | `#E3EFE9` | 227, 239, 233 | 5 / 0 / 3 / 6 |
| Charcoal | Black/charcoal: text on light, dark page background | `#161A18` | 22, 26, 24 | 15 / 0 / 8 / 90 |
| Charcoal 800 | Dark-mode card surface | `#1F2422` | 31, 36, 34 | 14 / 0 / 6 / 86 |
| Off-white | Light-mode page background | `#F6F4EF` | 246, 244, 239 | 0 / 1 / 3 / 4 |
| White | Cards on light | `#FFFFFF` | 255, 255, 255 | 0 / 0 / 0 / 0 |
| Champagne | Accent: thin rules, premium badges, secondary chart line | `#C9A86A` | 201, 168, 106 | 0 / 16 / 47 / 21 |
| Stone 500 | Muted text | `#6B7370` | 107, 115, 112 | 7 / 0 / 3 / 55 |

**Rules**
- Green is an accent, not a wash. Backgrounds are off-white, white or charcoal. Green covers at most about 10% of any screen. At most one green primary button per viewport.
- Champagne covers at most about 2% of a screen and is never used for text under 16 px. On light backgrounds the UI uses a darkened champagne (`#A98747`) for text so it meets 4.5:1.
- No gradients. Flat fills only.
- Status colours (pending `#B7791F`, approved `#2F7D5B`, modified `#4A6FA5`, rejected `#B23A3A`) are desaturated to sit with the palette.
- Charts: primary line deep green, secondary line champagne, grid charcoal at 8% opacity.

**Semantic variables** (use these in components, never raw hex): `--brand`, `--brand-hover`, `--brand-strong`, `--brand-soft`, `--accent`, `--bg-primary`, `--bg-surface`, `--bg-card`, `--text-primary`, `--text-secondary`, `--text-muted`, `--text-heading`, `--border-subtle`, `--border-active`. Tailwind utilities are exposed as `bg-brand`, `text-brand`, `bg-brand-soft`, `text-accent`, `bg-paper`, `bg-surface`, `text-ink`, `text-ink-muted`, `border-line`.

---

## 3. Typography

Two families only, both SIL Open Font Licence and self-hosted through `next/font`.

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display / headings | **Manrope** | 600, 700, 800 | Sentence case. Tight tracking (-0.02em). Uppercase only for the wordmark and small eyebrow labels. |
| Body / UI | **Inter** | 400, 500, 600 | 14 px minimum for body, 12 px minimum for any UI label. Line height 1.6 body, 1.2 headings. |

Scale (desktop): page title 24 px / 800, section title 16 px / 700, card title 14 px / 600, body 14 px / 400, label 12 px / 700 uppercase with 0.08em tracking. Hero headlines may go to 48–60 px but never all-caps.

---

## 4. Photography and illustration

Real, natural, strong and human. Authentic client transformation photos only where written consent exists (`Testimonial.consentGiven`). Prefer believable lifestyle, food, training and progress imagery with soft natural light. Avoid bodybuilding stock, aggressive poses, cartoon fitness art and heavy filters. Until approved photos exist, use the neutral off-white placeholder with the monogram.

---

## 5. Voice

Short, plain sentences. Calm, knowledgeable, warm. Say what the client will do and why it works. No hype words ("engine", "console", "dossier"), no exclamation-heavy copy, no motivational quotes. Nigerian and international foods are named plainly and treated as normal, not as exceptions.

---

## 6. Fitness Food Police sub-brand

"Fitness Food Police" is a playful content and personality sub-brand for humorous, educational social media. It never replaces or competes with the corporate identity. Inside the product it appears at most as a single light-hearted touchpoint (for example a verdict badge on a logged meal), styled with the same palette and fonts. Product areas, navigation, pricing and documents use ERICONET naming only.

---

## 7. Documents

Meal plans, progress reports, workout programmes and check-in forms share one template: A4, 18 mm margins, horizontal logo and tagline in the header, client name and page number in the footer, E watermark centred at 6% opacity. Always light. Tables use charcoal text on off-white with a single thin champagne rule under headings.

---

## 8. Do and don't

**Do:** generous white space, one accent per component, consistent 12 px radius on cards and 10 px on buttons, 44 px touch targets.

**Don't:** generic gym aesthetics, excessive green or gradients, cartoon fitness imagery, over-muscular imagery, more than two fonts, more than the palette above, cluttered layouts, text under 12 px, motivational quotes, cheap generic templates.
