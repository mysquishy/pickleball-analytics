import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for player match data
const playerMatchSchema = z.object({
  playerId: z.string().cuid2(),
  team: z.enum(['TEAM1', 'TEAM2']),
  position: z.enum(['FIRST', 'SECOND']).optional(),
  isWinner: z.boolean(),
  score: z.number().int().min(0).optional(),
});

// Validation schema for creating a match
const createMatchSchema = z.object({
  courtId: z.string().cuid2().optional(),
  matchType: z.enum(['SINGLES', 'DOUBLES']),
  scheduledFor: z.string().datetime().optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  playerMatches: z.array(playerMatchSchema).min(2).max(4),
});

// GET /api/clubs/[clubId]/matches
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const matches = await prisma.match.findMany({
      where: {
        clubId,
      },
      include: {
        court: {
          select: {
            id: true,
            name: true,
          },
        },
        playerMatches: {
          include: {
            player: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.match.count({
      where: { clubId },
    });

    return NextResponse.json({ matches, total });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get matches' },
      { status: 403 }
    );
  }
}

// POST /api/clubs/[clubId]/matches
export async function POST(req: Request, { params }: { params: Promise<{ clubId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clubId } = await params;

  try {
    const body = await req.json();
    const data = createMatchSchema.parse(body);

    // Get club to verify permissions
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Verify user can create matches (must be ADMIN or OWNER)
    await requireOrganizationRole(session.user.id, club.organizationId, 'ADMIN');

    // Validate player match data based on match type
    if (data.matchType === 'SINGLES' && data.playerMatches.length !== 2) {
      return NextResponse.json(
        { error: 'Singles matches must have exactly 2 players (1 per team)' },
        { status: 400 }
      );
    }

    if (data.matchType === 'DOUBLES' && data.playerMatches.length !== 4) {
      return NextResponse.json(
        { error: 'Doubles matches must have exactly 4 players (2 per team)' },
        { status: 400 }
      );
    }

    // Verify teams are balanced
    const team1Count = data.playerMatches.filter((pm) => pm.team === 'TEAM1').length;
    const team2Count = data.playerMatches.filter((pm) => pm.team === 'TEAM2').length;

    if (team1Count !== team2Count) {
      return NextResponse.json(
        { error: 'Each team must have the same number of players' },
        { status: 400 }
      );
    }

    // Verify all players belong to this club
    const playerIds = data.playerMatches.map((pm) => pm.playerId);
    const players = await prisma.player.findMany({
      where: {
        id: { in: playerIds },
        clubId,
        isActive: true,
      },
    });

    if (players.length !== playerIds.length) {
      return NextResponse.json(
        { error: 'One or more players not found or not active at this club' },
        { status: 404 }
      );
    }

    // Validate doubles positions
    if (data.matchType === 'DOUBLES') {
      const team1 = data.playerMatches.filter((pm) => pm.team === 'TEAM1');
      const team2 = data.playerMatches.filter((pm) => pm.team === 'TEAM2');

      // Check each team has both positions
      const team1Positions = team1.map((pm) => pm.position);
      const team2Positions = team2.map((pm) => pm.position);

      if (!team1Positions.includes('FIRST') || !team1Positions.includes('SECOND')) {
        return NextResponse.json(
          { error: 'Each doubles team must have one FIRST and one SECOND position' },
          { status: 400 }
        );
      }

      if (!team2Positions.includes('FIRST') || !team2Positions.includes('SECOND')) {
        return NextResponse.json(
          { error: 'Each doubles team must have one FIRST and one SECOND position' },
          { status: 400 }
        );
      }
    }

    // Create the match with player matches
    const match = await prisma.match.create({
      data: {
        clubId,
        courtId: data.courtId || null,
        matchType: data.matchType,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        startedAt: data.startedAt ? new Date(data.startedAt) : new Date(),
        completedAt: data.completedAt ? new Date(data.completedAt) : new Date(),
        notes: data.notes || null,
        playerMatches: {
          create: data.playerMatches,
        },
      },
      include: {
        court: {
          select: {
            id: true,
            name: true,
          },
        },
        playerMatches: {
          include: {
            player: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create match' },
      { status: 400 }
    );
  }
}
