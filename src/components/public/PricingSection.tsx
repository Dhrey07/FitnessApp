import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { PLAN_DETAILS } from '@/lib/services/entitlements';

export function PricingSection() {
  const plans = [
    PLAN_DETAILS.FREE,
    PLAN_DETAILS.SILVER,
    PLAN_DETAILS.GOLD,
    PLAN_DETAILS.DIAMOND,
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 border-b border-white/10 bg-[#0a0e18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="label-xs text-sky-400">Membership Tiers & Subscriptions</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            TRANSPARENT PRICING. <br />
            <span className="text-slate-400">Choose Your Level of Coaching.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Start with our 100% free Food Police or unlock full Fitness Police training with a 14-day free trial.
          </p>
        </div>

        {/* 4 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isGold = plan.tier === 'GOLD';
            const isFree = plan.tier === 'FREE';

            return (
              <div
                key={plan.tier}
                className={`surface p-7 flex flex-col justify-between space-y-6 relative transition-all ${
                  isGold
                    ? 'border-2 border-sky-400 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-sky-500/15'
                    : 'border-white/10'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-400 text-slate-950 text-[10px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <span className={`label-xs ${isGold ? 'text-sky-400' : 'text-slate-400'}`}>
                      {plan.tier} PLAN
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-1">{plan.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {isFree ? 'FREE' : `₦${plan.priceNgn.toLocaleString()}`}
                      </span>
                      {!isFree && <span className="text-xs text-slate-400">/ month</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isFree ? 'Forever free for all users' : 'Includes 14-day free trial on signup'}
                    </p>
                  </div>

                  {/* Bullet features */}
                  <ul className="space-y-2.5 pt-2 border-t border-white/10 text-xs text-slate-300">
                    {plan.bulletPoints.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-sky-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    href="/onboarding"
                    className={`text-xs w-full justify-center py-3 ${
                      isGold ? 'btn-brand font-extrabold shadow-md shadow-sky-500/20' : 'btn-secondary font-bold'
                    }`}
                  >
                    {isFree ? 'Join Free' : 'Start 14-Day Trial'} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
