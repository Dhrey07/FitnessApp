'use client';

import React, { useMemo, useState, ViewTransition } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, SelectField } from '@/components/ui/Field';
import { Pill } from '@/components/ui/Pill';
import { Sparkline } from '@/components/ui/Sparkline';
import { Table } from '@/components/ui/Table';
import type { ClientSummary } from '@/lib/coach/data';

const GOAL: Record<string, string> = {
  FAT_LOSS: 'Fat loss',
  BODY_RECOMPOSITION: 'Recomposition',
  MUSCLE_GAIN: 'Muscle gain',
  STRENGTH_PERFORMANCE: 'Strength',
  GENERAL_HEALTH: 'General health',
  HEALTHY_WEIGHT_GAIN: 'Weight gain',
};

function rel(d: string | null) {
  if (!d) return 'none yet';
  const n = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (n <= 0) return 'today';
  if (n === 1) return 'yesterday';
  if (n < 7) return `${n} days ago`;
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function ClientsTable({ clients }: { clients: ClientSummary[] }) {
  const [q, setQ] = useState('');
  const [tier, setTier] = useState('');

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return clients.filter((c) => (!needle || c.name.toLowerCase().includes(needle) || c.email.toLowerCase().includes(needle)) && (!tier || (tier === 'TRIAL' ? c.isTrial : c.tier === tier && !c.isTrial)));
  }, [clients, q, tier]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <Field label="Search" leading={<Search size={16} aria-hidden />}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or email" inputMode="search" enterKeyHint="search" autoComplete="off" />
        </Field>
        <SelectField label="Plan" value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="">All plans</option>
          <option value="TRIAL">On trial</option>
          <option value="FREE">Starter</option>
          <option value="SILVER">Essential</option>
          <option value="GOLD">Signature</option>
          <option value="DIAMOND">Private Coaching</option>
        </SelectField>
      </div>

      <Table<ClientSummary>
        rows={rows}
        rowKey={(c) => c.id}
        empty={<EmptyState message={q || tier ? 'No clients match that search.' : 'Clients appear here when they finish the assessment.'} />}
        columns={[
          {
            key: 'name',
            header: 'Client',
            cell: (c) => (
              <Link href={`/admin/clients/${c.id}`} className="flex items-center gap-3 font-medium hover:text-brand">
                <ViewTransition name={`client-avatar-${c.id}`} share="morph" default="none">
                  <Avatar name={c.name} size="sm" src={c.avatarUrl} />
                </ViewTransition>
                <span className="min-w-0">
                  <span className="block truncate">{c.name}</span>
                  <span className="block t-caption truncate">{c.goal ? GOAL[c.goal] ?? c.goal : c.email}</span>
                </span>
              </Link>
            ),
          },
          { key: 'plan', header: 'Plan', cell: (c) => <span className="text-ink-secondary">{c.plan}</span> },
          {
            key: 'checkin',
            header: 'Last check-in',
            cell: (c) => (
              <span className="flex items-center gap-2 text-ink-secondary">
                {rel(c.lastCheckIn)}
                {c.pendingCheckIn && <Pill tone="pending">To review</Pill>}
              </span>
            ),
          },
          { key: 'weight', header: 'Weight', align: 'right', cell: (c) => (c.weightKg != null ? `${c.weightKg} kg` : '–') },
          { key: 'trend', header: '8 weeks', align: 'right', width: '96px', cell: (c) => (c.weights.length > 1 ? <Sparkline data={c.weights} width={72} height={20} className="ml-auto" /> : <span className="t-caption">–</span>) },
        ]}
        mobile={(c) => ({
          href: `/admin/clients/${c.id}`,
          leading: (
            <ViewTransition name={`client-avatar-m-${c.id}`} share="morph" default="none">
              <Avatar name={c.name} size="sm" src={c.avatarUrl} />
            </ViewTransition>
          ),
          title: c.name,
          subtitle: `${c.plan} · check-in ${rel(c.lastCheckIn)}${c.weightKg != null ? ` · ${c.weightKg} kg` : ''}`,
          trailing: c.pendingCheckIn ? <Pill tone="pending">To review</Pill> : c.weights.length > 1 ? <Sparkline data={c.weights} width={48} height={16} /> : undefined,
        })}
      />
    </div>
  );
}
