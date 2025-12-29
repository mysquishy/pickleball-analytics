import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createInvite, getOrganizationInvites, revokeInvite } from '@/lib/invites';
import { requireOrganizationRole } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

const createInviteSchema = z.object({
  email: z.string().email(),
  organizationId: z.string(),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']),
});

// GET /api/invites?organizationId=xxx
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json({ error: 'organizationId required' }, { status: 400 });
  }

  try {
    // Verify user is at least member of organization
    await requireOrganizationRole(session.user.id, organizationId, 'MEMBER');

    const invites = await getOrganizationInvites(organizationId);
    return NextResponse.json({ invites });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get invites' },
      { status: 403 }
    );
  }
}

// POST /api/invites
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit invitation creation
  const rateLimitResult = checkRateLimit(`invite:${session.user.id}`, RATE_LIMITS.STRICT);
  if (rateLimitResult.limited) {
    return NextResponse.json(
      { error: 'Too many invitations. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const data = createInviteSchema.parse(body);

    // Verify user can invite (must be ADMIN or OWNER)
    await requireOrganizationRole(session.user.id, data.organizationId, 'ADMIN');

    const invite = await createInvite({
      ...data,
      invitedBy: session.user.name || session.user.email || 'A team member',
    });

    return NextResponse.json({ invite }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create invite' },
      { status: 400 }
    );
  }
}

// DELETE /api/invites?inviteId=xxx
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const inviteId = searchParams.get('inviteId');

  if (!inviteId) {
    return NextResponse.json({ error: 'inviteId required' }, { status: 400 });
  }

  try {
    await revokeInvite(inviteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to revoke invite' },
      { status: 400 }
    );
  }
}
