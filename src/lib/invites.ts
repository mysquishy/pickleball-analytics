import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import InviteEmail from '@/emails/invite';
import crypto from 'crypto';

/**
 * Create a team invitation
 */
export async function createInvite({
  email,
  organizationId,
  role,
  invitedBy,
}: {
  email: string;
  organizationId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  invitedBy: string;
}) {
  // Check if user is already a member
  const existingMember = await prisma.membership.findFirst({
    where: {
      organization: { id: organizationId },
      user: { email },
    },
  });

  if (existingMember) {
    throw new Error('User is already a member of this organization');
  }

  // Check for existing pending invite
  const existingInvite = await prisma.invite.findUnique({
    where: {
      email_organizationId: {
        email,
        organizationId,
      },
    },
  });

  if (existingInvite) {
    // Delete old invite and create new one
    await prisma.invite.delete({
      where: { id: existingInvite.id },
    });
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');

  // Create invite (expires in 7 days)
  const invite = await prisma.invite.create({
    data: {
      email,
      organizationId,
      role,
      token,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    include: {
      organization: true,
    },
  });

  // Send invitation email
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

  await sendEmail({
    to: email,
    subject: `You've been invited to join ${invite.organization.name}`,
    react: InviteEmail({
      organizationName: invite.organization.name,
      inviteUrl,
      invitedBy,
    }),
  });

  return invite;
}

/**
 * Accept an invitation
 */
export async function acceptInvite({ token, userId }: { token: string; userId: string }) {
  // Find invite
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invite) {
    throw new Error('Invalid or expired invitation');
  }

  // Check expiration
  if (invite.expires < new Date()) {
    await prisma.invite.delete({ where: { id: invite.id } });
    throw new Error('This invitation has expired');
  }

  // Get user to verify email matches
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.email !== invite.email) {
    throw new Error('This invitation was sent to a different email address');
  }

  // Create membership
  await prisma.membership.create({
    data: {
      userId,
      organizationId: invite.organizationId,
      role: invite.role,
    },
  });

  // Delete used invite
  await prisma.invite.delete({
    where: { id: invite.id },
  });

  return invite.organization;
}

/**
 * Cancel/revoke an invitation
 */
export async function revokeInvite(inviteId: string) {
  await prisma.invite.delete({
    where: { id: inviteId },
  });
}

/**
 * Get all pending invites for an organization
 */
export async function getOrganizationInvites(organizationId: string) {
  return prisma.invite.findMany({
    where: {
      organizationId,
      expires: { gte: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });
}
