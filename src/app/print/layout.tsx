import React, { Suspense } from 'react';
import { AutoPrint } from '@/components/print/PrintChrome';

// Documents are always light and self-contained; the theme toggle does not apply here.
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-light print-root min-h-screen print:min-h-0">
      <Suspense fallback={null}>
        <AutoPrint />
      </Suspense>
      {children}
    </div>
  );
}
