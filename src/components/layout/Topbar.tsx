'use client';

import React, { useState } from 'react';
import { Menu, Bell, Sparkles } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DEMO_PERSONAS } from '../Navbar';

interface TopbarProps {
  title: string;
  subtitle?: string;
  activeEmail: string;
  onPersonaChange: (email: string) => void;
}

export function Topbar({ title, subtitle, activeEmail, onPersonaChange }: TopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentPersona = DEMO_PERSONAS.find((p) => p.email === activeEmail) || DEMO_PERSONAS[0];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full z-50 animate-slide-in-right">
            <Sidebar
              activeEmail={activeEmail}
              onPersonaChange={onPersonaChange}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <header className="h-14 border-b border-white/10 bg-[#131924] flex items-center px-4 sm:px-5 gap-3 sticky top-0 z-20 shrink-0">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400 shrink-0"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-white truncate leading-tight font-display">{title}</h1>
          {subtitle && (
            <p className="text-xs text-slate-400 truncate hidden sm:block leading-tight mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="relative p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400" aria-label="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-sky-400 rounded-full ring-1 ring-slate-950" />
          </button>

          {/* Role Indicator / Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-sky-500/50 px-3 py-1.5 rounded-xl transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse-dot shrink-0" />
              <span className="text-xs font-semibold text-white capitalize">{currentPersona.name}</span>
              <span className="text-[9px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1.5 py-0.2 rounded font-bold uppercase hidden sm:inline-block">
                {currentPersona.tier}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Switch Demo Role
                </div>
                <div className="mt-1 space-y-1">
                  {DEMO_PERSONAS.map((p) => (
                    <button
                      key={p.email}
                      onClick={() => {
                        onPersonaChange(p.email);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        p.email === activeEmail ? 'bg-sky-500/10 border border-sky-500/30 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {p.name}
                          <span className="text-[9px] text-slate-400 font-normal">({p.role})</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.label}</p>
                      </div>
                      {p.email === activeEmail && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
