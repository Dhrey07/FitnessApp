'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorConfig: {
    bg: string;
    border: string;
    number: string;
    icon: string;
    label: string;
  };
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  isLoading?: boolean;
}

export function KPICard({ title, value, icon: Icon, colorConfig, trend, isLoading }: KPICardProps) {
  if (isLoading) {
    return (
      <div className={`rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 ${colorConfig.bg} ${colorConfig.border}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="skeleton w-7 h-7 rounded-lg" />
        </div>
        <div className="skeleton h-6 w-10 rounded mb-1" />
        <div className="skeleton h-3 w-16 rounded" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 hover:shadow-card-hover group cursor-default min-w-0 ${colorConfig.bg} ${colorConfig.border}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${colorConfig.icon}`}>
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        {trend && (
          <span
            className={`text-xs sm:text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap${
              trend.positive ? 'bg-status-approved/15 text-status-approved border border-status-approved/40' : 'bg-status-rejected/15 text-status-rejected border border-status-rejected/40'
            }`}
          >
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <p className={`text-lg sm:text-2xl font-bold tracking-tight mb-0.5 transition-transform duration-200 group-hover:scale-105 origin-left ${colorConfig.number}`}>
        {value}
      </p>
      <p className={`text-xs sm:text-xs font-medium truncate${colorConfig.label}`}>
        {title}
      </p>
      {trend && (
        <p className="text-xs text-ink-muted mt-0.5 truncate">{trend.label}</p>
      )}
    </div>
  );
}
