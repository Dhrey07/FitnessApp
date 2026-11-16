# Lighthouse, UI Phase 6

Lighthouse 13.6, mobile emulation (Moto G Power, slow 4G, 4x CPU throttle), production build on localhost, 16 November 2026. App pages were run signed in as the seeded demo client and coach.

| Page | Route | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | `/` | 95 | 100 | 100 | 100 | 1.1 s | 250 ms | 0 |
| Sign in | `/login` | 98 | 100 | 100 | 100 | 0.8 s | 150 ms | 0.018 |
| Client Today | `/client/dashboard` | 99 | 100 | 100 | 100 | 0.8 s | 150 ms | 0 |
| Client Food | `/client/nutrition` | 91 (median of 4 runs: 84, 93, 91, 87) | 100 | 100 | 100 | 0.8 s | 320 to 640 ms | 0 |
| Client Progress | `/client/progress` | 94 | 100 | 100 | 100 | 0.8 s | 280 ms | 0 |
| Coach Today | `/admin/dashboard` | 96 | 100 | 100 | 100 | 0.8 s | 240 ms | 0 |
| Programme builder | `/admin/training` | 97 | 100 | 100 | 100 | 0.8 s | 180 ms | 0 |

Targets from the brief: Performance 90 or more, Accessibility 95 or more, Best practices 95 or more, CLS under 0.05. Performance varies by several points between runs on the same build. Food is the page closest to the line: it carries the meal composer, tabs and timeline, and its blocking time comes mostly from the framework runtime and hydration. Earlier repeated runs of Progress gave 90, 93 and 98.
