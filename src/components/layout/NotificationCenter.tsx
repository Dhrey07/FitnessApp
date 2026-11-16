'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Button, IconButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListRow, ListRows } from '@/components/ui/ListRow';
import { Sheet } from '@/components/ui/Sheet';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

function ago(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 60) return mins <= 1 ? 'just now' : `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

/** Bell with an unread dot; opens a sheet of the user's real notifications. */
export function NotificationCenter() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications);
      setUnread(data.unread);
    } catch {
      /* offline: keep what we have */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markAll = async () => {
    setUnread(0);
    setItems((xs) => xs?.map((n) => ({ ...n, read: true })) ?? xs);
    await fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(() => undefined);
  };

  const openItem = async (n: NotificationItem) => {
    if (!n.read) {
      setUnread((u) => Math.max(0, u - 1));
      setItems((xs) => xs?.map((x) => (x.id === n.id ? { ...x, read: true } : x)) ?? xs);
      fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id }) }).catch(() => undefined);
    }
    if (n.link) {
      setOpen(false);
      router.push(n.link);
    }
  };

  return (
    <>
      <span className="relative inline-flex">
        <IconButton label={unread ? `Notifications, ${unread} unread` : 'Notifications'} onClick={() => setOpen(true)}>
          <Bell size={20} />
        </IconButton>
        {unread > 0 && <span aria-hidden className="pointer-events-none absolute top-2 right-2 h-2 w-2 rounded-full bg-brand ring-2 ring-[var(--bg-primary)]" />}
      </span>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Notifications"
        footer={unread > 0 ? <Button variant="secondary" full onClick={markAll}>Mark all as read</Button> : undefined}
      >
        {items === null ? (
          <p className="t-body-sm py-6">Loading…</p>
        ) : items.length === 0 ? (
          <EmptyState message="Feedback from your coach, new plans and reports will show up here." />
        ) : (
          <ListRows>
            {items.map((n) => (
              <ListRow
                key={n.id}
                onClick={() => openItem(n)}
                chevron={Boolean(n.link)}
                leading={<span aria-hidden className={`h-2 w-2 rounded-full ${n.read ? 'bg-transparent' : 'bg-brand'}`} />}
                title={<span className={n.read ? 'text-ink-secondary' : ''}>{n.title}</span>}
                subtitle={`${n.message} · ${ago(n.createdAt)}`}
              />
            ))}
          </ListRows>
        )}
      </Sheet>
    </>
  );
}
