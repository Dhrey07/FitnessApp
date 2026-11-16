# ERICONET — UI Rebuild Prompt (v2)

> Paste this whole document as the brief for the rebuild. It assumes the rebranded codebase on `ericonet-rebrand` (brand tokens, Prisma schema, APIs, print routes) is the starting point. Nothing in the data layer changes. Everything the user sees does.

---

## 0. Why we are doing this

The current UI is functionally complete and brand-correct, and it still reads as a template. A top product designer would not ship it. These are the measurable tells, taken from the code and the running app:

| Tell | Evidence |
| --- | --- |
| Everything is the same white card | 107 `surface` boxes, 137 `rounded-xl/2xl`, every section is a grid of bordered rectangles |
| Label soup | 104 uppercase 12px eyebrow labels ("FOCUS 01 • TRAINING", "WHAT SHOULD I DO TODAY?", "ACCOUNT ACCESS") |
| Badge soup | 95 badges; most screens show four or more pills competing for attention |
| No art direction | Zero photographs. 14 grey "photo pending" tiles, including on the public results section |
| Same rhythm six times | Public site = eyebrow, H2, paragraph, 3-column icon cards, repeat. Hero is text-left / card-right like every SaaS template |
| Decorative icons | Lucide icons in rounded squares used as ornaments on service cards, steps and stats |
| Template voice | "Here is your personal fitness focus and daily blueprint for today", "SYSTEM STATUS Human-in-the-Loop Active", "Select an Assessment from the Queue" |
| Demo-ware | Login page prints "Default: password123" and a list of demo accounts |
| Mobile is desktop stacked | Five header controls crammed into 375px, long single-scroll forms with uppercase labels, tables that overflow, no sticky primary action, no sheets |
| No motion, no states | Four keyframes defined, almost none used. Empty, loading and error states are afterthoughts |
| Marketing and app share one type scale | Nothing on the public site is allowed to be big, and nothing in the app is allowed to be quiet |

The goal is not "prettier cards". It is a product that looks like a serious coaching studio built by a senior design team: editorial on the public site, calm and data-forward inside the app, and genuinely designed for a phone first because that is where clients will live.

---

## 1. Direction

**One sentence.** A premium, calm, Nigerian-rooted coaching studio: quiet confidence, real photography, numbers presented like a good lab report, and copy that sounds like a coach who has done this a thousand times.

**Reference qualities** (steal the qualities, not the look):

- Editorial restraint and typographic hierarchy of a premium wellness brand site. Big display type, generous whitespace, photography doing the emotional work.
- The data presentation of the best health wearables: one hero number per screen, trends with context, no gauges, no decorative charts.
- The product polish of a top-tier SaaS: consistent 4/8 spacing, crisp focus states, instant feedback, zero layout shift, keyboard and touch both first-class.
- The warmth of a human coach: sentence case, short sentences, names used, food named as people actually eat it.

**Principles**

1. **Hierarchy before decoration.** Every screen has one primary thing. If two things compete, one of them loses size, colour or position.
2. **Cards are earned.** A card exists only when content needs grouping or elevation. Lists use rows and dividers. Sections use whitespace. Target: fewer than 25% of the current card count.
3. **Photography is the brand.** Deep green and off-white are the frame; people, food and movement are the picture.
4. **Numbers are typeset, not badged.** Hero stats use display type with units set small. Trends use a sparkline or a line, never a pill.
5. **Icons only when functional.** Navigation, actions, status. Never as section ornaments.
6. **Mobile is the design, desktop is the adaptation.** Design every app screen at 375px first, then widen.
7. **Motion explains.** Transitions show where things came from and went. 150 to 250ms, standard easing, reduced-motion respected.
8. **Every state is designed.** Empty, loading, error, success, offline, and "coach has not responded yet" all have a face.

---

## 2. Design system v2

Keep the nine brand tokens and the semantic variables in `globals.css`. Replace the component layer.

### 2.1 Typography

Two families stay: **Manrope** for display and headings, **Inter** for body and UI. Use them properly.

| Role | Family / weight | Size (desktop → mobile) | Tracking / leading |
| --- | --- | --- | --- |
| Display | Manrope 700 | `clamp(44px, 6vw, 88px)` | -0.03em / 0.95 |
| H1 | Manrope 700 | 40 → 32 | -0.02em / 1.05 |
| H2 | Manrope 700 | 32 → 26 | -0.02em / 1.1 |
| H3 | Manrope 600 | 22 → 20 | -0.01em / 1.2 |
| Hero stat | Manrope 700, tabular nums | 56 → 44 | -0.03em / 1 |
| Stat | Manrope 600, tabular nums | 28 → 24 | -0.02em / 1 |
| Body | Inter 400 | 16 | 0 / 1.6 |
| Body small | Inter 400 | 14 | 0 / 1.5 |
| UI | Inter 500 | 14 | 0 / 1.4 |
| Caption | Inter 400 | 12 | 0 / 1.4 |
| Overline | Inter 600 | 12 | +0.08em uppercase, **one per section maximum** |

Use `font-feature-settings: "tnum"` on every number. Use real units typeset small next to the number (`85` large, `kg` at 40% size, baseline aligned). Never put a number inside a badge.

### 2.2 Spacing, layout, radius, elevation

- 4px base. Allowed steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Containers: public 1200px, app content 960px, reading 680px.
- Public section vertical rhythm: 96px desktop, 64px mobile. Sections alternate background: off-white, white, deep green (one per page), off-white.
- Radius scale: 6 (inputs, pills), 12 (cards, sheets on desktop), 20 (sheets on mobile, hero media), full (avatars, buttons that are pills).
- Elevation: `none` (default), `raised` (0 1px 2px rgba(22,26,24,.06), 0 8px 24px -12px rgba(22,26,24,.12)), `overlay` (0 24px 48px -16px rgba(22,26,24,.28)). No borders and shadow together on the same element.
- Surfaces: `page` (off-white), `panel` (white, no border, raised only if floating), `inset` (green-100 at 40% for grouped fields), `ink` (charcoal or deep green panel for one highlight per screen).

### 2.3 Colour usage

- Deep green ≤ 10% of any screen: primary buttons, active nav, one highlight panel, links.
- Champagne ≤ 2%: tier highlight border, one rule under a section title, chart accent. Never text under 16px.
- Status colours only on status. No coloured left borders on cards.
- Dark theme stays, but it is a reading preference, not a second brand. Test every screen in both.

### 2.4 Imagery system

- Create `/public/photos/` with art-directed placeholders that look designed, not pending: deep-green panels with a subtle monogram texture at 6% and a one-line caption in champagne. Slots: hero (3:2 desktop, 4:5 mobile), coach portrait (4:5), nutrition plate (1:1), training (16:9), three result pairs (4:5 each). Real photographs replace them by file name later with no code change.
- Treatment for real photos: slight warm grade, no filters, no stock gym clichés (no chalk clouds, no screaming). People, Nigerian food, real rooms.
- Duotone green overlay is allowed on the hero only, at most 30% opacity, to hold text contrast.
- Never an illustration pack, never 3D blobs, never gradient meshes.

### 2.5 Data visualisation

- One style: 2px line, deep green, soft green-100 area fill at 25%, champagne for the target line. Dots only on hover/touch. Axis text 12px stone. No grid cages; horizontal hairlines only.
- Sparklines (48×16) inline next to stats.
- Progress toward a target is a thin bar with the number typeset above it, never a radial gauge.
- Charts never animate on first paint beyond a 300ms fade.

### 2.6 Motion

- Durations: 150ms (hover, toggles), 200ms (sheets, menus), 250ms (page sections, list reorders).
- Easing: `cubic-bezier(.2,.8,.2,1)` enter, `cubic-bezier(.4,0,1,1)` exit.
- Page transitions in the app: content fades up 8px. Sheets slide from bottom on mobile, scale from 98% on desktop.
- Lists animate height on add/remove. Numbers tween when they change (check-in saved, calories adjusted).
- `prefers-reduced-motion`: all of the above becomes opacity only.
- Allowed libraries: `motion` (Framer Motion successor), `vaul` for sheets, Radix primitives for menus, dialogs and tabs, `sonner` for toasts. Nothing else.

### 2.7 Voice

- Sentence case everywhere except the one overline per section and button labels that are single words.
- Short sentences. Name the client. Name the food. No "blueprint", "command center", "engine", "console", "dossier", "assessment queue", "signoff", "athlete".
- Buttons say the outcome: "Save check-in", "Send to Chidi", "Start session", "Log lunch".
- Empty states say what will appear and who causes it: "Your coach reviews check-ins on Sundays. Your first report will appear here after that."

---

## 3. Component library

Build these once in `src/components/ui/` and use nothing else. Every component supports dark theme, keyboard, 44px touch targets, and has a loading and disabled state.

| Component | Spec |
| --- | --- |
| `AppShell` | Desktop: 240px sidebar, content column, optional 320px context rail. Mobile: top bar with title and one action, bottom tab bar (5 max, safe-area aware, active indicator), everything else in a sheet |
| `PageHeader` | Title, optional one-line description, primary action right (desktop) or sticky bottom (mobile). No eyebrow. |
| `HeroStat` | Display number + small unit + delta with arrow and sentence context ("down 0.6 kg this week") + optional sparkline |
| `StatRow` | Horizontal scroll on mobile, 3 to 4 up on desktop. Numbers typeset, labels 12px, no boxes |
| `Section` | Title + optional action, children. Dividers between sections, not cards around them |
| `ListRow` | Leading (avatar/icon), title, subtitle, trailing (value/chevron), 56px min height, swipe actions on mobile where relevant |
| `Panel` | The only card. Props: `tone` (white/inset/ink), `raised`. Padding 20 mobile, 24 desktop |
| `Segmented` | Tabs for 2 to 4 options, animated indicator |
| `Sheet` | Bottom sheet on mobile, dialog on desktop. Drag handle, snap points, scroll lock |
| `Field` | Label (sentence case, 14px), input, help, error. `inputmode` and `autocomplete` always set. Numeric fields get a unit suffix inside the input |
| `Stepper` | Large +/− number control for sets, reps, kg; long-press accelerates |
| `Scale` | 1 to 5 selector with word anchors ("Very low" … "Very high"), 44px targets |
| `Slider` | For percentages only; value typeset above the thumb |
| `Button` | primary (green), secondary (outline), ghost, destructive. Sizes 36/44/52. Loading spinner replaces label, width preserved |
| `Pill` | Status only. One per row maximum |
| `Avatar` | Initials on green-100, photo when available |
| `Table` | Desktop only. On mobile the same data renders as `ListRow`s |
| `Chart` | Line and bar wrappers over Recharts with the style in 2.5 |
| `EmptyState` | Monogram at 10% opacity, one sentence, one action |
| `Skeleton` | Matches final layout exactly to prevent shift |
| `Toast` | Bottom centre mobile, bottom right desktop, 4s, undo where possible |
| `Banner` | One tone (inset green). Used for trial state and coach notes only |
| `Document` | The print look reused on screen for meal plans, programmes and reports: paper panel, serif-free, ruled rows |

Delete `badge-*`, `surface`, `label-xs`, `section-title`, `field-label` from `globals.css` once no file references them.

---

## 4. Page specifications

### 4.1 Public site (`/`)

Order and intent, with the mobile variant for each.

1. **Nav.** Logo left, four links centre, "Sign in" ghost and "Start" primary right. Transparent over the hero, turns off-white with a hairline after 40px scroll. Mobile: logo and a menu button that opens a full-screen sheet with large links and the primary action pinned at the bottom.
2. **Hero.** Full-bleed photograph (4:5 on mobile, 16:9 crop on desktop) with the display headline set over it in off-white on the left third, duotone at most 30%. One sentence, one primary button, one text link. Below the fold line, a thin strip with three facts typeset as numbers: "12 weeks", "1 coach", "Weekly check-ins". No checklist bullets.
3. **Results.** Three client stories as large photo pairs (before/after with consent) in a horizontal scroll on mobile and a 3-up on desktop. Each has the headline result as a hero stat, name, city, weeks, and a two-line quote. Consent-gated stories without photos use the art-directed placeholder, not a grey box.
4. **How coaching works.** A single horizontal timeline on desktop (four nodes with short text), a vertical rail on mobile. No icon squares. The coach's weekly feedback example sits beside it as a `Document` panel.
5. **Nutrition.** Split: left a photograph of a real plate, right the `Document` preview of a meal plan day with totals. The copy is three short sentences, not a bullet list. One button.
6. **Training.** Deep green ink section (the page's one dark panel). Programme day preview typeset in off-white, tempo/RPE explained in one line each. Photograph of movement on the right on desktop, above on mobile.
7. **Coach.** Portrait (4:5), name, two-paragraph bio in reading width, three credentials as a plain list. This section does not exist today and is the single biggest trust gap.
8. **Pricing.** Four plans as a comparison: on desktop a table with plan columns and feature rows, the Signature column highlighted with a champagne rule; on mobile a segmented control switching plan details, with "Starter is free" stated once. Prices in Naira, typeset.
9. **FAQ.** Accordion, reading width, no cards.
10. **Final CTA.** Headline, one button, WhatsApp link. Footer: logo, contact, Instagram, legal line. No "sub-brand" mention anywhere.

Acceptance: no more than six `Panel`s on the whole page; no 3-column icon-card grid; at least four photographic slots; one overline per section at most.

### 4.2 Auth and onboarding

- **Login.** Desktop split: photograph left 45%, form right in a 400px column, no card. Mobile: logo, form, button pinned above the keyboard. Remove the demo account list and the default-password hint from production; keep them behind `NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS=true` for local use only.
- **Sign-up / onboarding.** Replace the long form with a stepper: Account → About you → Goal and timeline → Training setup → Food preferences → Review. One group of questions per step, progress bar at the top, back button, autosave to local storage, numeric fields with unit suffixes and `inputmode="decimal"`. The review step shows the computed targets as hero stats before the client commits. On mobile each step fits one screen without scrolling where possible.

### 4.3 Client app

Bottom tabs: Today, Food, Train, Progress, More. "Plans" moves under More.

- **Today (`/client/dashboard`).** Greeting by first name, date. One `HeroStat` for the week's most relevant number (weight if a check-in is due soon, otherwise today's calories remaining). Then three `ListRow`s: today's session, today's meals logged versus target, check-in status. The coach's latest feedback as a quote in an inset panel. Nothing else. No "Focus 01/02/03".
- **Food (`/client/nutrition`).** A day timeline (breakfast, lunch, dinner, snacks as rows with photo thumbnails and kcal), a floating "Log a meal" button that opens a sheet with text, photo and search in a segmented control. Coach review status as a single pill per meal. "My meal plan" as a `Document` reached from a secondary tab, with day switcher and totals.
- **Train (`/client/training`).** Programme overview as `ListRow`s per day with completion ticks. Session view: exercise list; tapping one opens a full-screen logger with `Stepper`s for kg and reps per set, a rest timer that counts down in the sticky bottom bar, and progression guidance in one line. Designed for one-handed use. Download PDF stays in the overflow menu.
- **Check-in (`/client/check-in`).** Four steps in a `Sheet`-like flow on mobile and a two-column form on desktop: Measurements, Consistency, How it felt (four `Scale`s with word anchors), Notes. Autosave draft, submit button pinned. After submit, a confirmation screen with the delta versus last week typeset.
- **Progress (`/client/progress`).** Weight trend chart as the hero (range toggle 4/8/12 weeks), waist and steps as `StatRow`, check-in history as rows, published reports as `Document` cards with a "Download PDF" overflow.
- **Resources.** Editorial list, reading-width article pages with a sticky contents rail on desktop.
- **More.** Profile, plan and billing, notifications, theme, sign out.

### 4.4 Coach app

Desktop sidebar: Today, Clients, Check-ins, Nutrition, Programmes, Reports, Testimonials. Mobile uses the same bottom tab pattern with the four most used and a More sheet.

- **Today (`/admin/dashboard`).** The queue first: check-ins awaiting review, meals awaiting review, clients with no log in three days. Each a `ListRow` with a one-tap action. Revenue and client counts as a quiet `StatRow` below, not four cards at the top. Remove "System status".
- **Clients.** Desktop table (name, plan, last check-in, trend sparkline, action). Mobile list rows. Search and plan filter in the header.
- **Client detail.** Sticky header with avatar, name, plan pill and the primary actions (Message, Create report). Tabs: Overview, Check-ins, Food, Programme, Meal plan, Reports. Overview shows the trend chart and targets as an editable inset panel.
- **Check-in review.** Desktop split: list left, review right. Mobile: list, tapping opens a full-screen review with the numbers typeset in a `StatRow`, notes as quotes, then feedback textarea and calorie field, submit pinned.
- **Builders (meal plan, programme).** Desktop: spreadsheet-like rows with inline editing, keyboard navigation between cells, duplicate day, drag to reorder. Mobile: read-first with per-row edit sheets; builders are not expected to be used heavily on a phone, but must not break.
- **Reports.** List and editor keep the brief's field order; the editor becomes a `Document` with inline editable fields so what the coach sees is what the client will print.

### 4.5 Print routes

Unchanged structurally. Align type to the new scale and reuse the `Document` component so screen and paper match.

---

## 5. Mobile specification

- Breakpoints: 375 (design), 640, 768, 1024, 1280. Every page is screenshot-tested at 375 and 1280.
- Safe areas: `viewport-fit=cover`, bottom tab bar and sticky actions pad with `env(safe-area-inset-bottom)`.
- Touch targets 44×44 minimum; row heights 56.
- Primary action of any form is sticky at the bottom and stays above the keyboard.
- Inputs: correct `type`, `inputmode`, `autocomplete`, `enterkeyhint`. Numeric fields show units inside the field.
- No horizontal page scroll anywhere. Tables become rows below 768.
- Headers collapse to a title on scroll. Secondary actions live in an overflow menu or sheet.
- Add a web app manifest, maskable icons and a theme colour so "Add to home screen" produces a proper app.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best practices ≥ 95.

---

## 6. Remove "Fitness Police" entirely

The sub-brand is retired. No playful alias remains.

- `src/lib/brand.ts`: delete `subBrand`.
- `src/app/client/nutrition/page.tsx`: delete the sub-brand pill and its copy.
- `src/lib/services/entitlements.ts`: rename the `food_police` feature key to `nutrition_log` and update bullet copy.
- `docs/brand-guide.md`, `README.md`: remove the sub-brand rule and mention.
- `next.config.ts`: keep the legacy redirects (they protect old links) but relabel the comment as "legacy paths".
- Database: the `FoodSubmission` model and `/api/nutrition/*` routes keep their names. No migration.
- Grep acceptance: `grep -rniE "police" src docs README.md next.config.ts` returns only the redirect sources in `next.config.ts` and the retired-names note in `docs/brand-guide.md`.

---

## 7. Anti-pattern checklist (the "AI-built" tells)

Fail the review if any of these appear:

- A grid of three or more equal cards each with an icon in a rounded square.
- More than one uppercase overline per section, or any overline inside the app shell.
- A number inside a pill or badge.
- A coloured left border on a card.
- Text-left / card-right hero with a checklist under the buttons.
- Any "photo pending" or grey placeholder visible on the public site.
- Demo credentials visible outside local development.
- Template phrases: blueprint, command center, console, engine, dossier, roster, athlete, signoff, human-in-the-loop, system status.
- A screen with more than one primary button.
- A page whose mobile layout is the desktop layout stacked.
- A form with uppercase labels.
- A chart with a visible grid cage, a gauge, or a donut.
- Shadow and border on the same element.
- Gradients, glassmorphism, 3D illustrations, emoji in UI.

---

## 8. Execution phases

Each phase ends with: build and type check passing, screenshots at 375 and 1280 in light and dark for every touched page, the anti-pattern checklist run, and one commit `UI PHASE n: <summary>` on a branch off `ericonet-rebrand`.

1. **UI PHASE 1 — System and shell.** Component library in `src/components/ui/`, type scale, surfaces, motion utilities, `AppShell` for client and coach with bottom tabs, manifest and icons. Remove the sub-brand (section 6). Delete legacy component classes once unreferenced.
2. **UI PHASE 2 — Public site.** All ten sections, imagery slots, coach section, pricing comparison, mobile nav sheet.
3. **UI PHASE 3 — Auth and onboarding.** Login split layout, stepper onboarding, demo accounts env-gated.
4. **UI PHASE 4 — Client app.** Today, Food, Train with session logger, Check-in stepper, Progress, Resources, More.
5. **UI PHASE 5 — Coach app.** Today queue, clients, client detail tabs, check-in review, builders, reports editor.
6. **UI PHASE 6 — Polish and QA.** Motion pass, states pass, Lighthouse, contrast re-run, 375px sweep of every route, dark theme sweep, print alignment.

For each phase, report: files changed, screenshots, checklist results, and anything not completed with the reason.

---

## 9. Hard rules

- Keep Next 16 app router, Tailwind v4, Prisma/SQLite, cookie auth, existing APIs and print routes. UI only.
- Two fonts. Nine palette tokens. No gradients. Minimum 12px text, 14px body, 4.5:1 contrast in both themes.
- Dependencies allowed to be added: `motion`, `vaul`, `@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`, `sonner`. Nothing else without asking.
- Do not reintroduce any removed name.
- Every new page works one-handed on a 375px phone and looks intentional on a 1440px monitor.
