import { cookies } from 'next/headers';
import { prisma } from './db';

export const SESSION_COOKIE_NAME = 'fp_session_email';

/**
 * Retrieves the currently authenticated user from session cookie.
 */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!email) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Failed to get session user:', error);
    return null;
  }
}

export function isCoachRole(role: string | null | undefined) {
  return role === 'COACH' || role === 'ADMIN';
}

/**
 * Resolves which user an API request acts on. Clients always act on
 * themselves (any userId they send is ignored unless it is their own);
 * coaches may act on a client by passing userId. Returns null when there
 * is no session or a client asks for someone else.
 */
export async function resolveActingUser(requestedUserId?: string | null) {
  const me = await getSessionUser();
  if (!me) return { me: null, userId: null, status: 401 as const };
  if (!requestedUserId || requestedUserId === me.id) return { me, userId: me.id, status: 200 as const };
  if (isCoachRole(me.role)) return { me, userId: requestedUserId, status: 200 as const };
  return { me, userId: null, status: 403 as const };
}
