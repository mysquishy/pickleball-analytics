import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface PlayersPageProps {
  params: {
    slug: string;
  };
}

export default async function PlayersPage({ params }: PlayersPageProps) {
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

  const players = await prisma.player.findMany({
    where: {
      clubId: club.id,
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

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Players</h1>
            <p className="text-muted-foreground mt-2">
              {club.name} - {players.length} registered players
            </p>
          </div>
          <Link href={`/clubs/${club.slug}/players/new`}>
            <Button>Add Player</Button>
          </Link>
        </div>

        {players.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Players Yet</CardTitle>
              <CardDescription>No players have been registered at this club yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/clubs/${club.slug}/players/new`}>
                <Button>Add Your First Player</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <Card key={player.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={player.user.image || undefined} />
                      <AvatarFallback>
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
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {player.user.name || 'No Name'}
                      </CardTitle>
                      <CardDescription className="truncate">{player.user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Skill Levels */}
                    {(player.skillLevel || player.skillLevelSelf) && (
                      <div className="space-y-1">
                        {player.skillLevel && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rated:</span>
                            <span className="font-medium">{player.skillLevel.toFixed(1)}</span>
                          </div>
                        )}
                        {player.skillLevelSelf && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Self:</span>
                            <span className="font-medium">{player.skillLevelSelf.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Matches:</span>
                      <span className="font-medium">{player._count.playerMatches}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Leagues:</span>
                      <span className="font-medium">{player._count.leagueMemberships}</span>
                    </div>

                    {player.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{player.bio}</p>
                    )}

                    <Link href={`/players/${player.id}`}>
                      <Button variant="outline" className="w-full" size="sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
