'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { flushQueue, listQueued, QUEUE_EVENT } from '@/lib/offlineQueue';
import { toast } from '@/components/ui/Toast';

/**
 * Replays queued meal and set logs when the phone comes back online and
 * shows a single quiet line while anything is waiting.
 */
export function OfflineSync() {
  const router = useRouter();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    let alive = true;
    const refreshCount = async () => {
      const n = (await listQueued()).length;
      if (alive) setPending(n);
    };
    const flush = async () => {
      const sent = await flushQueue();
      await refreshCount();
      if (sent > 0) {
        toast(sent === 1 ? 'Synced 1 saved log' : `Synced ${sent} saved logs`);
        router.refresh();
      }
    };
    refreshCount();
    flush();
    window.addEventListener('online', flush);
    window.addEventListener(QUEUE_EVENT, refreshCount);
    return () => {
      alive = false;
      window.removeEventListener('online', flush);
      window.removeEventListener(QUEUE_EVENT, refreshCount);
    };
  }, [router]);

  if (pending === 0) return null;
  return (
    <p role="status" className="t-caption">
      {pending === 1 ? '1 log is' : `${pending} logs are`} saved on this phone and will sync when you are back online.
    </p>
  );
}
