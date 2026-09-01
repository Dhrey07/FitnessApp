'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Dumbbell,
  Calendar,
  Quote,
  LogOut,
  Menu,
  X,
  UserCheck,
  Flame,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

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
    { href: '/admin/clients', label: 'Clients Roster', icon: Users },
    { href: '/admin/food-police', label: 'Food Police Queue', icon: ShieldAlert },
    { href: '/admin/fitness-police', label: 'Workout Builder', icon: Dumbbell },
    { href: '/admin/check-ins', label: 'Check-In Reviews', icon: Calendar },
    { href: '/admin/testimonials', label: 'Social Proof', icon: Quote },
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
              className="lg:hidden p-2 rounded-xl bg-slate-900/60 dark:bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-sm shrink-0">
                <UserCheck size={16} />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[var(--text-heading)] text-sm tracking-tight leading-tight">
                    COACH OS
                  </span>
                  <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-400/30 px-1.5 py-0.5 rounded font-bold uppercase">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-medium hidden md:block">
                  Fitness Police Operating Console
                </span>
              </div>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle variant="icon" />

            <div className="flex items-center gap-1.5 bg-slate-900/60 dark:bg-slate-900 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 rounded-xl px-2 py-1.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Oga Eric"
                className="w-6 h-6 rounded-full object-cover border border-purple-400/40 shrink-0"
              />
              <span className="text-xs font-bold text-[var(--text-heading)] hidden sm:inline">Oga Eric</span>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
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
            <p className="label-xs px-3 pb-2 text-purple-400 font-bold">Coach Controls</p>
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-heading)]'
                  }`}
                >
                  <Icon size={15} className={active ? 'text-white' : 'text-[var(--text-muted)]'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto p-3.5 rounded-xl surface border border-[var(--border-subtle)] space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">System Status</span>
            <p className="font-bold text-[var(--text-heading)] text-xs">Human-in-the-Loop Active</p>
            <p className="text-[11px] text-[var(--text-muted)]">All client logs & check-ins require coach signoff.</p>
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
                <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black shrink-0">
                  <UserCheck size={15} />
                </div>
                <span className="font-extrabold text-[var(--text-heading)] text-sm">COACH OS</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
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
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-white' : 'text-[var(--text-muted)]'} />
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
                className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-400/10 transition-colors"
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
