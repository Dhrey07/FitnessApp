import React from 'react';
import { TrialInfo } from '@/lib/services/entitlements';
import { Banner, Button } from '@/components/ui';

/** One quiet inset line about the trial. Hidden when there is no trial. */
export function TrialBanner({ trialInfo }: { trialInfo?: TrialInfo }) {
  if (!trialInfo || !trialInfo.isTrial) return null;

  if (trialInfo.isExpired) {
    return (
      <Banner title="Your trial has ended" action={<Button href="/client/profile#membership" size="sm">Choose a plan</Button>}>
        Your nutrition log and progress history stay free. A plan keeps your training programme and check-ins going.
      </Banner>
    );
  }

  return (
    <Banner action={<Button href="/client/profile#membership" size="sm" variant="secondary">See plans</Button>}>
      Trial day {trialInfo.currentDay} of 14. {trialInfo.daysRemaining} {trialInfo.daysRemaining === 1 ? 'day' : 'days'} left with full access.
    </Banner>
  );
}
