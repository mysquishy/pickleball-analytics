import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CourtForm } from '@/components/courts/court-form';

interface NewCourtPageProps {
  params: {
    slug: string;
  };
}

export default async function NewCourtPage({ params }: NewCourtPageProps) {
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
            <p className="text-sm">You need to be an Admin or Owner to add courts to this club.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Court</h1>
          <p className="text-muted-foreground mt-2">Add a new court to {club.name}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <CourtForm clubId={club.id} clubSlug={club.slug} />
        </div>
      </div>
    </div>
  );
}
