'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FadeInUp } from '@/components/animations/FadeInUp';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';

interface SetupGuideClientProps {
  isStripeConfigured: boolean;
  isOpenAIConfigured: boolean;
  isResendConfigured: boolean;
  isNextAuthConfigured: boolean;
  isDatabaseConfigured: boolean;
  isSentryConfigured: boolean;
}

interface Instruction {
  text: string;
  code?: string;
  note?: string;
  links?: Array<{ text: string; url: string }>;
}

interface Step {
  number: number;
  title: string;
  completed: boolean;
  service: string;
  description: string;
  instructions: Instruction[];
}

export function SetupGuideClient({
  isStripeConfigured,
  isOpenAIConfigured,
  isResendConfigured,
  isNextAuthConfigured,
  isDatabaseConfigured,
  isSentryConfigured,
}: SetupGuideClientProps) {
  const localSteps: Step[] = [
    {
      number: 1,
      title: 'Database Setup (SQLite)',
      completed: isDatabaseConfigured,
      service: 'SQLite',
      description: 'SQLite is perfect for local development - no external database needed.',
      instructions: [
        {
          text: 'SQLite is already configured in your .env.local:',
          code: 'DATABASE_URL="file:./prisma/db.sqlite"',
        },
        {
          text: 'Initialize your local database:',
          code: 'npm run db:push',
        },
        {
          text: 'Create an admin user for testing:',
          code: 'npm run db:seed',
        },
      ],
    },
    {
      number: 2,
      title: 'NextAuth Configuration',
      completed: isNextAuthConfigured,
      service: 'Authentication',
      description: 'Set up authentication for local development.',
      instructions: [
        {
          text: 'Generate a secure secret (run this in terminal):',
          code: 'openssl rand -base64 32',
        },
        {
          text: 'Add to .env.local:',
          code: 'NEXTAUTH_SECRET="your-generated-secret"\nNEXTAUTH_URL="http://localhost:3000"',
        },
      ],
    },
    {
      number: 3,
      title: 'Stripe Test Mode',
      completed: isStripeConfigured,
      service: 'Stripe',
      description: 'Configure Stripe for testing subscriptions locally.',
      instructions: [
        {
          text: 'Create a Stripe account:',
          links: [{ text: 'Sign up for Stripe', url: 'https://dashboard.stripe.com/register' }],
        },
        {
          text: 'Get your TEST mode API keys:',
          links: [{ text: 'Stripe API Keys', url: 'https://dashboard.stripe.com/test/apikeys' }],
        },
        {
          text: 'Add test keys to .env.local:',
          code: 'STRIPE_SECRET_KEY="sk_test_..."\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."\nSTRIPE_WEBHOOK_SECRET="" # We\'ll set this up next',
        },
        {
          text: 'Create test products (Hobby $29, Pro $99, Enterprise $299):',
          links: [{ text: 'Create Products', url: 'https://dashboard.stripe.com/test/products' }],
        },
        {
          text: 'Copy Price IDs and add to .env.local:',
          code: 'STRIPE_HOBBY_PRICE_ID="price_..."\nSTRIPE_PRO_PRICE_ID="price_..."\nSTRIPE_ENTERPRISE_PRICE_ID="price_..."',
        },
        {
          text: 'Install Stripe CLI for local webhooks:',
          links: [{ text: 'Install Stripe CLI', url: 'https://stripe.com/docs/stripe-cli' }],
        },
        {
          text: 'Start webhook forwarding (keep this running):',
          code: 'stripe listen --forward-to localhost:3000/api/webhooks/stripe',
          note: 'Copy the webhook signing secret (whsec_...) and update STRIPE_WEBHOOK_SECRET in .env.local',
        },
      ],
    },
    {
      number: 4,
      title: 'Email Service (Resend)',
      completed: isResendConfigured,
      service: 'Resend',
      description: 'Set up email sending for welcome emails and invites.',
      instructions: [
        {
          text: 'Create a Resend account:',
          links: [{ text: 'Sign up for Resend', url: 'https://resend.com/signup' }],
        },
        {
          text: 'Get your API key:',
          links: [{ text: 'API Keys', url: 'https://resend.com/api-keys' }],
        },
        {
          text: 'Add to .env.local:',
          code: 'RESEND_API_KEY="re_..."\nEMAIL_FROM="onboarding@resend.dev"',
          note: 'Use onboarding@resend.dev for testing (works without domain verification)',
        },
      ],
    },
    {
      number: 5,
      title: 'OpenAI (Optional)',
      completed: isOpenAIConfigured,
      service: 'OpenAI',
      description: 'Enable AI chat widget (optional feature).',
      instructions: [
        {
          text: 'Create OpenAI account:',
          links: [{ text: 'Sign up for OpenAI', url: 'https://platform.openai.com/signup' }],
        },
        {
          text: 'Add billing information:',
          links: [{ text: 'Billing Settings', url: 'https://platform.openai.com/account/billing' }],
        },
        {
          text: 'Create API key:',
          links: [{ text: 'API Keys', url: 'https://platform.openai.com/api-keys' }],
        },
        {
          text: 'Add to .env.local:',
          code: 'OPENAI_API_KEY="sk-..."',
        },
      ],
    },
    {
      number: 6,
      title: 'Error Tracking (Optional)',
      completed: isSentryConfigured,
      service: 'Sentry',
      description: 'Track errors during development (optional).',
      instructions: [
        {
          text: 'Create Sentry account:',
          links: [{ text: 'Sign up for Sentry', url: 'https://sentry.io/signup/' }],
        },
        {
          text: 'Create a Next.js project:',
          links: [{ text: 'Create Project', url: 'https://sentry.io/organizations/' }],
        },
        {
          text: 'Add DSN to .env.local:',
          code: 'SENTRY_DSN="https://...@sentry.io/..."\nNEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."',
        },
      ],
    },
    {
      number: 7,
      title: 'Start Development',
      completed: isStripeConfigured && isNextAuthConfigured && isDatabaseConfigured,
      service: 'Ready',
      description: 'Launch your local development server.',
      instructions: [
        {
          text: 'Install dependencies:',
          code: 'npm install',
        },
        {
          text: 'Start development server:',
          code: 'npm run dev',
        },
        {
          text: 'Open your browser:',
          note: 'Visit http://localhost:3000',
        },
        {
          text: 'Login with seeded admin account:',
          code: 'Email: admin@example.com\nPassword: admin123',
          note: 'Change this password immediately after first login',
        },
      ],
    },
  ];

  const productionSteps: Step[] = [
    {
      number: 1,
      title: 'PostgreSQL Database',
      completed: false,
      service: 'Database',
      description: 'Set up a production PostgreSQL database.',
      instructions: [
        {
          text: 'Choose a PostgreSQL provider (recommended options):',
          links: [
            { text: 'Supabase (Free tier available)', url: 'https://supabase.com/dashboard' },
            { text: 'Neon (Serverless Postgres)', url: 'https://neon.tech' },
            { text: 'Railway', url: 'https://railway.app' },
          ],
        },
        {
          text: 'Create a new PostgreSQL database',
          note: "Follow your provider's setup guide to create a database",
        },
        {
          text: 'Copy your connection string',
          note: 'It should look like: postgresql://user:password@host:5432/dbname',
        },
        {
          text: 'Save this for Vercel environment variables (next step)',
          code: 'DATABASE_URL="postgresql://user:password@host:5432/dbname"',
        },
      ],
    },
    {
      number: 2,
      title: 'Deploy to Vercel',
      completed: false,
      service: 'Vercel',
      description: 'Deploy your application and configure environment variables.',
      instructions: [
        {
          text: 'Push your code to GitHub/GitLab/Bitbucket',
          note: 'Vercel connects to your Git repository for automatic deployments',
        },
        {
          text: 'Import project to Vercel:',
          links: [{ text: 'Import Project', url: 'https://vercel.com/new' }],
        },
        {
          text: 'Add ALL environment variables from .env.local',
          note: 'Go to Project Settings → Environment Variables',
        },
        {
          text: 'Critical: Update these variables for production:',
          code: `DATABASE_URL="postgresql://..." (from Step 1)
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="[generate new with: openssl rand -base64 32]"
EMAIL_FROM="noreply@yourdomain.com"

# Keep these for production:
STRIPE_SECRET_KEY="sk_live_..." (update in Step 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..." (update in Step 3)
STRIPE_WEBHOOK_SECRET="whsec_..." (update in Step 3)
STRIPE_HOBBY_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."
RESEND_API_KEY="re_..."
OPENAI_API_KEY="sk_..." (optional)
SENTRY_DSN="https://..." (optional)
NEXT_PUBLIC_SENTRY_DSN="https://..." (optional)`,
          note: 'Never use test/development values in production',
        },
        {
          text: 'Deploy the project',
          note: 'Vercel will automatically deploy. Wait for deployment to complete.',
        },
        {
          text: 'Run database migrations:',
          code: 'npx prisma migrate deploy',
          note: 'Run this in Vercel terminal or locally with production DATABASE_URL',
        },
      ],
    },
    {
      number: 3,
      title: 'Stripe Production Mode',
      completed: false,
      service: 'Stripe',
      description: 'Switch Stripe to production mode and configure webhooks.',
      instructions: [
        {
          text: 'Activate your Stripe account:',
          links: [
            { text: 'Activate Account', url: 'https://dashboard.stripe.com/account/onboarding' },
          ],
          note: 'Complete business details and bank account verification',
        },
        {
          text: 'Get LIVE mode API keys:',
          links: [{ text: 'Live API Keys', url: 'https://dashboard.stripe.com/apikeys' }],
        },
        {
          text: 'Update Vercel environment variables:',
          code: 'STRIPE_SECRET_KEY="sk_live_..."\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."',
          note: 'Replace the test keys with live keys',
        },
        {
          text: 'Create production webhook:',
          links: [{ text: 'Create Webhook', url: 'https://dashboard.stripe.com/webhooks' }],
        },
        {
          text: 'Configure webhook endpoint:',
          code: 'Endpoint URL: https://yourdomain.com/api/webhooks/stripe\n\nEvents to select:\n  ✓ checkout.session.completed\n  ✓ customer.subscription.updated\n  ✓ customer.subscription.deleted',
        },
        {
          text: 'Copy webhook signing secret and update Vercel:',
          code: 'STRIPE_WEBHOOK_SECRET="whsec_..." (from webhook details)',
          note: 'This is different from your local webhook secret',
        },
        {
          text: 'Redeploy after updating environment variables',
          note: 'Changes require a redeploy to take effect',
        },
      ],
    },
    {
      number: 4,
      title: 'Custom Domain Setup',
      completed: false,
      service: 'DNS',
      description: 'Connect your custom domain to Vercel.',
      instructions: [
        {
          text: 'Add domain in Vercel:',
          links: [
            { text: 'Domain Settings', url: 'https://vercel.com/docs/concepts/projects/domains' },
          ],
          note: 'Go to Project Settings → Domains',
        },
        {
          text: 'Add DNS records at your domain registrar:',
          code: 'A Record: @ → 76.76.21.21\nCNAME: www → cname.vercel-dns.com',
          note: 'Vercel will show you the exact records to add',
        },
        {
          text: 'Wait for DNS propagation (5-30 minutes)',
          note: 'Vercel will automatically provision SSL certificate',
        },
        {
          text: 'Update NEXTAUTH_URL in Vercel:',
          code: 'NEXTAUTH_URL="https://yourdomain.com"',
        },
        {
          text: 'Redeploy to apply changes',
          note: 'Trigger a new deployment for environment variable changes',
        },
      ],
    },
    {
      number: 5,
      title: 'Email Domain Verification',
      completed: false,
      service: 'Resend',
      description: 'Verify your domain for sending emails.',
      instructions: [
        {
          text: 'Add your domain in Resend:',
          links: [{ text: 'Add Domain', url: 'https://resend.com/domains' }],
        },
        {
          text: 'Add DNS records shown by Resend to your domain registrar',
          note: 'Typically 3 records: SPF, DKIM, and DMARC',
        },
        {
          text: 'Wait for verification (can take 24-48 hours)',
          note: 'Resend will automatically verify when DNS propagates',
        },
        {
          text: 'Update EMAIL_FROM in Vercel:',
          code: 'EMAIL_FROM="noreply@yourdomain.com"',
        },
        {
          text: 'Test email sending',
          note: 'Try signing up a new user to test welcome emails',
        },
      ],
    },
    {
      number: 6,
      title: 'OAuth Callback URLs',
      completed: false,
      service: 'Authentication',
      description: 'Update OAuth providers with production URLs (if using OAuth).',
      instructions: [
        {
          text: 'If using Google OAuth, update redirect URIs:',
          links: [
            {
              text: 'Google Cloud Console',
              url: 'https://console.cloud.google.com/apis/credentials',
            },
          ],
          code: 'Authorized redirect URIs:\n  https://yourdomain.com/api/auth/callback/google',
        },
        {
          text: 'If using GitHub OAuth, update callback URL:',
          links: [{ text: 'GitHub OAuth Apps', url: 'https://github.com/settings/developers' }],
          code: 'Authorization callback URL:\n  https://yourdomain.com/api/auth/callback/github',
        },
        {
          text: 'Add OAuth client IDs and secrets to Vercel environment variables',
          code: 'GOOGLE_CLIENT_ID="..."\nGOOGLE_CLIENT_SECRET="..."\nGITHUB_ID="..."\nGITHUB_SECRET="..."',
        },
      ],
    },
    {
      number: 7,
      title: 'Monitoring & Final Checks',
      completed: false,
      service: 'Production',
      description: 'Verify everything is working in production.',
      instructions: [
        {
          text: 'Create your first production admin user:',
          note: 'Sign up through the application UI with your real email',
        },
        {
          text: 'Manually promote user to admin in database:',
          code: "UPDATE \"User\" SET role = 'ADMIN' WHERE email = 'your@email.com';",
          note: 'Use Prisma Studio or your database GUI: npx prisma studio',
        },
        {
          text: 'Test critical user flows:',
          note: '1. User signup\n2. Email delivery\n3. Subscription purchase (use Stripe test cards)\n4. Dashboard access\n5. Organization creation',
        },
        {
          text: 'Monitor errors in Sentry (if configured):',
          links: [{ text: 'Sentry Dashboard', url: 'https://sentry.io' }],
        },
        {
          text: 'Set up Vercel monitoring:',
          links: [
            { text: 'Analytics', url: 'https://vercel.com/docs/concepts/analytics' },
            { text: 'Speed Insights', url: 'https://vercel.com/docs/concepts/speed-insights' },
          ],
        },
        {
          text: 'Review Stripe Dashboard for test transactions:',
          links: [{ text: 'Stripe Dashboard', url: 'https://dashboard.stripe.com' }],
        },
      ],
    },
  ];

  const localCompleted = localSteps.filter((s) => s.completed).length;
  const localProgress = Math.round((localCompleted / localSteps.length) * 100);

  const productionCompleted = productionSteps.filter((s) => s.completed).length;
  const productionProgress = Math.round((productionCompleted / productionSteps.length) * 100);

  const StepCard = ({ step, idx }: { step: Step; idx: number }) => (
    <FadeInUp key={step.number} delay={idx * 0.05}>
      <Card className={step.completed ? 'border-green-500 bg-green-50/50' : ''}>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              {step.completed ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-semibold text-gray-500">STEP {step.number}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full font-medium text-gray-700">
                  {step.service}
                </span>
                {step.completed && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    Configured
                  </span>
                )}
              </div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <CardDescription className="mt-2">{step.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 ml-10">
            {step.instructions.map((instruction, instIdx) => (
              <div key={instIdx} className="space-y-2">
                <p className="font-medium text-gray-900">{instruction.text}</p>

                {instruction.code && (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                    <code>{instruction.code}</code>
                  </pre>
                )}

                {instruction.links && (
                  <div className="flex flex-wrap gap-2">
                    {instruction.links.map(
                      (link: { text: string; url: string }, linkIdx: number) => (
                        <a
                          key={linkIdx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          {link.text}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )
                    )}
                  </div>
                )}

                {instruction.note && (
                  <p className="text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-500 p-3 rounded whitespace-pre-line">
                    {instruction.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </FadeInUp>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Setup Guide</h1>
          <p className="text-gray-600">
            Complete setup for local development and production deployment
          </p>
        </div>
      </FadeInUp>

      <Tabs defaultValue="local" className="w-full">
        <FadeInUp delay={0.1}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="local">Local Development</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
          </TabsList>
        </FadeInUp>

        <TabsContent value="local" className="space-y-6">
          <FadeInUp delay={0.15}>
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Local Setup Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {localCompleted} of {localSteps.length} completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${localProgress}%` }}
                />
              </div>
            </div>
          </FadeInUp>

          <div className="space-y-6">
            {localSteps.map((step, idx) => (
              <StepCard key={step.number} step={step} idx={idx} />
            ))}
          </div>

          <FadeInUp delay={0.2}>
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle>Local Development Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    • All environment variables go in{' '}
                    <code className="bg-gray-900 text-gray-100 px-2 py-1 rounded">.env.local</code>
                  </p>
                  <p>
                    • Never commit{' '}
                    <code className="bg-gray-900 text-gray-100 px-2 py-1 rounded">.env.local</code>{' '}
                    to Git
                  </p>
                  <p>• Restart dev server after changing environment variables</p>
                  <p>• Use Stripe test mode and test cards for local development</p>
                  <p>• Keep Stripe CLI webhook forwarding running while testing payments</p>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <FadeInUp delay={0.15}>
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Production Setup Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {productionCompleted} of {productionSteps.length} completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${productionProgress}%` }}
                />
              </div>
            </div>
          </FadeInUp>

          <div className="space-y-6">
            {productionSteps.map((step, idx) => (
              <StepCard key={step.number} step={step} idx={idx} />
            ))}
          </div>

          <FadeInUp delay={0.2}>
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle>Production Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• ✓ Use strong, unique secrets (never reuse development secrets)</p>
                  <p>• ✓ Switch all services to production mode (Stripe, etc.)</p>
                  <p>• ✓ Update all URLs from localhost to your domain</p>
                  <p>• ✓ Configure webhook endpoints with production URLs</p>
                  <p>• ✓ Verify email domain to avoid spam filters</p>
                  <p>• ✓ Test payments end-to-end before launching</p>
                  <p>• ✓ Set up monitoring and error tracking</p>
                  <p>• ✓ Never commit production secrets to version control</p>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>
        </TabsContent>
      </Tabs>
    </div>
  );
}
