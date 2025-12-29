import { NextResponse } from 'next/server';
import { isFeatureEnabled } from '@/lib/feature-flags';

export async function POST(req: Request) {
  try {
    const { flagKey, userId } = await req.json();

    if (!flagKey) {
      return NextResponse.json({ error: 'flagKey is required' }, { status: 400 });
    }

    const enabled = await isFeatureEnabled(flagKey, { userId });

    return NextResponse.json({ enabled });
  } catch (error) {
    console.error('Feature flag check error:', error);
    return NextResponse.json({ error: 'Failed to check feature flag' }, { status: 500 });
  }
}
