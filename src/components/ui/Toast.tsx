'use client';

import { Toaster as Sonner, toast as sonnerToast } from 'sonner';
import { useIsDesktop } from '@/lib/useMediaQuery';

/** Mount once in the app shell. Bottom centre on mobile, bottom right on desktop. */
export function Toaster() {
  const desktop = useIsDesktop();
  return (
    <Sonner
      position={desktop ? 'bottom-right' : 'bottom-center'}
      duration={4000}
      offset={24}
      // Phones: clear the tab bar and the floating action button.
      mobileOffset={{ bottom: 'calc(var(--tabbar-height) + env(safe-area-inset-bottom, 0px) + 84px)', left: 16, right: 16 }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'surface-panel elev-overlay flex items-center gap-3 px-4 py-3 w-[min(420px,calc(100vw-32px))] text-sm text-ink',
          title: 'font-medium',
          description: 't-caption',
          actionButton: 'ml-auto text-brand font-semibold text-sm',
        },
      }}
    />
  );
}

/**
 * toast('Check-in saved') or toast.undo('Meal deleted', () => restore()).
 */
export const toast = Object.assign(
  (message: string, description?: string) => sonnerToast(message, { description }),
  {
    undo: (message: string, onUndo: () => void) => sonnerToast(message, { action: { label: 'Undo', onClick: onUndo } }),
    error: (message: string, description?: string) => sonnerToast.error(message, { description }),
  }
);
