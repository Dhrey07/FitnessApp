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
            <option value="FREE">Starter (free)</option>
            <option value="SILVER">Silver Tier (₦15k)</option>
            <option value="GOLD">Gold Tier (₦25k)</option>
            <option value="DIAMOND">Diamond VIP (₦40k)</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="surface overflow-x-auto border border-[var(--border-subtle)]">
        <table className="w-full text-left text-xs">
          <thead className="bg-paper text-[var(--text-muted)] border-b border-[var(--border-subtle)] text-xs uppercase tracking-wider font-bold">
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
                <tr key={client.id} className="hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand font-bold flex items-center justify-center border border-line-active">
                        {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--text-heading)] text-sm">{client.firstName} {client.lastName}</p>
                        <p className="text-xs text-[var(--text-muted)]">{client.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[var(--text-heading)] uppercase text-xs">{profile?.primaryGoal?.replace('_', ' ') || 'Fat Loss'}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {profile?.weightKg || 80} kg • {profile?.waistCm || 85} cm waist
                      </p>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <span className={`badge text-xs${
                        isTrial ? 'badge-trial' :
                        sub.planTier === 'GOLD' ? 'badge-tier-gold' :
                        sub.planTier === 'DIAMOND' ? 'badge-tier-diamond' :
                        'bg-paper text-ink-secondary'
                      }`}>
                        {isTrial ? '14-Day Free Trial' : `${sub.planTier} Tier`}
                      </span>
                      <p className="text-xs text-[var(--text-muted)]">{sub.status}</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="badge badge-approved text-xs">
                      {client.weeklyCheckIns?.length || 0} Check-Ins Logged
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/2348012345678?text=${encodeURIComponent(
                          `Hello ${client.firstName}, Coach Eric here, checking in on your progress.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-status-approved/15 text-status-approved hover:bg-status-approved/25 transition-colors"
                        title="WhatsApp Client"
                      >
                        <MessageCircle size={15} />
                      </a>
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        Open profile <ArrowRight size={12} />
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
