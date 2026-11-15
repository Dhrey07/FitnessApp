'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Dumbbell,
  Calendar,
  Quote,
  LogOut,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Logo } from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';

interface AdminAppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AdminAppShell({ title, subtitle, children }: AdminAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/nutrition-review', label: 'Nutrition Review', icon: ClipboardList },
    { href: '/admin/training', label: 'Training Builder', icon: Dumbbell },
    { href: '/admin/check-ins', label: 'Check-ins', icon: Calendar },
    { href: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col transition-colors duration-200">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 glass-panel px-3 sm:px-6 lg:px-8 py-2.5 border-b border-[var(--border-subtle)]">
        <div className="w-full flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-paper border border-line text-ink-muted hover:text-[var(--text-heading)] transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <Logo variant="horizontal" size={32} href="/admin/dashboard" responsive />
              <span className="badge badge-trial hidden md:inline-flex">Coach</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle variant="icon" />

            <div className="flex items-center gap-1.5 bg-paper border border-line rounded-xl px-2 py-1.5">
              <div className="w-6 h-6 rounded-full bg-brand-soft text-brand font-bold flex items-center justify-center text-xs shrink-0" aria-hidden="true">{BRAND.coachName.split(' ').map((w) => w[0]).join('').slice(0, 2)}</div>
              <span className="text-xs font-bold text-[var(--text-heading)] hidden sm:inline">{BRAND.coachName}</span>
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

      {/* Main Admin Body */}
      <div className="flex-1 flex w-full min-h-0">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-60 xl:w-64 border-r border-[var(--border-subtle)] px-3 py-5 shrink-0 space-y-6 bg-[var(--bg-sidebar)]">
          <div className="space-y-0.5">
            <p className="label-xs px-3 pb-2 text-brand font-bold">Coach Controls</p>
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-brand-strong text-brand-on-strong shadow-md'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-heading)]'
                  }`}
                >
                  <Icon size={15} className={active ? 'text-[var(--text-heading)]' : 'text-[var(--text-muted)]'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto p-3.5 rounded-xl surface border border-[var(--border-subtle)] space-y-1.5 text-xs">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">System Status</span>
            <p className="font-bold text-[var(--text-heading)] text-xs">Human-in-the-Loop Active</p>
            <p className="text-xs text-[var(--text-muted)]">All client logs & check-ins require coach signoff.</p>
          </div>
        </aside>

        {/* Center Admin Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-5 overflow-x-hidden">
          <div className="space-y-0.5">
            <h1 className="page-title text-lg sm:text-xl lg:text-2xl">{title}</h1>
            {subtitle && <p className="text-xs text-[var(--text-muted)] leading-relaxed">{subtitle}</p>}
          </div>

          {children}
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
                  <UserCheck size={15} />
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

            <div className="space-y-0.5">
              {navItems.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? 'bg-brand-strong text-brand-on-strong shadow-md'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-[var(--text-heading)]' : 'text-[var(--text-muted)]'} />
                    <span>{item.label}</span>
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

    </div>
  );
}
