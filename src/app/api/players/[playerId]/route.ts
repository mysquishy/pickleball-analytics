import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for updating a player
const updatePlayerSchema = z.object({
  skillLevel: z.number().min(1.0).max(5.0).optional(),
  skillLevelSelf: z.number().min(1.0).max(5.0).optional(),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/players/[playerId]
export async function GET(req: Request, { params }: { params: Promise<{ playerId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { playerId } = await params;

  try {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            organizationId: true,
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

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Verify user is member of the club's organization
    await requireOrganizationRole(session.user.id, player.club.organizationId, 'MEMBER');

    return NextResponse.json({ player });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get player' },
      { status: 403 }
    );
  }
}

// PUT /api/players/[playerId]
export async function PUT(req: Request, { params }: { params: Promise<{ playerId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { playerId } = await params;

  try {
    const body = await req.json();
    const data = updatePlayerSchema.parse(body);

    // Get player to check permissions
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        club: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Verify user can update players (must be ADMIN or OWNER, or the player themselves)
    if (session.user.id !== player.userId) {
      await requireOrganizationRole(session.user.id, player.club.organizationId, 'ADMIN');
    }

    // Update the player
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        ...(data.skillLevel !== undefined && { skillLevel: data.skillLevel }),
        ...(data.skillLevelSelf !== undefined && { skillLevelSelf: data.skillLevelSelf }),
        ...(data.phone !== undefined && { phone: data.phone || null }),
        ...(data.bio !== undefined && { bio: data.bio || null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
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

    return NextResponse.json({ player: updatedPlayer });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update player' },
      { status: 400 }
    );
  }
}

// DELETE /api/players/[playerId]
export async function DELETE(req: Request, { params }: { params: Promise<{ playerId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { playerId } = await params;

  try {
    // Get player to check permissions
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        club: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Verify user can delete players (must be OWNER)
    await requireOrganizationRole(session.user.id, player.club.organizationId, 'OWNER');

    // Soft delete by setting isActive to false
    await prisma.player.update({
      where: { id: playerId },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete player' },
      { status: 400 }
    );
  }
}
