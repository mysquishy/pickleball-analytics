import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ClubForm } from '@/components/clubs/club-form';

export default async function NewClubPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Get user's organizations
  const memberships = await prisma.membership.findMany({
    where: {
      userId: session.user.id,
      role: {
        in: ['OWNER', 'ADMIN'],
      },
    },
    include: {
      organization: true,
    },
  });

  if (memberships.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            <h2 className="font-semibold mb-2">No Organization Found</h2>
            <p className="text-sm">
              You need to be an Owner or Admin of an organization to create a club. Please contact
              your organization administrator or create a new organization.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use the first organization (in the future, user can select which org)
  const organizationId = memberships[0].organizationId;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Club</h1>
          <p className="text-muted-foreground mt-2">
            Add a new pickleball club to your organization. Fill in the details below.
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <ClubForm organizationId={organizationId} />
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
          <p className="text-sm">
            <strong>Tip:</strong> After creating your club, you can add courts, register players,
            and start tracking matches!
          </p>
        </div>
      </div>
    </div>
  );
}
