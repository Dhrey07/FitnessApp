'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { BRAND } from '@/lib/brand';

/** Demo accounts appear only when explicitly enabled for local development. */
const SHOW_DEMO = process.env.NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS === 'true';

const DEMO = [
  { email: 'chidi@example.com', name: 'Chidi Okonkwo', detail: 'Client · Signature' },
  { email: 'aminat@example.com', name: 'Aminat Bello', detail: 'Client · Private Coaching' },
  { email: 'zainab@example.com', name: 'Zainab Dahiru', detail: 'Client · trial' },
  { email: 'tunde@example.com', name: 'Tunde Johnson', detail: 'Client · Starter' },
  { email: 'coach@ericonet.fit', name: BRAND.coachName, detail: 'Coach' },
];

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const asCoach = params.get('role') === 'coach';

  const [email, setEmail] = useState(SHOW_DEMO ? (asCoach ? 'coach@ericonet.fit' : 'chidi@example.com') : '');
  const [password, setPassword] = useState(SHOW_DEMO ? 'password123' : '');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'That email and password do not match.');
      router.push(data.redirectTo || '/client/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'That email and password do not match.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex-1 md:flex-none flex flex-col pt-6 md:pt-0" noValidate>
      <div className="space-y-2">
        <h1 className="t-h1">Sign in</h1>
        <p className="t-body-sm">Your programme, nutrition log and coach feedback.</p>
      </div>

      <div className="mt-8 space-y-5">
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" enterKeyHint="next" required />
        </Field>
        <Field label="Password" error={error || undefined}>
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            enterKeyHint="go"
            required
          />
        </Field>
        <button type="button" onClick={() => setShow((s) => !s)} className="focus-ring -mt-2 inline-flex items-center gap-1.5 h-10 t-caption hover:text-ink">
          {show ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
          {show ? 'Hide password' : 'Show password'}
        </button>
      </div>

      {/* Pinned to the bottom on mobile so it stays above the keyboard */}
      <div className="sticky bottom-0 -mx-4 px-4 pt-4 pb-4 mt-auto md:mt-8 md:static md:mx-0 md:px-0 md:pb-0 bg-paper safe-pb space-y-4">
        <Button type="submit" size="lg" full loading={loading}>
          Sign in
        </Button>
        <p className="t-body-sm text-center md:text-left">
          New here?{' '}
          <Link href="/onboarding" className="text-brand font-medium hover:underline">
            Start your assessment
          </Link>
        </p>
      </div>

      {SHOW_DEMO && (
        <section className="mt-8 hairline pt-6" aria-label="Demo accounts">
          <p className="t-ui">Demo accounts</p>
          <p className="t-caption mt-1">Local development only. Password is the seed default.</p>
          <ListRows className="mt-2">
            {DEMO.map((d) => (
              <ListRow
                key={d.email}
                title={d.name}
                subtitle={d.detail}
                onClick={() => {
                  setEmail(d.email);
                  setPassword('password123');
                  setError('');
                }}
                trailing={email === d.email ? <span className="text-brand text-xs font-medium">Selected</span> : undefined}
                chevron={false}
              />
            ))}
          </ListRows>
        </section>
      )}
    </form>
  );
}
