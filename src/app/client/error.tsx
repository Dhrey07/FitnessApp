'use client';

import { useEffect } from 'react';
import { AppShell } from '@/components/ui/AppShell';
import { ErrorState } from '@/components/ui/PageStates';
import { CLIENT_NAV } from '@/components/client/ClientAppShell';

export default function ClientError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <AppShell nav={CLIENT_NAV} homeHref="/client/dashboard">
      <ErrorState retry={retry} homeHref="/client/dashboard" homeLabel="Back to today" />
    </AppShell>
  );
}
