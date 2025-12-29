import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(): Promise<Session & { user: { id: string } }> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  return session as Session & { user: { id: string } };
}

/**
 * Require admin role - redirects to dashboard if not admin
 */
export async function requireAdmin() {
  const session = await requireAuth();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return { session, user };
}

/**
 * Get user's organizations
 */
export async function getUserOrganizations(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: {
      organization: {
        include: {
          subscription: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Check if user is member of organization
 */
export async function isMemberOfOrganization(userId: string, organizationId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });
  return !!membership;
}

/**
 * Require organization membership with specific role
 */
export async function requireOrganizationRole(
  userId: string,
  organizationId: string,
  requiredRole: 'OWNER' | 'ADMIN' | 'MEMBER'
) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    throw new Error('Not a member of this organization');
  }

  const roleHierarchy = { OWNER: 3, ADMIN: 2, MEMBER: 1 };
  if (roleHierarchy[membership.role] < roleHierarchy[requiredRole]) {
    throw new Error('Insufficient permissions');
  }

  return membership;
}
