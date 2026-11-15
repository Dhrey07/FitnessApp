'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Clock } from 'lucide-react';
import { TrialInfo } from '@/lib/services/entitlements';

interface TrialBannerProps {
  trialInfo?: TrialInfo;
}

export function TrialBanner({ trialInfo }: TrialBannerProps) {
  if (!trialInfo || !trialInfo.isTrial) return null;

  if (trialInfo.isExpired) {
    return (
      <div className="p-4 rounded-2xl bg-status-pending/15 border border-status-pending/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-status-pending/15 text-status-pending font-bold flex items-center justify-center shrink-0">
            <Clock size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-heading)]">Your 14-Day Free Trial Has Ended</p>
            <p className="text-xs text-ink-muted">
              Your nutrition log and progress history stay free. Choose a plan to continue your training programme.
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
    <div className="p-3.5 sm:p-4 rounded-2xl bg-paper border border-line-active flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-sm w-full">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand font-bold flex items-center justify-center shrink-0">
          <Sparkles size={16} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge badge-trial text-xs">Free trial</span>
            <span className="text-xs font-bold text-[var(--text-heading)]">Day {trialInfo.currentDay} of 14</span>
            <span className="text-xs text-ink-muted">• {trialInfo.daysRemaining} days remaining</span>
          </div>

          <div className="w-full max-w-[200px] sm:max-w-xs bg-paper h-1.5 rounded-full overflow-hidden border border-line">
            <div
              className="h-full transition-all duration-300 bg-paper"
              style={{ width: `${trialInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <Link
        href="/client/profile#membership"
        className="text-xs text-brand font-bold hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
      >
        View Membership Options <ArrowRight size={13} />
      </Link>
    </div>
  );
}
