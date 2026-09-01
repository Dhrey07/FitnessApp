'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import {
  Users,
  Award,
  Clock,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [attentionQueue, setAttentionQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const aRes = await fetch('/api/admin/analytics');
      const aData = await aRes.json();
      setMetrics(aData.metrics);

      const qRes = await fetch('/api/admin/attention-queue');
      const qData = await qRes.json();
      setAttentionQueue(qData.attentionQueue || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const m = metrics || {
    totalClients: 5,
    activeClients: 5,
    trialUsers: 1,
    paidClients: 3,
    expiredSubscriptions: 0,
    newSignupsThisWeek: 3,
    checkInsDue: 2,
    pendingFoodReviewsCount: 3,
    monthlyRecurringRevenueNgn: 80000,
    tierDistribution: { FREE: 1, SILVER: 1, GOLD: 1, DIAMOND: 1, TRIAL: 1 },
  };

  return (
    <AdminAppShell
      title="Head Coach Operations Console"
      subtitle="Overview of active client transformations, attention queue, and revenue."
    >
      {/* 4-METRIC KPI GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
        
        {/* Total Clients */}
        <div className="surface p-5 space-y-1 border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="label-xs text-[var(--text-muted)]">Total Clients</span>
            <Users size={15} className="text-[var(--text-muted)]" />
          </div>
          <p className="text-2xl font-black text-[var(--text-heading)]">{m.totalClients}</p>
          <p className="text-[10px] text-[var(--text-muted)]">Enrolled athletes</p>
        </div>

        {/* Active Subscriptions / Paid */}
        <div className="surface p-5 space-y-1 border border-purple-500/40">
          <div className="flex items-center justify-between">
            <span className="label-xs text-purple-400">Paid Subscribers</span>
            <Award size={15} className="text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400">{m.paidClients}</p>
          <p className="text-[10px] text-[var(--text-muted)]">Silver, Gold & Diamond</p>
        </div>

        {/* 14-Day Trial Users */}
        <div className="surface p-5 space-y-1 border border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="label-xs text-amber-400">Trial Users</span>
            <Clock size={15} className="text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{m.trialUsers}</p>
          <p className="text-[10px] text-[var(--text-muted)]">14-Day Free Access</p>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="surface p-5 space-y-1 border border-sky-400/40">
          <div className="flex items-center justify-between">
            <span className="label-xs text-sky-400">Monthly Revenue</span>
            <DollarSign size={15} className="text-sky-400" />
          </div>
          <p className="text-2xl font-black text-sky-400">₦{m.monthlyRecurringRevenueNgn.toLocaleString()}</p>
          <p className="text-[10px] text-[var(--text-muted)]">MRR (Nigeria & Global)</p>
        </div>

      </div>

      {/* SECONDARY ACTION STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        
        <Link href="/admin/check-ins" className="surface p-5 flex items-center justify-between border-l-4 border-l-cyan-500 hover:border-[var(--border-active)] transition-all">
          <div className="space-y-1">
            <span className="label-xs text-cyan-400">Action Required</span>
            <h3 className="font-bold text-[var(--text-heading)] text-sm">Sunday Check-Ins Due</h3>
            <p className="text-xs text-[var(--text-muted)]">{m.checkInsDue} Pending Coach Reviews</p>
          </div>
          <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
            {m.checkInsDue}
          </span>
        </Link>

        <Link href="/admin/food-police" className="surface p-5 flex items-center justify-between border-l-4 border-l-emerald-500 hover:border-[var(--border-active)] transition-all">
          <div className="space-y-1">
            <span className="label-xs text-emerald-400">Action Required</span>
            <h3 className="font-bold text-[var(--text-heading)] text-sm">Food Police Queue</h3>
            <p className="text-xs text-[var(--text-muted)]">{m.pendingFoodReviewsCount} Meals Awaiting Signoff</p>
          </div>
          <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
            {m.pendingFoodReviewsCount}
          </span>
        </Link>

        <Link href="/admin/clients" className="surface p-5 flex items-center justify-between border-l-4 border-l-purple-500 hover:border-[var(--border-active)] transition-all">
          <div className="space-y-1">
            <span className="label-xs text-purple-400">Growth</span>
            <h3 className="font-bold text-[var(--text-heading)] text-sm">New Signups This Week</h3>
            <p className="text-xs text-[var(--text-muted)]">{m.newSignupsThisWeek} Clients Onboarded</p>
          </div>
          <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
            +{m.newSignupsThisWeek}
          </span>
        </Link>

      </div>

      {/* CLIENT ATTENTION QUEUE */}
      <div className="surface p-6 sm:p-7 space-y-4 border border-[var(--border-subtle)] w-full">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h3 className="section-title text-base flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" /> Client Attention & Intervention Queue
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Clients flagged for low compliance, missed check-ins, or trial ending within 48 hours.
            </p>
          </div>
          <Link href="/admin/clients" className="text-xs text-purple-400 font-bold hover:underline">
            View All Clients →
          </Link>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {attentionQueue.length > 0 ? (
            attentionQueue.map((item) => (
              <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900/80 text-white font-bold flex items-center justify-center border border-[var(--border-subtle)]">
                    {item.clientName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text-heading)] text-sm">{item.clientName}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{item.clientEmail} • {item.planTier} Tier</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`badge text-[10px] ${
                    item.urgency === 'HIGH' ? 'badge-pending' : 'bg-slate-900/60 text-slate-300'
                  }`}>
                    {item.reason}
                  </span>

                  <Link
                    href={`/admin/clients/${item.id}`}
                    className="btn-secondary text-[11px] py-1.5 px-3"
                  >
                    Open 360° File <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-[var(--text-muted)] space-y-1">
              <CheckCircle2 size={24} className="mx-auto text-sky-400" />
              <p>Attention queue clear! All client check-ins and meal logs are up to date.</p>
            </div>
          )}
        </div>
      </div>
    </AdminAppShell>
  );
}
