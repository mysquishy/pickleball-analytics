import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MatchForm } from '@/components/matches/match-form';

interface NewMatchPageProps {
  params: {
    slug: string;
  };
}

export default async function NewMatchPage({ params }: NewMatchPageProps) {
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

  // Check if user has admin access
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: club.organizationId,
      },
    },
  });

  if (!membership || (membership.role !== 'ADMIN' && membership.role !== 'OWNER')) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <h2 className="font-semibold mb-2">Access Denied</h2>
            <p className="text-sm">You need to be an Admin or Owner to log matches at this club.</p>
          </div>
        </div>
      </div>
    );
  }

  // Get active players for this club
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
        },
      },
    },
    orderBy: {
      user: {
        name: 'asc',
      },
    },
  });

  // Get courts for this club
  const courts = await prisma.court.findMany({
    where: {
      clubId: club.id,
    },
    orderBy: {
      name: 'asc',
    },
  });

  if (players.length < 2) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Log Match</h1>
            <p className="text-muted-foreground mt-2">Record a match for {club.name}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            <h2 className="font-semibold mb-2">Not Enough Players</h2>
            <p className="text-sm">
              You need at least 2 active players to log a match. Please add more players to this
              club first.
            </p>
            <div className="mt-4">
              <a href={`/clubs/${club.slug}/players/new`} className="inline-block underline">
                Add players
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Log Match</h1>
          <p className="text-muted-foreground mt-2">
            Record a match for {club.name} ({players.length} players available)
          </p>
        </div>

        <MatchForm clubId={club.id} clubSlug={club.slug} players={players} courts={courts} />
      </div>
    </div>
  );
}
