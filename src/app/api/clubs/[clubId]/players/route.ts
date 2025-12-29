import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for creating a player
const createPlayerSchema = z.object({
  userId: z.string().cuid2().optional(),
  email: z.string().email().optional(),
  name: z.string().min(1, 'Name is required').optional(),
  skillLevel: z.number().min(1.0).max(5.0).optional(),
  skillLevelSelf: z.number().min(1.0).max(5.0).optional(),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
});

// GET /api/clubs/[clubId]/players
export async function GET(req: Request, { params }: { params: Promise<{ clubId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clubId } = await params;

  try {
    // Get club to verify permissions
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Verify user is member of the club's organization
    await requireOrganizationRole(session.user.id, club.organizationId, 'MEMBER');

    const players = await prisma.player.findMany({
      where: {
        clubId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            playerMatches: true,
            leagueMemberships: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    return NextResponse.json({ players });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get players' },
      { status: 403 }
    );
  }
}

// POST /api/clubs/[clubId]/players
export async function POST(req: Request, { params }: { params: Promise<{ clubId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clubId } = await params;

  try {
    const body = await req.json();
    const data = createPlayerSchema.parse(body);

    // Get club to verify permissions
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Verify user can create players (must be ADMIN or OWNER)
    await requireOrganizationRole(session.user.id, club.organizationId, 'ADMIN');

    let userId = data.userId;

    // If no userId provided, create or find user by email
    if (!userId && data.email) {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user (they'll need to set password later)
        const newUser = await prisma.user.create({
          data: {
            email: data.email,
            name: data.name || data.email.split('@')[0],
          },
        });
        userId = newUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Either userId or email is required' }, { status: 400 });
    }

    // Check if player already exists for this club
    const existingPlayer = await prisma.player.findFirst({
      where: {
        userId,
        clubId,
      },
    });

    if (existingPlayer) {
      return NextResponse.json(
        { error: 'This user is already a player at this club' },
        { status: 409 }
      );
    }

    // Create the player
    const player = await prisma.player.create({
      data: {
        userId,
        clubId,
        skillLevel: data.skillLevel || null,
        skillLevelSelf: data.skillLevelSelf || null,
        phone: data.phone || null,
        bio: data.bio || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            playerMatches: true,
            leagueMemberships: true,
          },
        },
      },
    });

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create player' },
      { status: 400 }
    );
  }
}
