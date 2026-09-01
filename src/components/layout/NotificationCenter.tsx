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
      title: 'Coach Lekan Reviewed Your Log',
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
      link: '/client/fitness-police',
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
      message: 'Your Jollof Rice & Grilled Chicken Lunch has been verified by Coach Lekan.',
      category: 'NUTRITION',
      timestamp: '2 days ago',
      read: true,
      link: '/client/food-police',
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
        return <ShieldCheck size={14} className="text-sky-400" />;
      case 'WORKOUT':
        return <Dumbbell size={14} className="text-cyan-400" />;
      case 'TRIAL':
        return <Sparkles size={14} className="text-amber-400" />;
      case 'NUTRITION':
        return <Check size={14} className="text-emerald-400" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        className="relative p-2 rounded-xl bg-slate-900/60 dark:bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-400 text-slate-950 text-[9px] font-black flex items-center justify-center animate-pulse-shimmer">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 dark:bg-slate-900 light:bg-white rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl z-50 overflow-hidden text-xs">
          
          {/* Panel Header */}
          <div className="p-3.5 border-b border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white dark:text-white light:text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-sky-400/20 text-sky-400 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5 dark:divide-white/5 light:divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    !n.read
                      ? 'bg-sky-500/5 dark:bg-sky-500/10 light:bg-sky-50/60'
                      : 'hover:bg-slate-800/40 dark:hover:bg-slate-800/40 light:hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-950 dark:bg-slate-950 light:bg-slate-100 shrink-0">
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className={`text-xs font-bold ${!n.read ? 'text-sky-400' : 'text-white dark:text-white light:text-slate-800'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{n.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-600 leading-snug">
                      {n.message}
                    </p>

                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-[10px] font-bold text-sky-400 hover:underline mt-1"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-1">
                <Bell size={24} className="mx-auto text-slate-600" />
                <p className="text-xs font-medium">You&apos;re all caught up!</p>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-2.5 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border-t border-white/10 dark:border-white/10 light:border-slate-200 text-center">
            <span className="text-[10px] text-slate-400">Fitness Police Notification Center</span>
          </div>
        </div>
      )}
    </div>
  );
}
