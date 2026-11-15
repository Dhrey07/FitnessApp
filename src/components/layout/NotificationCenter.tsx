'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Sparkles, ShieldCheck, Dumbbell, Clock, X } from 'lucide-react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'COACH' | 'WORKOUT' | 'TRIAL' | 'NUTRITION';
  timestamp: string;
  read: boolean;
  link?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Coach Eric reviewed your log',
      message: 'Great pacing on your push workout! Keep plantain to 4 slices maximum post-workout.',
      category: 'COACH',
      timestamp: '2 hours ago',
      read: false,
      link: '/client/check-in',
    },
    {
      id: '2',
      title: 'Today’s Workout Focus Ready',
      message: 'Upper Body Hypertrophy & Fat Burn session is ready to log.',
      category: 'WORKOUT',
      timestamp: '5 hours ago',
      read: false,
      link: '/client/training',
    },
    {
      id: '3',
      title: 'Trial Access Milestone',
      message: 'You are on Day 4 of your 14-day free trial. All features unlocked.',
      category: 'TRIAL',
      timestamp: '1 day ago',
      read: true,
      link: '/client/profile#membership',
    },
    {
      id: '4',
      title: 'Meal Log Approved',
      message: 'Your Jollof Rice & Grilled Chicken Lunch has been verified by Coach Eric.',
      category: 'NUTRITION',
      timestamp: '2 days ago',
      read: true,
      link: '/client/nutrition',
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'COACH':
        return <ShieldCheck size={14} className="text-brand" />;
      case 'WORKOUT':
        return <Dumbbell size={14} className="text-brand" />;
      case 'TRIAL':
        return <Sparkles size={14} className="text-status-pending" />;
      case 'NUTRITION':
        return <Check size={14} className="text-status-approved" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        className="relative p-2 rounded-xl bg-paper border border-line text-ink-secondary hover:text-[var(--text-heading)] transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-strong text-brand-on-strong text-xs font-black flex items-center justify-center animate-pulse-shimmer">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-paper rounded-2xl border border-line shadow-2xl z-50 overflow-hidden text-xs">
          
          {/* Panel Header */}
          <div className="p-3.5 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--text-heading)] text-ink-secondary">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-brand-soft text-brand px-2 py-0.5 rounded-full text-xs font-extrabold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-brand hover:underline flex items-center gap-1 font-semibold"
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-ink-muted hover:text-[var(--text-heading)]"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)] divide-[var(--border-subtle)] divide-[var(--border-subtle)]">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    !n.read
                      ? 'bg-brand-soft bg-brand-soft bg-brand-soft'
                      : 'hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)]'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-paper shrink-0">
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className={`text-xs font-bold ${!n.read ? 'text-brand' : 'text-[var(--text-heading)] text-[var(--text-heading)] text-ink-secondary'}`}>
                        {n.title}
                      </h4>
                      <span className="text-xs text-ink-muted shrink-0">{n.timestamp}</span>
                    </div>

                    <p className="text-xs text-ink-secondary text-ink-muted leading-snug">
                      {n.message}
                    </p>

                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-xs font-bold text-brand hover:underline mt-1"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-ink-muted space-y-1">
                <Bell size={24} className="mx-auto text-ink-muted" />
                <p className="text-xs font-medium">You&apos;re all caught up!</p>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-2.5 bg-black/60 bg-paper border-t border-line text-center">
            <span className="text-xs text-ink-muted">Notifications</span>
          </div>
        </div>
      )}
    </div>
  );
}
