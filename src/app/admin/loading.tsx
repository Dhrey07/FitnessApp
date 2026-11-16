'use client';

import { AppShell } from '@/components/ui/AppShell';
import { PageSkeleton } from '@/components/ui/PageStates';
import { COACH_NAV } from '@/components/admin/AdminAppShell';

export default function Loading() {
  return (
    <AppShell nav={COACH_NAV} homeHref="/admin/dashboard" role="Coach">
      <PageSkeleton />
    </AppShell>
  );
}