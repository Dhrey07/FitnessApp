'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Flame, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role');

  const [email, setEmail] = useState(defaultRole === 'coach' ? 'coach@fitnesspolice.com' : 'chidi@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to log in');
      }

      router.push(data.redirectTo || '/client/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between p-4 sm:p-8 transition-colors duration-200">
      {/* Top Header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between py-4 border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-sm">
            <Flame size={18} className="fill-slate-950 stroke-none" />
          </div>
          <span className="font-extrabold text-[var(--text-heading)] text-base tracking-tight">FITNESS POLICE</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="icon" />
          <Link href="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)] font-semibold">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Login Card */}
      <div className="max-w-md mx-auto w-full surface p-7 sm:p-9 space-y-6 my-auto border border-[var(--border-subtle)] shadow-xl">
        <div>
          <span className="label-xs text-sky-400">Account Access</span>
          <h1 className="page-title text-2xl mt-1">Sign In to Your Portal</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Access your personalized workouts, free Food Police log, and coaching reviews.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="field-label">Email Address</label>
            <div className="relative">
              <Mail size={15} className="text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="field-input pl-10"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="field-label mb-0">Password</label>
              <span className="text-[10px] text-[var(--text-muted)]">Default: password123</span>
            </div>
            <div className="relative">
              <Lock size={15} className="text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="field-input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-heading)]"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-brand text-xs w-full justify-center py-3 font-extrabold shadow-lg shadow-sky-500/20"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={14} />
          </button>
        </form>

        {/* Quick Testing Accounts */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Quick Fill (Development / Testing Accounts):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setDemoCredentials('chidi@example.com')}
              className="p-2 rounded-lg surface hover:border-sky-400/40 text-left transition-colors"
            >
              <p className="font-bold text-[var(--text-heading)]">Chidi (Client)</p>
              <p className="text-[10px] text-sky-400 font-semibold">Gold Tier Subscriber</p>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('zainab@example.com')}
              className="p-2 rounded-lg surface hover:border-sky-400/40 text-left transition-colors"
            >
              <p className="font-bold text-[var(--text-heading)]">Zainab (Client)</p>
              <p className="text-[10px] text-amber-400 font-semibold">14-Day Trial (Day 5)</p>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('tunde@example.com')}
              className="p-2 rounded-lg surface hover:border-sky-400/40 text-left transition-colors"
            >
              <p className="font-bold text-[var(--text-heading)]">Tunde (Client)</p>
              <p className="text-[10px] text-[var(--text-muted)]">Free Food Police User</p>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('coach@fitnesspolice.com')}
              className="p-2 rounded-lg surface hover:border-purple-400 text-left transition-colors"
            >
              <p className="font-bold text-purple-400">Oga Eric</p>
              <p className="text-[10px] text-purple-400 font-semibold">Head Coach Admin</p>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-[var(--text-muted)] pt-1">
          Don&apos;t have an account yet?{' '}
          <Link href="/onboarding" className="text-sky-400 font-bold hover:underline">
            Start 14-Day Free Trial
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--text-muted)] py-3">
        Fitness Police Secure Authentication Engine
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-heading)] flex items-center justify-center">Loading portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
