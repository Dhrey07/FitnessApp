import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

/** The signed-in user's latest notifications. */
export async function GET() {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const notifications = await prisma.notification.findMany({
    where: { userId: me.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
  return NextResponse.json({ notifications, unread: notifications.filter((n) => !n.read).length });
}

/** Mark all as read, or one when `id` is sent. */
export async function POST(request: Request) {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const id = typeof body.id === 'string' ? body.id : null;
  await prisma.notification.updateMany({
    where: { userId: me.id, read: false, ...(id ? { id } : {}) },
    data: { read: true },
  });
  return NextResponse.json({ ok: true });
}
