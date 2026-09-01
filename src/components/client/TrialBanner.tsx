'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { TrialInfo } from '@/lib/services/entitlements';

interface TrialBannerProps {
  trialInfo?: TrialInfo;
}

export function TrialBanner({ trialInfo }: TrialBannerProps) {
  if (!trialInfo || !trialInfo.isTrial) return null;

  if (trialInfo.isExpired) {
    return (
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
            <Clock size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Your 14-Day Free Trial Has Ended</p>
            <p className="text-[11px] text-slate-400">
              Food Police and your progress history remain 100% free. Upgrade to continue custom workout routines.
            </p>
          </div>
        </div>

        <Link
          href="/client/profile#membership"
          className="btn-brand text-xs py-2 px-4 shrink-0 font-bold self-start sm:self-auto"
        >
          Select Plan (From ₦15,000) <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-sky-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-sm w-full">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">
          <Sparkles size={16} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge badge-trial text-[10px]">Fitness Police Free Trial</span>
            <span className="text-xs font-bold text-white">Day {trialInfo.currentDay} of 14</span>
            <span className="text-[11px] text-slate-400">• {trialInfo.daysRemaining} days remaining</span>
          </div>

          <div className="w-full max-w-[200px] sm:max-w-xs bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300"
              style={{ width: `${trialInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <Link
        href="/client/profile#membership"
        className="text-xs text-sky-400 font-bold hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
      >
        View Membership Options <ArrowRight size={13} />
      </Link>
    </div>
  );
}
