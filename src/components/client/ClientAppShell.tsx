'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Flame,
  LayoutDashboard,
  Dumbbell,
  Utensils,
  TrendingUp,
  Calendar,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Layers,
  Settings,
} from 'lucide-react';
import { TrialBanner } from './TrialBanner';
import { TrialInfo, planTierLabel } from '@/lib/services/entitlements';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Logo } from '@/components/brand/Logo';
import { NotificationCenter } from '@/components/layout/NotificationCenter';
import { BRAND } from '@/lib/brand';

interface ClientAppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ClientAppShell({ title, subtitle, children }: ClientAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchUserContext();
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const fetchUserContext = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.status === 401 || res.status === 404) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (e) {
      console.error(e);
      router.push('/login');
    }
  };

  const navItems = [
    { href: '/client/dashboard', label: 'Home', shortLabel: 'Home', icon: LayoutDashboard, exact: true },
    { href: '/client/training', label: 'Training', shortLabel: 'Train', icon: Dumbbell },
    { href: '/client/nutrition', label: 'Nutrition', shortLabel: 'Food', icon: Utensils },
    { href: '/client/progress', label: 'Progress', shortLabel: 'Progress', icon: TrendingUp },
    { href: '/client/programs', label: 'Programs', shortLabel: 'Plans', icon: Layers },
    { href: '/client/resources', label: 'Guides', shortLabel: 'Guides', icon: BookOpen },
    { href: '/client/check-in', label: 'Check-in', shortLabel: 'Check-in', icon: Calendar },
    { href: '/client/profile', label: 'Settings', shortLabel: 'Me', icon: Settings },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  const sub = user?.subscription;
  const trialInfo: TrialInfo | undefined = user?.trialInfo;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col w-full transition-colors duration-200">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 glass-panel px-3 sm:px-6 lg:px-8 py-2.5 w-full border-b border-[var(--border-subtle)]">
        <div className="w-full flex items-center justify-between gap-2">
          
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-paper border border-line text-ink-muted hover:text-[var(--text-heading)] transition-colors touch-target"
              aria-label="Open navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Logo variant="horizontal" size={32} href="/client/dashboard" responsive />
          </div>

          {/* User Status, Notification Bell, Theme Switcher & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {trialInfo?.isTrial && trialInfo.isActive && (
              <span className="badge badge-trial text-xs hidden sm:inline-flex">
                <Sparkles size={11} /> Day {trialInfo.currentDay}/14
              </span>
            )}

            {sub && !sub.isTrial && (
              <span className={`badge text-xs hidden sm:inline-flex${
                sub.planTier === 'GOLD' ? 'badge-tier-gold' :
                sub.planTier === 'DIAMOND' ? 'badge-tier-diamond' :
                'bg-paper text-ink-secondary'
              }`}>
                {planTierLabel(sub.planTier)}
              </span>
            )}

            {/* Global Notification Center */}
            <NotificationCenter />

            {/* Global Theme Toggle */}
            <ThemeToggle variant="icon" />

            {/* Profile Avatar & Logout */}
            <div className="flex items-center gap-1.5 bg-paper border border-line rounded-xl px-2 py-1.5">
              <div className="w-6 h-6 rounded-full bg-brand-soft text-brand font-bold flex items-center justify-center text-xs border border-line-active shrink-0">
                {user?.firstName?.charAt(0) || 'C'}
              </div>
              <span className="text-xs font-bold text-[var(--text-heading)] hidden lg:inline truncate max-w-[100px]">
                {user?.firstName}
              </span>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1 text-ink-muted hover:text-status-rejected transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full pb-16 lg:pb-0 min-h-0">
        
        {/* Desktop Left Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-60 xl:w-64 border-r border-[var(--border-subtle)] px-3 py-5 shrink-0 space-y-6 bg-[var(--bg-sidebar)]">
          <div className="space-y-0.5">
            <p className="label-xs px-3 pb-2 text-[var(--text-muted)]">Navigation</p>
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-brand-strong text-brand-on-strong shadow-md'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-heading)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={active ? 'text-brand-on-strong' : 'text-[var(--text-muted)]'} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Coach Link */}
          <div className="mt-auto p-3.5 rounded-xl surface border border-[var(--border-subtle)] space-y-2 text-xs">
            <p className="font-bold text-[var(--text-heading)] text-xs uppercase tracking-wider">Head Coach</p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-soft text-brand font-bold flex items-center justify-center text-xs shrink-0" aria-hidden="true">{BRAND.coachName.split(' ').map((w) => w[0]).join('').slice(0, 2)}</div>
              <div className="min-w-0">
                <p className="font-bold text-[var(--text-heading)] text-xs truncate">{BRAND.coachName}</p>
                <p className="text-xs text-brand font-semibold">Head coach</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Workspace Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 overflow-x-hidden">
          {/* Trial Banner */}
          <TrialBanner trialInfo={trialInfo} />

          {/* Page Title Header */}
          <div className="space-y-0.5">
            <h1 className="page-title text-lg sm:text-xl lg:text-2xl">{title}</h1>
            {subtitle && <p className="text-xs text-[var(--text-muted)] leading-relaxed">{subtitle}</p>}
          </div>

          {/* Body Content */}
          {children}

          {/* Bottom spacer for mobile nav */}
          <div className="h-4 lg:h-0" />
        </main>

      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-[min(288px,85vw)] bg-[var(--bg-surface)] h-full py-5 px-4 space-y-5 border-r border-[var(--border-subtle)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-strong flex items-center justify-center text-brand-on-strong font-black shrink-0">
                  <Flame size={15} />
                </div>
                <span className="font-extrabold text-[var(--text-heading)] text-sm">{BRAND.shortName}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-[var(--text-heading)] transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* User info in drawer */}
            {user && (
              <div className="flex items-center gap-2.5 px-1">
                <div className="w-8 h-8 rounded-full bg-brand-soft text-brand font-bold flex items-center justify-center text-sm border border-line-active shrink-0">
                  {user.firstName?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--text-heading)] truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-0.5">
              {navItems.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? 'bg-brand-strong text-brand-on-strong shadow-md'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} className={active ? 'text-brand-on-strong' : 'text-[var(--text-muted)]'} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-medium">Appearance</span>
                <ThemeToggle variant="buttons" />
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-bold text-status-rejected hover:bg-status-rejected/15 transition-colors"
              >
                <LogOut size={17} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-subtle)] safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-1">
          {navItems.slice(0, 5).map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-0 flex-1 transition-all ${
                  active ? 'text-brand' : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                }`}
              >
                <Icon size={18} className={`shrink-0 ${active ? 'text-brand' : 'text-[var(--text-muted)]'}`} />
                <span className="text-xs font-bold mt-0.5 truncate w-full text-center leading-tight">
                  {item.shortLabel}
                </span>
                {active && <span className="w-1 h-1 rounded-full bg-brand-strong mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
