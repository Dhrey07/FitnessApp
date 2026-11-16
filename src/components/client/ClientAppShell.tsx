'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Utensils, Activity, TrendingUp, Calendar, BookOpen, Layers, Settings } from 'lucide-react';
import { TrialBanner } from './TrialBanner';
import { OfflineSync } from './OfflineSync';
import { TrialInfo, planTierLabel } from '@/lib/services/entitlements';
import { NotificationCenter } from '@/components/layout/NotificationCenter';
import { AppShell, type NavItem } from '@/components/ui/AppShell';
import { LargeTitle } from '@/components/ui/LargeTitle';

export interface ClientShellUser {
  name: string;
  email?: string;
  avatarUrl?: string | null;
  detail?: string;
  trialInfo?: TrialInfo;
}

interface ClientAppShellProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Small line above the title, e.g. the date. */
  meta?: React.ReactNode;
  /** Replaces the default notifications action. */
  action?: React.ReactNode;
  /** Leading control in the mobile bar, e.g. a back link. */
  back?: React.ReactNode;
  /** Desktop context rail (xl and up). */
  rail?: React.ReactNode;
  /** Pass from a server page to skip the client-side fetch. */
  user?: ClientShellUser;
  /** Hides the large title when the page draws its own header. */
  hideTitle?: boolean;
  children: React.ReactNode;
}

export const CLIENT_NAV: NavItem[] = [
  { href: '/client/dashboard', label: 'Today', icon: Home, exact: true },
  { href: '/client/nutrition', label: 'Food', icon: Utensils },
  { href: '/client/training', label: 'Train', icon: Activity },
  { href: '/client/progress', label: 'Progress', icon: TrendingUp },
  { href: '/client/check-in', label: 'Weekly check-in', icon: Calendar },
  { href: '/client/resources', label: 'Guides', icon: BookOpen },
  { href: '/client/programs', label: 'Plans', icon: Layers },
  { href: '/client/profile', label: 'Profile and billing', icon: Settings },
];

export function ClientAppShell({ title, subtitle, meta, action, back, rail, user: initialUser, hideTitle, children }: ClientAppShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<ClientShellUser | undefined>(initialUser);

  useEffect(() => {
    if (initialUser) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 401 || res.status === 404) {
          router.push('/login');
          return;
        }
        const { user: u } = await res.json();
        if (cancelled || !u) return;
        const trialInfo: TrialInfo | undefined = u.trialInfo;
        setUser({
          name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || 'Client',
          email: u.email,
          avatarUrl: u.avatarUrl,
          trialInfo,
          detail: trialInfo?.isTrial && trialInfo.isActive ? `Trial · day ${trialInfo.currentDay} of 14` : u.subscription ? planTierLabel(u.subscription.planTier) : undefined,
        });
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialUser, router]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  return (
    <AppShell
      nav={CLIENT_NAV}
      homeHref="/client/dashboard"
      user={user ? { name: user.name, email: user.email, avatarUrl: user.avatarUrl, detail: user.detail } : undefined}
      onSignOut={handleSignOut}
      rail={rail}
      above={<TrialBanner trialInfo={user?.trialInfo} />}
    >
      {!hideTitle && <LargeTitle title={title} description={subtitle} meta={meta} back={back} action={action ?? <NotificationCenter />} />}
      <OfflineSync />
      {children}
    </AppShell>
  );
}
