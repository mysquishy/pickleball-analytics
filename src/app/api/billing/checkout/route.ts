import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createCheckoutSession } from '@/lib/billing';
import { requireOrganizationRole } from '@/lib/auth';

// POST /api/billing/checkout
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { organizationId, priceId, plan } = await req.json();

    if (!organizationId || !priceId || !plan) {
      return NextResponse.json(
        { error: 'organizationId, priceId, and plan are required' },
        { status: 400 }
      );
    }

    // Verify user is OWNER of organization
    await requireOrganizationRole(session.user.id, organizationId, 'OWNER');

    const url = await createCheckoutSession({ organizationId, priceId, plan });

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 400 }
    );
  }
}
