# ERICONET — UI Rebuild Prompt (v3)

> Paste this whole document as the brief. Starting point is the `ericonet-rebrand` branch: brand tokens, Prisma schema, APIs, print routes and the retired "Fitness Police" naming are all settled. Nothing in the data layer changes. Everything the user sees is rebuilt.
>
> This is a full rebuild in six phases: design system and shell, public site, auth and onboarding, client app, coach app, polish and QA.

---

## 0. The problem, measured

The current UI is correct and complete, and it looks like a template a model generated. These tells come from the code and from screenshots of the running app at 375px and 1280px:

| Tell | Evidence |
| --- | --- |
| Everything is a white card | 107 `surface` boxes, 137 `rounded-xl/2xl`. Sections are grids of bordered rectangles |
| Label soup | 104 uppercase 12px eyebrows: "FOCUS 01 • TRAINING", "WHAT SHOULD I DO TODAY?", "ACCOUNT ACCESS" |
| Badge soup | 95 badges. Most screens show four or more pills at once |
| No art direction | Zero photographs. Fourteen grey "photo pending" tiles, including on the public results section |
| Same rhythm six times | Public site = eyebrow, H2, paragraph, three icon cards, repeat. Hero is text-left / card-right |
| Decorative icons | Lucide icons in rounded squares as ornaments on services, steps and stats |
| Template voice | "Here is your personal fitness focus and daily blueprint for today", "SYSTEM STATUS Human-in-the-Loop Active" |
| Demo-ware | Login prints "Default: password123" and a list of demo accounts |
| Mobile is desktop stacked | Five header controls in 375px, long single-scroll forms with uppercase labels, overflowing tables, no sticky actions, no sheets |
| The safest possible fonts | Manrope + Inter is the default pairing of a thousand generated apps |
| No signature moments | Nothing on any screen is memorable. Nothing is big. Nothing is allowed to be beautiful |

The outcome we want is simple to state: a stranger opening the site on a phone should think "a serious studio with a real design team built this", and a client opening the app every day should feel it was designed for their thumb.

---

## 1. Direction: confident, editorial, Nigerian, precise

**One sentence.** ERICONET looks like a premium coaching studio's own product: editorial typography at poster scale, real photographs of real people and real food, numbers set like a lab report, deep green used like a signature rather than a wash, and copy that sounds like a coach who has done this a thousand times.

This is **not** quiet wellness minimalism. Calm screens, yes. Timid screens, no. Every page gets one moment that is unmistakably designed.

### 1.1 Qualities to steal (not looks to copy)

- **Poster typography.** Headlines large enough to be the image when there is no image. Tight tracking, ragged right, deliberate line breaks.
- **Photographic honesty.** Natural light, warm skin, Nigerian kitchens and gyms, jollof and yam and plantain photographed like food magazines do. No stock gym clichés.
- **Lab-report numbers.** One hero number per screen, tabular figures, units set small, deltas with plain-language context. Trends as a single clean line.
- **Native-app muscle memory.** Bottom tabs, sheets, large titles that collapse, swipe to complete, long-press steppers, sticky primary actions above the keyboard.
- **A signature mark used with nerve.** The E monogram at 400px bleeding off a corner at 4% opacity, or as a 24px wordmark. Nothing in between.

### 1.2 Principles

1. **One primary thing per screen.** If two elements compete, one loses size, colour or position.
2. **Cards are earned.** A panel exists only to group or elevate. Lists use rows and hairlines, sections use whitespace. Target: under 25 panels across the whole client app.
3. **Photography is the brand; green is the frame.** Deep green at most 10% of any screen, used for the primary action, the active state and one highlight panel.
4. **Numbers are typeset, never badged.**
5. **Icons only when functional:** navigation, actions, status. Never as section decoration.
6. **Design at 375px, then widen.** Desktop is the adaptation.
7. **Motion explains.** Things come from somewhere and go somewhere. 150 to 250ms, respect reduced motion.
8. **Every state is designed:** empty, loading, error, success, offline, "coach has not replied yet".
9. **One signature moment per screen,** listed in section 4. If a screen has none, it is not finished.

---

## 2. Design system v2

Keep the nine palette tokens and the semantic variables in `globals.css`. Replace the component layer entirely.

### 2.1 Type

Two families, but choose them deliberately. **Manrope + Inter is no longer the default.** In Phase 1, build a type specimen page at `/dev/type` (local only) that sets the hero, a stat, body copy and a form in each candidate pairing, screenshot it at 375 and 1280, and commit the choice with a one-paragraph rationale in `docs/brand-guide.md`.

Candidates (all on Google Fonts, all with tabular figures):

| Display | Body | Character |
| --- | --- | --- |
| Bricolage Grotesque | Inter Tight | Warm, slightly quirky grotesque with real presence at 80px. Closest to "studio with a point of view" |
| Instrument Serif (display only, headlines and hero stats) | Instrument Sans | Editorial. The serif gives the public site a magazine feel; the sans keeps the app crisp. Riskier, highest ceiling |
| Hanken Grotesk | Hanken Grotesk | One family, superfamily range. Clean, modern, less distinctive |
| Manrope | Inter | The current pairing. Allowed only if the specimen proves the others worse, with the reason written down |

Scale, whichever family wins:

| Role | Weight | Size desktop → mobile | Tracking / leading |
| --- | --- | --- | --- |
| Poster | 700 | `clamp(56px, 8vw, 112px)` | -0.035em / 0.92 |
| Display | 700 | `clamp(40px, 5vw, 72px)` | -0.03em / 0.98 |
| H1 | 700 | 40 → 32 | -0.02em / 1.05 |
| H2 | 600 | 30 → 26 | -0.02em / 1.1 |
| H3 | 600 | 22 → 20 | -0.01em / 1.2 |
| Hero stat | 700 tabular | 64 → 52 | -0.03em / 1 |
| Stat | 600 tabular | 28 → 24 | -0.02em / 1 |
| Body | 400 | 16 | 0 / 1.6 |
| Body small | 400 | 14 | 0 / 1.5 |
| UI | 500 | 14 | 0 / 1.4 |
| Caption | 400 | 12 | 0 / 1.4 |
| Overline | 600 | 12 | +0.08em uppercase. **One per public section, none inside the app shell** |

Rules: `font-feature-settings: "tnum"` on every number. Units typeset at 40% of the number, baseline aligned. Headline line breaks are set by hand with `<br className="hidden md:block" />` where the rag needs it. Never a number inside a badge.

### 2.2 Space, layout, radius, elevation

- 4px base. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Containers: public 1280px with 24px gutters (16px mobile); app content 960px; reading 680px.
- Public vertical rhythm: 128px desktop, 80px mobile between sections. Sections alternate: off-white, white, ink (one per page), off-white.
- Radius: 6 (inputs, pills), 12 (panels, desktop dialogs), 24 (mobile sheets, hero media), full (avatars, pill buttons).
- Elevation: `none` (default), `raised` (`0 1px 2px rgba(22,26,24,.06), 0 12px 32px -16px rgba(22,26,24,.16)`), `overlay` (`0 32px 64px -24px rgba(22,26,24,.32)`). Border or shadow, never both.
- Surfaces: `page` (off-white), `panel` (white), `inset` (green-100 at 40%), `ink` (charcoal or deep green, one per screen).

### 2.3 Colour

- Deep green ≤ 10% of a screen. Champagne ≤ 2% and never text under 16px.
- **Accent treatment, allowed and encouraged:** a 1px champagne rule under a section title (max 64px wide), a champagne target line on charts, a champagne hairline framing the highlighted pricing column, champagne page numbers on print. That is the complete list.
- Status colours only on status. No coloured left borders.
- Monogram texture: the E at 4% opacity, 320 to 480px, anchored off a corner, on at most one section per page and one screen per app area.
- Dark theme stays as a reading preference. Test everything in both.

### 2.4 Imagery

- Create `/public/photos/` with **art-directed placeholders that look finished:** deep-green panel, the monogram texture at 6%, a champagne caption in 12px describing the intended shot ("Coach Eric, morning session, Lekki"). Real photographs replace them by filename with no code change.
- Slots: public hero (4:5 mobile, 16:9 desktop), coach portrait (4:5), plate (1:1), movement (16:9), three result pairs (4:5 each), login (4:5), onboarding review (16:9).
- Grade for real photos: warm, natural, no heavy filters. Duotone green overlay only on the hero, ≤ 30%, only where headline contrast needs it.
- Meal thumbnails in the Food timeline use the client's own photo at 64px with a 12px radius. No photo, no thumbnail: a flat inset square with the meal's first letter.
- Never illustration packs, 3D renders, gradient meshes, emoji.

### 2.5 Data visualisation

- One style: 2px deep green line, green-100 area at 25%, champagne dashed target line, horizontal hairlines only, 12px stone axis text, dots on hover/touch only.
- Sparklines 48×16 inline beside stats.
- Progress to target: a 2px bar across the full content width with the number typeset above. No rings, gauges, donuts or radials anywhere.
- First paint: 300ms fade. No draw-on animation.

### 2.6 Motion

- 150ms hover and toggles, 200ms sheets and menus, 250ms section and list transitions.
- Easing enter `cubic-bezier(.2,.8,.2,1)`, exit `cubic-bezier(.4,0,1,1)`.
- Page content fades up 8px. Sheets slide from the bottom on mobile and scale from 98% on desktop. Lists animate height on add and remove. Numbers tween when they change.
- Shared-element transition from a list row to its detail screen using the View Transitions API where supported, opacity fallback elsewhere.
- `prefers-reduced-motion`: opacity only.
- Libraries allowed: `motion`, `vaul`, `@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`, `sonner`. Nothing else without asking.

### 2.7 Voice

- Sentence case everywhere except the one public overline per section and single-word buttons.
- Short sentences. Use the client's name. Name the food. Plain deltas: "down 0.6 kg since last Sunday".
- Banned: blueprint, command center, console, engine, dossier, roster, athlete, signoff, human-in-the-loop, system status, assessment queue, verdict.
- Buttons state the outcome: "Save check-in", "Send to Chidi", "Start session", "Log lunch".
- Empty states say what will appear and who causes it.

---

## 3. Component library

Build once in `src/components/ui/`. Nothing else is used for UI. Every component: dark theme, keyboard, 44px targets, loading and disabled states, Storybook-style demo on `/dev/ui` (local only).

| Component | Spec |
| --- | --- |
| `AppShell` | Desktop: 240px sidebar, content, optional 320px context rail. Mobile: large title that collapses to a 48px bar on scroll, one trailing action, bottom tab bar (5 max, safe-area aware, 2px active indicator), everything else in a sheet |
| `LargeTitle` | iOS-style: 32px title in flow, collapses into the bar with a 200ms crossfade |
| `HeroStat` | Hero number + small unit + delta sentence + optional 96×24 sparkline |
| `StatRow` | Horizontal scroll with snap on mobile, 3 to 4 up on desktop. No boxes; hairline between items |
| `Section` | Title + optional trailing action, children. Hairline above, not a card around |
| `ListRow` | Leading avatar/thumbnail/none, title, subtitle, trailing value/pill/chevron. 56px min. Optional swipe actions on touch (complete, delete) with haptic tick via `navigator.vibrate(10)` where available |
| `Panel` | The only card. `tone` white/inset/ink, `raised` boolean. Padding 20 mobile, 24 desktop |
| `Segmented` | 2 to 4 options, sliding indicator, full width on mobile |
| `Sheet` | Bottom sheet on mobile with drag handle and snap points (50%, 92%), centred dialog on desktop. Scroll lock, focus trap |
| `Field` | 14px sentence-case label, input, help, error. `inputmode`, `autocomplete`, `enterkeyhint` always set. Unit suffix inside numeric fields |
| `Stepper` | Large −/+ for kg, reps, sets. 52px targets. Long-press accelerates. Haptic tick |
| `Scale` | 1 to 5 with word anchors at both ends and the selected word shown. 44px cells |
| `Slider` | Percentages only, value typeset above the thumb |
| `Button` | primary, secondary, ghost, destructive. Heights 40/48/56. Loading keeps width |
| `Pill` | Status only. One per row |
| `Avatar` | Initials on green-100, photo when present |
| `Table` | Desktop only. Below 768 the same data renders as `ListRow`s |
| `Chart` | Line and bar over Recharts in the 2.5 style |
| `EmptyState` | Monogram at 10%, one sentence, one action |
| `Skeleton` | Matches final layout exactly |
| `Toast` | Bottom centre mobile, bottom right desktop, undo where possible |
| `Banner` | Inset tone only. Trial state and coach notes |
| `Document` | Paper panel with ruled rows, used for meal plans, programmes and reports on screen, identical to print |
| `RestTimer` | Takes over the bottom bar: countdown typeset at stat size, full-width 2px bar draining, skip and +30s |
| `Composer` | The meal-logging sheet: segmented Photo / Describe / Search, camera opens immediately on Photo |

Delete `badge-*`, `surface`, `label-xs`, `section-title`, `field-label` from `globals.css` once unreferenced.

---

## 4. Screen blueprints

Each blueprint gives the layout at 375 and 1280 and names the **signature moment**. ASCII is proportional, not pixel-exact.

### 4.1 Public home

**Signature moment.** The poster headline overlapping the hero photograph's edge, with the monogram bleeding off the top-right corner at 4%.

```
375px                                  1280px
┌──────────────────────┐               ┌─────────────────────────────────────────────────────┐
│ E            Sign in ≡│               │ E  Coaching Nutrition Training Results Plans   Sign in [Start]│
├──────────────────────┤               ├─────────────────────────────────────────────────────┤
│ ████ PHOTO 4:5 ██████│               │ Sustainable          ████████████████████████████████│
│ ████████████████████ │               │ transformation,      ████████ PHOTO 16:9 ████████████│
│ ██ Sustainable ██████│               │ built around         ████████████████████████████████│
│ ██ transformation, ██│               │ your life.           ████████████████████████████████│
│ ██ built around █████│               │                      ████████████████████████████████│
│ ██ your life. ███████│               │ One sentence. [Start your assessment]  See how it works│
│ ████████████████████ │               ├─────────────────────────────────────────────────────┤
├──────────────────────┤               │ 12 weeks     ·     1 coach     ·     Weekly check-ins│
│ One sentence.        │               ├─────────────────────────────────────────────────────┤
│ [Start your assessment]│             │ RESULTS                                              │
│ See how it works →   │               │ ┌────────┐ ┌────────┐ ┌────────┐                     │
├──────────────────────┤               │ │ photo  │ │ photo  │ │ photo  │  −12.4 kg · 16 weeks │
│ 12 weeks · 1 coach · │               │ │ pair   │ │ pair   │ │ pair   │  Chidi, Lagos        │
│ Weekly check-ins     │               │ └────────┘ └────────┘ └────────┘  "two-line quote"    │
└──────────────────────┘               └─────────────────────────────────────────────────────┘
```

Section order and rules:

1. **Nav.** Transparent over the hero, becomes off-white with a hairline after 40px. Mobile menu is a full-screen sheet with 32px links and the primary action pinned at the bottom.
2. **Hero.** Photo 4:5 on mobile with the headline set over the lower half in off-white. Desktop: headline in the left 40%, photo right 60%, the headline's last line overlapping the photo by 48px. One sentence, one primary button, one text link. No bullets, no checklist.
3. **Numbers strip.** Three facts typeset as stats, hairlines between. No cards.
4. **Results.** Three stories. Mobile: horizontal snap scroll, each card 85vw. Desktop: 3-up. Photo pair (consent) or art-directed placeholder, hero stat result, name and city, weeks, two-line quote. No "verified" badges; consent is stated once in the section intro.
5. **How coaching works.** One horizontal rail on desktop with four nodes and 12-word descriptions, a vertical rail on mobile. Beside it, the coach's weekly feedback as a `Document`.
6. **Nutrition.** Plate photo left, `Document` meal-plan day right. Three short sentences, one button.
7. **Training.** The page's ink section. Programme day typeset in off-white, tempo and RPE each explained in one line, movement photo. Monogram texture here.
8. **Coach.** Portrait 4:5, name, two paragraphs in reading width, three credentials as a plain list, a short line on where he trains clients. **This section does not exist today and is the biggest trust gap on the site.**
9. **Pricing.** Desktop: comparison table, plans as columns, features as rows, Signature column framed by a champagne hairline. Mobile: segmented control switching plan detail, price in Naira typeset as a stat, "Starter is free" stated once.
10. **FAQ.** Accordion in reading width.
11. **Final CTA and footer.** Headline, one button, WhatsApp link. Footer: logo, contact, Instagram, legal line.

Acceptance: at most six `Panel`s on the page, no three-column icon grid, at least five photographic slots, one overline per section.

### 4.2 Login and onboarding

**Signature moment.** Onboarding's review step: the client's computed targets appear as hero stats, tweened in, before they commit.

- **Login.** Desktop: photo left 45%, form in a 400px column right, no card. Mobile: logo, large title "Sign in", two fields, button pinned above the keyboard. Demo accounts and the default-password hint render only when `NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS=true`.
- **Onboarding.** Stepper: Account → About you → Goal and timeline → Training setup → Food preferences → Review. Thin progress bar at the top, back button, autosave to local storage. Each step fits one 375px screen without scrolling where possible. Numeric fields have unit suffixes and `inputmode="decimal"`. Review shows calories, protein, target weight and programme end date as hero stats.

### 4.3 Client · Today

**Signature moment.** "Week 4 of 12" set at display size with a full-width 2px progress rule beneath it, the only thing above the fold besides the greeting.

```
375px                                  1280px (content 960, rail 320)
┌──────────────────────┐               ┌──────────────────────────────┬──────────────┐
│ Good morning, Chidi  │               │ Good morning, Chidi          │ Coach note   │
│ Sunday 16 November   │               │ Sunday 16 November           │ "Great pacing│
│                      │               │                              │  on your push│
│ Week 4 of 12         │               │ Week 4 of 12                 │  workout…"   │
│ ━━━━━━━━━━━━━━━━━━━━━│               │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│  Coach Eric  │
│                      │               │                              │  2 days ago  │
│ 85 kg  ↓0.6 this week│               │ 85 kg ↓0.6 this week  ⟋⟍⟋⟍   │              │
│ ⟋⟍⟋⟍⟋⟍              │               │                              │ Check-in due │
├──────────────────────┤               ├──────────────────────────────┤ Sunday       │
│ ▶ Upper body push    │               │ ▶ Upper body push    4 ex · 45 min  [Start] │
│   4 exercises · 45m ›│               ├──────────────────────────────┤              │
├──────────────────────┤               │ ◐ 1,720 of 2,288 kcal  2 meals logged     › │
│ ◐ 1,720 / 2,288 kcal ›│              ├──────────────────────────────┤              │
├──────────────────────┤               │ ✓ Check-in due Sunday                [Start] │
│ ✓ Check-in due Sunday›│              └──────────────────────────────┴──────────────┘
├──────────────────────┤
│ "Great pacing…"      │
│  Coach Eric · 2d ago │
├──────────────────────┤
│ Home Food Train Prog…│
└──────────────────────┘
```

Rules: no "Focus 01/02/03". No cards except the coach note (inset). Three `ListRow`s, each one tap to the thing itself.

### 4.4 Client · Food

**Signature moment.** The meal timeline is photo-first: each logged meal shows the client's own plate photo, and the composer opens the camera in one tap.

- Mobile: large title "Food", day switcher (yesterday / today / tomorrow as a `Segmented`), `HeroStat` calories remaining with a 2px bar, then rows per meal with photo thumbnail, name, kcal, one status pill. Floating "Log a meal" button bottom right above the tab bar opens the `Composer` sheet.
- Desktop: timeline left 60%, the day's macro summary and the coach's latest review in the right rail. Meal plan under a secondary tab as a `Document` with day switcher and totals.
- States: no meals yet today → one sentence and the composer button. Pending coach review → pill "With coach". Reviewed → pill with the coach's adjustment.

### 4.5 Client · Train and the session logger

**Signature moment.** The set logger. Two large `Stepper`s (kg, reps), one "Done" that swipes the set away, and the `RestTimer` taking over the bottom bar with a draining full-width line.

```
375px session logger
┌──────────────────────┐
│ ‹ Upper body push  ⋯ │
│ Incline bench press  │
│ 4 × 8–10 · RPE 8 · 2-0-1│
│                      │
│ Set 2 of 4           │
│  ┌────────┐ ┌───────┐│
│  │ − 42.5 +│ │ − 9 + ││   kg / reps steppers, 52px targets
│  └────────┘ └───────┘│
│  Last week: 40 × 9   │
│                      │
│ Set 1  40 kg × 10  ✓ │   completed sets as rows, swipe to edit
├──────────────────────┤
│ Rest 1:12            │   RestTimer bar, drains left to right
│ ━━━━━━━━━━━━━━━━━━   │
│ [Done set]  +30s  Skip│
└──────────────────────┘
```

- Programme overview: `ListRow`s per day with completion state; swipe left on a day to see its exercises on mobile; the whole day as a `Document` on desktop.
- Progression guidance one line under the exercise name. Coach notes in an inset panel only when present.
- Download PDF lives in the overflow menu.

### 4.6 Client · Check-in

**Signature moment.** The confirmation screen after submit: this week versus last typeset as deltas, with a sparkline of the last eight weeks, and the coach's response time stated.

- Four steps in a full-screen flow on mobile (Measurements, Consistency, How it felt, Notes), two-column form on desktop. Progress bar at the top. Autosaved draft. Submit pinned. `Scale`s for hunger, energy, sleep and stress with word anchors, never bare 1 to 5 radios.

### 4.7 Client · Progress

**Signature moment.** The weight trend as a full-bleed hero chart with the champagne target line, range toggle 4 / 8 / 12 weeks.

- Below: waist, steps and training consistency as a `StatRow`; check-in history as rows; published reports as `Document` cards with PDF in the overflow.

### 4.8 Coach · Today

**Signature moment.** The queue is the page. Three groups of rows: check-ins to review, meals to review, clients quiet for three days, each with a one-tap action. Revenue and client counts sit below as a quiet `StatRow`.

```
1280px
┌──────────┬──────────────────────────────────────────────────────────┐
│ Today    │ Sunday 16 November                                       │
│ Clients  │                                                          │
│ Check-ins│ Check-ins to review (3)                                  │
│ Nutrition│ ● Chidi Okonkwo   85 kg ↓0.6  waist 88  adherence 85%  [Review]│
│ Programmes│● Aminat Bello    62 kg ↑0.2  waist 70  adherence 92%  [Review]│
│ Reports  │                                                          │
│ Testimon.│ Meals to review (2)                                      │
│          │ ▣ Tunde · Jollof rice, chicken · est. 640 kcal        [Open]│
│          │                                                          │
│          │ Quiet for 3+ days (1)                                    │
│          │ ○ Zainab Dahiru · last log Thursday            [Message]│
│          │ ─────────────────────────────────────────────────────── │
│          │ 4 clients   ·   2 paid   ·   ₦65,000 this month          │
└──────────┴──────────────────────────────────────────────────────────┘
```

Remove "System status". No KPI cards at the top.

### 4.9 Coach · Clients and client detail

- **Clients.** Desktop table: name, plan, last check-in, 8-week sparkline, action. Mobile: rows. Search and plan filter in the header.
- **Client detail.** Sticky header: avatar, name, plan pill, Message and Create report. Tabs: Overview, Check-ins, Food, Programme, Meal plan, Reports. Overview: trend chart, targets as an editable inset panel, latest check-in summary.
- **Check-in review.** Desktop split list / review. Mobile: list, tap opens a full-screen review with numbers as a `StatRow`, notes as quotes, feedback textarea, calorie field, submit pinned. The "Create progress report" action sits in the overflow.

### 4.10 Coach · Builders and reports

- Desktop: spreadsheet-like rows, inline editing, arrow-key navigation between cells, duplicate day, drag to reorder. Mobile: read-first, per-row edit sheets; must not break.
- Report editor renders as a `Document` with inline editable fields so the coach edits what the client will print.

### 4.11 Print

Structure unchanged. Adopt the new type and reuse `Document` so screen and paper match.

---

## 5. Mobile: native-app depth, not just responsive

- **Design width 375.** Also screenshot 390 and 430. Breakpoints 640, 768, 1024, 1280.
- **PWA.** Web app manifest, maskable icons, `theme-color` per theme, `display: standalone`, splash colours. "Add to home screen" must produce an app, not a bookmark.
- **Offline logging.** Meal logs and set logs queue in IndexedDB when offline and sync on reconnect, with a small "Saved on this phone, will sync" line. Nothing else needs offline.
- **Safe areas.** `viewport-fit=cover`; tab bar, sticky actions and sheets pad with `env(safe-area-inset-*)`.
- **Large titles** that collapse on scroll. One trailing action in the bar. Everything else in a sheet or overflow.
- **Gestures.** Swipe between programme days, swipe a set to complete, swipe a meal row to delete with undo toast, pull sheet to dismiss. Never swipe-only: every gesture has a visible button equivalent.
- **Thumb zone.** Primary actions in the bottom 40% of the screen. Destructive actions never there.
- **Keyboard.** Primary button stays above the keyboard. Correct `type`, `inputmode`, `autocomplete`, `enterkeyhint`. Numeric fields show units inside the field.
- **Targets.** 44×44 minimum, 52 for steppers. Row heights 56.
- **No horizontal page scroll.** Tables become rows below 768.
- **Performance.** Route-level code splitting, images via `next/image` with explicit sizes, fonts preloaded with `display: swap` and matched fallbacks to kill layout shift. Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best practices ≥ 95, CLS < 0.05.

---

## 6. Retired names

"Fitness Police", "Food Police" and "Fitness Food Police" are already removed from the product, docs and feature keys. Legacy redirects remain in `next.config.ts`. Do not reintroduce them in any copy, component, filename or comment. Acceptance: `grep -rniE "police" src docs README.md next.config.ts` returns only the redirect sources and the retired-names line in `docs/brand-guide.md`.

---

## 7. Anti-pattern checklist

Fail the phase review if any of these appear:

- A grid of three or more equal cards each with an icon in a rounded square.
- More than one uppercase overline per public section, or any overline inside the app shell.
- A number inside a pill or badge.
- A coloured left border on a card.
- Text-left / card-right hero with a checklist under the buttons.
- Any "photo pending" grey tile visible anywhere; placeholders must be the art-directed kind.
- Demo credentials visible outside local development.
- Banned words from 2.7.
- More than one primary button on a screen.
- A mobile layout that is the desktop layout stacked.
- Uppercase form labels.
- A chart with a grid cage, a gauge, a ring or a donut.
- Shadow and border on the same element.
- Gradients, glassmorphism, 3D renders, emoji in UI, marquee tickers, typewriter effects.
- A screen without its signature moment from section 4.
- Manrope + Inter chosen without the specimen comparison written up.

---

## 8. Execution phases

Each phase ends with: build and type check green; screenshots at 375 and 1280 in light and dark for every touched route, saved under `docs/screens/ui-phase-n/`; the anti-pattern checklist run and reported; one commit `UI PHASE n: <summary>` on a branch off `ericonet-rebrand`.

1. **UI PHASE 1 — Type, system, shell.** Type specimen and decision, `src/components/ui/` library with `/dev/ui` demo, surfaces, motion utilities, `AppShell` for client and coach with bottom tabs and large titles, PWA manifest and icons, art-directed photo placeholders. Delete legacy component classes once unreferenced.
2. **UI PHASE 2 — Public site.** All eleven sections, coach section, pricing comparison, mobile nav sheet, numbers strip.
3. **UI PHASE 3 — Auth and onboarding.** Login split layout, stepper onboarding with review-step hero stats, demo accounts env-gated.
4. **UI PHASE 4 — Client app.** Today, Food with composer, Train with session logger and rest timer, Check-in flow with confirmation, Progress, Resources, More. Offline queue for meal and set logs.
5. **UI PHASE 5 — Coach app.** Today queue, clients, client detail tabs, check-in review, builders, report editor as a document.
6. **UI PHASE 6 — Polish and QA.** Motion pass, every state designed, View Transitions, Lighthouse, contrast re-run, 375/390/430 sweep, dark sweep, print alignment, screenshots archived.

For each phase, report: files changed, screenshots, checklist results, and anything not completed with the reason.

---

## 9. Hard rules

- Keep Next 16 app router, Tailwind v4, Prisma/SQLite, cookie auth, existing APIs and print routes. This is UI only.
- Two font families. Nine palette tokens. No gradients. Minimum 12px text, 14px body, 4.5:1 contrast in both themes.
- Dependencies may be added only from the list in 2.6. Ask before anything else.
- Every new screen works one-handed on a 375px phone and looks intentional on a 1440px monitor.
- Every screen has a signature moment. If you cannot name it, keep designing.
