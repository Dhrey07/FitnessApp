'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AppLayoutShellProps {
  title: string;
  subtitle?: string;
  activeEmail: string;
  onPersonaChange: (email: string) => void;
  children: React.ReactNode;
}

export function AppLayoutShell({
  title,
  subtitle,
  activeEmail,
  onPersonaChange,
  children,
}: AppLayoutShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0f17] text-white">
      {/* Desktop Sidebar (248px) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar activeEmail={activeEmail} onPersonaChange={onPersonaChange} />
      </div>

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          title={title}
          subtitle={subtitle}
          activeEmail={activeEmail}
          onPersonaChange={onPersonaChange}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-7 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
