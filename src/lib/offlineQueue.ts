'use client';

/**
 * A tiny IndexedDB queue for the two writes clients make on the move:
 * meal logs and set logs. When a POST fails because the phone is offline,
 * the request is stored with the time it happened and replayed on
 * reconnect. Nothing else is queued.
 */

const DB_NAME = 'ericonet-offline';
const STORE = 'queue';
export const QUEUE_EVENT = 'ericonet:queue-changed';

export type QueueKind = 'meal' | 'workout';

export interface QueuedRequest {
  id: string;
  kind: QueueKind;
  url: string;
  body: Record<string, unknown>;
  createdAt: string;
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const r = fn(t.objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    t.oncomplete = () => db.close();
  });
}

const notify = () => window.dispatchEvent(new Event(QUEUE_EVENT));

export async function listQueued(): Promise<QueuedRequest[]> {
  if (typeof indexedDB === 'undefined') return [];
  try {
    const all = await tx<QueuedRequest[]>('readonly', (s) => s.getAll() as IDBRequest<QueuedRequest[]>);
    return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } catch {
    return [];
  }
}

async function enqueue(item: QueuedRequest) {
  await tx('readwrite', (s) => s.put(item));
  notify();
}

async function remove(id: string) {
  await tx('readwrite', (s) => s.delete(id));
  notify();
}

export type SendResult = { status: 'sent'; data: unknown } | { status: 'queued' } | { status: 'error'; message: string };

/**
 * POST JSON. On a network failure (or when the browser reports offline) the
 * request is queued and 'queued' is returned. Server errors are returned as
 * errors and not queued, since replaying them would fail again.
 */
export async function sendOrQueue(kind: QueueKind, url: string, body: Record<string, unknown>): Promise<SendResult> {
  const createdAt = new Date().toISOString();
  const stamped = kind === 'meal' ? { ...body, loggedAt: createdAt } : { ...body, completedAt: createdAt };
  const queue = async (): Promise<SendResult> => {
    await enqueue({ id: crypto.randomUUID(), kind, url, body: stamped, createdAt });
    return { status: 'queued' };
  };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return queue();
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stamped) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { status: 'error', message: (data as { error?: string }).error || 'Something went wrong.' };
    return { status: 'sent', data };
  } catch {
    return queue();
  }
}

/** Replay queued requests in order. Returns how many were sent. */
export async function flushQueue(): Promise<number> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 0;
  const items = await listQueued();
  let sent = 0;
  for (const item of items) {
    try {
      const res = await fetch(item.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item.body) });
      if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 401 && res.status !== 408 && res.status !== 429)) {
        // Sent, or permanently rejected: either way it leaves the queue.
        await remove(item.id);
        if (res.ok) sent++;
      } else {
        break;
      }
    } catch {
      break;
    }
  }
  return sent;
}
