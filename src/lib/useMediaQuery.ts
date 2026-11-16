'use client';

import { useSyncExternalStore } from 'react';

function subscribe(query: string, cb: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

/** SSR-safe media query hook. Returns `fallback` on the server. */
export function useMediaQuery(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => subscribe(query, cb),
    () => window.matchMedia(query).matches,
    () => fallback
  );
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 768px)', false);
}
