# ERICONET Fitness & Wellness

**Nutrition. Training. Transformation.**

The coaching platform behind ERICONET Fitness & Wellness: a Next.js app where clients log meals, follow their training programme, submit a weekly check-in and read their progress reports, and where the coach reviews all of it and produces branded documents.

Brand rules live in [docs/brand-guide.md](docs/brand-guide.md). The rebrand plan that shaped this codebase is in [docs/ericonet-rebrand-prompt.md](docs/ericonet-rebrand-prompt.md).

## Stack

- Next.js 16 (app router, webpack build), React 19, TypeScript
- Tailwind CSS v4 with brand tokens defined in `src/app/globals.css`
- Prisma 5 with SQLite (`prisma/dev.db`)
- Cookie session auth (no external provider)
- Bricolage Grotesque and Inter Tight via `next/font`

## Getting started

```bash
npm install
```

```bash
npx prisma migrate deploy
```

```bash
npx prisma db seed
```

```bash
npm run dev
```

Open http://localhost:3000. The public site is at `/`, clients sign in at `/login`, and the coach area is under `/admin`.

For a production build:

```bash
npm run build
```

```bash
npm start
```

## Environment

Create a `.env` file in the project root. All values are optional for local development except the database URL.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite connection string, e.g. `file:./dev.db` |
| `NEXT_PUBLIC_SITE_URL` | Absolute origin used for metadata and Open Graph images |
| `NEXT_PUBLIC_BRAND_EMAIL` | Contact email shown in the footer and print documents |
| `NEXT_PUBLIC_BRAND_WHATSAPP` | Coach WhatsApp number in international format, digits only |
| `NEXT_PUBLIC_BRAND_INSTAGRAM` | Instagram handle without the @ |
| `NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS` | `true` shows the seed accounts on the sign-in page. Local development only; leave unset in production |

Brand strings (name, tagline, coach display name, sub-brand) are centralised in `src/lib/brand.ts`. Components import from there instead of hardcoding copy.

## Seed accounts

The seed creates one coach and four demo clients. Every account uses the password `password123`.

| Account | Email | Tier | Notes |
| --- | --- | --- | --- |
| Coach Eric | coach@ericonet.fit | Coach | Full admin access |
| Chidi | chidi@example.com | Signature (Gold) | Meal plan, training programme, check-ins |
| Aminat | aminat@example.com | Private Coaching (Diamond) | Sees published progress reports |
| Tunde | tunde@example.com | Essential (Silver) | Nutrition log and training |
| Zainab | zainab@example.com | Starter (Free) | Nutrition log only |

Re-running the seed resets all demo data. Record IDs change on every reseed. To list these accounts on the sign-in page, put `NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS=true` in `.env.local`.

## Product areas

**Client**

- `/client/dashboard` overview of the week
- `/client/nutrition` Nutrition Log (free) and the coach's meal plan
- `/client/training` Training Hub with the current programme and session logging
- `/client/check-in` weekly check-in form matching the brief's fields
- `/client/progress` measurements, charts and published progress reports
- `/client/resources` nutrition guidelines

**Coach**

- `/admin/dashboard` attention queue and metrics
- `/admin/clients` client list and per-client profile, targets, meal plan builder and reports
- `/admin/check-ins` review and feedback, with a shortcut to draft a progress report
- `/admin/nutrition-review` meal submissions awaiting sign-off
- `/admin/training` programme builder with sets, reps, rest, tempo, RPE/RIR, progression and coach notes
- `/admin/reports` progress reports across all clients

## Branded documents (print to PDF)

Every document is a print-styled page under `/print/*`. Each one carries the horizontal logo and tagline in the header, the E monogram watermark on every page, and a prepared-by footer. Opening a route with `?autoprint=1` triggers the browser's print dialog once fonts are ready, which is what the Download PDF buttons do.

| Route | Who can open it |
| --- | --- |
| `/print/meal-plan/[id]` | Owning client or coach |
| `/print/progress-report/[id]` | Coach, or the owning client once published |
| `/print/workout-programme/[id]` | Owning client or coach |
| `/print/check-in-form` | Any signed-in user (blank weekly form) |

Pages are A4 with 14 mm top and bottom margins. To render one headlessly:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --print-to-pdf=out.pdf "http://localhost:3000/print/check-in-form"
```

The session-gated routes need the `fp_session_email` cookie, so render those from the signed-in browser.

## Database changes

The schema is in `prisma/schema.prisma` and migrations in `prisma/migrations`. To add a migration without the interactive prompt:

```bash
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/$(date +%Y%m%d%H%M%S)_name/migration.sql
```

Then apply it with `npx prisma migrate deploy`. Never delete existing columns; add and migrate forward.

## Legacy routes

Paths from before the rebrand redirect permanently to their ERICONET equivalents. See the `redirects()` block in `next.config.ts`.

## Accessibility

Minimum UI text is 12 px, body text 14 px. Every text and background token pair in both themes meets WCAG AA (4.5:1). Champagne is used for borders, tints and chart accents only, never for text under 16 px.
