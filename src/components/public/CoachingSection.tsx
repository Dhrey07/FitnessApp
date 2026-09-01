import React from 'react';
import { UserCheck, MessageCircle, ShieldCheck, ClipboardCheck, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CoachingSection() {
  return (
    <section id="coaching" className="py-20 sm:py-28 border-b border-white/10 bg-[#0a0e18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="label-xs text-sky-400">Section 06 • Human Coaching & Accountability</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            TECHNOLOGY + REAL COACHING. <br />
            <span className="text-slate-400">Never An Impersonal Robot.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Algorithms calculate energy targets, but real human coaches keep you consistent when life gets busy, plateaus hit, or motivation wanes.
          </p>
        </div>

        {/* 2-Column Split: Coaching Pillars vs Live Coach Feedback Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Columns: Coaching Features */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="surface p-6 space-y-2 border-l-4 border-l-sky-500">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <ClipboardCheck size={16} className="text-sky-400" /> Weekly Check-In Reviews
              </h3>
              <p className="text-xs text-slate-300">
                Every week your coach analyzes your weight trajectory, waist change, training log adherence, and energy levels to make necessary micro-adjustments.
              </p>
            </div>

            <div className="surface p-6 space-y-2 border-l-4 border-l-emerald-500">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <MessageCircle size={16} className="text-emerald-400" /> Direct WhatsApp Accountability
              </h3>
              <p className="text-xs text-slate-300">
                Gold and Diamond members get direct messaging and voice-note check-ins with Coach Lekan for immediate feedback on food choices and form checks.
              </p>
            </div>

            <div className="surface p-6 space-y-2 border-l-4 border-l-cyan-500">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <RefreshCw size={16} className="text-cyan-400" /> Dynamic Target & Routine Adjustments
              </h3>
              <p className="text-xs text-slate-300">
                When weight loss slows down or training volume needs a deload, your coach adjusts your daily calorie targets and assigned workouts on the fly.
              </p>
            </div>

          </div>

          {/* Right Column: Coach Bio & Sample Feedback Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="surface p-6 sm:p-8 space-y-6 border border-white/15 shadow-2xl">
              
              {/* Coach Profile Bio */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Coach Lekan Adeyemi"
                  className="w-14 h-14 rounded-2xl object-cover border border-sky-400/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-base">Coach Lekan Adeyemi</h3>
                    <span className="badge badge-approved text-[10px]">Head Coach</span>
                  </div>
                  <p className="text-xs text-slate-400">Certified Strength & Nutrition Specialist • 8+ Yrs Coaching</p>
                </div>
              </div>

              {/* Sample Real Feedback Message */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="text-sky-400 flex items-center gap-1.5"><ShieldCheck size={13} /> Official Coach Review</span>
                  <span>Yesterday at 4:15 PM</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  &quot;Solid check-in this week, Chidi! Down another 0.8kg and waist is down another centimeter. Since your bench press numbers stayed high, the current 400 kcal deficit is optimal. Let&apos;s keep daily steps at 8,500 and keep pushing!&quot;
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Gold & Diamond coaching available across Nigeria and worldwide.</span>
                <Link href="/onboarding" className="text-sky-400 font-bold hover:underline">
                  Get Started →
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
