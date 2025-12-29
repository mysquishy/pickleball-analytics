import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { frontendTools } from '@assistant-ui/react-ai-sdk';
import { auth } from '@/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { trackUsage } from '@/lib/usage';

export const maxDuration = 30;

export async function POST(req: Request) {
  // Authenticate user
  const session = await auth();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Rate limit by user to prevent abuse
  const rateLimitResult = checkRateLimit(`chat:${session.user.id}`, RATE_LIMITS.API);
  if (rateLimitResult.limited) {
    return new Response('Rate limit exceeded. Please try again later.', {
      status: 429,
      headers: {
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      },
    });
  }

  try {
    const { messages, system, tools, organizationId } = await req.json();

    // Track usage for billing/monitoring if organizationId provided
    if (organizationId) {
      await trackUsage({
        organizationId,
        metric: 'ai_chat_requests',
        value: 1,
        metadata: {
          userId: session.user.id,
          endpoint: '/api/chat',
        },
      });
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system:
        system ||
        'You are a helpful AI assistant. You can answer questions and help users with their tasks.',
      messages: convertToModelMessages(messages),
      tools: {
        ...frontendTools(tools),
        // Add backend tools here
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
