import { requireAdmin } from '@/lib/auth';
import { SetupGuideClient } from './setup-guide-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SetupGuidePage() {
  await requireAdmin();

  // Check which services are configured
  const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;
  const isOpenAIConfigured = !!process.env.OPENAI_API_KEY;
  const isResendConfigured = !!process.env.RESEND_API_KEY;
  const isNextAuthConfigured = !!process.env.NEXTAUTH_SECRET;
  const isDatabaseConfigured = !!process.env.DATABASE_URL;
  const isSentryConfigured = !!process.env.SENTRY_DSN;

  return (
    <SetupGuideClient
      isStripeConfigured={isStripeConfigured}
      isOpenAIConfigured={isOpenAIConfigured}
      isResendConfigured={isResendConfigured}
      isNextAuthConfigured={isNextAuthConfigured}
      isDatabaseConfigured={isDatabaseConfigured}
      isSentryConfigured={isSentryConfigured}
    />
  );
}
