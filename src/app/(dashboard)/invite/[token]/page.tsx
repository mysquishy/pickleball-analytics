import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { acceptInvite } from '@/lib/invites';

export default async function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const session = await requireAuth();
  const { token } = await params;

  try {
    const organization = await acceptInvite({
      token,
      userId: session.user.id,
    });

    // Redirect to organization dashboard
    redirect(`/dashboard?joined=${organization.slug}`);
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Invitation</h1>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : 'This invitation is invalid or has expired.'}
          </p>
          <a href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }
}
