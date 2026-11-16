'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, Calendar, ClipboardList, Activity, FileText, Quote } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { AppShell, LargeTitle, type NavItem } from '@/components/ui';

interface AdminAppShellProps {
  title: string;
  subtitle?: string;
  /** One trailing action for the page. */
  action?: React.ReactNode;
  children: React.ReactNode;
}

const NAV: NavItem[] = [
  { href: '/admin/dashboard', label: 'Today', icon: Home, exact: true },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/check-ins', label: 'Check-ins', icon: Calendar },
  { href: '/admin/nutrition-review', label: 'Nutrition', icon: ClipboardList },
  { href: '/admin/training', label: 'Programmes', icon: Activity },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Quote },
];

export function AdminAppShell({ title, subtitle, action, children }: AdminAppShellProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  return (
    <AppShell nav={NAV} homeHref="/admin/dashboard" role="Coach" user={{ name: BRAND.coachName, detail: 'Head coach' }} onSignOut={handleSignOut}>
      <LargeTitle title={title} description={subtitle} action={action} />
      {children}
    </AppShell>
  );
}
