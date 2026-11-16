'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, MoreHorizontal, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Avatar } from './Avatar';
import { Sheet } from './Sheet';
import { Toaster } from './Toast';
import { ListRow, ListRows } from './ListRow';

export interface NavItem {
  href: string;
  label: string;
  /** Short label for the tab bar. */
  short?: string;
  icon: LucideIcon;
  exact?: boolean;
}

export interface ShellUser {
  name: string;
  email?: string;
  avatarUrl?: string | null;
  /** One line under the name, e.g. the plan name. */
  detail?: React.ReactNode;
}

interface AppShellProps {
  /** Full navigation. The first four items become mobile tabs; the rest live under More. */
  nav: NavItem[];
  homeHref: string;
  user?: ShellUser;
  onSignOut?: () => void;
  /** Optional 320px context rail on desktop. */
  rail?: React.ReactNode;
  /** Rendered above the page content inside the content column (banners). */
  above?: React.ReactNode;
  /** Small label under the logo in the sidebar, e.g. "Coach". */
  role?: string;
  /** Extra rows in the More sheet and sidebar footer. */
  extra?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + '/');
}

/**
 * Desktop: 240px sidebar, content column (max 960px), optional 320px rail.
 * Mobile: content with a bottom tab bar (4 items + More). Page titles come
 * from <LargeTitle> inside children so each page controls its own bar.
 */
export function AppShell({ nav, homeHref, user, onSignOut, rail, above, role, extra, children, contentClassName }: AppShellProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);
  const tabs = nav.slice(0, 4);
  const overflow = nav.slice(4);
  const overflowActive = overflow.some((i) => isActive(pathname, i));

  React.useEffect(() => setMoreOpen(false), [pathname]);

  return (
    <div className="min-h-dvh bg-paper text-ink flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex sticky top-0 h-dvh w-60 shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)] px-3 py-5">
        <div className="px-2">
          <Logo variant="horizontal" size={28} href={homeHref} />
          {role && <p className="t-caption mt-2">{role}</p>}
        </div>
        <nav className="mt-8 space-y-0.5" aria-label="Main">
          {nav.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'focus-ring flex items-center gap-3 h-11 px-3 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-[var(--dur-1)]',
                  active ? 'bg-brand-soft text-brand' : 'text-ink-secondary hover:text-ink hover:bg-[var(--bg-card-hover)]'
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 px-1">
          {extra}
          <div className="flex items-center justify-between gap-2">
            <ThemeToggle variant="icon" />
            {onSignOut && (
              <button type="button" onClick={onSignOut} className="focus-ring h-10 px-3 rounded-full text-sm text-ink-secondary hover:text-ink hover:bg-[var(--bg-card-hover)] flex items-center gap-2">
                <LogOut size={16} aria-hidden /> Sign out
              </button>
            )}
          </div>
          {user && (
            <div className="flex items-center gap-3 pt-3 hairline">
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                {user.detail && <p className="t-caption truncate">{user.detail}</p>}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 flex">
        <main className={cn('flex-1 min-w-0 px-4 md:px-10 pb-6 md:py-8 tabbar-clear md:pb-8', contentClassName)}>
          <div className="mx-auto w-full max-w-[960px] space-y-6">
            {above}
            {children}
          </div>
        </main>
        {rail && (
          <aside className="hidden xl:block w-80 shrink-0 border-l border-[var(--border-subtle)] px-6 py-8 sticky top-0 h-dvh overflow-y-auto">
            <div className="space-y-6">{rail}</div>
          </aside>
        )}
      </div>

      {/* Mobile tab bar */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-[var(--bg-header)] backdrop-blur-md border-t border-[var(--border-subtle)] safe-pb" aria-label="Main">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn('focus-ring relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium', active ? 'text-brand' : 'text-ink-muted')}
              >
                {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brand" aria-hidden />}
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                {item.short ?? item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            className={cn('focus-ring relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium', overflowActive ? 'text-brand' : 'text-ink-muted')}
          >
            {overflowActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brand" aria-hidden />}
            <MoreHorizontal size={22} aria-hidden />
            More
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen} title="More">
        {user && (
          <div className="flex items-center gap-3 pb-4">
            <Avatar name={user.name} src={user.avatarUrl} />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              {user.detail && <p className="t-caption truncate">{user.detail}</p>}
            </div>
          </div>
        )}
        <ListRows>
          {overflow.map((item) => {
            const Icon = item.icon;
            return <ListRow key={item.href} href={item.href} leading={<Icon size={20} className="text-ink-secondary" aria-hidden />} title={item.label} />;
          })}
        </ListRows>
        <div className="pt-4 space-y-4">
          {extra}
          <div className="flex items-center justify-between">
            <span className="t-body-sm">Appearance</span>
            <ThemeToggle variant="buttons" />
          </div>
          {onSignOut && (
            <button type="button" onClick={onSignOut} className="focus-ring w-full h-12 rounded-full border border-[var(--border-input)] text-sm font-medium text-ink flex items-center justify-center gap-2">
              <LogOut size={16} aria-hidden /> Sign out
            </button>
          )}
        </div>
      </Sheet>

      <Toaster />
    </div>
  );
}
