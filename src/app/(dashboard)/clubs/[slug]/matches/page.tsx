import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface MatchesPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function MatchesPage({ params, searchParams }: MatchesPageProps) {
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

  const page = parseInt(searchParams.page || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  const [matches, total] = await Promise.all([
    prisma.match.findMany({
      where: {
        clubId: club.id,
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
                    email: true,
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
      skip,
    }),
    prisma.match.count({
      where: { clubId: club.id },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
            <p className="text-muted-foreground mt-2">
              {club.name} - {total} matches played
            </p>
          </div>
          <Link href={`/clubs/${club.slug}/matches/new`}>
            <Button>Log Match</Button>
          </Link>
        </div>

        {matches.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Matches Yet</CardTitle>
              <CardDescription>No matches have been played at this club yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/clubs/${club.slug}/matches/new`}>
                <Button>Log Your First Match</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {matches.map((match) => {
                const team1Players = match.playerMatches.filter((pm) => pm.team === 'TEAM1');
                const team2Players = match.playerMatches.filter((pm) => pm.team === 'TEAM2');
                const team1Score = team1Players[0]?.score ?? 0;
                const team2Score = team2Players[0]?.score ?? 0;
                const team1Wins = team1Players.some((pm) => pm.isWinner);
                const team2Wins = team2Players.some((pm) => pm.isWinner);

                return (
                  <Card key={match.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                              {match.matchType}
                            </span>
                            {match.court && (
                              <span className="text-xs text-muted-foreground">
                                {match.court.name}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {match.completedAt?.toLocaleDateString() || 'No date'}
                            </span>
                          </div>

                          {/* Match Display */}
                          <div className="flex items-center gap-6">
                            {/* Team 1 */}
                            <div className="flex-1">
                              <div className="space-y-1">
                                {team1Players.map((pm) => (
                                  <div key={pm.id} className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {pm.player.user.name
                                          ? pm.player.user.name[0].toUpperCase()
                                          : pm.player.user.email[0].toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">
                                      {pm.player.user.name || 'Unknown'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Score */}
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                <span className={team1Wins ? 'text-green-600' : 'text-red-600'}>
                                  {team1Score}
                                </span>
                                <span className="mx-2 text-muted-foreground">-</span>
                                <span className={team2Wins ? 'text-green-600' : 'text-red-600'}>
                                  {team2Score}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {team1Wins ? 'Team 1 Won' : 'Team 2 Won'}
                              </p>
                            </div>

                            {/* Team 2 */}
                            <div className="flex-1">
                              <div className="space-y-1">
                                {team2Players.map((pm) => (
                                  <div key={pm.id} className="flex items-center gap-2 justify-end">
                                    <span className="text-sm">
                                      {pm.player.user.name || 'Unknown'}
                                    </span>
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {pm.player.user.name
                                          ? pm.player.user.name[0].toUpperCase()
                                          : pm.player.user.email[0].toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {page > 1 && (
                  <Link href={`/clubs/${club.slug}/matches?page=${page - 1}`}>
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground py-2">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link href={`/clubs/${club.slug}/matches?page=${page + 1}`}>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
