import React from 'react';
import Link from 'next/link';
import { Utensils, Camera, MessageSquare, Search, CheckCircle2, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

export function NutritionSection() {
  return (
    <section id="nutrition" className="py-20 sm:py-28 border-b border-white/10 bg-[#080b11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> 100% Free For All Registered Clients
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            MEET FOOD POLICE. <br />
            <span className="text-slate-400">Nutrition Without Blind Restrictions.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Nutrition isn’t about eating boiled chicken and lettuce every single day. Food Police gives you instant calorie and macronutrient clarity for African and international meals — completely free.
          </p>
        </div>

        {/* 4 Interaction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Camera size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Photo Meal Logging</h3>
            <p className="text-xs text-slate-300">
              Snap or upload a photo of your meal. The engine parses portion yields, estimated macros, and ingredient density.
            </p>
          </div>

          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Natural Language Entry</h3>
            <p className="text-xs text-slate-300">
              Type what you ate in plain English (e.g. &quot;2 wraps of pounded yam, egusi soup and goat meat&quot;) for fast parsing.
            </p>
          </div>

          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Search size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">African & Global Foods</h3>
            <p className="text-xs text-slate-300">
              Extensive built-in database of Nigerian staples (Jollof, Moi Moi, Efo Riro, Yam, Suya, Dodo) and international foods.
            </p>
          </div>

          <div className="surface p-6 space-y-3 surface-hover">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-sm font-bold text-white uppercase">Coach Oversight & Advice</h3>
            <p className="text-xs text-slate-300">
              Your human coach reviews your logs, validates portion sizes, and provides cultural swaps to keep you on goal.
            </p>
          </div>

        </div>

        {/* Free Banner with CTA & Medical Disclaimer */}
        <div className="surface p-8 sm:p-10 border-sky-500/40 bg-gradient-to-r from-sky-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="badge badge-approved">ALWAYS FREE</span>
              <h3 className="text-xl font-bold text-white">Food Police is Never Put Behind a Paywall</h3>
            </div>
            <p className="text-xs text-slate-300">
              Create your free account today and start logging meals with instant macro analysis and coach verification right away.
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              *Note: Nutritional calculations are estimates and do not replace professional medical or clinical advice.
            </p>
          </div>

          <Link href="/onboarding" className="btn-brand text-xs px-6 py-3 shrink-0">
            Create Free Food Police Account <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
