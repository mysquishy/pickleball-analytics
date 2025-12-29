import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from '@/lib/auth';
import { z } from 'zod';

const leaderboardSchema = z.object({
  type: z.enum(['overall', 'monthly', 'active', 'skill']).optional().default('overall'),
  skillLevel: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val || '20')),
});

// GET /api/clubs/[clubId]/leaderboard
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
    const { type, skillLevel, limit } = leaderboardSchema.parse({
      type: searchParams.get('type') || 'overall',
      skillLevel: searchParams.get('skillLevel') || undefined,
      limit: searchParams.get('limit') || '20',
    });

    let leaderboard;

    switch (type) {
      case 'monthly':
        leaderboard = await getMonthlyLeaderboard(clubId, limit);
        break;
      case 'active':
        leaderboard = await getActivePlayersLeaderboard(clubId, limit);
        break;
      case 'skill':
        if (!skillLevel) {
          return NextResponse.json(
            { error: 'skillLevel parameter is required for skill leaderboard' },
            { status: 400 }
          );
        }
        leaderboard = await getSkillLevelLeaderboard(clubId, skillLevel, limit);
        break;
      case 'overall':
      default:
        leaderboard = await getOverallLeaderboard(clubId, limit);
        break;
    }

    return NextResponse.json({ leaderboard, type });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get leaderboard' },
      { status: 400 }
    );
  }
}

async function getOverallLeaderboard(clubId: string, limit: number) {
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
        },
      },
    },
  });

  // Calculate stats for each player
  const leaderboard = await Promise.all(
    players.map(async (player) => {
      const playerMatches = await prisma.playerMatch.findMany({
        where: {
          playerId: player.id,
        },
      });

      const totalMatches = playerMatches.length;
      const wins = playerMatches.filter((pm) => pm.isWinner).length;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      return {
        player: {
          id: player.id,
          name: player.user.name || player.user.email,
          email: player.user.email,
          image: player.user.image,
          skillLevel: player.skillLevel,
          skillLevelSelf: player.skillLevelSelf,
        },
        stats: {
          totalMatches,
          wins,
          losses: totalMatches - wins,
          winRate: parseFloat(winRate.toFixed(1)),
        },
      };
    })
  );

  // Sort by win rate (minimum 5 matches to qualify)
  return leaderboard
    .filter((entry) => entry.stats.totalMatches >= 5)
    .sort((a, b) => {
      if (b.stats.winRate !== a.stats.winRate) {
        return b.stats.winRate - a.stats.winRate;
      }
      return b.stats.totalMatches - a.stats.totalMatches;
    })
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
}

async function getMonthlyLeaderboard(clubId: string, limit: number) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

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
    },
  });

  const leaderboard = await Promise.all(
    players.map(async (player) => {
      const playerMatches = await prisma.playerMatch.findMany({
        where: {
          playerId: player.id,
          match: {
            completedAt: {
              gte: startOfMonth,
            },
          },
        },
      });

      const totalMatches = playerMatches.length;
      const wins = playerMatches.filter((pm) => pm.isWinner).length;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      return {
        player: {
          id: player.id,
          name: player.user.name || player.user.email,
          email: player.user.email,
          image: player.user.image,
          skillLevel: player.skillLevel,
        },
        stats: {
          totalMatches,
          wins,
          losses: totalMatches - wins,
          winRate: parseFloat(winRate.toFixed(1)),
        },
      };
    })
  );

  // Sort by win rate (minimum 3 matches to qualify for monthly)
  return leaderboard
    .filter((entry) => entry.stats.totalMatches >= 3)
    .sort((a, b) => {
      if (b.stats.winRate !== a.stats.winRate) {
        return b.stats.winRate - a.stats.winRate;
      }
      return b.stats.totalMatches - a.stats.totalMatches;
    })
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
}

async function getActivePlayersLeaderboard(clubId: string, limit: number) {
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
        },
      },
    },
  });

  const leaderboard = await Promise.all(
    players.map(async (player) => {
      const playerMatches = await prisma.playerMatch.findMany({
        where: {
          playerId: player.id,
        },
        include: {
          match: true,
        },
      });

      const totalMatches = playerMatches.length;
      const wins = playerMatches.filter((pm) => pm.isWinner).length;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      // Get last match date
      const sortedMatches = playerMatches.sort(
        (a, b) =>
          new Date(b.match.completedAt || 0).getTime() -
          new Date(a.match.completedAt || 0).getTime()
      );
      const lastMatch = sortedMatches[0]?.match.completedAt;

      return {
        player: {
          id: player.id,
          name: player.user.name || player.user.email,
          email: player.user.email,
          image: player.user.image,
          skillLevel: player.skillLevel,
        },
        stats: {
          totalMatches,
          wins,
          losses: totalMatches - wins,
          winRate: parseFloat(winRate.toFixed(1)),
          lastMatch,
        },
      };
    })
  );

  // Sort by total matches played
  return leaderboard
    .filter((entry) => entry.stats.totalMatches > 0)
    .sort((a, b) => b.stats.totalMatches - a.stats.totalMatches)
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
}

async function getSkillLevelLeaderboard(clubId: string, skillLevel: string, limit: number) {
  const skillMin = parseFloat(skillLevel);
  const skillMax = skillMin + 0.5;

  const players = await prisma.player.findMany({
    where: {
      clubId,
      isActive: true,
      OR: [
        {
          skillLevel: {
            gte: skillMin,
            lt: skillMax,
          },
        },
        {
          skillLevelSelf: {
            gte: skillMin,
            lt: skillMax,
          },
        },
      ],
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
    },
  });

  const leaderboard = await Promise.all(
    players.map(async (player) => {
      const playerMatches = await prisma.playerMatch.findMany({
        where: {
          playerId: player.id,
        },
      });

      const totalMatches = playerMatches.length;
      const wins = playerMatches.filter((pm) => pm.isWinner).length;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      return {
        player: {
          id: player.id,
          name: player.user.name || player.user.email,
          email: player.user.email,
          image: player.user.image,
          skillLevel: player.skillLevel,
          skillLevelSelf: player.skillLevelSelf,
        },
        stats: {
          totalMatches,
          wins,
          losses: totalMatches - wins,
          winRate: parseFloat(winRate.toFixed(1)),
        },
      };
    })
  );

  // Sort by win rate (minimum 3 matches to qualify)
  return leaderboard
    .filter((entry) => entry.stats.totalMatches >= 3)
    .sort((a, b) => {
      if (b.stats.winRate !== a.stats.winRate) {
        return b.stats.winRate - a.stats.winRate;
      }
      return b.stats.totalMatches - a.stats.totalMatches;
    })
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
}
