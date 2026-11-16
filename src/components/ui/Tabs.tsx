'use client';

import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';

/** Underline tabs for page sections (client detail, nutrition log/plan). */
export const Tabs = RadixTabs.Root;

export function TabsList({ className, children, label }: { className?: string; children: React.ReactNode; label: string }) {
  return (
    <RadixTabs.List aria-label={label} className={cn('flex gap-6 hairline-b overflow-x-auto scrollbar-hidden -mx-4 px-4 md:mx-0 md:px-0', className)}>
      {children}
    </RadixTabs.List>
  );
}

export function Tab({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        'focus-ring relative shrink-0 h-11 whitespace-nowrap text-sm font-medium text-ink-secondary transition-colors duration-[var(--dur-1)]',
        'data-[state=active]:text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand after:opacity-0 data-[state=active]:after:opacity-100 after:transition-opacity',
        className
      )}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

export function TabPanel({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <RadixTabs.Content value={value} className={cn('pt-6 outline-none motion-enter', className)}>
      {children}
    </RadixTabs.Content>
  );
}
