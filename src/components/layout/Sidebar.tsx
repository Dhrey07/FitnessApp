'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Dumbbell, Utensils, TrendingUp, UserCheck, LayoutDashboard, Calendar, X, LogOut } from 'lucide-react';
import { DEMO_PERSONAS } from '../Navbar';

interface SidebarProps {
  activeEmail: string;
  onPersonaChange: (email: string) => void;
  onClose?: () => void;
}

export function Sidebar({ activeEmail, onPersonaChange, onClose }: SidebarProps) {
  const pathname = usePathname();
  const currentPersona = DEMO_PERSONAS.find((p) => p.email === activeEmail) || DEMO_PERSONAS[0];
  const isCoach = currentPersona.role === 'COACH';

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="flex flex-col h-full bg-[#131924] border-r border-white/10 w-[min(248px,85vw)] shrink-0">
      {/* Fitness Police Logo Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
            <ShieldAlert className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-white text-sm tracking-tight block truncate">Fitness Police</span>
            <span className="text-[10px] text-sky-400 font-medium block -mt-0.5 truncate">Coaching Hub</span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto scrollbar-hidden">
        {/* Coaching Management (Coach Admin) */}
        <div className="space-y-0.5">
          <p className="label-sm px-3 pt-1 pb-2 text-slate-400 flex items-center justify-between">
            <span>Coaching Management</span>
            {isCoach && <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-400/30 px-1.5 py-0.2 rounded font-bold">ACTIVE</span>}
          </p>
          {[
            { href: '/admin/dashboard', label: 'Coach Dashboard', icon: LayoutDashboard },
            { href: '/admin/food-police', label: 'Food Police Queue', icon: ShieldAlert },
            { href: '/admin/clients', label: 'Client Roster', icon: UserCheck },
          ].map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-sky-500/15 text-sky-400 font-bold border-l-2 border-sky-400 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`shrink-0 ${active ? 'text-sky-400' : 'text-slate-400'}`} size={16} />
                <span className="truncate">{label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />}
              </Link>
            );
          })}
        </div>

        {/* Client Workspace */}
        <div className="space-y-0.5 pt-2 border-t border-white/10">
          <p className="label-sm px-3 pt-1 pb-2 text-slate-400 flex items-center justify-between">
            <span>Client Workspace</span>
            {!isCoach && <span className="text-[9px] bg-sky-500/20 text-sky-400 border border-sky-400/30 px-1.5 py-0.2 rounded font-bold">ACTIVE</span>}
          </p>
          {[
            { href: '/client/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
            { href: '/client/food-police', label: 'Food Police (Free)', icon: Utensils },
            { href: '/client/fitness-police', label: 'Fitness Police Hub', icon: Dumbbell },
            { href: '/client/progress', label: 'Progress Tracker', icon: TrendingUp },
            { href: '/client/check-in', label: 'Weekly Check-In', icon: Calendar },
          ].map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-sky-500/15 text-sky-400 font-bold border-l-2 border-sky-400 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`shrink-0 ${active ? 'text-sky-400' : 'text-slate-400'}`} size={16} />
                <span className="truncate">{label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Profile Card */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs shrink-0 border border-sky-500/30">
            {getInitials(currentPersona.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate leading-tight">{currentPersona.name}</p>
            <p className="text-[10px] text-slate-400 truncate capitalize leading-tight mt-0.5">
              {currentPersona.tier} ({currentPersona.role})
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
