import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function ClubsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Get user's organizations
  const organizations = await prisma.membership.findMany({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });

  const organizationIds = organizations.map((m) => m.organizationId);

  // Get all clubs from user's organizations
  const clubs = await prisma.club.findMany({
    where: {
      organizationId: { in: organizationIds },
    },
    include: {
      _count: {
        select: {
          courts: true,
          players: true,
          matches: true,
          leagues: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Clubs</h1>
            <p className="text-muted-foreground mt-2">
              Manage your pickleball clubs and facilities
            </p>
          </div>
          <Link href="/clubs/new">
            <Button>Create New Club</Button>
          </Link>
        </div>

        {clubs.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Clubs Yet</CardTitle>
              <CardDescription>
                You haven&apos;t created any clubs yet. Get started by creating your first club!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/clubs/new">
                <Button>Create Your First Club</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <Card key={club.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{club.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {club.city && club.state ? `${club.city}, ${club.state}` : 'No location set'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Courts:</span>
                      <span className="font-medium">{club._count.courts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Players:</span>
                      <span className="font-medium">{club._count.players}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Matches:</span>
                      <span className="font-medium">{club._count.matches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Leagues:</span>
                      <span className="font-medium">{club._count.leagues}</span>
                    </div>
                  </div>
                  <Link href={`/clubs/${club.slug}`} className="mt-4 block">
                    <Button variant="outline" className="w-full">
                      View Club
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
