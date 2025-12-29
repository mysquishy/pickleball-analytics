import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { trackUsage } from '@/lib/usage';

/**
 * Example API route with rate limiting and usage tracking
 * This demonstrates the pattern for building protected API endpoints
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit by user ID
  const rateLimitResult = checkRateLimit(`api:${session.user.id}`, RATE_LIMITS.API);

  if (rateLimitResult.limited) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        resetTime: rateLimitResult.resetTime,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      }
    );
  }

  // Track API usage (example: tracking API calls)
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');

  if (organizationId) {
    await trackUsage({
      organizationId,
      metric: 'api_calls',
      value: 1,
      metadata: {
        endpoint: '/api/v1/example',
        method: 'GET',
      },
    });
  }

  // Your API logic here
  return NextResponse.json(
    {
      message: 'API endpoint working',
      user: session.user.email,
    },
    {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      },
    }
  );
}
