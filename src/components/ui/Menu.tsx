'use client';

import * as React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface MenuItem {
  label: string;
  onSelect?: () => void;
  href?: string;
  icon?: React.ReactNode;
  destructive?: boolean;
}

/** Overflow menu. The default trigger is a 44px "more" icon button. */
export function Menu({ items, trigger, label = 'More', align = 'end' }: { items: MenuItem[]; trigger?: React.ReactNode; label?: string; align?: 'start' | 'end' }) {
  return (
    <Dropdown.Root modal={false}>
      <Dropdown.Trigger asChild>
        {trigger ?? (
          <button type="button" aria-label={label} className="focus-ring h-11 w-11 rounded-full flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-[var(--bg-card-hover)]">
            <MoreHorizontal size={20} />
          </button>
        )}
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align={align} sideOffset={6} className="z-50 min-w-[200px] surface-panel elev-overlay p-1.5 outline-none data-[state=open]:motion-enter">
          {items.map((item) => {
            const cls = cn(
              'flex items-center gap-2.5 h-11 px-3 rounded-[var(--radius-sm)] text-sm text-ink outline-none cursor-pointer select-none data-[highlighted]:bg-[var(--bg-card-hover)]',
              item.destructive && 'text-status-rejected'
            );
            return item.href ? (
              <Dropdown.Item key={item.label} asChild>
                <a href={item.href} className={cls}>{item.icon}{item.label}</a>
              </Dropdown.Item>
            ) : (
              <Dropdown.Item key={item.label} onSelect={item.onSelect} className={cls}>
                {item.icon}
                {item.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
