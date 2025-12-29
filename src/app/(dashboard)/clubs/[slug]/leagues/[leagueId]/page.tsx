import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getScheduleDescription, estimateRounds } from '@/lib/league-scheduler';

interface LeaguePageProps {
  params: {
    slug: string;
    leagueId: string;
  };
}

async function getLeagueStandings(leagueId: string) {
  const memberships = await prisma.leagueMembership.findMany({
    where: { leagueId },
    include: {
      player: {
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
      },
    },
  });

  // Calculate standings based on league matches
  const standings = await Promise.all(
    memberships.map(async (membership) => {
      const playerMatches = await prisma.playerMatch.findMany({
        where: {
          playerId: membership.playerId,
          match: {
            leagueId,
          },
        },
      });

      const totalMatches = playerMatches.length;
      const wins = playerMatches.filter((pm) => pm.isWinner).length;
      const losses = totalMatches - wins;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      return {
        player: membership.player,
        stats: {
          matches: totalMatches,
          wins,
          losses,
          winRate: parseFloat(winRate.toFixed(1)),
        },
      };
    })
  );

  // Sort by win rate, then by total matches
  return standings
    .filter((s) => s.stats.matches > 0)
    .sort((a, b) => {
      if (b.stats.winRate !== a.stats.winRate) {
        return b.stats.winRate - a.stats.winRate;
      }
      return b.stats.matches - a.stats.matches;
    })
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
}

export default async function LeaguePage({ params }: LeaguePageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const club = await prisma.club.findUnique({
    where: { slug: params.slug },
  });

  if (!club) {
    notFound();
  }

  const league = await prisma.league.findUnique({
    where: { id: params.leagueId },
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

  if (!league || league.clubId !== club.id) {
    notFound();
  }

  const standings = await getLeagueStandings(league.id);

  const getStatusBadge = () => {
    switch (league.status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{league.name}</h1>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusBadge()}`}>
                  {league.status}
                </span>
              </div>
              <p className="text-muted-foreground">{club.name}</p>
            </div>
            <Link href={`/clubs/${club.slug}`}>
              <Button variant="outline">Back to Club</Button>
            </Link>
          </div>

          {league.description && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{league.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {league.format === 'ROUND_ROBIN' ? 'Round Robin' : 'Elimination'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Match Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{league.matchType}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{league.memberships.length}</div>
              </CardContent>
            </Card>
          </div>

          {(league.startDate || league.endDate) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {league.startDate && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {new Date(league.startDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              )}

              {league.endDate && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      End Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {new Date(league.endDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Schedule Info */}
          <Card className="mt-6 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Schedule Format</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {getScheduleDescription(league.format, league.matchType, league.memberships.length)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Estimated{' '}
                {estimateRounds(league.format, league.matchType, league.memberships.length)} rounds
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Standings */}
        <Card>
          <CardHeader>
            <CardTitle>Standings</CardTitle>
            <CardDescription>
              {standings.length > 0
                ? 'Current league standings based on match results'
                : 'No matches played yet. Standings will appear once matches are logged.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {standings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No matches played yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Log matches to see standings update automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {standings.map((entry) => (
                  <div
                    key={entry.player.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="text-2xl font-bold w-12 text-center">
                        {getMedalIcon(entry.rank)}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={entry.player.user.image || undefined} />
                        <AvatarFallback>
                          {entry.player.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Player Info */}
                      <div>
                        <p className="font-semibold">{entry.player.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.stats.matches} matches
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{entry.stats.winRate}%</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.stats.wins}W - {entry.stats.losses}L
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
