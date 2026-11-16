'use client';

import { AppShell } from '@/components/ui/AppShell';
import { PageSkeleton } from '@/components/ui/PageStates';
import { CLIENT_NAV } from '@/components/client/ClientAppShell';

/** Shown while a client page loads: the same frame, with a skeleton where content goes. */
export default function Loading() {
  return (
    <AppShell nav={CLIENT_NAV} homeHref="/client/dashboard">
      <PageSkeleton />
    </AppShell>
  );
}