import { notFound } from 'next/navigation';
import {
  Bricolage_Grotesque,
  Inter_Tight,
  Instrument_Serif,
  Instrument_Sans,
  Hanken_Grotesk,
  Manrope,
  Inter,
} from 'next/font/google';
import { TnumProbe } from './TnumProbe';

/**
 * Local-only type specimen used to choose the v2 font pairing.
 * Each candidate sets the same poster headline, hero stat, body copy and a
 * form row so the pairings can be compared at 375px and 1280px.
 */

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--sp-bricolage', display: 'swap' });
const interTight = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--sp-inter-tight', display: 'swap' });
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: ['400'], variable: '--sp-instrument-serif', display: 'swap' });
const instrumentSans = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--sp-instrument-sans', display: 'swap' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--sp-hanken', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--sp-manrope', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--sp-inter', display: 'swap' });

const PAIRINGS = [
  { id: 'bricolage', name: 'Bricolage Grotesque + Inter Tight', display: 'var(--sp-bricolage)', body: 'var(--sp-inter-tight)', displayWeight: 700 },
  { id: 'instrument', name: 'Instrument Serif + Instrument Sans', display: 'var(--sp-instrument-serif)', body: 'var(--sp-instrument-sans)', displayWeight: 400 },
  { id: 'hanken', name: 'Hanken Grotesk (superfamily)', display: 'var(--sp-hanken)', body: 'var(--sp-hanken)', displayWeight: 700 },
  { id: 'manrope', name: 'Manrope + Inter (current)', display: 'var(--sp-manrope)', body: 'var(--sp-inter)', displayWeight: 700 },
];

export const dynamic = 'force-static';

export default function TypeSpecimenPage() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SHOW_DEV_PAGES !== 'true') notFound();

  const vars = [bricolage, interTight, instrumentSerif, instrumentSans, hanken, manrope, inter].map((f) => f.variable).join(' ');

  return (
    <main className={`${vars} min-h-screen bg-paper text-ink px-4 py-10 sm:px-8`}>
      <div className="mx-auto max-w-[1280px] space-y-16">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.08em] text-ink-muted" style={{ fontFamily: 'var(--sp-inter)' }}>Type specimen · local only</p>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--sp-inter)' }}>Four pairings, one brief</h1>
        </header>

        {PAIRINGS.map((p, i) => (
          <section key={p.id} id={p.id} className="border-t border-line pt-10 space-y-10" style={{ fontFamily: p.body }}>
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 className="text-sm font-semibold text-ink-muted" style={{ fontFamily: 'var(--sp-inter)' }}>
                {String(i + 1).padStart(2, '0')} · {p.name}
              </h2>
              <TnumProbe family={p.display} label="display" />
            </div>

            {/* Poster headline over an ink panel, as the hero will be */}
            <div className="rounded-[24px] bg-[#0B3D2E] text-[#F6F4EF] p-6 sm:p-12 overflow-hidden relative">
              <p
                className="relative z-10"
                style={{
                  fontFamily: p.display,
                  fontWeight: p.displayWeight,
                  fontSize: 'clamp(44px, 7vw, 104px)',
                  lineHeight: 0.94,
                  letterSpacing: p.id === 'instrument' ? '-0.015em' : '-0.035em',
                  maxWidth: '12ch',
                }}
              >
                Sustainable transformation, built around your life.
              </p>
              <p className="mt-6 max-w-[48ch] text-base sm:text-lg text-[#F6F4EF]/80 relative z-10">
                Personalised nutrition, training and weekly coaching for adults who want the result to last.
              </p>
            </div>

            {/* Hero stat + stat row */}
            <div className="grid gap-8 sm:grid-cols-[1fr_1fr]">
              <div>
                <p className="text-sm text-ink-muted">Current weight</p>
                <p className="flex items-baseline gap-2" style={{ fontFamily: p.display, fontWeight: p.displayWeight, fontVariantNumeric: 'tabular-nums' }}>
                  <span style={{ fontSize: 64, lineHeight: 1, letterSpacing: '-0.03em' }}>85.0</span>
                  <span className="text-ink-muted" style={{ fontSize: 24, fontFamily: p.body, fontWeight: 500 }}>kg</span>
                </p>
                <p className="mt-2 text-sm text-ink-secondary">down 0.6 kg since last Sunday</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-line">
                {[['88', 'cm', 'Waist'], ['8,420', '', 'Steps'], ['4/4', '', 'Sessions']].map(([v, u, l]) => (
                  <div key={l} className="px-4 first:pl-0">
                    <p className="flex items-baseline gap-1" style={{ fontFamily: p.display, fontWeight: p.displayWeight, fontVariantNumeric: 'tabular-nums' }}>
                      <span style={{ fontSize: 28, lineHeight: 1, letterSpacing: '-0.02em' }}>{v}</span>
                      {u && <span className="text-ink-muted text-sm" style={{ fontFamily: p.body }}>{u}</span>}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* H2 + body + UI row */}
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-3 max-w-[60ch]">
                <h3 style={{ fontFamily: p.display, fontWeight: p.id === 'instrument' ? 400 : 600, fontSize: 30, lineHeight: 1.1, letterSpacing: p.id === 'instrument' ? '-0.01em' : '-0.02em' }}>
                  A simple weekly rhythm, with a real coach reading the numbers.
                </h3>
                <p className="text-base leading-relaxed text-ink-secondary">
                  Software calculates. A human decides. Every check-in is read by Coach Eric, and every adjustment is explained in plain words. Jollof, yam, plantain, beans and eba all sit inside a fat-loss plan when quantities are clear.
                </p>
                <p className="text-sm leading-relaxed text-ink-muted">
                  Body small. Weekly averages and waist, together with how you slept and how hungry you were, show what is really happening.
                </p>
              </div>
              <div className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-ink">Current weight</span>
                  <span className="flex items-center rounded-[6px] border border-[var(--border-input)] bg-surface px-3 h-12">
                    <input className="flex-1 bg-transparent outline-none text-base" defaultValue="85.0" inputMode="decimal" style={{ fontVariantNumeric: 'tabular-nums' }} />
                    <span className="text-sm text-ink-muted">kg</span>
                  </span>
                </label>
                <div className="flex gap-3">
                  <button className="h-12 px-5 rounded-full bg-[#0B3D2E] text-[#F6F4EF] text-sm font-semibold">Save check-in</button>
                  <button className="h-12 px-5 rounded-full border border-line text-sm font-semibold">Cancel</button>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-line">
                  <div>
                    <p className="text-sm font-medium">Upper body push</p>
                    <p className="text-xs text-ink-muted">4 exercises · 45 min</p>
                  </div>
                  <span className="text-xs text-ink-muted">›</span>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
