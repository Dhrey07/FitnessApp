import React from 'react';
import Link from 'next/link';
import { ArrowRight, Utensils, Sparkles, CheckCircle2 } from 'lucide-react';

export function FinalCtaSection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-[#080b11] via-[#0b1424] to-[#080b11]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-8 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} /> Transform Your Body, Health & Habits
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-tight max-w-3xl mx-auto">
          READY TO START YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400">
            TRANSFORMATION?
          </span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Join hundreds of clients making real progress with custom nutrition, structured training routines, and human coach oversight.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link href="/onboarding" className="btn-brand text-sm px-8 py-4 font-black shadow-xl shadow-sky-500/25 w-full sm:w-auto text-center">
            Start Your 14-Day Free Trial <ArrowRight size={16} />
          </Link>
          <a href="#nutrition" className="btn-secondary text-sm px-7 py-4 font-bold flex items-center justify-center gap-2 w-full sm:w-auto text-center">
            <Utensils size={16} /> Explore Food Police (Free)
          </a>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 text-center">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-sky-400 shrink-0" /> No immediate billing</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-sky-400 shrink-0" /> Food Police is 100% Free forever</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-sky-400 shrink-0" /> Cancel anytime with zero penalty</span>
        </div>

      </div>
    </section>
  );
}
