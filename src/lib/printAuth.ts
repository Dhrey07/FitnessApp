import { getSessionUser } from '@/lib/auth';

/** A document may be viewed by the client it belongs to or by any coach/admin. */
export async function canViewClientDocument(ownerUserId: string) {
  const me = await getSessionUser();
  if (!me) return { ok: false as const, me: null };
  const ok = me.id === ownerUserId || me.role === 'COACH' || me.role === 'ADMIN';
  return { ok, me };
}

export async function isCoach() {
  const me = await getSessionUser();
  return me && (me.role === 'COACH' || me.role === 'ADMIN') ? me : null;
}
