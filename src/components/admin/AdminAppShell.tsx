'use client';

import React, { useState } from 'react';
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
    { href: '/admin/dashboard', label: 'Coach Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/clients', label: 'Clients Roster', icon: Users },
    { href: '/admin/food-police', label: 'Food Police Queue', icon: ShieldAlert },
    { href: '/admin/fitness-police', label: 'Fitness Police Builder', icon: Dumbbell },
    { href: '/admin/check-ins', label: 'Check-In Reviews', icon: Calendar },
    { href: '/admin/testimonials', label: 'Social Proof Manager', icon: Quote },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col transition-colors duration-200">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 glass-panel px-4 sm:px-8 py-3 border-b border-[var(--border-subtle)]">
        <div className="w-full flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-slate-900/60 dark:bg-slate-900 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-sm">
                <UserCheck size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[var(--text-heading)] text-sm tracking-tight block leading-tight">
                    HEAD COACH OS
                  </span>
                  <span className="text-[9px] bg-purple-500/20 text-purple-400 dark:text-purple-300 border border-purple-400/30 px-1.5 py-0.2 rounded font-bold uppercase">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-medium block">
                  Fitness Police Operating Console
                </span>
              </div>
            </Link>
          </div>

          {/* Theme Switcher & Coach Profile Status */}
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" />

            <div className="flex items-center gap-2 bg-slate-900/60 dark:bg-slate-900 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 rounded-xl px-3 py-1.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Coach Lekan"
                className="w-6 h-6 rounded-full object-cover border border-purple-400/40"
              />
              <span className="text-xs font-bold text-[var(--text-heading)] hidden sm:inline">Coach Lekan Adeyemi</span>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="ml-1 p-1 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex w-full pb-8">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border-subtle)] p-5 shrink-0 space-y-6 bg-[var(--bg-sidebar)]">
          <div className="space-y-1">
            <p className="label-xs px-3 text-purple-400 font-bold">Coach Operating Controls</p>
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
                  <Icon size={16} className={active ? 'text-white' : 'text-[var(--text-muted)]'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto p-4 rounded-xl surface border border-[var(--border-subtle)] space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">System Status</span>
            <p className="font-bold text-[var(--text-heading)] text-xs">Human-in-the-Loop Active</p>
            <p className="text-[11px] text-[var(--text-muted)]">All client logs & check-ins require head coach signoff.</p>
          </div>
        </aside>

        {/* Center Admin Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          <div className="space-y-1">
            <h1 className="page-title text-xl sm:text-2xl">{title}</h1>
            {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
          </div>

          {children}
        </main>

      </div>
    </div>
  );
}
