'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import {
  Users,
  Search,
  Filter,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, [search, tierFilter]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/clients?search=${encodeURIComponent(search)}`;
      if (tierFilter) url += `&tier=${encodeURIComponent(tierFilter)}`;

      const res = await fetch(url);
      const data = await res.json();
      setClients(data.clients || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAppShell
      title="Client Transformations Roster"
      subtitle="Complete database of enrolled athletes, trial users, and active coaching subscribers."
    >
      {/* Search & Filter Toolbar */}
      <div className="surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[var(--border-subtle)]">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email..."
            className="field-input pl-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[var(--text-muted)] shrink-0" />
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="field-input text-xs py-2 w-auto"
          >
            <option value="">All Tiers & Statuses</option>
            <option value="FREE">Free Food Police Only</option>
            <option value="SILVER">Silver Tier (₦15k)</option>
            <option value="GOLD">Gold Tier (₦25k)</option>
            <option value="DIAMOND">Diamond VIP (₦40k)</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="surface overflow-x-auto border border-[var(--border-subtle)]">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/60 dark:bg-slate-900 light:bg-slate-100 text-[var(--text-muted)] border-b border-[var(--border-subtle)] text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="p-4">Client</th>
              <th className="p-4">Goal & Metrics</th>
              <th className="p-4">Membership Tier</th>
              <th className="p-4">Check-In Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {clients.map((client) => {
              const profile = client.profile;
              const sub = client.subscriptions?.[0] || { planTier: 'FREE', status: 'ACTIVE' };
              const isTrial = sub.isTrial;

              return (
                <tr key={client.id} className="hover:bg-slate-900/40 dark:hover:bg-slate-900/40 light:hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center border border-purple-500/30">
                        {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--text-heading)] text-sm">{client.firstName} {client.lastName}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{client.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[var(--text-heading)] uppercase text-[11px]">{profile?.primaryGoal?.replace('_', ' ') || 'Fat Loss'}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {profile?.weightKg || 80} kg • {profile?.waistCm || 85} cm waist
                      </p>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <span className={`badge text-[10px] ${
                        isTrial ? 'badge-trial' :
                        sub.planTier === 'GOLD' ? 'badge-tier-gold' :
                        sub.planTier === 'DIAMOND' ? 'badge-tier-diamond' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {isTrial ? '14-Day Free Trial' : `${sub.planTier} Tier`}
                      </span>
                      <p className="text-[10px] text-[var(--text-muted)]">{sub.status}</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="badge badge-approved text-[10px]">
                      {client.weeklyCheckIns?.length || 0} Check-Ins Logged
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/2348012345678?text=${encodeURIComponent(
                          `Hello ${client.firstName}, Coach Lekan here checking in on your Fitness Police progress.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        title="WhatsApp Client"
                      >
                        <MessageCircle size={15} />
                      </a>
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="btn-secondary text-[11px] py-1.5 px-3"
                      >
                        Open 360° File <ArrowRight size={12} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminAppShell>
  );
}
