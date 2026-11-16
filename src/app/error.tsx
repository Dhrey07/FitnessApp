'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/PageStates';

export default function RootError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="min-h-dvh bg-paper text-ink pub-container flex items-center">
      <ErrorState retry={retry} />
    </main>
  );
}
