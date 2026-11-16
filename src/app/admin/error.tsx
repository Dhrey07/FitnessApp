'use client';

import { useEffect } from 'react';
import { AppShell } from '@/components/ui/AppShell';
import { ErrorState } from '@/components/ui/PageStates';
import { COACH_NAV } from '@/components/admin/AdminAppShell';

export default function CoachError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <AppShell nav={COACH_NAV} homeHref="/admin/dashboard" role="Coach">
      <ErrorState retry={retry} homeHref="/admin/dashboard" homeLabel="Back to today" />
    </AppShell>
  );
}
