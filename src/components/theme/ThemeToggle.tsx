'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown' | 'buttons';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={`Current: ${resolvedTheme} mode. Click to toggle.`}
        className={`p-2 rounded-xl bg-paper border border-line text-ink-secondary hover:text-brand transition-colors${className}`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon size={16} className="text-brand" />
        ) : (
          <Sun size={16} className="text-status-pending" />
        )}
      </button>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-1.5 bg-paper p-1 rounded-xl border border-line text-xs${className}`}>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
            theme === 'light'
              ? 'bg-brand-strong text-brand-on-strong shadow-sm'
              : 'text-ink-muted hover:text-ink hover:text-ink'
          }`}
        >
          <Sun size={13} /> Light
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
            theme === 'dark'
              ? 'bg-brand-strong text-brand-on-strong shadow-sm'
              : 'text-ink-muted hover:text-ink hover:text-ink'
          }`}
        >
          <Moon size={13} /> Dark
        </button>
        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
            theme === 'system'
              ? 'bg-paper text-[var(--text-heading)] bg-paper text-ink-secondary shadow-sm'
              : 'text-ink-muted hover:text-ink hover:text-ink'
          }`}
        >
          <Monitor size={13} /> System
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-paper border border-line text-xs font-semibold text-ink-secondary"
      >
        {resolvedTheme === 'dark' ? <Moon size={14} className="text-brand" /> : <Sun size={14} className="text-status-pending" />}
        <span className="capitalize">{theme}</span>
        <ChevronDown size={13} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 py-1 bg-paper rounded-xl border border-line shadow-xl z-50 text-xs space-y-0.5">
          <button
            type="button"
            onClick={() => { setTheme('light'); setDropdownOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-card-hover)] ${
              theme === 'light' ? 'text-brand font-bold' : 'text-ink-secondary'
            }`}
          >
            <Sun size={14} /> Light
          </button>
          <button
            type="button"
            onClick={() => { setTheme('dark'); setDropdownOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-card-hover)] ${
              theme === 'dark' ? 'text-brand font-bold' : 'text-ink-secondary'
            }`}
          >
            <Moon size={14} /> Dark
          </button>
          <button
            type="button"
            onClick={() => { setTheme('system'); setDropdownOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-card-hover)] ${
              theme === 'system' ? 'text-brand font-bold' : 'text-ink-secondary'
            }`}
          >
            <Monitor size={14} /> System
          </button>
        </div>
      )}
    </div>
  );
}
