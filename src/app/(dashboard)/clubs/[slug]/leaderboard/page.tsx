import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LeaderboardClient } from './leaderboard-client';

interface LeaderboardPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    type?: string;
    skill?: string;
  };
}

async function getLeaderboard(clubId: string, type: string, skillLevel?: string) {
  const queryParams = new URLSearchParams({
    type: type || 'overall',
    limit: '50',
  });

  if (skillLevel) {
    queryParams.set('skillLevel', skillLevel);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(
    `${baseUrl}/api/clubs/${clubId}/leaderboard?${queryParams.toString()}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.leaderboard || [];
}

export default async function LeaderboardPage({ params, searchParams }: LeaderboardPageProps) {
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

  const type = searchParams.type || 'overall';
  const skillLevel = searchParams.skill;
  const leaderboard = await getLeaderboard(club.id, type, skillLevel);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <LeaderboardClient
          club={club}
          initialLeaderboard={leaderboard}
          initialType={type}
          initialSkillLevel={skillLevel}
        />
      </div>
    </div>
  );
}
