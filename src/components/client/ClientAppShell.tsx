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
import { TrialInfo } from '@/lib/services/entitlements';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { NotificationCenter } from '@/components/layout/NotificationCenter';

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
    { href: '/client/dashboard', label: 'Home', icon: LayoutDashboard, exact: true },
    { href: '/client/fitness-police', label: 'Workouts', icon: Dumbbell },
    { href: '/client/food-police', label: 'Food Police', icon: Utensils, badge: 'FREE' },
    { href: '/client/progress', label: 'Progress', icon: TrendingUp },
    { href: '/client/programs', label: 'Programs', icon: Layers },
    { href: '/client/resources', label: 'Resources', icon: BookOpen },
    { href: '/client/check-in', label: 'Coaching', icon: Calendar },
    { href: '/client/profile', label: 'Settings', icon: Settings },
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
      <header className="sticky top-0 z-40 glass-panel px-4 sm:px-8 lg:px-10 py-3 w-full border-b border-[var(--border-subtle)]">
        <div className="w-full flex items-center justify-between">
          
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-slate-900/60 dark:bg-slate-900 border border-white/10 dark:border-white/10 light:border-slate-200 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link href="/client/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-sm">
                <Flame size={18} className="fill-slate-950 stroke-none" />
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-[var(--text-heading)] text-sm tracking-tight block leading-tight">
                  FITNESS POLICE
                </span>
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
                  Command Centre
                </span>
              </div>
            </Link>
          </div>

          {/* User Status, Notification Bell, Theme Switcher & Profile */}
          <div className="flex items-center gap-2.5">
            {trialInfo?.isTrial && trialInfo.isActive && (
              <span className="badge badge-trial text-[10px] hidden md:inline-flex">
                <Sparkles size={11} /> Trial: Day {trialInfo.currentDay} of 14
              </span>
            )}

            {sub && !sub.isTrial && (
              <span className={`badge text-[10px] hidden md:inline-flex ${
                sub.planTier === 'GOLD' ? 'badge-tier-gold' :
                sub.planTier === 'DIAMOND' ? 'badge-tier-diamond' :
                'bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-800'
              }`}>
                {sub.planTier} TIER
              </span>
            )}

            {/* Global Notification Center */}
            <NotificationCenter />

            {/* Global Theme Toggle */}
            <ThemeToggle variant="icon" />

            {/* Profile Avatar & Logout */}
            <div className="flex items-center gap-2 bg-slate-900/60 dark:bg-slate-900 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 rounded-xl px-2.5 py-1.5">
              <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px] border border-sky-500/30">
                {user?.firstName?.charAt(0) || 'C'}
              </div>
              <span className="text-xs font-bold text-[var(--text-heading)] hidden lg:inline truncate max-w-[120px]">
                {user?.firstName}
              </span>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="ml-0.5 p-1 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full pb-16 lg:pb-8">
        
        {/* Desktop Left Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border-subtle)] p-5 shrink-0 space-y-6 bg-[var(--bg-sidebar)]">
          <div className="space-y-1">
            <p className="label-xs px-3 text-[var(--text-muted)]">Navigation</p>
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/20'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-heading)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={active ? 'text-slate-950' : 'text-[var(--text-muted)]'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !active && (
                    <span className="bg-sky-400/20 text-sky-400 text-[9px] px-1.5 py-0.2 rounded font-black">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Coach Link */}
          <div className="mt-auto p-4 rounded-xl surface border border-[var(--border-subtle)] space-y-2 text-xs">
            <p className="font-bold text-[var(--text-heading)] text-[11px] uppercase tracking-wider">Assigned Head Coach</p>
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Coach Lekan"
                className="w-8 h-8 rounded-full object-cover border border-sky-400/40"
              />
              <div>
                <p className="font-bold text-[var(--text-heading)] text-xs">Coach Lekan</p>
                <p className="text-[10px] text-sky-400 font-semibold">Online & Reviewing</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Workspace Content Area */}
        <main className="flex-1 px-4 sm:px-8 lg:px-10 py-6 space-y-6 max-w-full overflow-hidden">
          {/* Trial Banner */}
          <TrialBanner trialInfo={trialInfo} />

          {/* Page Title Header */}
          <div className="space-y-1">
            <h1 className="page-title text-xl sm:text-2xl">{title}</h1>
            {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
          </div>

          {/* Body Content */}
          {children}
        </main>

      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-[var(--bg-surface)] h-full p-5 space-y-6 border-r border-[var(--border-subtle)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-400 flex items-center justify-center text-slate-950 font-black">
                  <Flame size={16} />
                </div>
                <span className="font-extrabold text-[var(--text-heading)] text-sm">FITNESS POLICE</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={active ? 'text-slate-950' : 'text-[var(--text-muted)]'} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Theme</span>
                <ThemeToggle variant="buttons" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-subtle)] px-2 py-1.5 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
                active ? 'text-sky-400' : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
              }`}
            >
              <Icon size={18} className={active ? 'text-sky-400 scale-110' : 'text-[var(--text-muted)]'} />
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
