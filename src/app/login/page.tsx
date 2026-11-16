import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from './LoginForm';
import { Skeleton } from '@/components/ui/Skeleton';

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
      {/* Server-rendered so the first paint has the heading, not a blank column. */}
      <div className="space-y-2 pt-6 md:pt-0">
        <h1 className="t-h1">Sign in</h1>
        <p className="t-body-sm">Your programme, nutrition log and coach feedback.</p>
      </div>
      <Suspense fallback={<FormSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}

/** Same footprint as the form, so nothing shifts when it hydrates. */
function FormSkeleton() {
  return (
    <div className="mt-8 space-y-5" aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-14 w-full rounded-full mt-4" />
    </div>
  );
}
