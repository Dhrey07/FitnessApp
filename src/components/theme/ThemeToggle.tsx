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
        className={`p-2 rounded-xl bg-slate-900/60 dark:bg-slate-900 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-sky-400 dark:hover:text-sky-400 light:hover:text-sky-600 transition-colors ${className}`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon size={16} className="text-sky-400" />
        ) : (
          <Sun size={16} className="text-amber-500" />
        )}
      </button>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-1.5 bg-slate-900/80 dark:bg-slate-900 light:bg-slate-100 p-1 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-300 text-xs ${className}`}>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
            theme === 'light'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-800'
          }`}
        >
          <Sun size={13} /> Light
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
            theme === 'dark'
              ? 'bg-sky-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-800'
          }`}
        >
          <Moon size={13} /> Dark
        </button>
        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
            theme === 'system'
              ? 'bg-slate-800 text-white light:bg-slate-300 light:text-slate-900 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-800'
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 dark:bg-slate-900 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-300 text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700"
      >
        {resolvedTheme === 'dark' ? <Moon size={14} className="text-sky-400" /> : <Sun size={14} className="text-amber-500" />}
        <span className="capitalize">{theme}</span>
        <ChevronDown size={13} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 py-1 bg-slate-900 dark:bg-slate-900 light:bg-white rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl z-50 text-xs space-y-0.5">
          <button
            type="button"
            onClick={() => { setTheme('light'); setDropdownOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 ${
              theme === 'light' ? 'text-sky-400 font-bold' : 'text-slate-300 light:text-slate-700'
            }`}
          >
            <Sun size={14} /> Light
          </button>
          <button
            type="button"
            onClick={() => { setTheme('dark'); setDropdownOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 ${
              theme === 'dark' ? 'text-sky-400 font-bold' : 'text-slate-300 light:text-slate-700'
            }`}
          >
            <Moon size={14} /> Dark
          </button>
          <button
            type="button"
            onClick={() => { setTheme('system'); setDropdownOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 ${
              theme === 'system' ? 'text-sky-400 font-bold' : 'text-slate-300 light:text-slate-700'
            }`}
          >
            <Monitor size={14} /> System
          </button>
        </div>
      )}
    </div>
  );
}
