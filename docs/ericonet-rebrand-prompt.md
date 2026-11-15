# ERICONET FITNESS & WELLNESS — Platform Rebrand & Brief Alignment

> Paste everything below this line into a fresh Claude Code session opened in this repo.
> Work phase by phase. Commit at the end of each phase with the message format `PHASE n: <summary>`.

---

## 0. Context you must read first

- This repo is a Next.js 16.3 / React 19 / Tailwind v4 / Prisma 5 (SQLite) app currently branded **"Fitness Police"** with a sky-blue / cyan palette, a `Flame` / `ShieldAlert` lucide icon as the logo, and Unsplash stock photos.
- `AGENTS.md` warns this Next.js version differs from training data. **Before writing any code, read the relevant guides in `node_modules/next/dist/docs/`** (app router, fonts, metadata, route handlers, images). Heed deprecation notices.
- The brand brief is `/Users/apple/Downloads/ERICONET_Fitness_Wellness_Brand_Design_Brief.docx`. Its contents are summarised faithfully in Section 1 below. Treat Section 1 as the source of truth.
- Do not change business logic that is unrelated to the brief (nutrition engine maths, entitlement rules, auth flow) unless a task below explicitly says so.
- Run `npm run build` after every phase. The build must pass before you commit.

---

## 1. The brief (source of truth)

**Brand name:** ERICONET FITNESS & WELLNESS
**Tagline:** Nutrition. Training. Transformation.

**Positioning:** personalised fitness, nutrition and lifestyle coaching for sustainable physical transformation through structured nutrition, training, accountability and measurable progress. Services: personalised nutrition coaching; fat loss and sustainable weight management; muscle building and body recomposition; structured training and progressive overload; lifestyle improvement and accountability; regular progress tracking and programme adjustments; practical, evidence-informed coaching for real people.

**Personality:** professional, knowledgeable, modern, approachable, disciplined, results-focused, evidence-informed, human and relatable.

**Audience:** adults wanting fat loss and better health; people seeking sustainable weight management rather than crash diets; muscle building / recomposition; busy professionals needing structure and accountability; Nigerian/African clients and international clients; people who want coaching that fits normal life and familiar foods.

**Logo direction:** minimalist, modern, premium. A clean **E monogram** or abstract symbol built around the letter E. Must work as a standalone icon and alongside the full name, stay clear at small sizes, and work digitally, in documents, on social and merchandise. **Avoid:** dumbbells, barbells, muscle silhouettes, six-pack icons, fork/knife, plates, measuring tapes, generic swooshes, complicated fitness symbols.

**Logo variations required:** primary, horizontal, standalone E monogram/icon, black, white/reversed, transparent background.

**Colour:** deep green; black/charcoal; white/off-white; optional restrained gold/champagne accent. Provide HEX, RGB and CMYK. **Avoid excessive gradients or too many colours.**

**Typography:** modern strong sans-serif for headings; clean highly readable sans-serif for body; premium, modern, professional; commercially licensed, long-term safe.

**Photography:** real, natural, strong, human. Authentic client transformation photos (with permission). Avoid bodybuilding stock imagery. Clean, confident, premium rather than aggressive.

**Fitness Food Police sub-brand:** a fun, humorous, educational content/personality sub-brand for social media. It must **not** replace or compete with the main corporate identity. Main identity stays professional and premium; Fitness Food Police can be playful.

**Branded meal plan / nutrition PDF:** cover page with client name, primary goal, starting weight, target weight, programme duration, coach/business branding, tagline. Daily pages with day number, Meal 1, snack(s), Meal 2 / Meal 3, exact food quantities, daily calorie target, protein/carb/fat targets, clear formatting.

**Nutrition guidelines section (branded):** raw vs cooked weights; water intake; meal timing; protein intake; vegetables and fruit; fibre; cooking oils; seasoning and sauces; drinks and liquid calories; eating out; snacks and cravings; what to do after a missed meal; social events; normal day-to-day weight fluctuations; food substitutions.

**Progress report template:** starting weight, current weight, waist, average steps, training consistency, nutrition adherence, hunger, energy, sleep, strength/performance, challenges, wins, coach assessment, next adjustments.

**Workout programme template:** exercise, sets, reps, rest period, tempo (where applicable), RPE/RIR (where applicable), progression guidance, coach notes.

**Weekly check-in form:** current weight, waist, average daily steps, training sessions completed, nutrition adherence, hunger, energy, sleep, stress, challenges, wins, what the client needs help with.

**Watermark:** E monogram as a subtle watermark on PDFs and formal client documents; never interferes with readability.

**Overall avoid:** generic gym aesthetics, excessive green or gradients, cartoon fitness imagery, over-muscular or aggressive imagery, too many fonts, too many colours, cluttered layouts, tiny text, excessive motivational quotes, cheap generic templates.

**Final feel:** PROFESSIONAL + TRUSTWORTHY + MODERN + DISCIPLINED + HUMAN + RESULTS-FOCUSED. Credible enough for a serious coaching business, approachable enough to feel like a real coach who understands everyday life.

---

## 2. Current-state audit (what you are changing)

| Area | Current state | Brief requirement |
|---|---|---|
| Brand name | "Fitness Police" everywhere: `layout.tsx` metadata, `PublicHeader`, `PublicFooter`, `Sidebar`, `ClientAppShell`, `AdminAppShell`, login/signup, seed emails `@fitnesspolice.com` | ERICONET FITNESS & WELLNESS as master brand |
| Sub-brands | "Food Police" (free nutrition logging) and "Fitness Police" (paid training) are the product names | "Fitness Food Police" is a playful content sub-brand only; must not be the corporate identity |
| Logo | `Flame` icon in a sky-to-blue gradient square; `ShieldAlert` in sidebar | E monogram system, no gym clichés, no gradients |
| Colours | `--color-brand: #38bdf8` (sky). ~400 hardcoded `sky-*`, `cyan-*`, `blue-*` Tailwind classes across 39 files. Gradients in hero, header logo, pricing | Deep green, charcoal, off-white, optional champagne. Minimal gradients |
| Fonts | System font stack in `globals.css`; no `next/font` | Strong sans headings, readable sans body, licensed |
| Assets | `public/` contains only Next.js starter SVGs | Logo SVG set, favicon, OG image |
| Imagery | Unsplash stock (hero athlete, check-in photo, progress photos, seed avatars) | Real/neutral, non-aggressive; no bodybuilding stock |
| Weekly check-in | `WeeklyCheckIn` has weight, waist, energy, sleep, workoutAdherence %, nutritionAdherence %, difficultyLevel, challenges, generalFeedback, photoUrl | Needs: average daily steps, training sessions completed, hunger, stress, wins, "what I need help with" as its own field |
| Progress report | Does not exist as an entity or document | Full branded progress report with coach assessment and next adjustments |
| Workout programme | `Exercise` has sets, reps, restSeconds, tempo, notes | Needs RPE/RIR, progression guidance, coach notes as distinct fields |
| Meal plan | `MealPlan` + `MealPlanItem` keyed by mealType only; no day structure; no programme duration or target weight | Day-by-day plan, exact quantities, cover page with starting/target weight and duration |
| Nutrition guidelines | Not present (resources page has 4 placeholder article cards) | 15-topic branded guidelines section |
| PDF / print | None | Branded meal plan, progress report, workout programme, check-in form as PDF with E watermark |
| Copy tone | Hype-heavy ("Head Coach Operations Console", "Secure Authentication Engine", "Sunday Check-In Engine", "Client 360° File") | Professional, calm, human |

---

## 3. Brand system to implement

### 3.1 Single source of truth: `src/lib/brand.ts`

Create one constants module and import from it everywhere. No brand string may be hardcoded in a component after this work.

```ts
export const BRAND = {
  name: 'ERICONET FITNESS & WELLNESS',
  shortName: 'ERICONET',
  tagline: 'Nutrition. Training. Transformation.',
  coachName: 'Coach Eric',            // replaces "Oga Eric" in UI copy; seed data may keep the real name
  subBrand: { name: 'Fitness Food Police', tone: 'playful' },
  contact: { email: '', whatsapp: '', instagram: '' }, // fill from env or leave blank
  legalName: 'ERICONET Fitness & Wellness',
} as const;
```

### 3.2 Colour tokens (replace the sky palette in `globals.css`)

Use exactly these tokens. Put the HEX / RGB / CMYK table in `docs/brand-guide.md` as well.

| Token | Role | HEX | RGB | CMYK (approx.) |
|---|---|---|---|---|
| `--brand-green-900` | Primary deep green (buttons, active states, headings accent) | `#0B3D2E` | 11, 61, 46 | 82, 0, 25, 76 |
| `--brand-green-700` | Hover / secondary green | `#145A43` | 20, 90, 67 | 78, 0, 26, 65 |
| `--brand-green-100` | Tint for subtle backgrounds / badges | `#E3EFE9` | 227, 239, 233 | 5, 0, 3, 6 |
| `--brand-charcoal` | Black/charcoal: dark surfaces, body text on light | `#161A18` | 22, 26, 24 | 15, 0, 8, 90 |
| `--brand-charcoal-800` | Dark-mode card surface | `#1F2422` | 31, 36, 34 | 14, 0, 6, 86 |
| `--brand-offwhite` | Light-mode page background | `#F6F4EF` | 246, 244, 239 | 0, 1, 3, 4 |
| `--brand-white` | Cards on light | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0 |
| `--brand-champagne` | Restrained accent: thin rules, premium badges, chart secondary line. **Never** large fills | `#C9A86A` | 201, 168, 106 | 0, 16, 47, 21 |
| `--brand-stone-500` | Muted text | `#6B7370` | 107, 115, 112 | 7, 0, 3, 55 |

Rules:
- Map the existing semantic variables (`--color-brand`, `--bg-primary`, `--bg-surface`, `--bg-card`, `--text-*`, `--border-*`) onto the tokens above for both `:root` (dark) and `html.light`. Keep the semantic variable names so component CSS classes (`.btn-brand`, `.surface`, `.badge-*`) keep working.
- **Light mode becomes the default theme** (off-white page, white cards, charcoal text, deep green primary). Dark mode remains available via the existing `ThemeProvider` and uses charcoal surfaces with off-white text. Update `layout.tsx` (`className="dark"` → `"light"`) and the `ThemeProvider` default accordingly.
- Green is an accent, not a wash. Page backgrounds are never green. No full-bleed green sections. At most one green primary CTA per viewport.
- Remove every gradient except: none. Replace `bg-gradient-to-*` with flat fills. Replace `text-transparent bg-clip-text` headline effects with solid text.
- Status colours (pending/approved/modified/rejected) may stay but desaturate them to sit with the palette (amber `#B7791F`, green `#2F7D5B`, slate-blue `#4A6FA5`, red `#B23A3A`).
- Chart colours in `recharts` usages: primary line `#0B3D2E`, secondary line `#C9A86A`, grid `rgba(22,26,24,0.08)`.

### 3.3 Typography (`next/font`)

- Headings: **Manrope** (weights 600, 700, 800). Body: **Inter** (400, 500, 600). Both are SIL Open Font License, which satisfies the "commercially licensed, long-term" requirement. Load via `next/font/google` in `layout.tsx`, expose as CSS variables `--font-display` and `--font-sans`, and remove the system stacks from `globals.css`.
- Minimum body size 14px, minimum UI label size 12px. Remove every `text-[9px]`, `text-[10px]` and `text-[11px]` and replace with `text-xs` (12px) at minimum. Fix the `.label-xs` class to 12px.
- Headings: sentence case, not SHOUTING uppercase. Remove the `uppercase` class from h1/h2 hero and section headings. Keep uppercase only for tiny eyebrow labels (`.label-sm`) with tracking.
- Two type families only. Delete any third font reference.

### 3.4 Logo system (SVG files in `public/brand/`)

Design and hand-write the SVGs (no external fetch). Concept: a geometric **E monogram** formed from three horizontal bars of equal weight with the middle bar shortened, set inside an optional rounded square. Stroke-free, single colour, works at 16px.

Produce:
- `e-monogram.svg` (green on transparent), `e-monogram-black.svg`, `e-monogram-white.svg`
- `logo-primary.svg` (monogram stacked above wordmark + tagline), `logo-primary-black.svg`, `logo-primary-white.svg`
- `logo-horizontal.svg` (monogram left, wordmark right), `logo-horizontal-black.svg`, `logo-horizontal-white.svg`
- `watermark.svg` (monogram at 6% opacity, for PDFs)
- `favicon.svg`, `apple-touch-icon.png` (180px, render from SVG with a script or skip if no renderer is available; say so in the PR), and an `opengraph-image` route under `src/app/` using Next's built-in OG image generation that renders the horizontal logo on off-white.

Create a React component `src/components/brand/Logo.tsx` with props `variant: 'monogram' | 'horizontal' | 'primary'`, `tone: 'auto' | 'black' | 'white' | 'green'`, `size`. Use it in `PublicHeader`, `PublicFooter`, `Sidebar`, `ClientAppShell`, `AdminAppShell`, `login`, `signup`, `onboarding`. Delete all `Flame` and `ShieldAlert` logo usages. Wordmark set in Manrope 800 with 0.02em tracking: "ERICONET" on one line, "FITNESS & WELLNESS" smaller beneath.

Write `docs/brand-guide.md`: palette table (above), type scale, logo clear-space and minimum size rules, do/don't list from the brief, and the sub-brand rule.

### 3.5 Naming the products inside the platform

The platform's features keep working, but their names change so the master brand is ERICONET and "Fitness Food Police" is only a playful content/community touch:

| Current name | New name |
|---|---|
| Food Police (free meal logging) | **Nutrition Log** (free). The AI/coach review queue in admin becomes **Nutrition Review Queue**. |
| Fitness Police (paid training hub) | **Training Hub** |
| "Fitness Police Free / Silver Coaching / Gold Fitness Police / Diamond VIP" | **Starter (Free) / Essential / Signature / Private Coaching** — update `PLAN_DETAILS` names, taglines and `getUpgradeMessage` strings in `src/lib/services/entitlements.ts`. Keep tier keys (`FREE/SILVER/GOLD/DIAMOND`), prices and feature arrays unchanged. |
| "Head Coach Operations Console" | **Coach Dashboard** |
| "Client 360° File" | **Client Profile** |
| "Sunday Check-In Engine", "Secure Authentication Engine", "Personalisation Engine" | plain names: Weekly Check-In, Sign in, Personalisation |
| "Oga Eric" in UI copy | `BRAND.coachName` |
| Seed coach email `coach@fitnesspolice.com` | `coach@ericonet.fit` (or similar); update the demo persona list in `Navbar.tsx` and the demo buttons on `login/page.tsx` |

Add a single, optional, clearly playful "Fitness Food Police" touchpoint: a small badge or card on the Nutrition Log page ("Fitness Food Police verdict: approved ✅") driven by `BRAND.subBrand`. Its styling may use a rounded pill and a friendlier tone, but it still uses the brand palette and fonts. Nothing else in the product uses the "police" framing.

Update `layout.tsx` metadata: title `ERICONET Fitness & Wellness | Nutrition. Training. Transformation.`, description from the positioning statement, `metadataBase`, OpenGraph and Twitter cards, icons pointing to the new favicon.

---

## 4. Data model changes (Prisma)

Edit `prisma/schema.prisma`, run `npx prisma migrate dev --name ericonet_brief_alignment`, regenerate the client, and update `prisma/seed.ts` so every new field is populated for the three demo clients.

### 4.1 `Profile`
Add:
```prisma
startingWeightKg      Float?
targetWeightKg        Float?
programmeStartDate    DateTime?
programmeDurationWeeks Int?     @default(12)
averageDailySteps     Int?
```
On onboarding, set `startingWeightKg = weightKg`. Add a "Target weight" and "Programme length" step or field to the onboarding flow (`src/app/onboarding/page.tsx`) and to the coach's client profile editor.

### 4.2 `WeeklyCheckIn`
Add (keep existing fields):
```prisma
averageDailySteps         Int?
trainingSessionsCompleted Int?
trainingSessionsPlanned   Int?
hungerLevel               Int?    // 1-5
stressLevel               Int?    // 1-5
wins                      String?
helpNeeded                String?
```
Migrate meaning: `generalFeedback` currently holds "what do you need help with"; move that UI field to `helpNeeded` and keep `generalFeedback` as optional free text. Derive `workoutAdherence` from sessions completed / planned when both are present.

### 4.3 `Exercise`
Add:
```prisma
rpe                 Float?   // 1-10
rir                 Int?     // reps in reserve
progressionGuidance String?
coachNotes          String?
```
Keep `notes` for backwards compatibility but stop writing to it from the Workout Builder.

### 4.4 Meal plan day structure
Add `dayNumber Int @default(1)` and `quantity String?` (exact quantity, e.g. "150 g cooked rice", "2 medium eggs") to `MealPlanItem`. Add `mealLabel String?` ("Meal 1", "Snack", "Meal 2", "Meal 3") so the PDF uses the brief's labels while `mealType` keeps powering the existing logic. Add to `MealPlan`: `durationDays Int @default(7)`, `guidelinesIncluded Boolean @default(true)`.

### 4.5 New model `ProgressReport`
```prisma
model ProgressReport {
  id                   String   @id @default(uuid())
  userId               String
  user                 User     @relation("UserProgressReports", fields: [userId], references: [id], onDelete: Cascade)
  coachId              String
  coach                User     @relation("CoachProgressReports", fields: [coachId], references: [id])
  periodStart          DateTime
  periodEnd            DateTime
  startingWeightKg     Float
  currentWeightKg      Float
  waistCm              Float
  averageSteps         Int?
  trainingConsistency  Int      // %
  nutritionAdherence   Int      // %
  hunger               Int?     // 1-5 avg
  energy               Int?     // 1-5 avg
  sleep                Int?     // 1-5 avg
  strengthPerformance  String?
  challenges           String?
  wins                 String?
  coachAssessment      String
  nextAdjustments      String
  publishedAt          DateTime?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```
Add the two relation arrays to `User`.

### 4.6 New model `NutritionGuideline`
Seed the 15 brief topics as rows (`slug`, `title`, `orderIndex`, `body` in Markdown, `active`). Write real, practical, evidence-informed content for each topic (150–250 words each), in a calm coach voice, referencing familiar Nigerian and international foods where natural (rice, yam, plantain, beans, eggs, chicken, fish, oats). No motivational quotes.

---

## 5. Feature work

### 5.1 Weekly check-in (client) — `src/app/client/check-in/page.tsx` and `src/app/api/fitness-police/check-in/route.ts`
Rebuild the form to exactly the brief's field order: current weight, waist, average daily steps, training sessions completed (of planned), nutrition adherence, hunger (1–5), energy (1–5), sleep (1–5), stress (1–5), challenges, wins, what you need help with. Optional progress photo stays. Remove the hardcoded Unsplash default photo URL and the pre-filled demo values; prefill weight/waist from the last check-in or profile only. Keep the existing AI trends summary.

### 5.2 Coach check-in review — `src/app/admin/check-ins/page.tsx`
Show all new fields in the review card. Add a "Create progress report from this check-in" action that pre-fills a `ProgressReport` draft.

### 5.3 Progress reports (new)
- Admin: `src/app/admin/clients/[id]/reports/` list + `new` + `[reportId]` edit. Fields per 4.5. Auto-prefill from profile and the last 4 check-ins (averages for hunger/energy/sleep/steps, consistency %). Publish button sets `publishedAt` and creates a `Notification`.
- Client: `src/app/client/progress/` gets a "Reports" tab listing published reports with a "Download PDF" button.
- API: `src/app/api/admin/progress-reports/route.ts` (GET/POST), `[id]/route.ts` (GET/PATCH), `src/app/api/progress-reports/mine/route.ts` for clients. Enforce the `progress_reports` entitlement for clients (Diamond), but coaches can always create.

### 5.4 Workout programme — `src/app/admin/fitness-police/page.tsx` (Workout Builder) and client `fitness-police` / `programs` pages
Add RPE, RIR, progression guidance and coach notes inputs per exercise. Client view shows the brief's column set: Exercise · Sets · Reps · Rest · Tempo · RPE/RIR · Progression · Coach notes. Rename route segments `fitness-police` → `training` for both client and admin (`src/app/client/training`, `src/app/admin/training`, `src/app/api/training/*`); add `redirects()` in `next.config.ts` from the old paths.

### 5.5 Meal plan builder and client view
- Admin: add a meal plan builder under `src/app/admin/clients/[id]/meal-plan` that works day by day (Day 1…N), with meal labels Meal 1 / Snack / Meal 2 / Meal 3, exact quantity, calories and macros per item, and a per-day total vs. target bar.
- Client: `src/app/client/nutrition` (renamed from `food-police`) gets a "My Meal Plan" tab rendering the same structure, plus a "Download PDF" button.
- Add `redirects()` for `/client/food-police` → `/client/nutrition` and `/admin/food-police` → `/admin/nutrition-review`.

### 5.6 Nutrition guidelines
- Client: `src/app/client/resources` becomes **Guides**, lists the 15 `NutritionGuideline` topics in brief order, each opening a reading page `resources/[slug]`. Remove the 4 placeholder articles and the "PREMIUM" lock on guidelines (they are included with every meal plan per the brief).
- The guidelines are also appended as a section to the meal plan PDF when `guidelinesIncluded` is true.

### 5.7 Branded PDF documents
Implement with print-optimised React routes plus the browser's print-to-PDF, so no native dependencies are needed:
- `src/app/print/meal-plan/[id]/page.tsx`
- `src/app/print/progress-report/[id]/page.tsx`
- `src/app/print/workout-programme/[id]/page.tsx`
- `src/app/print/check-in-form/page.tsx` (blank weekly check-in form for clients who prefer paper/WhatsApp)
- `src/app/print/layout.tsx` with its own `@page { size: A4; margin: 18mm }` CSS, no app chrome, light theme forced, Manrope/Inter embedded, the E monogram `watermark.svg` fixed centre at 6% opacity behind content, header strip with horizontal logo + tagline, footer with page number via CSS counters, client name and "Prepared by Coach Eric · ERICONET Fitness & Wellness".
- Each print page checks session: the owning client or any COACH/ADMIN may view; otherwise 404.
- Meal plan PDF structure must match the brief: cover (client name, primary goal, starting weight, target weight, programme duration, branding, tagline) → daily pages (Day n, Meal 1, Snack, Meal 2, Meal 3, exact quantities, daily calorie target, P/C/F targets) → Nutrition Guidelines section → closing page with contact and disclaimer.
- Add a "Download PDF" button component `src/components/brand/DownloadPdfButton.tsx` that opens the print route in a new tab and calls `window.print()` on load (`?autoprint=1`).
- If you can add `@react-pdf/renderer` or Playwright-based server rendering without breaking `next build --webpack`, you may add a `GET /api/pdf/...` route as an enhancement, but the print routes are the required deliverable.

### 5.8 Public website (`src/app/page.tsx` and `src/components/public/*`)
Rewrite copy and layout to the brief's tone. Keep the section order but rename anchors and headings:
- Hero: headline "Sustainable transformation, built around your life." Sub-copy from the positioning statement. Primary CTA "Start your assessment" → `/onboarding`. Secondary "See how coaching works" → `#coaching`. Replace the Unsplash athlete photo with a neutral, premium placeholder block (off-white card with the monogram and three real metric chips: calorie target, protein target, weekly check-in) until the client supplies approved transformation photos. No gradient backlight.
- Sections: What we help with (the 7 positioning bullets as a clean grid) · How coaching works (assessment → plan → weekly check-in → adjust) · Nutrition that fits familiar foods · Structured training and progressive overload · Progress you can measure (show the check-in metrics) · Client results (testimonials from DB; before/after only where `verifiedClient` and both photos exist; otherwise text card) · Plans · FAQ (new, 6 questions: who it's for, Nigerian/international, foods, how check-ins work, how long, how to cancel) · Final CTA.
- Remove all "FREE" shouting badges in the nav. Nav items: Coaching · Nutrition · Training · Results · Plans · Sign in · Start.
- Footer: logo, tagline, positioning line, the medical disclaimer (keep), contact placeholders from `BRAND.contact`, © `BRAND.legalName`.
- No motivational quotes anywhere on the site. Max one short client quote per testimonial card.

### 5.9 App shells, auth, onboarding
- `ClientAppShell` nav: Home · Nutrition · Training · Progress · Check-in · Guides · Settings. `AdminAppShell` nav: Dashboard · Clients · Nutrition Review · Training Builder · Check-ins · Reports · Testimonials.
- Sidebar/topbar use `Logo variant="horizontal"` on desktop and `monogram` collapsed. Remove the purple "ACTIVE" badges.
- `login`, `signup`, `onboarding`: logo at top, calm copy, remove "Secure Authentication Engine" text, keep demo persona buttons but label them "Demo accounts".
- `TrialBanner`, `NotificationCenter`, modals: swap colours via tokens, no gradients.

### 5.10 Imagery
- Remove every `images.unsplash.com` URL from `src/` and `prisma/seed.ts`. Seed avatars use initials (already supported in `Sidebar`). Testimonial photos are `null` in seed except where a local placeholder in `public/placeholders/` is used (generate simple neutral SVG placeholders: off-white with the monogram, labelled "Photo pending client consent").
- Add a `consentGiven Boolean @default(false)` to `Testimonial`; public site only renders photos when `consentGiven && verifiedClient`.

### 5.11 Sweep
- `grep -rn "sky-\|cyan-\|blue-\|from-\|to-\|via-\|Flame\|ShieldAlert\|Fitness Police\|Food Police\|Oga Eric\|unsplash" src prisma` must return zero hits except the single sub-brand component and the historical seed name if retained.
- `grep -rn "text-\[9px\]\|text-\[10px\]\|text-\[11px\]" src` must return zero hits.
- Update `README.md` to describe the product as ERICONET Fitness & Wellness with setup, seed accounts, and the print/PDF routes.

---

## 6. Phase plan and commits

1. **PHASE 1 — Brand foundation:** `brand.ts`, tokens in `globals.css`, `next/font`, logo SVGs + `Logo` component, metadata/favicon/OG, light default theme, `docs/brand-guide.md`. Build passes.
2. **PHASE 2 — Rename and restyle:** product names, route renames + redirects, shells, auth, onboarding, public site rewrite, sweep of hardcoded colours and tiny text. Build passes, run the app and visually check `/`, `/login`, `/onboarding`, `/client/dashboard`, `/admin/dashboard` in both themes.
3. **PHASE 3 — Data model:** schema changes, migration, seed updates, API updates for check-in and exercises. Build + `npx prisma db seed` pass.
4. **PHASE 4 — Check-in, workout programme, meal plan builder, guidelines.**
5. **PHASE 5 — Progress reports + all print/PDF routes with watermark.** Open each print route in the browser, print preview to A4, and confirm: cover content, day pages, guidelines, watermark visible but faint, no clipped text, page numbers.
6. **PHASE 6 — README, final sweep greps, Lighthouse-style pass:** contrast of green-on-off-white and champagne-on-charcoal meets WCAG AA for text (champagne is accent-only, never body text).

For each phase, report: files changed, what was verified in the running app, and anything you could not complete and why.

---

## 7. Hard rules

- Two fonts. Nine palette tokens. No gradients. No gym-cliché icons (no `Dumbbell` as a brand mark; lucide `Dumbbell` may remain as a small functional nav icon only if nothing better fits; prefer `Activity` or `ClipboardList`).
- Green ≤ 10% of any screen's area. Champagne ≤ 2% and never as text under 16px.
- Minimum 12px UI text, 14px body, 4.5:1 contrast.
- Tone: short, plain sentences. No exclamation-heavy copy. No "engine", "console", "dossier", "police" (outside the sub-brand touchpoint).
- Keep SQLite and the existing cookie auth; do not introduce a new auth provider or payment provider in this work.
- Do not delete existing data columns; add and migrate forward.
- Every new page works on a 375px wide screen.
