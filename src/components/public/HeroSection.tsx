import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Dumbbell, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-white/10 bg-gradient-to-b from-[#0a1220] via-[#080b11] to-[#080b11]">
      {/* Editorial Ambient Backlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-sky-500/15 via-blue-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} /> Personalised Nutrition & Smarter Training
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] uppercase">
              YOUR STRONGER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400">
                SELF STARTS HERE.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Personalised nutrition. Smarter training. Real accountability. Get expert guidance designed around your body, goals, and lifestyle.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-2">
              <Link href="/onboarding" className="btn-brand text-sm px-7 py-3.5 font-extrabold shadow-lg shadow-sky-500/25 w-full sm:w-auto text-center">
                Start Your Transformation <ArrowRight size={16} />
              </Link>
              <a href="#fitness" className="btn-secondary text-sm px-6 py-3.5 font-bold w-full sm:w-auto text-center">
                Explore Fitness
              </a>
            </div>

            {/* Trust Proof Points */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-sky-400 shrink-0" /> 14-Day Free Trial
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Full Fitness Police access</p>
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-sky-400 shrink-0" /> Free Food Police
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Free nutrition logging forever</p>
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-sky-400 shrink-0" /> Coach Verified
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Human review & feedback</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80"
                alt="Fitness Athlete Training"
                className="w-full h-[440px] object-cover object-center filter brightness-90 contrast-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/40 to-transparent" />

              {/* Floating Live Card 1: Today's Focus */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl glass-card border border-white/15 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Dumbbell size={13} /> Today&apos;s Workout
                  </span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded">45 MIN</span>
                </div>
                <p className="font-extrabold text-white text-sm">Upper Body Hypertrophy & Fat Burn</p>
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
                  <span>Target: 2,288 kcal</span>
                  <span className="font-bold text-sky-400">187g Protein</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
