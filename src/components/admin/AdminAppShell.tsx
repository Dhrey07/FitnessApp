'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, Calendar, ClipboardList, Activity, FileText, Quote } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { AppShell, type NavItem } from '@/components/ui/AppShell';
import { LargeTitle } from '@/components/ui/LargeTitle';

interface AdminAppShellProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  /** One trailing action for the page. */
  action?: React.ReactNode;
  /** Leading control in the mobile bar, e.g. a back link. */
  back?: React.ReactNode;
  rail?: React.ReactNode;
  hideTitle?: boolean;
  children: React.ReactNode;
}

export const COACH_NAV: NavItem[] = [
  { href: '/admin/dashboard', label: 'Today', icon: Home, exact: true },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/check-ins', label: 'Check-ins', icon: Calendar },
  { href: '/admin/nutrition-review', label: 'Meals', icon: ClipboardList },
  { href: '/admin/training', label: 'Programmes', icon: Activity },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Quote },
];

export function AdminAppShell({ title, subtitle, meta, action, back, rail, hideTitle, children }: AdminAppShellProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  return (
    <AppShell nav={COACH_NAV} homeHref="/admin/dashboard" role="Coach" user={{ name: BRAND.coachName, detail: 'Head coach' }} onSignOut={handleSignOut} rail={rail}>
      {!hideTitle && <LargeTitle title={title} description={subtitle} meta={meta} action={action} back={back} />}
      {children}
    </AppShell>
  );
}
