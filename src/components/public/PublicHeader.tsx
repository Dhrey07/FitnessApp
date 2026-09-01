'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X, Flame } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel px-4 sm:px-8 py-3.5 border-b border-[var(--border-subtle)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-sky-400/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-slate-950 stroke-none" />
          </div>
          <div>
            <span className="font-extrabold text-[var(--text-heading)] text-base tracking-tight block leading-tight">
              FITNESS POLICE
            </span>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
              Coaching & Nutrition
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-[var(--text-secondary)]">
          <a href="#transformation" className="hover:text-sky-400 transition-colors">Transformation</a>
          <a href="#fitness" className="hover:text-sky-400 transition-colors">Fitness</a>
          <a href="#nutrition" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
            Food Police
            <span className="bg-sky-400/20 text-sky-400 text-[9px] px-1.5 py-0.5 rounded font-black">FREE</span>
          </a>
          <a href="#personalisation" className="hover:text-sky-400 transition-colors">Personalisation</a>
          <a href="#tracking" className="hover:text-sky-400 transition-colors">Tracking</a>
          <a href="#coaching" className="hover:text-sky-400 transition-colors">Coaching</a>
          <a href="#results" className="hover:text-sky-400 transition-colors">Results</a>
          <a href="#pricing" className="hover:text-sky-400 transition-colors">Membership</a>
        </nav>

        {/* CTA Actions & Theme Switcher */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle variant="icon" />
          <Link href="/login" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-heading)] px-3 py-2 transition-colors">
            Client Log In
          </Link>
          <Link href="/onboarding" className="btn-brand text-xs">
            Start 14-Day Free Trial <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle variant="icon" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl surface border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-2 text-xs font-semibold animate-fade-in">
          <a
            href="#transformation"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-slate-900/60 hover:text-[var(--text-heading)]"
          >
            Transformation Outcome
          </a>
          <a
            href="#fitness"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-slate-900/60 hover:text-[var(--text-heading)]"
          >
            Fitness Police Training
          </a>
          <a
            href="#nutrition"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-slate-900/60 hover:text-[var(--text-heading)] flex items-center justify-between"
          >
            <span>Food Police Nutrition</span>
            <span className="bg-sky-400/20 text-sky-400 text-[9px] px-1.5 py-0.5 rounded font-black">FREE</span>
          </a>
          <a
            href="#personalisation"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-slate-900/60 hover:text-[var(--text-heading)]"
          >
            Personalisation Engine
          </a>
          <a
            href="#tracking"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-slate-900/60 hover:text-[var(--text-heading)]"
          >
            Progress & Metrics
          </a>
          <a
            href="#coaching"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-slate-900/60 hover:text-[var(--text-heading)]"
          >
            Human Coaching & Reviews
          </a>
          <a
            href="#results"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-slate-900/60 hover:text-[var(--text-heading)]"
          >
            Member Transformations
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-slate-900/60 hover:text-[var(--text-heading)]"
          >
            Coaching Tiers & Plans
          </a>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary text-xs w-full justify-center py-2.5"
            >
              Client Log In
            </Link>
            <Link
              href="/onboarding"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-brand text-xs w-full justify-center py-2.5"
            >
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
