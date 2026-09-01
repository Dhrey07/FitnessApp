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
