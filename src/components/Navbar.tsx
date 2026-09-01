'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert, Dumbbell, Utensils, TrendingUp, UserCheck, Sparkles, LayoutDashboard, CheckCircle2, Menu } from 'lucide-react';
import { Sidebar } from './layout/Sidebar';

export const DEMO_PERSONAS = [
  { email: 'chidi@example.com', name: 'Chidi Okonkwo', role: 'CLIENT', tier: 'GOLD', label: 'Gold Subscriber (Fat Loss)' },
  { email: 'aminat@example.com', name: 'Aminat Bello', role: 'CLIENT', tier: 'DIAMOND', label: 'Diamond VIP (Muscle Gain)' },
  { email: 'tunde@example.com', name: 'Tunde Johnson', role: 'CLIENT', tier: 'FREE', label: 'Free User (Food Police)' },
  { email: 'coach@fitnesspolice.com', name: 'Oga Eric', role: 'COACH', tier: 'ADMIN', label: 'Admin / Head Coach' },
];

export function Navbar({ activeEmail, onPersonaChange }: { activeEmail?: string; onPersonaChange?: (email: string) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState(activeEmail || 'chidi@example.com');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPersona = DEMO_PERSONAS.find((p) => p.email === selectedEmail) || DEMO_PERSONAS[0];

  const handleSelectPersona = (email: string, role: string) => {
    setSelectedEmail(email);
    if (onPersonaChange) onPersonaChange(email);
    setDropdownOpen(false);
    
    if (role === 'COACH' && !pathname.startsWith('/admin')) {
      router.push('/admin/dashboard');
    } else if (role === 'CLIENT' && pathname.startsWith('/admin')) {
      router.push('/client/dashboard');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Mobile Drawer Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-extrabold text-base tracking-tight text-white">
                  <span>FITNESS POLICE</span>
                  <span className="text-[9px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1.5 py-0.2 rounded uppercase font-semibold">SaaS</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Human-in-the-Loop AI Coaching</p>
              </div>
            </Link>
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            {currentPersona.role === 'CLIENT' ? (
              <>
                <Link
                  href="/client/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    pathname === '/client/dashboard' ? 'bg-sky-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/client/food-police"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    pathname === '/client/food-police' ? 'bg-sky-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  Food Police <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-bold">FREE</span>
                </Link>
                <Link
                  href="/client/fitness-police"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    pathname === '/client/fitness-police' ? 'bg-sky-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Dumbbell className="w-4 h-4" />
                  Fitness Police
                </Link>
                <Link
                  href="/client/progress"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    pathname === '/client/progress' ? 'bg-sky-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Progress
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    pathname === '/admin/dashboard' ? 'bg-sky-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Coach Dashboard
                </Link>
                <Link
                  href="/admin/food-police"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    pathname === '/admin/food-police' ? 'bg-sky-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Review Queue
                </Link>
                <Link
                  href="/admin/clients"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    pathname === '/admin/clients' ? 'bg-sky-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Clients Roster
                </Link>
              </>
            )}
          </nav>

          {/* Demo Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 bg-slate-900 border border-slate-700 hover:border-sky-500/50 px-3 py-1.5 rounded-xl transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs border border-sky-500/30 shrink-0">
                {currentPersona.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentPersona.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    currentPersona.tier === 'GOLD' ? 'badge-tier-gold' :
                    currentPersona.tier === 'DIAMOND' ? 'badge-tier-diamond' :
                    currentPersona.tier === 'ADMIN' ? 'bg-purple-400/20 text-purple-300 border border-purple-400/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {currentPersona.tier}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Switch Demo Persona</p>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-[min(288px,calc(100vw-2rem))] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Switch Interactive Demo Role
                </div>
                <div className="mt-1 space-y-1">
                  {DEMO_PERSONAS.map((p) => (
                    <button
                      key={p.email}
                      onClick={() => handleSelectPersona(p.email, p.role)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start gap-2.5 transition-colors ${
                        p.email === selectedEmail ? 'bg-sky-500/10 border border-sky-500/30 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      {p.email === selectedEmail ? (
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {p.name}
                          <span className="text-[9px] text-slate-400 font-normal">({p.role})</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Slide-over Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <Sidebar
            activeEmail={selectedEmail}
            onPersonaChange={(email) => {
              const p = DEMO_PERSONAS.find((item) => item.email === email);
              if (p) handleSelectPersona(email, p.role);
            }}
            onClose={() => setMobileMenuOpen(false)}
          />
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
