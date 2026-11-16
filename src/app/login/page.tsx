import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <AuthLayout
      caption={
        <p className="t-h2 text-[var(--brand-offwhite)] max-w-[16ch]" style={{ color: 'var(--brand-offwhite)' }}>
          Nutrition. Training. Transformation.
        </p>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
