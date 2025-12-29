import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from '@/lib/auth';
import { z } from 'zod';

const createLeagueSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  format: z.enum(['ROUND_ROBIN', 'ELIMINATION']),
  matchType: z.enum(['SINGLES', 'DOUBLES']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  playerIds: z.array(z.string().cuid2()).min(2),
});

// GET /api/clubs/[clubId]/leagues
export async function GET(req: Request, { params }: { params: Promise<{ clubId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clubId } = await params;

  try {
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    await requireOrganizationRole(session.user.id, club.organizationId, 'MEMBER');

    const leagues = await prisma.league.findMany({
      where: { clubId },
      include: {
        _count: {
          select: {
            memberships: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ leagues });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get leagues' },
      { status: 403 }
    );
  }
}

// POST /api/clubs/[clubId]/leagues
export async function POST(req: Request, { params }: { params: Promise<{ clubId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clubId } = await params;

  try {
    const body = await req.json();
    const data = createLeagueSchema.parse(body);

    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    await requireOrganizationRole(session.user.id, club.organizationId, 'ADMIN');

    // Verify all players are active members of this club
    const players = await prisma.player.findMany({
      where: {
        id: { in: data.playerIds },
        clubId,
        isActive: true,
      },
    });

    if (players.length !== data.playerIds.length) {
      return NextResponse.json(
        { error: 'One or more players not found or not active at this club' },
        { status: 404 }
      );
    }

    // Validate player count based on match type
    const minPlayers = data.matchType === 'SINGLES' ? 2 : 4;
    if (data.playerIds.length < minPlayers) {
      return NextResponse.json(
        {
          error: `${data.matchType === 'SINGLES' ? 'Singles' : 'Doubles'} leagues require at least ${minPlayers} players`,
        },
        { status: 400 }
      );
    }

    // Create league and memberships in a transaction
    const league = await prisma.$transaction(async (tx) => {
      const newLeague = await tx.league.create({
        data: {
          clubId,
          name: data.name,
          description: data.description || null,
          format: data.format,
          matchType: data.matchType,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          status: 'UPCOMING',
          memberships: {
            create: data.playerIds.map((playerId) => ({
              playerId,
            })),
          },
        },
        include: {
          memberships: {
            include: {
              player: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newLeague;
    });

    return NextResponse.json({ league }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create league' },
      { status: 400 }
    );
  }
}
