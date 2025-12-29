import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface PlayerProfilePageProps {
  params: {
    playerId: string;
  };
}

async function getPlayerStats(playerId: string) {
  // Get all matches for this player
  const playerMatches = await prisma.playerMatch.findMany({
    where: {
      playerId,
    },
    include: {
      match: {
        include: {
          club: {
            select: {
              id: true,
              name: true,
              slug: true,
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
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      match: {
        completedAt: 'desc',
      },
    },
  });

  const totalMatches = playerMatches.length;
  const wins = playerMatches.filter((pm) => pm.isWinner).length;
  const losses = totalMatches - wins;
  const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

  // Calculate recent form (last 10 matches)
  const recentForm = playerMatches.slice(0, 10).map((pm) => ({
    isWinner: pm.isWinner,
    matchId: pm.match.id,
    date: pm.match.completedAt,
  }));

  // Get unique opponents
  const opponents = new Map<string, { name: string; wins: number; losses: number }>();

  playerMatches.forEach((pm) => {
    const team = pm.team;
    const opponentsInMatch = pm.match.playerMatches.filter(
      (other) => other.playerId !== playerId && other.team !== team
    );

    opponentsInMatch.forEach((opp) => {
      const oppKey = opp.playerId;
      if (!opponents.has(oppKey)) {
        opponents.set(oppKey, {
          name: opp.player.user.name || opp.player.user.email,
          wins: 0,
          losses: 0,
        });
      }

      const stats = opponents.get(oppKey)!;
      if (pm.isWinner) {
        stats.wins++;
      } else {
        stats.losses++;
      }
    });
  });

  return {
    totalMatches,
    wins,
    losses,
    winRate,
    recentForm,
    opponents: Array.from(opponents.entries()).map(([id, stats]) => ({ id, ...stats })),
    playerMatches,
  };
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const player = await prisma.player.findUnique({
    where: { id: params.playerId },
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
    },
  });

  if (!player) {
    notFound();
  }

  const stats = await getPlayerStats(player.id);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/clubs/${player.club.slug}/players`}
            className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
          >
            ← Back to Players
          </Link>

          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={player.user.image || undefined} />
              <AvatarFallback className="text-2xl">
                {player.user.name
                  ? player.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : player.user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{player.user.name || 'No Name'}</h1>
              <p className="text-muted-foreground">{player.user.email}</p>
              <p className="text-sm text-muted-foreground mt-1">{player.club.name}</p>

              {(player.skillLevel || player.skillLevelSelf) && (
                <div className="flex gap-4 mt-3">
                  {player.skillLevel && (
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Rated: {player.skillLevel.toFixed(1)}
                    </div>
                  )}
                  {player.skillLevelSelf && (
                    <div className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      Self: {player.skillLevelSelf.toFixed(1)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMatches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.wins}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Losses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Form */}
        {stats.recentForm.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Form</CardTitle>
              <CardDescription>Last 10 matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {stats.recentForm.map((form, _index) => (
                  <div
                    key={form.matchId}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      form.isWinner ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                    title={form.date ? new Date(form.date).toLocaleDateString() : 'No date'}
                  >
                    {form.isWinner ? 'W' : 'L'}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Matches */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
              <CardDescription>Match history</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.playerMatches.length === 0 ? (
                <p className="text-sm text-muted-foreground">No matches played yet.</p>
              ) : (
                <div className="space-y-3">
                  {stats.playerMatches.slice(0, 5).map((playerMatch) => {
                    const isWin = playerMatch.isWinner;

                    return (
                      <div
                        key={playerMatch.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              isWin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isWin ? 'WIN' : 'LOSS'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {playerMatch.match.completedAt?.toLocaleDateString() || 'No date'}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{playerMatch.match.matchType}</p>
                        <p className="text-xs text-muted-foreground">
                          Score: {playerMatch.score || '-'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Head-to-Head */}
          {stats.opponents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Head-to-Head</CardTitle>
                <CardDescription>Performance against opponents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.opponents.slice(0, 8).map((opponent) => {
                    const total = opponent.wins + opponent.losses;
                    const winRate = total > 0 ? (opponent.wins / total) * 100 : 0;

                    return (
                      <div
                        key={opponent.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{opponent.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {opponent.wins}W - {opponent.losses}L
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{winRate.toFixed(0)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
