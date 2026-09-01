'use client';

import React from 'react';
import Link from 'next/link';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { BookOpen, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Utensils, Dumbbell, Clock } from 'lucide-react';

export default function ResourcesClientPage() {
  const articles = [
    {
      id: '1',
      title: 'Macro Counting & African Staples Guide',
      category: 'NUTRITION',
      readTime: '6 min read',
      summary: 'How to accurately portion Jollof rice, Pounded Yam, Plantain, and Egusi soup without giving up traditional cultural foods.',
      isFree: true,
    },
    {
      id: '2',
      title: 'Progressive Overload 101: RPE vs Percentage Loading',
      category: 'TRAINING',
      readTime: '8 min read',
      summary: 'Understand mechanical tension, rate of perceived exertion, and how to safely increase weight without risking joint injury.',
      isFree: true,
    },
    {
      id: '3',
      title: 'Sleep, Cortisol & Fat Loss Plateau Management',
      category: 'RECOVERY',
      readTime: '5 min read',
      summary: 'Why sleeping less than 6 hours spikes cortisol and holds water retention, masking physical fat loss progress on the scale.',
      isFree: false,
    },
    {
      id: '4',
      title: 'Post-Workout Protein Timing & Glycogen Replenishment',
      category: 'NUTRITION',
      readTime: '7 min read',
      summary: 'Optimal protein dosage per meal and carb timing for maximum muscle protein synthesis following heavy leg and chest sessions.',
      isFree: false,
    },
  ];

  return (
    <ClientAppShell
      title="Educational Resources & Science Guides"
      subtitle="Evidence-based guides written by Oga Eric to help you master your training, nutrition, and recovery."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {articles.map((art) => (
          <div key={art.id} className="surface p-6 space-y-4 border border-[var(--border-subtle)] surface-hover">
            <div className="flex items-center justify-between">
              <span className="label-xs text-sky-400">{art.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                  <Clock size={12} /> {art.readTime}
                </span>
                <span className={`badge text-[9px] ${art.isFree ? 'badge-approved' : 'badge-trial'}`}>
                  {art.isFree ? 'FREE ACCESS' : 'PREMIUM'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[var(--text-heading)] leading-snug">{art.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{art.summary}</p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-[11px] text-sky-400 font-bold flex items-center gap-1">
                <ShieldCheck size={13} /> Written by Oga Eric
              </span>
              <button
                type="button"
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Read Guide →
              </button>
            </div>
          </div>
        ))}
      </div>
    </ClientAppShell>
  );
}
