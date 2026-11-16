'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui';

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      leading={<LogOut size={16} aria-hidden />}
      onClick={async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } finally {
          router.push('/login');
        }
      }}
    >
      Sign out
    </Button>
  );
}
