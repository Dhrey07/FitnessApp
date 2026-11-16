'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Utensils, Activity, TrendingUp, Calendar, BookOpen, Layers, Settings } from 'lucide-react';
import { TrialBanner } from './TrialBanner';
import { TrialInfo, planTierLabel } from '@/lib/services/entitlements';
import { NotificationCenter } from '@/components/layout/NotificationCenter';
import { AppShell, LargeTitle, type NavItem } from '@/components/ui';

interface ClientAppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const NAV: NavItem[] = [
  { href: '/client/dashboard', label: 'Today', icon: Home, exact: true },
  { href: '/client/nutrition', label: 'Food', icon: Utensils },
  { href: '/client/training', label: 'Train', icon: Activity },
  { href: '/client/progress', label: 'Progress', icon: TrendingUp },
  { href: '/client/check-in', label: 'Weekly check-in', icon: Calendar },
  { href: '/client/resources', label: 'Guides', icon: BookOpen },
  { href: '/client/programs', label: 'Plans', icon: Layers },
  { href: '/client/profile', label: 'Profile and billing', icon: Settings },
];

/**
 * Client shell: loads the signed-in user, then renders the shared AppShell
 * with the client navigation, the trial banner and the page's large title.
 */
export function ClientAppShell({ title, subtitle, children }: ClientAppShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 401 || res.status === 404) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (!cancelled) setUser(data.user);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  const sub = user?.subscription;
  const trialInfo: TrialInfo | undefined = user?.trialInfo;
  const detail = trialInfo?.isTrial && trialInfo.isActive ? `Trial · day ${trialInfo.currentDay} of 14` : sub ? planTierLabel(sub.planTier) : undefined;

  return (
    <AppShell
      nav={NAV}
      homeHref="/client/dashboard"
      user={user ? { name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Client', email: user.email, detail } : undefined}
      onSignOut={handleSignOut}
      above={<TrialBanner trialInfo={trialInfo} />}
    >
      <LargeTitle title={title} description={subtitle} action={<NotificationCenter />} />
      {children}
    </AppShell>
  );
}
