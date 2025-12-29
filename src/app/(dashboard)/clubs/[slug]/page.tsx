import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface ClubPageProps {
  params: {
    slug: string;
  };
}

export default async function ClubPage({ params }: ClubPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const club = await prisma.club.findUnique({
    where: { slug: params.slug },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      courts: {
        orderBy: { name: 'asc' },
      },
      _count: {
        select: {
          courts: true,
          players: true,
          matches: true,
          leagues: true,
        },
      },
    },
  });

  if (!club) {
    notFound();
  }

  // Get recent matches
  const recentMatches = await prisma.match.findMany({
    where: { clubId: club.id },
    include: {
      playerMatches: {
        include: {
          player: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { completedAt: 'desc' },
    take: 5,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{club.name}</h1>
              <p className="text-muted-foreground mt-2">
                {club.city && club.state ? `${club.city}, ${club.state}` : 'No location set'}
              </p>
              {club.description && <p className="mt-3 text-sm">{club.description}</p>}
            </div>
            <div className="flex gap-2">
              <Link href="/clubs">
                <Button variant="outline">Back to Clubs</Button>
              </Link>
              <Button>Settings</Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{club._count.courts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{club._count.players}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{club._count.matches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Leagues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{club._count.leagues}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courts Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Courts</CardTitle>
                  <CardDescription>Playing surfaces at your club</CardDescription>
                </div>
                <Link href={`/clubs/${club.slug}/courts/new`}>
                  <Button size="sm">Add Court</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {club.courts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-4">No courts added yet.</p>
                    <Link href={`/clubs/${club.slug}/courts/new`}>
                      <Button size="sm">Add Your First Court</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {club.courts.map((court) => (
                      <div
                        key={court.id}
                        className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <div>
                            <p className="font-medium">{court.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {court.surface || 'No surface info'} •{' '}
                              {court.indoors ? 'Indoor' : 'Outdoor'}
                              {court.lighting && ' • Has Lighting'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Matches */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Matches</CardTitle>
                <CardDescription>Latest games played</CardDescription>
              </CardHeader>
              <CardContent>
                {recentMatches.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No matches played yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentMatches.map((match) => (
                      <div key={match.id} className="text-sm">
                        <p className="font-medium">{match.matchType}</p>
                        <p className="text-muted-foreground">
                          {match.completedAt?.toLocaleDateString() || 'Scheduled'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={`/clubs/${club.slug}/courts/new`}>
            <Button variant="outline" className="w-full">
              Add Court
            </Button>
          </Link>
          <Link href={`/clubs/${club.slug}/players/new`}>
            <Button variant="outline" className="w-full">
              Add Player
            </Button>
          </Link>
          <Link href={`/clubs/${club.slug}/matches/new`}>
            <Button className="w-full">Log Match</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
