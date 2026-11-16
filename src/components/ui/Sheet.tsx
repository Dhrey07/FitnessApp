'use client';

import * as React from 'react';
import { Drawer } from 'vaul';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useIsDesktop } from '@/lib/useMediaQuery';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  /** Pinned bottom slot, e.g. the primary button. */
  footer?: React.ReactNode;
  /** Desktop dialog width. */
  width?: 'sm' | 'md' | 'lg';
}

const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

/**
 * Bottom sheet on touch widths with drag handle and snap points; a centred
 * dialog on desktop. Scroll lock and focus trap come from the primitives.
 */
export function Sheet({ open, onOpenChange, title, description, children, footer, width = 'md' }: SheetProps) {
  const desktop = useIsDesktop();

  if (desktop) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgba(22,26,24,0.5)] data-[state=open]:animate-[v2-fade_var(--dur-2)_var(--ease-enter)]" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 surface-panel elev-overlay p-0 outline-none flex flex-col max-h-[calc(100vh-64px)]',
              widths[width],
              'data-[state=open]:animate-[v2-dialog-in_var(--dur-2)_var(--ease-enter)]'
            )}
          >
            <div className="flex items-start justify-between gap-4 p-6 pb-4">
              <div className="min-w-0">
                <Dialog.Title className="t-h3">{title}</Dialog.Title>
                {description && <Dialog.Description className="t-body-sm mt-1">{description}</Dialog.Description>}
              </div>
              <Dialog.Close className="focus-ring -mr-2 -mt-2 h-10 w-10 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-[var(--bg-card-hover)]" aria-label="Close">
                <X size={18} />
              </Dialog.Close>
            </div>
            <div className="px-6 pb-6 overflow-y-auto flex-1">{children}</div>
            {footer && <div className="p-4 hairline">{footer}</div>}
          </Dialog.Content>
        </Dialog.Portal>
        <style jsx global>{`
          @keyframes v2-dialog-in { from { opacity: 0; transform: translate(-50%, -50%) scale(0.98); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        `}</style>
      </Dialog.Root>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-[rgba(22,26,24,0.5)]" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[92dvh] rounded-t-[var(--radius-lg)] bg-[var(--bg-surface)] elev-overlay outline-none">
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-[var(--border-input)]" aria-hidden />
          <div className="px-5 pt-4 pb-3">
            <Drawer.Title className="t-h3">{title}</Drawer.Title>
            {description ? <Drawer.Description className="t-body-sm mt-1">{description}</Drawer.Description> : <Drawer.Description className="sr-only">{title}</Drawer.Description>}
          </div>
          <div className="px-5 pb-5 overflow-y-auto flex-1">{children}</div>
          {footer && <div className="p-4 hairline safe-pb">{footer}</div>}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
